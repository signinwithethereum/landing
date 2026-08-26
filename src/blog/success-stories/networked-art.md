---
title: networked.art gives collectors one account instead of two
description: On a marketplace that reads mainnet, your wallet already has a history before you ever sign up. A signature is what turns that into your account rather than a stranger's.
date: 2026-08-17
draft: true
---

# networked.art gives collectors one account instead of two

[networked.art](https://networked.art) is a marketplace where artists deploy
their own contracts and run their own auctions on Ethereum mainnet. It reads those
contracts directly, which is what makes it useful and also what gives it an
identity problem that a conventional site never has.

## You have a history before you have an account

Because the marketplace reads mainnet, it knows about your wallet before it knows
about you. If you have ever bought a piece, that address already has a presence
there: works, sales, the people who follow it. Nobody signed up for any of that.
It is just what the chain says.

So when you do arrive and make an account with an email, you are briefly two
people. There is the account you just created, and there is the history your
wallet has been accumulating since before you showed up. Both are yours. Neither
is wrong. And no email-and-password login can join them, because an email says
nothing about who controls an address.

Signing a message does. That is the whole point of the signature here: it is not
the login, it is the proof that lets the two halves become one account. You sign
once, and the work, the sales and the followers that were attached to your
address are attached to you.

The benefit is quiet and easy to miss until you have lived without it. You do not
start from zero. You do not maintain two profiles. You do not email support to ask
someone to connect them by hand.

## What signing in actually looks like

The sign-in page offers three ways in, an emailed code, a wallet, or X, and
treats them as equals rather than burying the wallet option behind a "connect"
step. Choosing the wallet route takes you to a page whose heading is
**Sign in with Ethereum** and whose subtitle explains the two steps in plain
words: connect a wallet, then sign a message to prove ownership.

Three details make it feel unremarkable in a good way:

**The signature prompt appears on its own.** Once you have picked a wallet, the
message request fires immediately. There is no second button to hunt for, which
is where a lot of wallet sign-ins lose people who assumed the first click was the
whole thing.

**The wait says which wallet it is waiting for.** "Requesting signature from
MetaMask…", then "Verifying signature…". A spinner with no subject is how someone
concludes the page is broken and reloads it, and reloading mid-signature is
exactly the wrong move.

**Rejecting is not an error.** Declining in your wallet produces a plain
explanation and a "Try again", not a stack trace and not a dead end.

## The message says what you are agreeing to

Signing in, linking a second wallet, and claiming an invite are three different
things, and networked.art puts a different sentence in each message, so the
statement your wallet shows you is about the thing you are actually doing rather
than a generic "please sign to continue".

This is the part of ERC-4361 that does the most work for the least effort. The
message names the site asking, in text the wallet renders and you can read, and
your signature is only good for that site. A signature you gave one site cannot be
carried to another, which is what makes a readable sentence a security feature
rather than a courtesy. [The message](/docs/message) has the full field list;
[security considerations](/docs/security-considerations) covers what the server has
to check.

## A first Ethereum account, without an extension

The part worth copying is the onboarding. Before showing a wallet picker,
networked.art asks a question the picker cannot: do you have a wallet, or do you
need one?

Choosing "Create new Ethereum account" makes one in the browser, with the copy
saying plainly what that means: your keys stay on this device, no extension
required. Email comes afterwards and is optional, framed as a way to reach you
rather than as the account itself.

Both routes end at the same place: a standard ERC-4361 signature. Somebody who has
never installed anything gets a self-custodial account and a normal sign-in, and
the marketplace does not need a second code path to support them. Wallet first,
email optional, and no custodial middle ground to explain.

## Names, not addresses

After you sign in, your ENS name and avatar appear by themselves. You are not
`0x7291…558f` in the interface, and you did not upload anything or fill in a
profile to avoid being.

That is the compounding benefit of using the account someone already has. The
name, the avatar and the history came with the key. A conventional sign-up would
have asked for all three and then held its own copy of them.

## What to take from it

If your product reads onchain data, you already have users you have never met,
and they already have something worth keeping. ERC-4361 is the only sign-in that
can prove a person and one of those histories are the same party, not because it
is clever, but because it is the only one whose evidence is about an address
rather than about an account somebody else issued.

Design that reconciliation before you need it. And offer to make someone a wallet
rather than assuming they have one; it is a few screens, and it is the difference
between "sign in with Ethereum" reading as a door or as a wall.

---

*Disclosure: networked.art and this site are both built by
[1001.digital](https://1001.digital). This write-up covers what the product does
for the people using it; how it is built is theirs and is not described here.*
