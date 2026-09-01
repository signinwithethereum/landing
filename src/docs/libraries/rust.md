---
title: Rust
description: 'API reference for the signinwithethereum crate: the Message struct, VerificationOpts, error types and smart-wallet verification.'
---

# Rust

The Rust implementation of Sign in with Ethereum can be found here:

- [signinwithethereum/siwe-rs on GitHub](https://github.com/signinwithethereum/siwe-rs)
- [signinwithethereum on crates.io](https://crates.io/crates/signinwithethereum)

## Getting Started

### Installation

Add the crate to your `Cargo.toml`:

```toml
[dependencies]
signinwithethereum = "0.8"
```

### Features

Enable optional features as needed:

| Feature | Description |
| --- | --- |
| `serde` | Serialization/deserialization via serde |
| `alloy` | EIP-1271 contract wallet and EIP-6492 counterfactual wallet signature verification |
| `typed-builder` | Builder pattern for `VerificationOpts` |

```toml
[dependencies]
signinwithethereum = { version = "0.8", features = ["serde", "alloy"] }
```

## API Reference

### `Message` Struct

The core type representing an [EIP-4361](https://eips.ethereum.org/EIPS/eip-4361) message. Implements `FromStr` for parsing and `Display` for serialization.

#### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `scheme` | `Option<String>` | No | URI scheme of the request origin (e.g. `"https"`) |
| `domain` | `Authority` | Yes | RFC 3986 authority requesting the signing |
| `address` | `[u8; 20]` | Yes | Ethereum address (raw bytes) |
| `address_raw` | `Option<String>` | No | Raw address hex (no `0x`) exactly as parsed, set only when the input was not EIP-55 checksummed |
| `statement` | `Option<String>` | No | Human-readable ASCII assertion |
| `uri` | `UriString` | Yes | RFC 3986 URI referring to the resource |
| `version` | `Version` | Yes | Must be `V1` for EIP-4361 |
| `chain_id` | `u64` | Yes | EIP-155 Chain ID |
| `nonce` | `String` | Yes | Alphanumeric token, minimum 8 characters |
| `issued_at` | `TimeStamp` | Yes | RFC 3339 timestamp |
| `expiration_time` | `Option<TimeStamp>` | No | When the message expires |
| `not_before` | `Option<TimeStamp>` | No | When the message becomes valid |
| `request_id` | `Option<String>` | No | System-specific identifier |
| `resources` | `Vec<UriString>` | No | List of resource URIs |
| `warnings` | `Vec<String>` | No | Non-fatal validation warnings (e.g. unchecksummed address) surfaced during parsing |

::: info
`address_raw` and `warnings` are populated by the parser. When constructing a
`Message` directly, set `address_raw: None` (the canonical EIP-55 form is then
used) and `warnings: Vec::new()`. `PartialEq` ignores `warnings` but includes
`address_raw`, because that field changes how the message serializes and
therefore what gets hashed for EIP-191.
:::

#### Parsing

Parse an EIP-4361 formatted string into a `Message` via `FromStr`:

```rust
use signinwithethereum::Message;

let msg = r#"example.com wants you to sign in with your Ethereum account:
0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2

Sign in to Example

URI: https://example.com
Version: 1
Chain ID: 1
Nonce: 32891756
Issued At: 2021-09-30T16:25:24Z"#;

let message: Message = msg.parse().unwrap();
```

The parser validates:
- EIP-55 checksummed address (mixed-case addresses must pass the checksum; all-lowercase / all-uppercase are accepted with a warning on `message.warnings`)
- Alphanumeric nonce (minimum 8 characters)
- RFC 3339 timestamps
- RFC 3986 URI and domain
- Optional `scheme://` prefix per EIP-4361
- Printable ASCII statement (no control characters)
- Truly blank separator lines between the address, statement and URI fields, so that no unauthenticated text can be smuggled into a message that still verifies

#### Serialization

`Message` implements `Display`, producing the EIP-4361 string representation:

```rust
use signinwithethereum::Message;

let msg = "example.com wants you to sign in with your Ethereum account:\n0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\n\n\nURI: https://example.com\nVersion: 1\nChain ID: 1\nNonce: 32891756\nIssued At: 2021-09-30T16:25:24Z";
let message: Message = msg.parse().unwrap();
let formatted = message.to_string();
```

With the `serde` feature, `Message` serializes as its EIP-4361 string:

```rust
use signinwithethereum::Message;

let message: Message = msg_str.parse().unwrap();
let json = serde_json::to_string(&message).unwrap();
let deserialized: Message = serde_json::from_str(&json).unwrap();
```

#### Methods

##### `verify_eip191(&self, sig: &[u8; 65]) -> Result<Vec<u8>, VerificationError>`

Verifies an EIP-191 signature against the message's `address` field. Returns the recovered public key on success.

```rust
use signinwithethereum::Message;
use hex::FromHex;

let message: Message = msg_str.parse().unwrap();
let signature = <[u8; 65]>::from_hex("6228b3ec...051c").unwrap();

let public_key: Vec<u8> = message.verify_eip191(&signature).unwrap();
```

##### `async verify(&self, sig: &[u8], opts: &VerificationOpts) -> Result<(), VerificationError>`

Full verification: time constraints, field binding checks, and signature authentication. Verification order follows EIP-6492:

1. **EIP-6492**: if the signature has the magic suffix, verify via the universal offchain validator
2. **EOA**: try standard `ecrecover` for 65-byte signatures
3. **EIP-1271**: fall back to onchain `isValidSignature` if EOA verification fails (requires `alloy` feature)

```rust
use hex::FromHex;
use signinwithethereum::{Message, VerificationOpts};
use time::{format_description::well_known::Rfc3339, OffsetDateTime};

#[tokio::main]
async fn main() {
    let msg = r#"localhost:4361 wants you to sign in with your Ethereum account:
0x6Da01670d8fc844e736095918bbE11fE8D564163

SIWE Notepad Example

URI: http://localhost:4361
Version: 1
Chain ID: 1
Nonce: kEWepMt9knR6lWJ6A
Issued At: 2021-12-07T18:28:18.807Z"#;

    let message: Message = msg.parse().unwrap();
    let signature = <[u8; 65]>::from_hex(
        "6228b3ecd7bf2df018183aeab6b6f1db1e9f4e3cbe24560404112e25363540eb\
         679934908143224d746bbb5e1aa65ab435684081f4dbb74a0fec57f98f40f5051c"
    ).unwrap();

    let opts = VerificationOpts {
        domain: Some("localhost:4361".parse().unwrap()),
        nonce: Some("kEWepMt9knR6lWJ6A".into()),
        timestamp: Some(
            OffsetDateTime::parse("2021-12-08T00:00:00Z", &Rfc3339).unwrap()
        ),
        ..Default::default()
    };

    message.verify(&signature, &opts).await.unwrap();
}
```

##### `valid_now(&self) -> bool`

Checks whether the message is valid at the current time (not expired, past `not_before`).

##### `valid_at(&self, t: &OffsetDateTime) -> bool`

Checks whether the message is valid at a specific point in time. Uses the half-open interval `[not_before, expiration_time)`.

##### `eip191_bytes(&self) -> Result<Vec<u8>, fmt::Error>`

Returns the EIP-191 Personal-Signature pre-hash signing input bytes.

##### `eip191_hash(&self) -> Result<[u8; 32], fmt::Error>`

Returns the Keccak-256 hash of the EIP-191 signing input.

### `VerificationOpts` Struct

Configuration for `Message::verify()`. All fields are optional; only set the fields you want to validate against.

| Field | Type | Description |
| --- | --- | --- |
| `domain` | `Option<Authority>` | Expected domain (origin binding) |
| `nonce` | `Option<String>` | Expected nonce (replay resistance) |
| `timestamp` | `Option<OffsetDateTime>` | Time to check against (defaults to now) |
| `uri` | `Option<UriString>` | Expected URI |
| `chain_id` | `Option<u64>` | Expected chain ID |
| `scheme` | `Option<String>` | Expected scheme |
| `rpc_url` | `Option<String>` | RPC URL for EIP-1271/EIP-6492 checks (requires `alloy` feature) |

::: info
The `rpc_url` field is only available when the `alloy` feature is enabled.
:::

With the `typed-builder` feature, you can use the builder pattern:

```rust
use signinwithethereum::VerificationOpts;

let opts = VerificationOpts::builder()
    .domain(Some("example.com".parse().unwrap()))
    .nonce(Some("abc12345".into()))
    .build();
```

### `generate_nonce() -> String`

Generates a cryptographically secure random nonce (17 alphanumeric characters).

```rust
use signinwithethereum::generate_nonce;

let nonce = generate_nonce();
```

### Error Types

#### `ParseError`

Errors raised during message parsing:

| Variant | Description |
| --- | --- |
| `Domain` | Domain field is non-conformant |
| `Format` | General formatting error |
| `Address` | Address field is non-conformant |
| `Uri` | URI field is non-conformant |
| `TimeStamp` | Timestamp is non-conformant |
| `ParseIntError` | Chain ID is non-conformant |

#### `VerificationError`

Errors raised during signature verification:

| Variant | Description |
| --- | --- |
| `Crypto` | Invalid k256 signature |
| `Serialization` | Message serialization failed |
| `Signer` | Recovered address does not match |
| `Time` | Message expired or not yet valid |
| `DomainMismatch` | Domain does not match expected value |
| `NonceMismatch` | Nonce does not match expected value |
| `UriMismatch` | URI does not match expected value |
| `ChainIdMismatch` | Chain ID does not match expected value |
| `SchemeMismatch` | Scheme does not match expected value |
| `ContractCall` | Contract wallet verification failed (requires `alloy`) |
| `RpcRequired` | EIP-6492 signature detected but no RPC URL configured |
| `SignatureLength` | Signature is not 65 bytes and `alloy` feature is not enabled |

## Smart Contract Wallets (EIP-1271 / EIP-6492)

With the `alloy` feature enabled, `verify()` supports signatures from:

- **EIP-1271**: deployed contract wallets (e.g. Safe, Argent)
- **EIP-6492**: counterfactual (not yet deployed) contract wallets

Provide an `rpc_url` in the verification options:

```rust
use signinwithethereum::{Message, VerificationOpts};

let opts = VerificationOpts {
    domain: Some("example.com".parse().unwrap()),
    nonce: Some(stored_nonce),
    rpc_url: Some("https://eth.llamarpc.com".into()),
    ..Default::default()
};

message.verify(&signature, &opts).await.unwrap();
```

## Backend Integration

### Axum Example

```rust
use axum::{extract::State, http::StatusCode, routing::{get, post}, Json, Router};
use serde::{Deserialize, Serialize};
use signinwithethereum::{generate_nonce, Message, VerificationOpts};
use std::{collections::HashMap, sync::Arc};
use tokio::sync::Mutex;

type NonceStore = Arc<Mutex<HashMap<String, ()>>>;

#[tokio::main]
async fn main() {
    let nonces: NonceStore = Arc::new(Mutex::new(HashMap::new()));

    let app = Router::new()
        .route("/api/nonce", get(get_nonce))
        .route("/api/verify", post(verify))
        .with_state(nonces);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn get_nonce(State(nonces): State<NonceStore>) -> Json<NonceResponse> {
    let nonce = generate_nonce();
    nonces.lock().await.insert(nonce.clone(), ());
    Json(NonceResponse { nonce })
}

async fn verify(
    State(nonces): State<NonceStore>,
    Json(body): Json<VerifyRequest>,
) -> Result<Json<VerifyResponse>, StatusCode> {
    let message: Message = body.message.parse()
        .map_err(|_| StatusCode::BAD_REQUEST)?;

    // Consume nonce (one-time use)
    if nonces.lock().await.remove(&message.nonce).is_none() {
        return Err(StatusCode::BAD_REQUEST);
    }

    let signature = hex::decode(
        body.signature.strip_prefix("0x").unwrap_or(&body.signature)
    ).map_err(|_| StatusCode::BAD_REQUEST)?;

    let opts = VerificationOpts {
        domain: Some("localhost:3000".parse().unwrap()),
        nonce: Some(message.nonce.clone()),
        ..Default::default()
    };

    message.verify(&signature, &opts).await
        .map_err(|_| StatusCode::UNAUTHORIZED)?;

    Ok(Json(VerifyResponse {
        address: signinwithethereum::eip55(&message.address),
        chain_id: message.chain_id,
    }))
}

#[derive(Serialize)]
struct NonceResponse { nonce: String }

#[derive(Deserialize)]
struct VerifyRequest { message: String, signature: String }

#[derive(Serialize)]
struct VerifyResponse { address: String, chain_id: u64 }
```

## Migrating from `siwe` crate

This crate is the actively maintained successor to the [`siwe`](https://crates.io/crates/siwe) crate (v0.6), which is no longer maintained.

### Cargo.toml

```diff
- siwe = "0.6"
+ signinwithethereum = "0.8"
```

### Code changes

Rename the import:

```diff
- use siwe::{Message, VerificationOpts};
+ use signinwithethereum::{Message, VerificationOpts};
```

If you used the `ethers` feature for EIP-1271 contract wallet verification, switch to `alloy`:

```diff
- siwe = { version = "0.6", features = ["ethers"] }
+ signinwithethereum = { version = "0.8", features = ["alloy"] }
```

And replace the provider in `VerificationOpts`:

```diff
  let opts = VerificationOpts {
-     rpc_provider: Some("https://eth.llamarpc.com".try_into().unwrap()),
+     rpc_url: Some("https://eth.llamarpc.com".into()),
      ..Default::default()
  };
```

The `Message` struct has gained three fields since v0.6: `scheme` (added in 0.7.0), `warnings` (0.8.0) and `address_raw` (0.8.1). If you construct `Message` values directly (rather than parsing), add them:

```diff
  let msg = Message {
+     scheme: None,
      domain: "example.com".parse().unwrap(),
      // ...
+     address_raw: None,
+     warnings: Vec::new(),
  };
```

See the [CHANGELOG](https://github.com/signinwithethereum/siwe-rs/blob/main/CHANGELOG.md) for the full list of breaking changes.

## Changelog

See the full [CHANGELOG](https://github.com/signinwithethereum/siwe-rs/blob/main/CHANGELOG.md) for version history.

### v0.8.1 Highlights

- **Fixed verification of uniform-case addresses**: in 0.8.0, messages whose address was all-lowercase or all-uppercase parsed with a warning but silently failed verification, because `Display` always re-serialized the address in EIP-55 form and the EIP-191 hash no longer matched what the signer signed.
- **New `address_raw` field on `Message`** (breaking): stores the raw address hex as it appeared in the parsed message, and `Display` emits it verbatim so signatures over uniform-case messages verify. Set it to `None` when constructing messages directly.

### v0.8.0 Highlights

- **New `warnings` field on `Message`** (breaking): carries non-fatal parsing warnings. Set it to `Vec::new()` when constructing messages directly. `PartialEq` excludes it.
- **Unchecksummed addresses accepted with a warning**: all-lowercase and all-uppercase addresses now parse, matching the TypeScript reference implementation. Mixed-case addresses with an invalid checksum are still rejected.
- **Empty statements distinguished from missing**: the parser now handles all three EIP-4361 states — present, empty and absent — instead of conflating the last two.

### v0.7.1 Highlights

- **Cross-chain contract-wallet verification**: the RPC endpoint's chain ID is now validated against the message before any onchain call.
- **Blank line injection fixed**: separator lines between the address, statement and URI fields must be truly blank, closing a canonicalization gap where extra unauthenticated lines could be injected into a message that still verified.

### v0.7.0 Highlights

- **`alloy` replaces `ethers`**: the deprecated ethers dependency has been replaced with [alloy](https://github.com/alloy-rs/alloy) v1. Pass an RPC URL string instead of a provider.
- **EIP-6492 support**: verify signatures from counterfactual (undeployed) smart contract wallets.
- **Scheme parsing**: messages with optional `scheme://` prefixes are now parsed correctly.
- **Stricter validation**: nonces must be alphanumeric, statements must be printable ASCII.
- **Fixed temporal boundaries**: `valid_at()` now uses `[not_before, expiration_time)`.

## Testing

```bash
cargo test
```

To run tests that require onchain verification (EIP-1271 / EIP-6492), enable the `alloy` feature and provide an Ethereum mainnet RPC URL:

```bash
ETH_RPC_URL="https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY" cargo test --features alloy
```

## Resources

-   **GitHub**: [signinwithethereum/siwe-rs](https://github.com/signinwithethereum/siwe-rs)
-   **crates.io**: [signinwithethereum](https://crates.io/crates/signinwithethereum)
-   **docs.rs**: [signinwithethereum](https://docs.rs/signinwithethereum)
