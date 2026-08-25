/* One example account and message, shared by the homepage sign-in demo and the
 * validator, so the site tells the same story twice. The address is
 * EIP-55 checksummed and the nonce is 16 alphanumeric characters, so the site's
 * own example survives the site's own linter. */

export const EXAMPLE = {
  domain: 'app.example.com',
  address: '0x7291BB770D168a6fD41AE73CcA7C709cba4d558f',
  statement: 'Sign in to Example App.',
  uri: 'https://app.example.com',
  version: '1',
  chainId: '1',
  nonce: 'kR8vQ2mZ7pLx4Tn9',
  issuedAt: '2026-08-17T12:00:00Z',
  expirationTime: '2026-08-17T12:10:00Z'
} as const

/** Build the message exactly as ERC-4361 orders it. */
export function exampleMessage(): string {
  const m = EXAMPLE
  return [
    `${m.domain} wants you to sign in with your Ethereum account:`,
    m.address,
    '',
    m.statement,
    '',
    `URI: ${m.uri}`,
    `Version: ${m.version}`,
    `Chain ID: ${m.chainId}`,
    `Nonce: ${m.nonce}`,
    `Issued At: ${m.issuedAt}`,
    `Expiration Time: ${m.expirationTime}`
  ].join('\n')
}

/* The same message with the clock set to now.
 *
 * The example above carries fixed timestamps, which is right for a page you
 * read and wrong for the validator: any fixed `Issued At` is either in the
 * future or already expired, so a static sample always trips a time check. This
 * one is stamped when it is asked for. */
export function freshMessage(): string {
  const now = new Date()
  now.setMilliseconds(0)
  const later = new Date(+now + 10 * 60_000)
  const iso = (d: Date) => d.toISOString().replace('.000', '')

  return exampleMessage()
    .replace(`Issued At: ${EXAMPLE.issuedAt}`, `Issued At: ${iso(now)}`)
    .replace(`Expiration Time: ${EXAMPLE.expirationTime}`, `Expiration Time: ${iso(later)}`)
}
