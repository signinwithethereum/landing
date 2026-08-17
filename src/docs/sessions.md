---
title: Sessions
description: A SIWE signature authenticates a sign-in, not a session. How to issue one, store nonces, revoke, re-authenticate, and handle account switches.
---

# Sessions

Verification tells you one thing: at this moment, someone holding the key for
this address signed this message. That is an authentication event. It is not a
session, it does not persist, and it is not something to hand back to the client
and trust on the next request.

Everything after `verify()` returns is ordinary web session work. SIWE replaces
the password, not the cookie.

::: warning
Never accept a message and signature as a credential on subsequent requests.
A client that re-sends the same pair on every call has handed you a bearer token
with no expiry that you cannot revoke, and you have paid an `ecrecover` — or an
RPC round trip — for each request. Verify once, then issue a session.
:::

## Issuing a session

You have three realistic options.

| | Where it lives | Revocable | Good for |
| --- | --- | --- | --- |
| Encrypted cookie | Cookie, contents opaque to the client | Yes, if you keep server state; otherwise only by expiry | Server-rendered apps, same-origin APIs |
| Opaque bearer token | Client storage, looked up server-side | Yes, immediately | Native apps, cross-origin APIs |
| JWT | Client storage or cookie, self-describing | No, not without a denylist | Multi-service backends that need stateless checks |

**Encrypted cookies** are the default worth reaching for. The browser attaches
the cookie automatically, `httpOnly` keeps JavaScript away from it, and an
encrypted payload cannot be forged or read by the client. The quickstart uses
[iron-session](https://github.com/vvo/iron-session) for exactly this:

```typescript
const { data } = await siweMessage.verify({
  signature,
  domain: process.env.NEXT_PUBLIC_DOMAIN ?? new URL(request.url).host,
  nonce: session.nonce,
})

session.address = data.address
session.chainId = data.chainId
session.nonce = undefined // single use — spend it
await session.save()
```

::: tip
Encrypted, not merely signed. A signed cookie is tamper-evident but readable; an
encrypted one is neither readable nor forgeable. Since the payload here is
someone's Ethereum address, the difference is a privacy question as well as a
security one.
:::

**Opaque bearer tokens** are the right answer when there is no cookie jar — a
mobile client, a CLI, a cross-origin API. Issue a random identifier, store the
session server-side keyed by it, and let the client send it in an
`Authorization` header. You get instant revocation because the state is yours.

**JWTs** buy stateless verification across services and pay for it with
revocation. A JWT is valid until it expires, whatever you decide in the
meantime. If you want both, keep access tokens short — minutes — and pair them
with a refresh token you can revoke, or maintain a denylist of live token ids,
which is server state again and most of the way back to option two.

Whatever you choose, put a real address in it and nothing more than you need.
The session should carry the verified address, the chain id, and an issue time.
It should not carry the message or the signature.

## `Expiration Time` is not your session lifetime

These are two different clocks and conflating them is the most common design
error in SIWE integrations.

The message's `Expiration Time` bounds how long the *signature* is acceptable —
the window between the wallet signing and your server verifying. That is a
network round trip and a person clicking a button. Ten minutes is generous;
`verify()` will reject anything past it.

Your session lifetime is a separate policy decision about how long the person
stays signed in. Hours or days, depending on what the app does.

```typescript
const message = new SiweMessage({
  // ...
  issuedAt: new Date().toISOString(),
  expirationTime: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // the signature
})

// the session, set after verification succeeds
session.ttl = 60 * 60 * 24 * 7
```

Setting `Expiration Time` a week out to "keep the user signed in" does not keep
anyone signed in. It only widens the window in which a captured signature is
still worth replaying.

## Nonce storage

The nonce is what makes a signature usable exactly once. That property is
entirely yours to enforce, and it needs somewhere to live between the two
requests that make up a sign-in.

Three requirements:

1. **Server-issued.** Generate it with the library's `generateNonce()` — 96 bits
   of `crypto.getRandomValues` — and never accept one the client supplied.
2. **Single use.** Delete it the moment verification succeeds. A nonce that
   survives verification is not a nonce.
3. **Short-lived.** Give it a TTL of a few minutes so unspent nonces expire on
   their own rather than accumulating.

Where to put it:

- **In the pending session** — the simplest option, and what the quickstart
  does. Write the nonce into the session cookie when it is issued, clear it on
  success. No shared storage, and the nonce is naturally scoped to one browser.
- **In Redis, keyed by nonce, with a TTL** — the right shape when you have
  several application servers or no session before sign-in. `SET nonce … EX 300
  NX`, then `DEL` on success; the `NX` makes the write itself the uniqueness
  check.
- **In your database** — fine, but remember the cleanup job. A nonce table with
  no expiry becomes a very large table.

Rate-limit the endpoint that issues nonces. Without a limit, anyone can fill
whatever store you chose.

## Revocation

Signing out has to end the session on the server. Clearing a cookie
client-side is a suggestion, not a revocation.

```typescript
export async function POST() {
  const session = await getSession()
  session.destroy()
  return Response.json({ ok: true })
}
```

Beyond a single sign-out, decide up front how you would:

- **End every session for one address.** Keep a per-address `sessionsValidAfter`
  timestamp and reject sessions issued before it. One write invalidates all of
  them.
- **End every session everywhere.** Rotate the session secret. Cheap, blunt, and
  worth having as an option before you need it.

If you went with JWTs, both of these need the denylist mentioned above. Plan for
it while you are choosing, not afterwards.

## Re-authentication

A session says who someone is. It does not say they are still at the keyboard.
For operations where that matters — changing a payout address, deleting an
account, signing off on something expensive — ask for a fresh signature.

Run the same flow: new nonce, new message, verify, and check that the recovered
address matches the session's. Put a `Request ID` or a purposeful statement in
the message so the wallet prompt says what is being approved rather than "sign
in" again. Record the time and treat the elevation as short-lived — minutes, not
the rest of the session.

This is a step up in privilege, not a new session. Do not reissue the session
cookie on the back of it.

## When the user switches accounts

Wallets let people change the selected account at any time, and the page usually
finds out from an event rather than a reload. Your session still holds the
previous address, and that is correct — it reflects who signed in.

Decide what the switch means and be consistent about it:

- **Treat it as a sign-out.** Simplest and safest. The session no longer matches
  the wallet, so end it and offer sign-in for the new account.
- **Treat it as a new sign-in.** Keep the old session until a new signature
  verifies, then swap. Better for apps where switching accounts is routine.

What not to do is keep serving the old session's data under the new address, or
switch the session's address without a signature from that address. Neither has
been authenticated.

```typescript
useEffect(() => {
  if (!address || !session?.address) return
  if (address.toLowerCase() !== session.address.toLowerCase()) {
    signOut() // or: start a fresh sign-in for `address`
  }
}, [address, session?.address])
```

Compare addresses case-insensitively, or checksum both sides first. Two
different casings of the same address are the same account, and a strict `!==`
will sign people out for no reason.

A chain switch is a smaller version of the same question. If your app only
operates on the chain the session was established for, either re-authenticate or
tell the user to switch back — do not silently treat a mainnet sign-in as
authority on another network.

## Also read

- [Security considerations](/docs/security-considerations) — the verification parameters, cookie flags, rate limits and the pre-deployment checklist.
- [The message](/docs/message) — the nonce and timestamp rules the message itself has to satisfy.
- [Backend](/docs/quickstart/backend) — a working nonce, verify and session implementation.
