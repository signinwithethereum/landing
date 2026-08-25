---
title: The message
description: Every field of an ERC-4361 message, in the order the grammar puts them, with the blank-line, checksum, nonce and timestamp rules spelled out.
---

# The message

A SIWE message is plain text. Your app builds it, the wallet shows it to the
person signing, and the wallet signs the exact bytes with `personal_sign`
([EIP-191](https://eips.ethereum.org/EIPS/eip-191)). Verification recovers a
signer from those same bytes, so the string your server checks has to be
byte-identical to the string that was signed. There is no canonicalization step
to save you.

[ERC-4361](https://eips.ethereum.org/EIPS/eip-4361) fixes the format: which
lines appear, in which order, with which labels, and where the blank lines go.
Everything below follows the published standard.

## The template

```
[scheme://]${domain} wants you to sign in with your Ethereum account:
${address}

${statement}

URI: ${uri}
Version: ${version}
Chain ID: ${chainId}
Nonce: ${nonce}
Issued At: ${issuedAt}
Expiration Time: ${expirationTime}
Not Before: ${notBefore}
Request ID: ${requestId}
Resources:
- ${resources[0]}
- ${resources[1]}
```

The order is not a convention, it is the grammar. A field out of order is a
message some parsers will reject and some wallets will refuse to render.

## Fields

| Line | Required | What it is |
| --- | --- | --- |
| `${domain} wants you to sign in with your Ethereum account:` | Yes | The RFC 3986 authority asking for the signature, optionally preceded by `scheme://`. |
| `${address}` | Yes | The account signing in, as `0x` plus 40 hex characters. |
| `${statement}` | No | One line of human-readable text. |
| `URI:` | Yes | An RFC 3986 URI for the resource that is the subject of the signing. |
| `Version:` | Yes | Always `1`. |
| `Chain ID:` | Yes | The EIP-155 chain id the session is bound to. |
| `Nonce:` | Yes | At least 8 alphanumeric characters, issued by your server. |
| `Issued At:` | Yes | RFC 3339 datetime for when the message was created. |
| `Expiration Time:` | No | When the signature stops being valid. |
| `Not Before:` | No | When the signature starts being valid. |
| `Request ID:` | No | Your own identifier for this sign-in request. |
| `Resources:` | No | A list the user is shown and agrees to, one `- ` URI per line. |

The five optional trailing fields keep the order above when several are present:
`Expiration Time`, `Not Before`, `Request ID`, then `Resources`.

### Domain

The domain is what the wallet displays and what your server compares against
its own hostname. Pass your known value into verification; never read the
domain out of the message and compare it against itself.

Include the port when there is one — `localhost:3000` is a valid authority and a
different domain from `localhost`. The optional `scheme://` prefix binds the
origin's scheme as well, and if you emit it you have to expect it at
verification time too.

### Address

`0x` followed by 40 hex characters. For an EOA the casing MUST follow the
[ERC-55](https://eips.ethereum.org/EIPS/eip-55) mixed-case checksum, which is
what every official library emits and what the validator checks.

::: warning
An all-lowercase address is the single most common defect in real messages. Most
libraries accept it with a warning rather than an error, so it survives testing
and then fails against stricter verifiers. Checksum the address when you build
the message.
:::

Verification recovers a signer from the signature and compares it to this line.
For a contract account there is nothing to recover — see
[Smart accounts](/docs/smart-accounts).

### Statement

Optional, and the one line a person is actually likely to read. Say what signing
does, in a sentence.

The grammar allows RFC 3986 reserved and unreserved characters plus the space,
which exists to exclude the line feed: a statement cannot contain a newline. If
you need two sentences, use two sentences on one line. A statement carrying a
line break is not a longer statement, it is a message that no longer parses.

### URI and Version

`URI` is where the sign-in is happening. It is checked alongside the domain, so
a matching domain on the wrong origin still fails.

`Version` is `1`. The standard has one version and no plans for another.

### Chain ID

The EIP-155 chain id the session is bound to, and the network on which contract
accounts have to be resolved. Decimal digits, canonically formatted — `01` is
not `1`.

Pin the values you accept rather than trusting whatever arrives. Accepting any
chain id means accepting a signature produced on a chain you never intended to
support.

### Nonce

At least 8 alphanumeric characters — `[A-Za-z0-9]`, so no hyphens, no
underscores, no base64 padding. Every official library ships a
cryptographically secure generator that produces 17 characters; use it.

Two rules matter more than the length:

- The nonce comes from **your server**. A nonce the client picked provides no
  replay protection, because whoever captured the signed message can present it
  again with the same nonce.
- The nonce is accepted **exactly once**. Delete it the moment verification
  succeeds.

See [Sessions](/docs/sessions) for where to store one and how long to keep it.

### Timestamps

`Issued At`, `Expiration Time` and `Not Before` are RFC 3339 datetimes — the
profile of ISO 8601 that `new Date().toISOString()` produces:

```typescript
new Date().toISOString() // '2026-08-17T12:00:00.000Z'
```

Both `Z` and a numeric offset are valid, and fractional seconds are allowed.
Local times without an offset are not.

`Expiration Time` is optional and leaving it out is legal. It is also almost
always wrong: without it, a captured signature is valid forever. Ten minutes is
a sensible default, because this timestamp bounds the sign-in and not the
session that follows it.

### Request ID

An opaque identifier of your own, carried through the signature so you can
correlate the sign-in with something on your side. Restricted to RFC 3986
`pchar`, so no `/` and no `?`.

### Resources

A list of things the user is shown and agrees to as part of authenticating. The
section header is `Resources:` on its own line, then one entry per line, each
prefixed with `- `:

```
Resources:
- https://example.com/my-web2-claim.json
- ipfs://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq
```

Each entry has to be a valid RFC 3986 URI. The list is informational as far as
ERC-4361 is concerned — it does not grant anything by itself.
[ERC-5573](https://eips.ethereum.org/EIPS/eip-5573) builds object capabilities
on top of this field; if you are reaching for `Resources` to express permissions
rather than to show someone a list, read that first.

## Blank lines

Under published ERC-4361, the message has a fixed seam between the account
address and `URI:`:

`address` → empty line → optional statement → empty line → `URI:`

The statement can disappear. Its surrounding empty lines cannot.

<BlankLines />

::: info Proposed update — work in progress
The [draft erratum](https://github.com/signinwithethereum/ERCs/pull/1) explores
a no-statement form with one empty line between the address and `URI:`. It is
not final and does not change the rule above today.
:::

::: tip
For published ERC-4361, one empty line with no statement is the classic
hand-rolled bug. It can still verify against your own parser because the same
wrong code built the message, then fail everywhere else. Build messages with a
library, or paste the finished string into the [validator](/tools/validator).
:::

There is no trailing newline. The message ends with the last character of the
last field.

## A complete example

```
app.example.com wants you to sign in with your Ethereum account:
0x7291BB770D168a6fD41AE73CcA7C709cba4d558f

Sign in to Example App.

URI: https://app.example.com
Version: 1
Chain ID: 1
Nonce: kR8vQ2mZ7pLx4Tn9
Issued At: 2026-08-17T12:00:00Z
Expiration Time: 2026-08-17T12:10:00Z
```

Line by line:

| Line | Value | Notes |
| --- | --- | --- |
| 1 | `app.example.com` | The authority. Your server compares this against its own hostname. |
| 2 | `0x7291BB770D168a6fD41AE73CcA7C709cba4d558f` | ERC-55 checksummed. |
| 3 | | Blank. Always. |
| 4 | `Sign in to Example App.` | The statement. One line, no newline in it. |
| 5 | | Blank. Always. |
| 6 | `https://app.example.com` | Agrees with the domain on line 1. |
| 7 | `1` | The only version. |
| 8 | `1` | Ethereum mainnet. |
| 9 | `kR8vQ2mZ7pLx4Tn9` | 16 alphanumeric characters, server-issued, single-use. |
| 10 | `2026-08-17T12:00:00Z` | RFC 3339. |
| 11 | `2026-08-17T12:10:00Z` | Ten minutes later. Bounds the sign-in, not the session. |

Producing it with the TypeScript library:

```typescript
import { SiweMessage, generateNonce } from '@signinwithethereum/siwe'

const message = new SiweMessage({
  domain: 'app.example.com',
  address: '0x7291BB770D168a6fD41AE73CcA7C709cba4d558f',
  statement: 'Sign in to Example App.',
  uri: 'https://app.example.com',
  version: '1',
  chainId: 1,
  nonce: generateNonce(), // in production, issued by your server
  issuedAt: '2026-08-17T12:00:00Z',
  expirationTime: '2026-08-17T12:10:00Z',
})

message.prepareMessage() // the exact string above
```

## The grammar

The normative definition, from ERC-4361:

```text
sign-in-with-ethereum =
    [ scheme "://" ] domain %s" wants you to sign in with your Ethereum account:" LF
    address LF
    LF
    [ statement LF ]
    LF
    %s"URI: " uri LF
    %s"Version: " version LF
    %s"Chain ID: " chain-id LF
    %s"Nonce: " nonce LF
    %s"Issued At: " issued-at
    [ LF %s"Expiration Time: " expiration-time ]
    [ LF %s"Not Before: " not-before ]
    [ LF %s"Request ID: " request-id ]
    [ LF %s"Resources:"
    resources ]

scheme          = ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )
domain          = authority
address         = "0x" 40*40HEXDIG
statement       = *( reserved / unreserved / " " )
uri             = URI
version         = "1"
chain-id        = 1*DIGIT
nonce           = 8*( ALPHA / DIGIT )
issued-at       = date-time
expiration-time = date-time
not-before      = date-time
request-id      = *pchar
resources       = *( LF resource )
resource        = "- " URI
```

## Check your work

- [Message validator](/tools/validator) — paste a message and get back format, compliance and security problems.
- [Message builder](/tools/builder) — assemble one field at a time and watch the wire format change.
- [Security considerations](/docs/security-considerations) — what the server has to assert at verification time.
- [ERC-4361](https://eips.ethereum.org/EIPS/eip-4361) — the standard itself.
