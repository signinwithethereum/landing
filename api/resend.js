/* Email forwarding via the Resend HTTP API. A single POST, so the fetch that
 * ships with Node does the job — no SDK dependency.
 *
 * CONTACT_FROM must be an address on a domain verified in Resend, or Resend
 * rejects the send. The submitter's address goes in reply_to, so answering a
 * forwarded message from the inbox just works. */

const RESEND_ENDPOINT = 'https://api.resend.com/emails'

export async function forwardContactMessage({ name, email, company, message }) {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.warn('RESEND_API_KEY is not set; contact message stored but not forwarded.')
    return false
  }

  const to = process.env.CONTACT_TO || 'contact@siwe.xyz'
  const from = process.env.CONTACT_FROM || 'siwe.xyz <contact@siwe.xyz>'

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    ...(company ? [`Company: ${company}`] : []),
    '',
    message,
    '',
    '--',
    'Sent from the contact form on siwe.xyz.'
  ].join('\n')

  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `[siwe.xyz] ${name}`,
      text
    })
  })

  if (!response.ok) {
    throw new Error(`Resend responded ${response.status}: ${await response.text()}`)
  }

  return true
}
