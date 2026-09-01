/* The service behind the contact form and the newsletter signup on siwe.xyz.
 *
 * Two POST endpoints and a healthcheck, on Node's own http server — small
 * enough that a framework would be mostly imports. Contact messages are stored
 * in PostgreSQL first and forwarded by email via Resend second, so a mail
 * outage loses nothing.
 *
 * Environment:
 *   PORT             default 8787
 *   DATABASE_URL     postgres://user:pass@host:5432/db
 *   RESEND_API_KEY   forwarding is skipped (with a warning) when unset
 *   CONTACT_TO       default contact@siwe.xyz
 *   CONTACT_FROM     default "siwe.xyz <contact@siwe.xyz>"; domain must be
 *                    verified in Resend
 *   ALLOWED_ORIGINS  comma-separated, default covers siwe.xyz and local dev
 *   ADMIN_TOKEN      bearer token for /admin/*; unset disables those endpoints
 */

import { createServer } from 'node:http'
import { timingSafeEqual } from 'node:crypto'

import {
  pool,
  migrate,
  insertContactMessage,
  markContactForwarded,
  insertNewsletterSubscriber,
  setContactHandled,
  setContactNote,
  deleteContactMessage,
  setNewsletterUnsubscribed,
  deleteNewsletterSubscriber
} from './db.js'
import { forwardContactMessage } from './resend.js'

const PORT = Number(process.env.PORT || 8787)

const ALLOWED_ORIGINS = (
  process.env.ALLOWED_ORIGINS ||
  'https://siwe.xyz,https://next.siwe.xyz,https://monitor.siwe.xyz,http://localhost:4321'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

/* The Grafana dashboards in the siwe/monitoring repo send this as a bearer
 * token. Unset means the /admin endpoints answer 404 like any other unknown
 * path, so a deploy that forgets the secret exposes nothing. */
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || ''

/* ------------------------------------------------------------- validation */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* A single-line field: whitespace collapsed, so a value can never smuggle a
 * newline into the forwarded email's headers-like preamble. */
function line(value, max) {
  if (typeof value !== 'string') return ''
  return value.replace(/\s+/g, ' ').trim().slice(0, max)
}

function text(value, max) {
  if (typeof value !== 'string') return ''
  return value.replace(/\r\n/g, '\n').trim().slice(0, max)
}

function validEmail(value) {
  return value.length <= 254 && EMAIL_RE.test(value)
}

/* ------------------------------------------------------------- rate limit */

/* Per IP and endpoint, in memory. Enough to blunt a naive script; anything
 * beyond that is a job for the proxy in front. */
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 10 * 60 * 1000
const hits = new Map()

function rateLimited(ip, endpoint) {
  const key = `${ip} ${endpoint}`
  const now = Date.now()
  const recent = (hits.get(key) || []).filter((t) => now - t < RATE_WINDOW_MS)
  if (recent.length >= RATE_LIMIT) return true
  recent.push(now)
  hits.set(key, recent)
  return false
}

setInterval(() => {
  const now = Date.now()
  for (const [key, times] of hits) {
    const recent = times.filter((t) => now - t < RATE_WINDOW_MS)
    if (recent.length === 0) hits.delete(key)
    else hits.set(key, recent)
  }
}, RATE_WINDOW_MS).unref()

function clientIp(req) {
  /* kamal-proxy terminates TLS in front and appends the client to
   * X-Forwarded-For; the first entry is the caller. */
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim()
  }
  return req.socket.remoteAddress || 'unknown'
}

/* ---------------------------------------------------------------- plumbing */

function applyCors(req, res) {
  const origin = req.headers.origin
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin, Access-Control-Request-Headers')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    /* Whatever the preflight asks for, within an already allowlisted origin.
     * Grafana's action buttons send Authorization plus a handful of its own
     * x-grafana-* headers, and the set has changed between releases — echoing
     * the request beats chasing the list. */
    const requested = req.headers['access-control-request-headers']
    res.setHeader('Access-Control-Allow-Headers', requested || 'Content-Type, Authorization')
    res.setHeader('Access-Control-Max-Age', '86400')
  }
}

function respond(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(body))
}

const MAX_BODY_BYTES = 32 * 1024

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > MAX_BODY_BYTES) {
        reject(new Error('Body too large.'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'))
      } catch {
        reject(new Error('Invalid JSON.'))
      }
    })
    req.on('error', reject)
  })
}

/* ---------------------------------------------------------------- handlers */

async function handleContact(body) {
  const name = line(body.name, 200)
  const email = line(body.email, 254)
  const company = line(body.company, 200)
  const message = text(body.message, 5000)

  if (!name) return { status: 400, body: { ok: false, error: 'Please add your name.' } }
  if (!validEmail(email)) {
    return { status: 400, body: { ok: false, error: 'Please add a valid email address.' } }
  }
  if (!message) return { status: 400, body: { ok: false, error: 'Please add a message.' } }

  const id = await insertContactMessage({ name, email, company, message })

  /* Stored is the success condition; forwarding is best effort. A failed send
   * leaves forwarded_at NULL, which is also the retry queue if one is ever
   * needed. */
  try {
    if (await forwardContactMessage({ name, email, company, message })) {
      await markContactForwarded(id)
    }
  } catch (error) {
    console.error(`Contact message ${id} stored but not forwarded:`, error.message)
  }

  return { status: 200, body: { ok: true } }
}

