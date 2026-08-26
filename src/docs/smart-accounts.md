---
title: Smart accounts
description: How to verify SIWE signatures from contract accounts: EIP-1271, ERC-6492 for accounts that are not deployed yet, and EIP-7702 delegated EOAs.
---

# Smart accounts

An EOA signature carries its own signer. You hash the message per
[EIP-191](https://eips.ethereum.org/EIPS/eip-191), run `ecrecover` over the
65-byte signature, and get an address back. Nothing else is needed, and no
network call is involved.

A contract account has no private key. There is no signer to recover, so
`ecrecover` over its signature returns either nothing usable or an address that
has no relationship to the account, and verification fails with an invalid
signature error even though the signature is perfectly valid. Whether a
signature is acceptable is a question only the account itself can answer, and
asking it means making a call.

That call is what this page is about. There are three cases:

| Case | The account | How you verify |
| --- | --- | --- |
| EOA | A key pair | `ecrecover`, offline |
| Deployed contract account | Code at the address | [EIP-1271](https://eips.ethereum.org/EIPS/eip-1271) `isValidSignature`, one `eth_call` |
| Counterfactual contract account | Not deployed yet | [ERC-6492](https://eips.ethereum.org/EIPS/eip-6492), one `eth_call` against a universal validator |

::: warning
All of this needs an Ethereum RPC endpoint, and it has to be on the chain named
by the message's `Chain ID`. A contract account at `0xabc…` on mainnet is not
the same account as `0xabc…` on Optimism. Every official library enforces that
binding and refuses to fall back to the contract path when the RPC reports a
different chain id.
:::

## EIP-1271: deployed accounts

EIP-1271 gives a contract one method:

```solidity
function isValidSignature(bytes32 _hash, bytes memory _signature)
  external
  view
  returns (bytes4 magicValue);
```

The verifier hashes the SIWE message per EIP-191, calls `isValidSignature` on
the account with that hash and the signature bytes, and treats the signature as
valid if the return value is the magic value `0x1626ba7e`, which is
`bytes4(keccak256("isValidSignature(bytes32,bytes)"))`. Anything else, including
a revert, means no.

What the account does inside that method is its own business. A Safe counts
owner signatures against its threshold. A passkey wallet verifies a P-256
signature. A session-key wallet checks whether the key is still in scope. None
of that is your problem, which is the point of the standard.

Ordering differs between implementations. Most try `ecrecover` first and only
fall through to `isValidSignature` when recovery fails, which keeps ordinary EOA
sign-ins off the network entirely; others check for a wrapped signature before
attempting recovery. If the RPC round-trip is on a path you care about, check what
your library actually does rather than assuming.

## ERC-6492: accounts that do not exist yet

Modern smart-account wallets give a user an address before anything is deployed.
The address is deterministic, a function of the factory and the deployment
arguments, and deployment is deferred until the account first needs to send a
transaction. Signing in is not a transaction, so a person can perfectly
reasonably sign in from an account that has no code at all.

`isValidSignature` cannot be called on an address with no code. ERC-6492 solves
this by wrapping the signature so it carries its own deployment instructions:

```
abi.encode(factory, factoryCalldata, originalSignature) || magicSuffix
```

The magic suffix is 32 bytes of `0x6492…6492`, which is how a verifier
recognizes a wrapped signature without trying to decode it first. The verifier
then runs the ERC-6492 universal validator bytecode through `eth_call` with no
`to` address: inside that call frame the account is deployed from the factory,
`isValidSignature` is called on it, and the result comes back. `eth_call`
discards state, so nothing is deployed for real and nothing costs gas.

That single call also handles already-deployed accounts and plain EOAs, which is
why some libraries use it as their only contract path.

::: info
ERC-6492 permits a verifier to submit the factory transaction for real after a
successful check, to finalize deployment. None of the official SIWE libraries do
that. Verification is read-only. If you need the account actually deployed,
make the factory call yourself.
:::

## Per-library configuration

### TypeScript

Verification is provider-agnostic. You register a `SiweConfig` once at startup
and `verify()` uses it:

```typescript
import { configure, createConfig } from '@signinwithethereum/siwe'

// Auto-detects whichever of viem or ethers is installed.
configure(await createConfig(process.env.ETH_RPC_URL!))
```

`createConfig(rpcUrl)` is the shortcut: give it an RPC URL and it builds the
adapter for whichever library it finds. Use the explicit constructors when you
already have a client and want the SIWE library to share it; connection
pooling, custom transports, a mocked client in tests:

```typescript
import { createPublicClient, http } from 'viem'
import { configure, createViemConfig } from '@signinwithethereum/siwe'

const publicClient = createPublicClient({ transport: http(process.env.ETH_RPC_URL!) })
configure(await createViemConfig({ publicClient }))
```

`createEthersConfig(provider)` is the equivalent for ethers and auto-detects v5
or v6 at runtime. Both support EIP-1271 and ERC-6492; the viem path needs viem
v2 or newer.

Without any config, contract-account verification fails with
`SiweErrorType.MISSING_CONFIG`; EOA sign-ins keep working, which is exactly why
this gets missed until a Safe user shows up.

Useful exports:

- `isEIP6492Signature(signature)`: whether a signature carries the wrapper.
- `EIP6492_MAGIC_SUFFIX`: the 32-byte suffix itself.
- `EIP1271_MAGICVALUE`: `'0x1626ba7e'`.
- `SiweErrorType.INVALID_SIGNATURE_CHAIN_ID`: the provider's chain does not match the message's `Chain ID`.

For a backend that is not RPC-shaped at all, a Safe API, a cache, a signing
service, implement `checkContractWalletSignature` on your own `SiweConfig`:

```typescript
import { configure } from '@signinwithethereum/siwe'
import type { SiweConfig } from '@signinwithethereum/siwe'

configure({
  verifyMessage,   // recover the signer from an EIP-191 signature
  hashMessage,     // EIP-191 personal_sign hash
  getAddress,      // normalize to ERC-55 checksum
  checkContractWalletSignature: async (address, message, signature, chainId) => {
    // return true if the account accepts this signature
  },
} satisfies SiweConfig)
```

See the [TypeScript reference](/docs/libraries/typescript) for the full
interface.

### Rust

Contract support lives behind the `alloy` feature:

```toml
[dependencies]
signinwithethereum = { version = "0.7", features = ["alloy"] }
```

Then set `rpc_url` on the verification options:

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

Rust checks for the ERC-6492 suffix *before* trying `ecrecover`, then falls back
to EIP-1271. Relevant `VerificationError` variants: `RpcRequired` (a wrapped
signature arrived with no `rpc_url` set), `ContractCall` (the account rejected
it), and `SignatureLength` (not 65 bytes and the `alloy` feature is off).

### Python

Pass a `web3` provider to `verify()`:

```python
from siwe import SiweMessage
from web3 import HTTPProvider

provider = HTTPProvider("https://eth.llamarpc.com")

message = SiweMessage.from_message(message_string)
message.verify(
    signature,
    domain="example.com",
    nonce=stored_nonce,
    chain_id=1,
    provider=provider,
)
```

`is_eip6492_signature(signature)` reports the wrapper. A provider on the wrong
network raises `ChainIdMismatch`.

### Go

Contract verification goes through an interface rather than a concrete client.
`*ethclient.Client` already satisfies `EthCaller`:

```go
type EthCaller interface {
    CallContract(ctx context.Context, call ethereum.CallMsg, blockNumber *big.Int) ([]byte, error)
    ChainID(ctx context.Context) (*big.Int, error)
}
```

Wrap one in a verifier and pass it through `VerifyOptions`:

```go
cl, err := ethclient.Dial("https://eth.llamarpc.com")
verifier := siwe.NewEthCallerVerifier(cl)

res, err := m.VerifyWith(ctx, signature, siwe.VerifyParams{
    Domain:  &domain,
    Nonce:   &nonce,
    URI:     &uri,
    ChainID: &chainID,
}, siwe.VerifyOptions{
    ContractVerifier: verifier,
})
// res.ContractVerified is true when the contract path was used
```

For a non-RPC backend, implement `ContractSignatureVerifier` directly:

```go
type ContractSignatureVerifier interface {
    VerifyContractSignature(
        ctx context.Context,
        address common.Address,
        hash common.Hash,
        sig []byte,
        chainID int,
    ) (bool, error)
}
```

A `nil` `ContractVerifier` disables the fallback entirely. `IsEIP6492Signature`
reports the wrapper, and a mismatched provider chain returns
`ErrInvalidSignatureChain`. Note that only genuine EVM reverts (JSON-RPC error
code `3`) are read as "signature not valid"; transport failures surface as
errors rather than as rejections, so a flaky RPC will not quietly log people
out.

### Ruby

Configure an RPC URL once at boot:

```ruby
Siwe.configure do |c|
  c.rpc_url = ENV["ETH_RPC_URL"]
end

message.verify!(signature: sig, domain: "example.com", nonce: stored_nonce)
```

Ruby takes the simplest route: when `ecrecover` fails, it makes one
deploy-and-call against the ERC-6492 universal validator, which covers deployed
EIP-1271 wallets and counterfactual ones alike.

Per-call configuration goes through `Siwe::Config.new(rpc_url:)`, or
`Siwe::Config.new(rpc:)` with a pre-built client, anything responding to
`eth_call(to:, data:, block:)` and `chain_id` will do, so a cached client or a
test double drops straight in. `Siwe.eip6492_signature?(hex)` reports the
wrapper. Failures are `:invalid_signature_chain_id` for a chain mismatch and
`:rpc_error` for a transport problem.

## EIP-7702 delegated EOAs

[EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) lets an EOA point at a
contract's code while keeping its own address and its own key. The account is
not migrated and not replaced: the address stays an EOA address, the private
key still exists, and `personal_sign` still produces a normal 65-byte signature
that `ecrecover` resolves.

So SIWE sign-in for a delegated EOA needs nothing special. The EOA path handles
it, offline, exactly as before.

Two things are worth knowing:

- **Do not test for "contract account" by checking whether the address has
  code.** A delegated EOA has code (a 23-byte delegation indicator pointing at
  its delegate) and would fail that test while still verifying by recovery.
  Attempting recovery and falling back only when it fails gets this right without
  ever asking the question.
- **The wallet may still choose the contract path.** If the delegate implements
  `isValidSignature`, a wallet is free to return a signature that only validates
  that way. Configuring an RPC costs you nothing when recovery succeeds, because
  the call is never made, so configure it anyway.

## Checklist

- [ ] An RPC endpoint is configured on the verification path, not just the frontend
- [ ] The RPC is on the chain your messages carry in `Chain ID`
- [ ] You accept a fixed set of chain ids rather than whatever arrives
- [ ] You have signed in once with a deployed contract account, such as a Safe
- [ ] You have signed in once with a wallet that has not been deployed yet
- [ ] RPC failures are handled as failures, not as rejected sign-ins
- [ ] Rate limits account for the contract path costing a network round trip; see [Security considerations](/docs/security-considerations)
