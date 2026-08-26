---
title: Message builder
description: Assemble an ERC-4361 message field by field and watch the wire format change. Generates nonces and timestamps. Runs entirely in your browser.
pageClass: wide
outline: false
aside: false
---

# Message builder

Fill in fields on the left, read the message on the right. Useful for seeing
what a field actually does to the wire format, and for producing a fixture to
paste into a test.

<Builder />

## Notes

The nonce button uses `crypto.getRandomValues`, which is the right source. In
production the nonce must come from **your server** and be accepted exactly once;
a nonce the client picked is not a nonce, it is a decoration.

`Version` is always `1`, so it is not editable. Leaving `Expiration Time` empty
is legal and usually a mistake; ten minutes is a reasonable default, because this
timestamp bounds the sign-in, not the session that follows it.

Resources go one URI per line. If you are reaching for them to express
permissions rather than to show the user a list, read
[ERC-5573](https://eips.ethereum.org/EIPS/eip-5573) first.
