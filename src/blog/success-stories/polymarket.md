---
title: "Polymarket - The worlds largest prediction market"
description: More than 30 million users. Over $27 billion traded globally. One SIWE signature to login.
date: 2026-08-27
---

# Polymarket success story (placeholder)

# Polymarket - The worlds largest prediction market

More than 30 million users. Over $27 billion traded globally. One SIWE signature to login.

By offering Sign in with Ethereum alongside Google and email, Polymarket gives wallet users a direct way to access their accounts without creating another password.

The wallet becomes more than a way to deposit funds. It becomes the identity anchoring an entire trading account.

## Authentication

Polymarket is a prediction market where people trade on the outcomes of politics, sports, economics, technology, culture, and other real-world events.

Underneath that consumer experience is a blockchain-based trading system. Users have accounts containing funds, positions, and outcome tokens. Orders are authorized cryptographically, matched through a central limit order book, and settled through smart contracts on Polygon.

Authentication is closely connected to the product. A Polymarket account is not simply a profile. It is associated with a signer and a trading wallet holding real assets.

Polymarket offers three ways into that system: Google, email, or your Ethereum wallet.

The first signature uses [Sign in with Ethereum](https://eips.ethereum.org/EIPS/eip-4361).

Polymarket’s SIWE message identifies `polymarket.com` as the requesting domain and includes the user’s address, the Polygon chain ID, a unique nonce, an issuance time, and an expiration time, 15 minutes.

The wallet signs that standardized message and returns the signature. Polymarket can verify that the signature came from the address named in the message before establishing a session.

No Polymarket password needs to be created or stored. The private key never leaves the wallet. No blockchain transaction occurs, no funds move, and no gas fee is required.

The user proves one thing, ownership of the account.

## One signature

A login signature should not be confused with a financial authorization.

Signing in does not give Polymarket permission to place an order or transfer assets. The SIWE message only creates an authenticated session.

Polymarket makes this separation visible during onboarding. Wallet users sign once to connect their account and again to enable trading.

The two signatures answer different questions.

The SIWE signature asks whether the user controls the account attempting to sign in.

The trading signature asks whether that account has authorized access to Polymarket’s trading system.

The same separation continues inside Polymarket’s [order-book authentication](https://docs.polymarket.com/getting-started/api). An EIP-712 `ClobAuth` signature establishes control of the signer and creates trading credentials. Those credentials authenticate private requests, while orders carry their own EIP-712 signatures defining what the user has approved.

Orders are matched offchain for speed. When orders match, the trade settles on Polygon, where the exchange contract verifies the signatures and transfers the corresponding funds and outcome tokens. ([Polymarket order lifecycle](https://docs.polymarket.com/concepts/order-lifecycle))

SIWE authenticates the session. Trading credentials authenticate private requests. Order signatures authorize trades. Smart contracts enforce the settlement.

## Scale

Polymarket reports more than 30 million global users and over $27 billion traded.

A [June 2026 study](https://arxiv.org/html/2606.16852v1) also described more than 100,000 daily active addresses and approximately 1.9 million filled orders per day at the time of its research.

Although these figures do not measure SIWE usage, it’s clearly a large surface.

Wallet authentication is available inside a global consumer platform handling millions of accounts, billions of dollars in cumulative trading, it’s high stakes.

Polymarket has also received significant institutional backing. In October 2025, Intercontinental Exchange, the parent company of the New York Stock Exchange, [agreed to invest up to $2 billion](https://ir.theice.com/press/news-details/2025/ICE-Announces-Strategic-Investment-in-Polymarket/default.aspx) at an approximately $8 billion pre-investment valuation.

An open Ethereum authentication standard now sits at the entrance to a product backed by one of the world’s largest exchange operators.
