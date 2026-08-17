---
title: Ambire turns a signature request into a sign-in screen
description: Most wallets show you a message and let you read it. Ambire recognises an ERC-4361 sign-in, lays it out in plain labels, warns when the site asking is not the site named, and stops asking you to re-sign every day.
date: 2026-08-17
---

# Ambire turns a signature request into a sign-in screen

The security of signing in with Ethereum does not live only on the server. Half of
it is whether the person holding the key can tell what they are agreeing to, and
that half belongs to the wallet. ERC-4361 says so in capitals: wallet implementers
**MUST** display the domain, address, statement and resources, and **MUST** prevent
phishing by verifying the origin of the request against the `scheme` and `domain`
fields.

[Ambire](https://www.ambire.com/) — a self-custodial extension and mobile wallet —
treats that as a product surface rather than a compliance note, and the whole thing
is open source under GPL-3.0 if you want to check.

## What you see instead of a message

The screen is titled **Sign-in request**. Not "Sign message". Not "Signature
request". It names the app asking and states the intent — *wants to prove you own
this account* — where an unstructured message gets the vaguer *is requesting your
signature*.

Underneath, the parsed message as a table of plain labels: the site, the account,
the network as a name rather than a chain number, the nonce, when it was issued.
Empty fields are left out instead of shown blank. The buttons are **Reject** and
**Sign in**.

No hex. No JSON. No scrolling through a wall of text to find the one line that
tells you which site you are about to be logged into.

Walletbeat, which reviews wallets independently, captured the dialog in July 2026
and summarises it as *"Ambire formats SIWE requests for easy readability"*, marking
ERC-4361 as supported. Their
[screenshot](https://beta.walletbeat.eth.limo/references/wallets/ambire/screenshots/2026-07-24-ambire-erc4361-siwe.png)
is the quickest way to see what this looks like in practice.

None of it is possible without the standard. A wallet can only lay out fields it
can find, and it can only find them because ERC-4361 fixes what they are called and
what order they come in. Structure at the protocol layer is what buys clarity at
the interface.

## It tells you when the site asking is not the site named

This is the part that protects people rather than merely informing them.

The message names a site. The request comes from a site. When those disagree,
something is wrong — most likely that a page you are on has handed your wallet a
message written for somewhere else, hoping your signature can be used to log in
there as you. You cannot see that by reading a signature request. The wallet can.

Ambire shows a red alert when they disagree:

> **Deceptive app request** — The app you're attempting to sign in to does not
> match the domain in the message. This may be a phishing attempt.

And when the message names an account that is not the one being asked to sign, the
request is refused outright rather than flagged. Warn where the person might have a
reason; refuse where they cannot.

There is a subtlety here that is worth knowing even if you never use Ambire. The
comparison has to be against the full host, port included — not the registrable
domain. If a wallet compares only the registrable domain, then a message for
`app.example.com` passes when the asking site is `evil.example.com`, because both
reduce to `example.com`. On any platform that hands out subdomains, that is a
complete bypass. Ambire compares the whole authority.

## It stops asking you to sign in every day

The most common complaint about signing in with Ethereum is not security, it is
repetition: the same message, for the same site, over and over.

Ambire's answer is a checkbox on the sign-in screen — *Auto-login on this network
for the next* — with a duration you pick, up to thirty days. Sign in once, and
subsequent identical sign-ins to that site happen without a prompt. Disconnecting
the app revokes it.

Two things make this safe rather than convenient-but-alarming:

**The policy belongs to you, not to the app.** An app cannot request to be
auto-approved. The wallet and the person using it create the rule, which means the
worst an app can do is ask normally.

**It only offers the option when the request is clean.** If the domain does not
match, or the message has expired, the toggle is not there. You cannot accidentally
grant standing permission to the thing the warning was about.

This is a formalised idea rather than a bespoke feature:
[ERC-8019](https://eips.ethereum.org/EIPS/eip-8019) specifies it, and Ambire's
co-founder and CEO, Ivo Georgiev, is one of its authors. Its motivation is exactly
the complaint above — *"Users repeatedly sign identical Sign-In With Ethereum
(SIWE) messages for trusted apps."*

## A brand-new smart account can sign in

Modern smart-account wallets give you an address before anything is deployed on
chain. Signing in is not a transaction, so there is no reason a person with a
brand-new account should not be able to log in — but the obvious way of checking a
contract account's signature involves calling the contract, and there is no
contract there yet.

[ERC-6492](https://eips.ethereum.org/EIPS/eip-6492) closes that, and it is Final.
Ivo Georgiev co-authored it with Agustin Aguilar of Sequence; its motivation notes
that dapps expect signatures "not only for interactions, but also just for logging
in". Ambire both produces and verifies these signatures, and publishes its
verifier as a standalone, audited library.

The user-visible consequence: a wallet you set up a minute ago works on sites that
verify properly, with no funding step and no first transaction.

## The problem that is not the wallet's to fix

Ambire keeps a list of well-known apps that reject smart-account signatures, and
tells you before you waste your time:

> This app has been flagged to not support Smart Account signatures.

That list exists because a lot of sites still verify signatures in a way that only
works for a plain key. It is the clearest possible argument for checking your own
verification path: a wallet can render a beautiful sign-in screen and a person can
read it carefully, and it still fails if your server cannot accept the signature
they produced. [Smart accounts](/docs/smart-accounts) is the page for that.

Worth being fair about scope, too: Walletbeat's overall transaction-legibility
rating for Ambire is *partial*, flagging other things it would like to see. Passing
on ERC-4361 is not passing on everything.

## What to take from it

**If you build wallets:** a parsed sign-in is a better product than a rendered
string. It lets you say "Sign-in request" instead of "Sign message", name the site,
show the account, and refuse when the origin disagrees with the message. That last
one is the specification's **MUST**, and it is the only one your user cannot do for
themselves.

**If you verify signatures:** the wallets are holding up their end. Make sure a
smart account can get through your verification, and compare the full host rather
than the registrable domain — the two ERCs above exist so that both are possible.

---

*Written from public sources: the AmbireTech repositories, the ERC texts, Ambire's
release notes, and Walletbeat. We have not spoken to Ambire.*
