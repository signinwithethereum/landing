---
title: ERC-4361 is Final
description: Sign-In with Ethereum reached Final status on 5 August 2025, four years after it was drafted. Here is what that changes, what it does not, and where the remaining ambiguities are being tracked.
date: 2026-08-05
---

# ERC-4361 is Final

Sign-In with Ethereum was created as a draft on **11 October 2021**. It moved to
Last Call on **15 July 2025** and to **Final on 5 August 2025**.

If you have been treating SIWE as a promising draft you might adopt once it
settles: it settled. That was a year ago.

## What Final means

An ERC in Final status is immutable except for errata. The wording of the message,
the field names, the ordering, the ABNF grammar — none of it can change under you.
An implementation you write against it today will still be correct.

That is a stronger guarantee than most authentication choices come with, and it is
worth being concrete about the comparison. A federated login is a contract with a
company: the terms, the pricing, the availability and the continued existence of
the product are all theirs to change. ERC-4361 is a document in the public domain.
There is nobody to ask and nobody who can withdraw it.

The specification also requires nothing of you at registration time. There is no
client id, no secret, no allowlisted redirect URI, no developer account, no rate
limit. You implement one side or both and you are done.

## What Final does not mean

**It does not mean the standard covers everything.** ERC-4361 is deliberately
narrow, and the Rationale says so. Explicitly out of scope:

- Authorization to server resources
- Additional authentication not based on Ethereum addresses
- The specific mechanisms to ensure domain-binding
- Protocols for use without TLS connections

The first of those is the one people trip over. A SIWE signature authenticates a
sign-in. It does not carry permissions, and building an authorization model on the
`resources` field is not what that field is for. If you want capabilities in the
message, that is [ERC-5573](https://eips.ethereum.org/EIPS/eip-5573), which is
still Draft. If you want to gate a feature, do it in your own application —
[evm.now](/blog/success-stories/evm-now) is a worked example of keeping the two
apart.

**It does not mean the spec is unambiguous.** Final means frozen, not perfect.
Reading it closely against real implementations turns up places where two
reasonable engineers reach different conclusions, and where the shipped libraries
had quietly diverged.

## Where the remaining ambiguities live

There is an erratum in flight. The
[erc-4361-erratum](https://github.com/signinwithethereum/erc-4361-erratum) repository
documents the findings and the proposed changes — nineteen commits against v1,
including excluding a `userinfo@` component from `domain` and widening `statement`
to printable ASCII.

An erratum on a Final ERC is not an embarrassment. It is the mechanism working:
the standard is frozen, the ambiguities are catalogued in public, and the fixes
are clarifications rather than changes of substance.

Alongside it there is a corpus of
[shared test vectors](https://github.com/signinwithethereum/test-vectors) covering
parsing, verification and the grammar. All five official libraries run against it,
which is what lets us say a message built by one parses in the others rather than
hoping so. If you are writing a sixth implementation — in a language we do not
cover, or inside a wallet — start there.

The [validator](/tools/validator) on this site runs the same rules the vectors
encode, plus the security checks that are best practice rather than specification.

## The standards around it also landed

ERC-4361 does not stand alone, and the pieces that make it work for every account
type are Final too:

| | |
| --- | --- |
| [ERC-191](https://eips.ethereum.org/EIPS/eip-191) | The signed-data format SIWE rides on. Final. |
| [EIP-1271](https://eips.ethereum.org/EIPS/eip-1271) | `isValidSignature` — contract accounts can sign. Final. |
| [ERC-6492](https://eips.ethereum.org/EIPS/eip-6492) | Accounts that have not been deployed yet can sign. Final. |
| [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) | EOAs can carry code, and keep signing as EOAs. Final, shipped in Pectra. |

Between them: an EOA, a delegated EOA, a deployed smart account and a
counterfactual smart account can all sign in, and one verification path can accept
all four. [Smart accounts](/docs/smart-accounts) covers how, and which library
call gets you there — the most common way to accidentally exclude every
smart-account user is to reach for an EOA-only verification helper without
noticing that is what it is.

## If you are adopting it now

Three things worth knowing before you start:

1. **The server issues the nonce and checks its own domain.** The most common
   implementation bug is verifying the message against values taken from the
   message. [Security considerations](/docs/security-considerations) is short and
   it is the page to read.
2. **The blank lines are load-bearing.** A message with no statement has *two*
   blank lines between the address and `URI:`. Strict on-device parsers reject a
   message with one. [The message](/docs/message) has the exact rule.
3. **The signature is not a session.** It authenticates one moment. Everything
   after that is yours: [sessions](/docs/sessions).

Then pick a [library](/docs/libraries/) and you are about twenty lines from
working.
