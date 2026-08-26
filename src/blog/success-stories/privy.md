---
title: "Privy: SIWE inside infrastructure"
description: "160 million accounts. More than $15 billion processed each month. One supported flow for bringing an existing Ethereum wallet into an application."
date: 2026-08-25
---

# **Privy: SIWE inside infrastructure**

160 million accounts. More than $15 billion processed each month. One supported flow for bringing an existing Ethereum wallet into an application.

By integrating Sign in with Ethereum into a broader authentication platform, Privy lets developers offer passwordless wallet login alongside email, social accounts, SMS, and passkeys.

The result is more than a successful implementation at one application. Privy has made SIWE available as reusable infrastructure that thousands of product teams can configure, customize, and bring to their own users.

*Privy’s [current product page](https://www.privy.io/user-wallets) reports more than 160 million accounts, over $15 billion processed monthly, signature times under 20 milliseconds, and 99.99 percent historical uptime. These are platform-wide figures, not SIWE-specific usage numbers.*

## **Authentication infrastructure**

Most SIWE success stories begin with an application deciding to add wallet login. The application generates a message, asks the user to sign it, verifies the signature, and creates a session.

Privy operates one layer beneath that experience.

Its authentication infrastructure gives developers a common system for supporting email, SMS, passkeys, social accounts, and external wallets. Teams can use Privy’s prebuilt interface or create a fully customized experience using its SDKs.

When a user authenticates successfully, Privy returns a common user object containing a unique identifier and any accounts the user has linked. An Ethereum wallet can therefore become one credential within a larger identity rather than an isolated crypto account.

A user might initially enter through Google, later create an embedded wallet, and then link an existing external wallet. Another user can begin directly with SIWE and never create a password at all.

This flexibility matters because products rarely serve only one kind of user. Crypto-native users may expect to connect an existing wallet. Everyone else may be more comfortable starting with an email address, passkey, or social account.

Privy allows both experiences to exist inside the same product.

## **Sign in with an existing wallet**

Privy’s [external wallet authentication flow](https://docs.privy.io/authentication/user-authentication/login-methods/wallet) follows a clear sequence.

First, the application requests a SIWE message for the user’s Ethereum address and the relevant blockchain network. The message follows the structure defined by [ERC-4361](https://eips.ethereum.org/EIPS/eip-4361), including information such as the requesting domain, wallet address, URI, chain ID, nonce, and issuance time.

The user signs that message through a connected wallet such as MetaMask, Phantom, or Coinbase Wallet. The signature uses Ethereum’s standard personal-signing method and happens locally inside the wallet.

The application then submits the original message and signature to Privy. Privy verifies the request and returns an authenticated user, allowing the application to establish a session.

No password needs to be created or stored. The private key never leaves the wallet. No blockchain transaction is submitted, no funds move, and no gas fee is required.

The user is proving one fact: they control the Ethereum account named in the message.

Privy packages that process into supported authentication methods and SDK functions. Developers still control how wallet login appears inside their product, but they do not need to invent the underlying message generation, verification, user creation, and session flow from scratch.

## **Direct and delegated identity**

Privy distinguishes between direct and delegated authentication methods.

With a direct method such as a wallet or passkey, the user controls the credential used to authenticate. In the case of SIWE, that credential is an Ethereum account secured by the user’s cryptographic keys.

With delegated authentication, the user relies on another service. Google, Apple, GitHub, an email provider, or a mobile carrier helps establish who the user is and whether they can continue accessing the account.

Both models are useful. The important difference is where control resides.

Privy does not require developers to choose one model for every user. Wallet authentication can appear as an initial login option or be added later as a linked account. Applications can also connect Privy to an existing authentication provider rather than replacing their current identity system.

That makes SIWE a first-class credential without forcing the entire application into a wallet-first onboarding experience.

For a user who already has an Ethereum wallet, authentication can remain direct and passwordless. For someone encountering crypto rails for the first time, the application can offer a familiar entrance and introduce wallet functionality later.

## **From authentication to wallet control**

Privy also provides embedded wallets, but these should not be confused with SIWE.

SIWE authenticates a user who already controls an external Ethereum account. An embedded wallet allows an application to create a wallet for someone who may have entered through email, social login, SMS, or a passkey.

Together, the two approaches let applications support both existing wallet holders and users who do not yet have one.

According to Privy’s [wallet architecture documentation](https://docs.privy.io/wallets/overview/solutions/user-wallets), embedded wallet keys are divided using distributed key sharding. Neither Privy nor the application holds the complete private key. The key is reconstructed temporarily inside a trusted execution environment when an authorized signature is required and is not persistently stored in complete form.

Authentication therefore becomes part of the wallet’s security boundary. A valid user session can authorize wallet activity, while policies can restrict factors such as supported networks, assets, recipients, and transfer limits.

This is where Privy’s broader contribution becomes clear. It connects the moment a user proves who they are with the infrastructure through which that user can control a wallet, sign messages, and interact with digital assets.

## **Scale and Stripe**

Privy’s reach gives that infrastructure a significant multiplier effect.

When Stripe announced its acquisition of Privy in June 2025, Privy said it powered more than 75 million accounts across over 1,000 developer teams. Stripe completed the acquisition the following month, with Privy continuing to operate as an independent product. The financial terms were not disclosed. ([Privy](https://privy.io/blog/announcing-our-acquisition-by-stripe), [Stripe](https://stripe.com/newsroom/news/stripe-2025-update))

By February 2026, Stripe described Privy as powering more than 110 million programmable wallets. Privy’s current product page now reports more than 160 million accounts and over $15 billion in monthly processing.

Those numbers represent Privy’s complete authentication and wallet platform, not SIWE alone. Still, they show the scale of the infrastructure through which SIWE is being offered.

Privy is also becoming more deeply integrated with Stripe’s financial products. In April 2026, Stripe and Privy announced digital asset accounts designed to let companies build stablecoin-based financial products through a single API. Stripe identified Ramp, Deel, and DoorDash among the companies already building with the system. ([Stripe Sessions 2026](https://stripe.com/newsroom/news/sessions-2026))

Privy’s story is therefore not simply that a large platform adopted SIWE. It is that a company supplying identity and wallet infrastructure to many other platforms made SIWE one of its standard authentication capabilities.

Every developer that enables the method can bring wallet-based identity into another product, market, and user experience.

## **The takeaway**

You do not need to force every user through a crypto-native onboarding flow to support wallet identity.

Let email, social accounts, SMS, passkeys, and wallets lead into one user system. Give people who already have an Ethereum wallet a direct way to use it. Let everyone else begin with something familiar.

For an existing wallet holder, ask exactly one question: does this person control this account?

Privy’s makes the open standard that is SIWE practical for other developers to benefit from.

