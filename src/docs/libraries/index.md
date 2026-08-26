---
title: Library Implementations
description: The official SIWE libraries for TypeScript, Rust, Python, Go and Ruby, with a feature comparison and specification compliance.
---

# Library Implementations

Five official implementations of [ERC-4361](https://eips.ethereum.org/EIPS/eip-4361),
one per language, all checked against the same corpus of
[test vectors](https://github.com/signinwithethereum/test-vectors).

::: tip Already using viem?
[viem](https://viem.sh/) ships SIWE functions of its own: `createSiweMessage`,
`generateSiweNonce`, `parseSiweMessage`, `validateSiweMessage` and the
`verifySiweMessage` action. If viem is already in your project, that is the
shortest path and one fewer dependency. Note that its `verifyMessage` **utility**
recovers an EOA signer only; the **action** of the same name is the one that
handles [contract accounts](/docs/smart-accounts). Reaching for the utility is the
most common way to accidentally lock out every smart-account user.
:::

## Official Libraries

### TypeScript/JavaScript

The original and most feature-complete SIWE implementation.

-   **Documentation**: [TypeScript library reference](/docs/libraries/typescript)
-   **Package**: [`@signinwithethereum/siwe`](https://www.npmjs.com/package/@signinwithethereum/siwe) on npm
-   **Platforms**: Node.js, Browser, React Native
-   **Features**: Provider-agnostic (viem, ethers), EIP-6492 support, strict mode
-   **Best for**: Web applications, React/Vue/Angular apps, Node.js backends

### Rust

High-performance, pure Rust implementation.

-   **Documentation**: [Rust library reference](/docs/libraries/rust)
-   **Package**: [`signinwithethereum`](https://crates.io/crates/signinwithethereum) on crates.io
-   **Platforms**: Server applications, CLI tools, embedded systems
-   **Features**: Zero-copy parsing, EIP-6492 support via alloy, serde serialization
-   **Best for**: High-performance backends, blockchain infrastructure, CLI tools

### Python

Idiomatic Python implementation built on pydantic and web3.py.

-   **Documentation**: [Python library reference](/docs/libraries/python)
-   **Package**: [`signinwithethereum`](https://pypi.org/project/signinwithethereum/) on PyPI (imports as `siwe`)
-   **Platforms**: Python 3.10+ backends, scripts, data pipelines
-   **Features**: Pydantic-validated messages, EIP-1271 and EIP-6492 support via web3.py
-   **Best for**: Django / FastAPI / Flask backends, Python services and tooling

### Go

Pure-Go implementation, a port of the canonical TypeScript library.

-   **Documentation**: [Go library reference](/docs/libraries/go)
-   **Module**: [`github.com/signinwithethereum/siwe-go`](https://pkg.go.dev/github.com/signinwithethereum/siwe-go)
-   **Platforms**: Go 1.21+ services, CLIs, blockchain infrastructure
-   **Features**: Structured error types with machine-readable codes, EIP-1271 and EIP-6492 support via any go-ethereum–compatible RPC client
-   **Best for**: Go backends (net/http, Gin, Echo, gRPC), indexers, bots

### Ruby

Idiomatic Ruby implementation with built-in smart-wallet support.

-   **Documentation**: [Ruby library reference](/docs/libraries/ruby)
-   **Gem**: [`siwe-rb`](https://rubygems.org/gems/siwe-rb) on RubyGems (`require "siwe"`)
-   **Platforms**: Ruby 3.3+ backends, scripts, and tooling
-   **Features**: Frozen value-object messages, structured `Siwe::Error`, built-in EIP-1271 and EIP-6492 support via a duck-typed RPC client
-   **Best for**: Rails / Sinatra / Hanami backends, Ruby services and tooling

## Quick Comparison

| Feature | TypeScript | Rust | Python | Go | Ruby |
| --- | --- | --- | --- | --- | --- |
| Message Parsing | Yes | Yes | Yes | Yes | Yes |
| Signature Verification (EIP-191) | Yes | Yes | Yes | Yes | Yes |
| Contract Wallets (EIP-1271) | Yes | Yes (with `alloy` feature) | Yes (with web3 provider) | Yes (with `EthCaller`) | Yes (with RPC client) |
| Counterfactual Wallets (EIP-6492) | Yes | Yes (with `alloy` feature) | Yes (with web3 provider) | Yes (with `EthCaller`) | Yes (with RPC client) |
| Nonce Generation | Yes | Yes | Yes | Yes | Yes |
| Serde Serialization | N/A | Yes (with `serde` feature) | N/A (pydantic) | N/A (stdlib JSON tags) | N/A (`to_h` / `to_json`) |
| Browser Support | Yes | No | No | No | No |
| Async Verification | Yes | Yes | No (sync) | Yes (ctx-based) | No (sync) |

## Specification Compliance

All libraries implement:

- [EIP-4361](https://eips.ethereum.org/EIPS/eip-4361) (Sign in with Ethereum)
- [EIP-191](https://eips.ethereum.org/EIPS/eip-191) (Signed Data Standard)
- [EIP-1271](https://eips.ethereum.org/EIPS/eip-1271) (Contract Signatures)
- [EIP-6492](https://eips.ethereum.org/EIPS/eip-6492) (Counterfactual Signatures)
- RFC 3986 (URI Specification)
- RFC 3339 (Timestamp Format)

All libraries generate identical EIP-4361 compliant messages; signatures created
in one language can be verified in any other. That is not an aspiration: it is what
the shared [test vectors](https://github.com/signinwithethereum/test-vectors)
check, and every library runs against them. If you are writing a sixth
implementation, in another language or inside a wallet, start there.
