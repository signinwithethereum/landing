/* The official implementations.
 *
 * All five are maintained by 1001.digital and all five are checked against the
 * shared test-vectors corpus, so a message that parses in one parses in the
 * rest. Versions are deliberately absent — they go stale and the registries
 * already publish them. */

export interface Library {
  name: string
  /** The package as a registry names it. */
  pkg: string
  install: string
  registry: string
  repo: string
  docs: string
  /** What this one is the right choice for. */
  note: string
}

export const LIBRARIES: Library[] = [
  {
    name: 'TypeScript',
    pkg: '@signinwithethereum/siwe',
    install: 'npm i @signinwithethereum/siwe',
    registry: 'https://www.npmjs.com/package/@signinwithethereum/siwe',
    repo: 'https://github.com/signinwithethereum/siwe',
    docs: '/docs/libraries/typescript',
    note: 'The reference implementation. Runs in the browser and on the server, and takes viem or ethers for the smart-account path.'
  },
  {
    name: 'Python',
    pkg: 'signinwithethereum',
    install: 'pip install signinwithethereum',
    registry: 'https://pypi.org/project/signinwithethereum/',
    repo: 'https://github.com/signinwithethereum/siwe-py',
    docs: '/docs/libraries/python',
    note: 'Pydantic models over the message. A separate Django app wires up the endpoints, sessions and wallet linking for you.'
  },
  {
    name: 'Rust',
    pkg: 'signinwithethereum',
    install: 'cargo add signinwithethereum',
    registry: 'https://crates.io/crates/signinwithethereum',
    repo: 'https://github.com/signinwithethereum/siwe-rs',
    docs: '/docs/libraries/rust',
    note: 'No async runtime unless you ask for one. Optional serde, alloy and builder features.'
  },
  {
    name: 'Go',
    pkg: 'github.com/signinwithethereum/siwe-go',
    install: 'go get github.com/signinwithethereum/siwe-go',
    registry: 'https://pkg.go.dev/github.com/signinwithethereum/siwe-go',
    repo: 'https://github.com/signinwithethereum/siwe-go',
    docs: '/docs/libraries/go',
    note: 'Plain structs and errors. The contract-wallet path is an interface you supply, so it stays out of your dependency tree if you do not need it.'
  },
  {
    name: 'Ruby',
    pkg: 'siwe-rb',
    install: 'gem install siwe-rb',
    registry: 'https://rubygems.org/gems/siwe-rb',
    repo: 'https://github.com/signinwithethereum/siwe-rb',
    docs: '/docs/libraries/ruby',
    note: 'Frozen value objects and a duck-typed RPC client. Rails and Sinatra examples in the docs.'
  }
]

/* Things that are not a library — you deploy or install them and get SIWE
 * without writing verification code at all. */
export interface Integration {
  name: string
  what: string
  link: string
}

export const INTEGRATIONS: Integration[] = [
  {
    name: 'OpenID Connect provider',
    what: 'Put SIWE behind a standard OIDC endpoint and any OIDC client can use it — including ones that have never heard of Ethereum.',
    link: '/docs/oidc-provider/'
  },
  {
    name: 'Discourse',
    what: 'A plugin that adds wallet sign-in to a forum, with ENS names and avatars resolved server-side.',
    link: '/docs/integrations/discourse'
  },
  {
    name: 'Django',
    what: 'A reusable app with the nonce and verify endpoints, an auth backend, and wallet linking.',
    link: '/docs/libraries/python#django'
  }
]
