---
layout: page
pageClass: page-bleed
title: Sign in with Ethereum
titleTemplate: An open standard for Ethereum authentication
description: Sign in with Ethereum (ERC-4361) is an open standard for signing into apps with an Ethereum account. Users sign a readable message and the server verifies it.
---

<div class="home-page">

<HomeHero />

<WalletComparison />

<HomeWhy />

<HomeFlow>

```ts
import { generateNonce, SiweMessage } from '@signinwithethereum/siwe'

app.get('/nonce', (req, res) => {
  req.session.nonce = generateNonce()
  res.send(req.session.nonce)
})

app.post('/verify', async (req, res) => {
  const { message, signature } = req.body
  const siwe = new SiweMessage(message)
  const { success } = await siwe.verify({
    signature,
    domain: 'app.example.com',
    nonce: req.session.nonce
  })

  if (!success) return res.status(401).end()
  req.session.nonce = undefined
  req.session.address = siwe.address
  res.status(204).end()
})
```

</HomeFlow>

<HomeLibraries />

</div>
