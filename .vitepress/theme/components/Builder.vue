<script setup lang="ts">
/* Message builder.
 *
 * Fill in the fields, read the message off the right. Useful for two things:
 * seeing what a change to a field does to the wire format, and producing a
 * fixture to paste into a test. Everything happens in the page.
 *
 * The message is assembled by the same parser used by the validator, so what
 * comes out here is what the validator over on /tools/validator expects. */

import { computed, onMounted, ref } from 'vue'
import { SiweMessageParser, ValidationEngine, type SiweMessageFields } from '../lib/siwe'
import MessageBlock from './MessageBlock.vue'

const ALPHANUM = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

function makeNonce(len = 17): string {
  const bytes = new Uint8Array(len)
  crypto.getRandomValues(bytes)
  let out = ''
  for (const b of bytes) out += ALPHANUM[b % ALPHANUM.length]
  return out
}

function isoNow(offsetMinutes = 0): string {
  const d = new Date(Date.now() + offsetMinutes * 60_000)
  d.setMilliseconds(0)
  return d.toISOString().replace('.000', '')
}

const f = ref({
  domain: 'app.example.com',
  address: '0x7291BB770D168a6fD41AE73CcA7C709cba4d558f',
  statement: 'Welcome to the Example App.',
  uri: 'https://app.example.com',
  chainId: '1',
  nonce: 'kR8vQ2mZ7pLx4Tn9',
  issuedAt: '2026-08-17T12:00:00Z',
  expirationTime: '',
  notBefore: '',
  requestId: '',
  resources: ''
})

/* Stamped on the client, not during setup: a timestamp generated while
 * server-rendering would not match the one the browser computes on hydration.
 * The defaults above are what the server renders. */
onMounted(() => {
  f.value.nonce = makeNonce()
  f.value.issuedAt = isoNow()
  f.value.expirationTime = isoNow(10)
})

const message = computed(() => {
  const v = f.value
  const fields: SiweMessageFields = {
    domain: v.domain || undefined,
    address: v.address || undefined,
    statement: v.statement || undefined,
    uri: v.uri || undefined,
    version: '1',
    chainId: v.chainId || undefined,
    nonce: v.nonce || undefined,
    issuedAt: v.issuedAt || undefined,
    expirationTime: v.expirationTime || undefined,
    notBefore: v.notBefore || undefined,
    requestId: v.requestId || undefined,
    resources: v.resources
      ? v.resources
          .split('\n')
          .map((r) => r.trim())
          .filter(Boolean)
      : undefined
  }
  return SiweMessageParser.generateMessage(fields)
})

/* quickValidate runs the field rules only — no security or best-practice
 * checks. That is the right depth for a readout that updates as you type; the
 * validator page runs the whole set. */
const check = computed(() => {
  const q = ValidationEngine.quickValidate(message.value)
  if (q.errorCount) {
    return { tone: 'is-bad', text: `${q.errorCount} error${q.errorCount === 1 ? '' : 's'}` }
  }
  if (!q.isComplete) {
    return { tone: 'is-warn', text: 'Incomplete: a required field is still empty' }
  }
  if (q.warningCount) {
    return {
      tone: 'is-warn',
      text: `Well formed, with ${q.warningCount} warning${q.warningCount === 1 ? '' : 's'}`
    }
  }
  return { tone: 'is-ok', text: 'Well-formed ERC-4361 message' }
})

const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | undefined

async function copy() {
  try {
    await navigator.clipboard.writeText(message.value)
    copied.value = true
    clearTimeout(copyTimer)
    copyTimer = setTimeout(() => (copied.value = false), 1600)
  } catch {
    /* Clipboard refused; the message above is selectable. */
  }
}

const TEXT: { key: keyof typeof f.value; label: string; hint?: string; area?: boolean }[] = [
  { key: 'domain', label: 'Domain', hint: 'Host, with a port if you use one. No scheme.' },
  { key: 'address', label: 'Address', hint: 'EIP-55 checksummed.' },
  { key: 'statement', label: 'Statement', hint: 'Optional. One sentence, no line breaks.' },
  { key: 'uri', label: 'URI' },
  { key: 'chainId', label: 'Chain ID' },
  { key: 'requestId', label: 'Request ID', hint: 'Optional.' },
  { key: 'resources', label: 'Resources', hint: 'Optional. One URI per line.', area: true }
]
</script>

