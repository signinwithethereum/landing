---
layout: page
pageClass: page-bleed
title: Sign-In with Ethereum
titleTemplate: Secure authentication for millions of Ethereum users
description: Sign-In with Ethereum (ERC-4361) is an open authentication standard. A user signs a short, readable message with the key they already hold, your server checks the signature, and no third party sits in between.
---

<HomeHero />

<MessageAnatomy />

<WalletComparison />

<HomeWhy />

<HomeFlow>

```ts
import { generateNonce, SiweMessage } from '@signinwithethereum/siwe'

// 1. The nonce is yours to issue, and yours to remember.
app.get('/nonce', (req, res) => {
  req.session.nonce = generateNonce()
  res.send(req.session.nonce)
})

// 4. Verify against your own values — not the ones that arrived.
app.post('/verify', async (req, res) => {
  const { message, signature } = req.body

  const siwe = new SiweMessage(message)
  const { success } = await siwe.verify({
    signature,
    domain: 'app.example.com',
    nonce: req.session.nonce
  })

  if (!success) return res.status(401).end()

  req.session.nonce = undefined      // a nonce is good exactly once
  req.session.address = siwe.address // the session is yours from here
  res.status(204).end()
})
```

</HomeFlow>

<HomeLibraries />

<HomeAdoption />

<HomeClose />
