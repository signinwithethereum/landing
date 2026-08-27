---
title: evm.now has nothing for you to sign up for
description: A contract explorer with a paid feature and no accounts. You sign once with the wallet you already have, and what you are entitled to is read from the chain rather than from a subscriptions table.
date: 2026-08-17
draft: true
---

# evm.now has nothing for you to sign up for

[evm.now](https://evm.now) is a contract explorer: read, interact with, and
understand any verified smart contract. Explorers are read-only by nature, which
makes it a strange place to find a sign-in at all. So the interesting question is
not how it does ERC-4361 but why it needs authentication, and the answer is a
clean illustration of something the specification is explicit about:
authentication and authorization are two different jobs.

## The feature that costs money

evm.now generates plain-language, line-by-line explanations of Solidity source.
Producing those costs real money per contract, so they cannot be free for every
contract on Ethereum. Explanations for featured contracts are free to everyone;
beyond that, it is a supporter benefit.

Which means two questions have to be answered, and they are not the same question:

- **Who is asking?** A signature settles that.
- **Are they entitled to it?** An onchain subscription settles that.

The specification puts "authorization to server resources" explicitly out of
scope, and this is what respecting that looks like. The signature is asked one
question and answers it. Entitlement is a separate matter, decided somewhere else
entirely, in this case by a contract.

## What that removes from your day

There is no account to create. No email to confirm, no password to invent, no
OAuth consent screen, no "continue with" button belonging to a company that has
nothing to do with smart contracts.

There is also nothing to lose. No password to forget, no reset flow, no support
queue when the reset email does not arrive, and no credential of yours sitting in
a database that could turn up in a breach years from now. Your entitlement is not
a row someone could mislay; it is a fact about the chain that any client can check.

And it is portable in a way a subscription rarely is. The thing that says you are
a supporter is onchain, so it is not evm.now's private opinion about you.

## Sign-in appears when it is relevant, and not before

Nothing prompts you on page load. You can browse, read verified source, and poke
at contracts without ever being asked who you are, which is right, because for
almost everything the explorer does the answer does not matter.

The prompt arrives at the moment you ask for the thing that needs it. Press the
explain button on a contract that is not featured and you get one of three honest
outcomes: a note that you need to connect a wallet, a sign-in dialog, or, if you
have just generated one, a message telling you when you can generate the next.

The dialog is titled **Sign in with Ethereum** and says what signing is *for*:
verifying your supporter status. It has one button. Pressing it shows which wallet
it is waiting on, then that it is verifying, then closes and immediately starts the
explanation you asked for. No reload, no redirect, no landing back on a page you
have to re-navigate from.

Two small things that matter more than they look:

**Your session is remembered, so you are not re-signing constantly.** Signing in
again is only asked for when it has genuinely lapsed, not on every visit.

**Switching accounts in your wallet ends the session.** If you change address, the
app does not carry on acting as the previous one. That is the sort of thing that is
invisible when it works and alarming when it does not.

## Two sentences, two jobs

Worth noting because it is a small craft decision most integrations get wrong.
There are two pieces of copy in play, and they say different things:

- The message your **wallet** renders says what the signature *is*: a sign-in to
  evm.now.
- The dialog in the **app** says what it is *for*: verifying your supporter
  status.

Neither is redundant. The wallet's job is to tell you what you are cryptographically
agreeing to; the app's job is to tell you why it is asking. Collapsing them into one
sentence loses whichever half you dropped.

## Limits attach to the person, not to a token

Because the wallet is the identity, usage limits attach to it directly. Generating
a new explanation has a cooldown, and the message says so in plain terms: how long
it is, and when you can try again.

There is no API key to issue, store, rotate or leak in order to make that work.
The thing being rate-limited is an address whose control was proved by a signature,
which is a stronger claim than a bearer token in a browser and less to look after.

## What to take from it

If your product has a feature that costs money per use, you have an authorization
problem that no login solves. Answer "who" with ERC-4361: it is cheap, standard,
and stores nothing. Then answer "are they entitled" somewhere else, like a contract, a
licence server, or a subscriptions table, and keep the two apart.

The tempting shortcut is to stuff entitlements into the message's `Resources`
field. That is what [ERC-5573](https://eips.ethereum.org/EIPS/eip-5573) is for, it
has been a draft for five years, and a separate check you control works today and
is easier to reason about.

And put the sign-in where the need is. Asking on page load, before the visitor
knows what your product does, converts worse and is harder to justify, because at
that moment you genuinely do not need to know who they are.

---

*Disclosure: evm.now and this site are both built by
[1001.digital](https://1001.digital). This write-up covers what the product does
for the people using it; how it is built is theirs and is not described here.*
