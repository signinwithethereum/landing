---
title: Introduction
description: Sign in with Ethereum is ERC-4361 — a plain-text message a user signs with a key they already hold, and which your server verifies. Start here.
---

# Sign in with Ethereum

Sign in with Ethereum is an authentication method for Ethereum accounts,
specified in [ERC-4361](https://eips.ethereum.org/EIPS/eip-4361). The
specification reached **Final** status on 5 August 2025.

It works like this. Your server issues a nonce. You assemble a short plain-text
message naming your domain, the user's address, that nonce and an expiry. The
user's wallet signs the exact bytes of that message. Your server recovers the
signer and checks the message against values it controls. If everything matches,
you have proof that whoever is asking holds the key to that address, and you can
start a session.

That is the whole idea. There is no identity provider, no client secret to
register, no password to store, and nothing to broadcast — the signature is
off-chain and costs no gas.

::: tip Start here
If you want working code in front of you, go to the
[quickstart](/docs/quickstart/). If you want to understand the message first,
read [the message](/docs/message). If you are about to ship, read
[security considerations](/docs/security-considerations) — it is short and it is
the page that matters most.
:::

## What to read

| | |
| --- | --- |
| [The message](/docs/message) | Every field, what it is for, and the blank-line rules implementations get wrong. |
| [Quickstart](/docs/quickstart/) | A running Next.js app — [frontend](/docs/quickstart/frontend) and [backend](/docs/quickstart/backend). |
| [Security considerations](/docs/security-considerations) | What the server must control, and the mistakes that undermine it. |
| [Smart accounts](/docs/smart-accounts) | Verifying signatures from contract accounts, including ones not deployed yet. |
| [Sessions](/docs/sessions) | What happens after verification succeeds. A signature is not a session. |
| [Libraries](/docs/libraries/) | Official implementations in TypeScript, Python, Rust, Go and Ruby. |
| [Integrations](/docs/integrations/) | Discourse and the OIDC provider, for when you would rather not write verification code. |
| [OIDC provider](/docs/oidc-provider/) | Put SIWE behind a standard OpenID Connect endpoint. |
| [Message validator](/tools/validator) | Paste a message, see everything wrong with it. |

## What SIWE does, and does not do

It authenticates. It proves that the party making a request controls a
particular Ethereum address, at a particular moment, for a particular domain.

It does not authorize. The specification puts "authorization to server resources"
explicitly out of scope, along with "additional authentication not based on
Ethereum addresses" and "the specific mechanisms to ensure domain-binding". What
a signed-in address is allowed to *do* is your application's decision, and
building that on the message's `Resources` field is not what the field is for.

It does not manage sessions. It authenticates one moment; everything after that
is yours. See [sessions](/docs/sessions).

It does not recover keys. Losing the key means losing the account, in the way that
a forgotten password does not. The specification says so in its Key Management
notes, and points at contract accounts as the mitigation — which is real, but it
is the wallet's job and not the standard's.

And it does not hide who you are. A reused address is a persistent public
identifier, and every site you sign in to sees the same one. The specification
concedes this under Identifier Reuse and calls better answers "out of scope for
this specification".

## The standards it sits on

| | |
| --- | --- |
| [ERC-191](https://eips.ethereum.org/EIPS/eip-191) | The signed-data format. This is why existing wallets can sign a SIWE message with no changes. |
| [EIP-55](https://eips.ethereum.org/EIPS/eip-55) | The address checksum the message requires. |
| [EIP-155](https://eips.ethereum.org/EIPS/eip-155) | Where the `Chain ID` field comes from. |
| [EIP-1271](https://eips.ethereum.org/EIPS/eip-1271) | How a contract account validates a signature. |
| [ERC-6492](https://eips.ethereum.org/EIPS/eip-6492) | How an account that is not deployed yet validates one. |

## Where it is maintained

The specification is public domain and Final, which means it cannot change under
you. The implementations, the shared
[test vectors](https://github.com/signinwithethereum/test-vectors) every library
is checked against, and this site are on
[GitHub](https://github.com/signinwithethereum/).