async function handleNewsletter(body) {
  const email = line(body.email, 254)
  const source = line(body.source, 64) || 'siwe.xyz'

  if (!validEmail(email)) {
    return { status: 400, body: { ok: false, error: 'Please add a valid email address.' } }
  }

  await insertNewsletterSubscriber({ email, source })
  return { status: 200, body: { ok: true } }
}

const ENDPOINTS = {
  '/contact': handleContact,
  '/newsletter': handleNewsletter
}

/* ------------------------------------------------------------------- admin */

/* Compares in constant time and without leaking the expected length. */
function validAdminToken(header) {
  if (!ADMIN_TOKEN) return false
  if (typeof header !== 'string' || !header.startsWith('Bearer ')) return false
  const offered = Buffer.from(header.slice(7))
  const expected = Buffer.from(ADMIN_TOKEN)
  if (offered.length !== expected.length) return false
  return timingSafeEqual(offered, expected)
}

/* Grafana interpolates the row's id straight into the JSON body, so an empty
 * cell arrives as the literal string rather than a number. */
function rowId(value) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

const NOT_FOUND = { status: 404, body: { ok: false, error: 'No such row.' } }
const BAD_ID = { status: 400, body: { ok: false, error: 'A valid row id is required.' } }

async function adminContactHandle(body) {
  const id = rowId(body.id)
  if (!id) return BAD_ID
  const found = await setContactHandled(id, body.handled !== false)
  return found ? { status: 200, body: { ok: true } } : NOT_FOUND
}

async function adminContactNote(body) {
  const id = rowId(body.id)
  if (!id) return BAD_ID
  const found = await setContactNote(id, text(body.note, 2000))
  return found ? { status: 200, body: { ok: true } } : NOT_FOUND
}

async function adminContactDelete(body) {
  const id = rowId(body.id)
  if (!id) return BAD_ID
  const found = await deleteContactMessage(id)
  return found ? { status: 200, body: { ok: true } } : NOT_FOUND
}

async function adminNewsletterUnsubscribe(body) {
  const id = rowId(body.id)
  if (!id) return BAD_ID
  const found = await setNewsletterUnsubscribed(id, body.unsubscribed !== false)
  return found ? { status: 200, body: { ok: true } } : NOT_FOUND
}

async function adminNewsletterDelete(body) {
  const id = rowId(body.id)
  if (!id) return BAD_ID
  const found = await deleteNewsletterSubscriber(id)
  return found ? { status: 200, body: { ok: true } } : NOT_FOUND
}

const ADMIN_ENDPOINTS = {
  '/admin/contact/handle': adminContactHandle,
  '/admin/contact/note': adminContactNote,
  '/admin/contact/delete': adminContactDelete,
  '/admin/newsletter/unsubscribe': adminNewsletterUnsubscribe,
  '/admin/newsletter/delete': adminNewsletterDelete
}

/* ------------------------------------------------------------------ server */

const server = createServer(async (req, res) => {
  applyCors(req, res)

  const path = new URL(req.url, 'http://localhost').pathname

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.method === 'GET' && (path === '/healthz' || path === '/')) {
    respond(res, 200, { ok: true, service: 'siwe-api' })
    return
  }

  /* Admin traffic is one authenticated operator clicking buttons in Grafana:
   * it skips the public rate limit, which would lock them out after five
   * clicks, and answers before the honeypot check below. */
  const adminHandler = ADMIN_ENDPOINTS[path]
  if (adminHandler && ADMIN_TOKEN) {
    if (req.method !== 'POST') {
      respond(res, 405, { ok: false, error: 'Method not allowed.' })
      return
    }
    if (!validAdminToken(req.headers.authorization)) {
      respond(res, 401, { ok: false, error: 'Unauthorized.' })
      return
    }
    try {
      const { status, body: payload } = await adminHandler(await readJsonBody(req))
      respond(res, status, payload)
    } catch (error) {
      console.error(`POST ${path} failed:`, error)
      respond(res, 500, { ok: false, error: 'Something went wrong.' })
    }
    return
  }

  const handler = ENDPOINTS[path]
  if (!handler || req.method !== 'POST') {
    respond(res, 404, { ok: false, error: 'Not found.' })
    return
  }

  if (rateLimited(clientIp(req), path)) {
    respond(res, 429, { ok: false, error: 'Too many requests. Please try again later.' })
    return
  }

  let body
  try {
    body = await readJsonBody(req)
  } catch (error) {
    respond(res, 400, { ok: false, error: error.message })
    return
  }

  /* The honeypot. The forms render a hidden "website" field that people never
   * see; a filled one is a bot, which gets a cheerful yes and no row. */
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    respond(res, 200, { ok: true })
    return
  }

  try {
    const { status, body: payload } = await handler(body)
    respond(res, status, payload)
  } catch (error) {
    console.error(`${req.method} ${path} failed:`, error)
    respond(res, 500, { ok: false, error: 'Something went wrong. Please try again.' })
  }
})

await migrate()

server.listen(PORT, () => {
  console.log(`siwe-api listening on :${PORT}`)
})

async function shutdown() {
  server.close()
  await pool.end()
  process.exit(0)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
