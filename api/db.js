/* PostgreSQL. Two tables, created on boot — the schema is small enough that
 * `CREATE ... IF NOT EXISTS` on every start is the whole migration story.
 * Add columns with `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` below the
 * creates if the shape ever grows. */

import pg from 'pg'

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5
})

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS contact_messages (
    id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name         text NOT NULL,
    email        text NOT NULL,
    company      text,
    message      text NOT NULL,
    forwarded_at timestamptz,
    created_at   timestamptz NOT NULL DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email      text NOT NULL,
    source     text NOT NULL DEFAULT 'siwe.xyz',
    created_at timestamptz NOT NULL DEFAULT now()
  );

  CREATE UNIQUE INDEX IF NOT EXISTS newsletter_subscribers_email_key
    ON newsletter_subscribers ((lower(email)));
`

/* The postgres container may come up after this one on a host reboot, so the
 * first connection is retried rather than treated as fatal. */
export async function migrate({ attempts = 10, delayMs = 3000 } = {}) {
  for (let attempt = 1; ; attempt++) {
    try {
      await pool.query(SCHEMA)
      return
    } catch (error) {
      if (attempt >= attempts) throw error
      console.warn(`Database not ready (attempt ${attempt}/${attempts}): ${error.message}`)
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }
}

export async function insertContactMessage({ name, email, company, message }) {
  const { rows } = await pool.query(
    `INSERT INTO contact_messages (name, email, company, message)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [name, email, company || null, message]
  )
  return rows[0].id
}

export async function markContactForwarded(id) {
  await pool.query(`UPDATE contact_messages SET forwarded_at = now() WHERE id = $1`, [id])
}

/* Resubscribing is a no-op rather than an error, so the endpoint never leaks
 * whether an address is already on the list. */
export async function insertNewsletterSubscriber({ email, source }) {
  await pool.query(
    `INSERT INTO newsletter_subscribers (email, source)
     VALUES ($1, $2)
     ON CONFLICT ((lower(email))) DO NOTHING`,
    [email, source]
  )
}
