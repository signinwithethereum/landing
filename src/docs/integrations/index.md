---
title: Integrations
description: Ready-made ways to add SIWE to an existing platform, like Discourse, Django, or any OpenID Connect client, without writing verification code.
---

# Integrations

Sometimes the right amount of SIWE code to write is none. These are the routes
that already exist.

| | | |
| --- | --- | --- |
| [Discourse](/docs/integrations/discourse) | A plugin | Wallet sign-in for a forum, with ENS names and avatars resolved server-side. |
| [Django](/docs/libraries/python#django) | A reusable app | Nonce and verify endpoints, an auth backend, sessions and wallet linking. |
| [OIDC provider](/docs/oidc-provider/) | A service you host | Put SIWE behind a standard OpenID Connect endpoint, and any OIDC client can use it. |

The OIDC provider is the general answer. If your platform can talk to an OpenID
Connect identity provider (and most enterprise software can), it can accept SIWE
without ever learning what an Ethereum address is.

## Building your own

If none of the above fits, you are writing about twenty lines against a
[library](/docs/libraries/). The shape is always the same:

**On the client.** Connect a wallet, fetch a nonce from your server, build the
message, ask the wallet to sign it, post the message and signature back.

**On the server.** Issue and remember the nonce. On verification, recover the
signer and check the message against *your own* domain, *your own* nonce and the
clock, never against values taken from the message that just arrived. Then start
a session and forget the nonce.

The [quickstart](/docs/quickstart/) is that, written out, with both halves.
[Security considerations](/docs/security-considerations) is the same thing from the
direction of what goes wrong.

## Adding one here

Built something for a platform not listed? Open a pull request on
[the site](https://github.com/signinwithethereum/website), or add yourself to
the [ecosystem](/ecosystem), one entry in one file.
