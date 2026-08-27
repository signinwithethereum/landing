---
title: Message validator
description: Paste an ERC-4361 message and see everything wrong with it, from format and compliance to security. Runs entirely in your browser.
pageClass: wide
outline: false
aside: false
---

# Message validator

Paste a message. You get back parse errors, spec violations, and the security
problems that a message can be well formed and still have, such as a four-digit nonce,
a missing expiry, or a domain that does not match the URI.

Nothing is uploaded. The whole linter runs in this page, which matters because
real messages carry real addresses and real nonces.

<Validator />

## What it checks

**Format.** The header line, the address line, the blank lines around the
statement, field order, and the exact labels ERC-4361 specifies. A message that
drifts here is a message some wallets will refuse to render.

**Compliance.** Address checksums, `Version: 1`, ISO 8601 timestamps, RFC 3986
URIs, and the alphanumeric nonce rule.

**Security.** The things the spec permits but you should not do: a short or
predictable nonce, no expiry, a statement carrying line breaks, a domain that
does not agree with the URI, a chain id you probably did not mean.

Strict mode adds the security and best-practice rules. Turn it off to see only
what breaks the standard.

## Also useful

- [Message builder](/tools/builder): go the other way, and assemble one field at a time.
- [Security considerations](/docs/security-considerations): the reasoning behind the security rules.
- [The message](/docs/message): every field, and what it is for.