<template>
  <div class="bld">
    <div class="bld-grid">
      <form class="bld-form" @submit.prevent>
        <label v-for="t in TEXT" :key="t.key" class="bld-field">
          <span class="t-label">{{ t.label }}</span>
          <textarea v-if="t.area" v-model="f[t.key]" rows="3" spellcheck="false" />
          <input v-else v-model="f[t.key]" type="text" spellcheck="false" autocomplete="off" />
          <small v-if="t.hint">{{ t.hint }}</small>
        </label>

        <label class="bld-field">
          <span class="t-label">Nonce</span>
          <span class="bld-row">
            <input v-model="f.nonce" type="text" spellcheck="false" autocomplete="off" />
            <button type="button" @click="f.nonce = makeNonce()">New</button>
          </span>
          <small>At least eight alphanumeric characters, from a CSPRNG, issued by your server.</small>
        </label>

        <label class="bld-field">
          <span class="t-label">Issued At</span>
          <span class="bld-row">
            <input v-model="f.issuedAt" type="text" spellcheck="false" autocomplete="off" />
            <button type="button" @click="f.issuedAt = isoNow()">Now</button>
          </span>
        </label>

        <label class="bld-field">
          <span class="t-label">Expiration Time</span>
          <span class="bld-row">
            <input v-model="f.expirationTime" type="text" spellcheck="false" autocomplete="off" />
            <button type="button" @click="f.expirationTime = isoNow(10)">+10 min</button>
          </span>
          <small>Optional, and worth setting. This bounds the sign-in, not the session.</small>
        </label>

        <label class="bld-field">
          <span class="t-label">Not Before</span>
          <input v-model="f.notBefore" type="text" spellcheck="false" autocomplete="off" />
        </label>
      </form>

      <div class="bld-out">
        <div class="screen bld-screen">
          <div class="bld-screen-in">
            <MessageBlock :message="message" />
          </div>
        </div>

        <p class="bld-verdict" :class="check.tone">{{ check.text }}</p>

        <p class="bld-copy">
          <button type="button" class="btn btn-ghost btn-mono" @click="copy">
            {{ copied ? 'Copied' : 'Copy message' }}
          </button>
        </p>

        <p class="bld-note">
          <a href="/tools/validator">Run it through the validator</a> for the full
          rule set, including the security checks this readout leaves out.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bld {
  margin-top: var(--s5);
}

.bld-grid {
  display: grid;
  gap: var(--s6);
  align-items: start;
}

@media (min-width: 1000px) {
  .bld-grid {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1fr);
    gap: var(--s7);
  }

  .bld-out {
    position: sticky;
    top: calc(var(--vp-nav-height) + var(--s6));
  }
}

/* ----------------------------------------------------------------- form */

.bld-form {
  display: flex;
  flex-direction: column;
  gap: var(--s4);
}

.bld-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bld-field input,
.bld-field textarea {
  width: 100%;
  min-width: 0;
  padding: 7px var(--s3);
  border: 1px solid var(--rule);
  border-radius: var(--radius);
  background: var(--canvas-2);
  color: var(--ink);
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
  line-height: 1.6;
}

.bld-field textarea {
  resize: vertical;
}

.bld-field input:focus,
.bld-field textarea:focus {
  border-color: var(--rule-strong);
  outline: none;
}

.bld-field small {
  font-size: var(--t-label);
  line-height: 1.5;
  color: var(--ink-3);
}

.bld-row {
  display: flex;
  gap: var(--s2);
}

.bld-row button {
  flex: none;
  padding-inline: var(--s3);
  border: 1px solid var(--rule);
  border-radius: var(--radius);
  background: transparent;
  color: var(--ink-2);
  font-family: var(--font-mono);
  font-size: var(--t-label);
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  cursor: pointer;
  white-space: nowrap;
}

.bld-row button:hover {
  border-color: var(--ink);
  color: var(--ink);
}

/* ------------------------------------------------------------------ out */

.bld-out {
  display: flex;
  flex-direction: column;
  gap: var(--s3);
}

.bld-screen-in {
  position: relative;
  z-index: 3;
  padding: var(--s5);
}

.bld-verdict {
  margin: 0;
  padding: var(--s3) var(--s4);
  border: 1px solid var(--rule);
  border-left-width: 2px;
  border-radius: var(--radius);
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
  line-height: 1.5;
}

.bld-verdict.is-ok {
  border-left-color: var(--ok);
  color: var(--ok);
}

.bld-verdict.is-warn {
  border-left-color: var(--warn);
  color: var(--warn);
}

.bld-verdict.is-bad {
  border-left-color: var(--danger);
  color: var(--danger);
}

.bld-copy {
  margin: 0;
}

.bld-note {
  margin: var(--s2) 0 0;
  font-size: var(--t-tiny);
  line-height: 1.55;
  color: var(--ink-2);
}

.bld-note a {
  color: var(--accent-ui);
  text-decoration: none;
}

.bld-note a:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
