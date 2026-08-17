/* One example message, shared by the hero and the anatomy section so the two
 * can never disagree. The address is EIP-55 checksummed and the nonce is 16
 * alphanumeric characters, so this message passes the validator on /tools/
 * validator — the site's own example has to survive the site's own linter. */

export interface Field {
  /** The label as it appears in the message, or a name for the two header lines. */
  key: string
  value: string
  /** What this field is for. One sentence, present tense. */
  note: string
  /** The attack it closes, if it closes one. */
  defends?: string
}

export const EXAMPLE = {
  domain: 'app.example.com',
  address: '0x7291BB770D168a6fD41AE73CcA7C709cba4d558f',
  statement: 'Sign in to Example.',
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

/* Line numbers into the message above, so the anatomy list can light up the
 * lines it describes. Zero-indexed. */
export const ANATOMY: (Field & { lines: number[] })[] = [
  {
    key: 'domain',
    value: EXAMPLE.domain,
    lines: [0],
    note: 'The site asking for the signature. The wallet shows it, and your server checks it against its own hostname.',
    defends: 'A signature made for one site is worthless on another.'
  },
  {
    key: 'address',
    value: EXAMPLE.address,
    lines: [1],
    note: 'The account signing in. Verification recovers the signer from the signature and this line has to match.'
  },
  {
    key: 'statement',
    value: EXAMPLE.statement,
    lines: [3],
    note: 'Optional, and the one line a person is most likely to read. Say what signing does, in a sentence.'
  },
  {
    key: 'URI',
    value: EXAMPLE.uri,
    lines: [5],
    note: 'Where the sign-in is happening. Checked alongside the domain, so a matching domain on the wrong origin still fails.'
  },
  {
    key: 'Version',
    value: EXAMPLE.version,
    lines: [6],
    note: 'Always 1. The standard has one version.'
  },
  {
    key: 'Chain ID',
    value: EXAMPLE.chainId,
    lines: [7],
    note: 'The chain the account is asserted on. Pin the values you accept rather than trusting whatever arrives.'
  },
  {
    key: 'Nonce',
    value: EXAMPLE.nonce,
    lines: [8],
    note: 'Issued by your server, at least eight alphanumeric characters, and accepted exactly once.',
    defends: 'A captured signature cannot be presented twice.'
  },
  {
    key: 'Issued At',
    value: EXAMPLE.issuedAt,
    lines: [9],
    note: 'When the message was created, as an ISO 8601 timestamp.'
  },
  {
    key: 'Expiration Time',
    value: EXAMPLE.expirationTime,
    lines: [10],
    note: 'When the signature stops being accepted. Ten minutes is plenty — this authenticates a sign-in, not a session.',
    defends: 'A leaked signature stops working on its own.'
  }
]

/** The three fields ERC-4361 allows that this example leaves out. */
export const OPTIONAL: Field[] = [
  {
    key: 'Not Before',
    value: '2026-08-17T12:00:00Z',
    note: 'The signature is not valid until this time.'
  },
  {
    key: 'Request ID',
    value: 'a3f1c9',
    note: 'Your own correlation id, carried through the signature.'
  },
  {
    key: 'Resources',
    value: '- https://example.com/my-web2-claim.json',
    note: 'A list the user is shown and agrees to. ERC-5573 builds object capabilities on top of it.'
  }
]
