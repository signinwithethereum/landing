<script setup lang="ts">
/* Why it matters.
 *
 * Four claims, each one a thing that is true of a signature and not true of a
 * federated login. The coda is deliberate: a page that only lists advantages
 * reads as a pitch, and the people this page is for can tell. */

const CLAIMS = [
  {
    title: 'No issuer to answer to',
    body: 'Sign in with Google means one company decides who your users are, and can stop deciding at any time. A signature has no issuer. There is no account to be suspended and no API to be cut off from.'
  },
  {
    title: 'Nothing to breach',
    body: 'You hold no passwords, no password hashes and no third-party refresh tokens. There is no credential store to leak, and no shared secret whose compromise is everyone else’s problem too.'
  },
  {
    title: 'The account they already have',
    body: 'The key that signs in is the key that holds their ENS name, their assets and their history. Identity is not something each app invents separately and then has to keep in sync.'
  },
  {
    title: 'Every account can already sign',
    body: 'SIWE rides on ERC-191, which wallets have supported for years, so the work of adopting it sits with the verifier rather than with the wallet. No new cryptography, no contract to deploy, no transaction, no gas.'
  }
]
</script>

<template>
  <section class="band">
    <div class="shell">
      <header class="why-head">
        <p class="t-label">Why it matters</p>
        <h2 class="t-h2">Authentication is the last part of the web still rented</h2>
        <p class="t-body">
          Almost everything else a site needs, it can run itself. Identity is the
          exception: for twenty years the practical options have been to store
          passwords or to borrow an identity from a company large enough to be
          worth trusting. ERC&#8209;4361 is the third option, and it is a standard
          rather than a service.
        </p>
      </header>

      <ul class="why-list">
        <li v-for="c in CLAIMS" :key="c.title">
          <h3 class="t-h3">{{ c.title }}</h3>
          <p>{{ c.body }}</p>
        </li>
      </ul>

      <aside class="why-coda">
        <p class="t-label">And what it does not do</p>
        <p>
          A signature proves control of a key at a moment in time. It does not
          manage your sessions, recover a lost key, or hide the fact that an
          address is a durable public identifier. Smart accounts, passkeys and
          per-app session keys each address part of that, and none of it is
          automatic.
          <a href="/docs/security-considerations">Read the security considerations</a>
          before you ship.
        </p>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.why-head {
  display: flex;
  flex-direction: column;
  gap: var(--s4);
  max-width: 62ch;
  margin-bottom: var(--s7);
}

.why-list {
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--rule);
}

@media (min-width: 760px) {
  .why-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: var(--s8);
  }
}

.why-list li {
  display: flex;
  flex-direction: column;
  gap: var(--s2);
  padding: var(--s5) 0;
  border-bottom: 1px solid var(--rule);
}

.why-list p {
  margin: 0;
  max-width: 44ch;
  font-size: var(--t-small);
  line-height: 1.6;
  color: var(--ink-2);
  text-wrap: pretty;
}

.why-coda {
  margin-top: var(--s6);
  padding-left: var(--s4);
  border-left: 2px solid var(--rule-strong);
}

.why-coda p:last-child {
  margin: var(--s2) 0 0;
  max-width: 66ch;
  font-size: var(--t-small);
  line-height: 1.6;
  color: var(--ink-2);
  text-wrap: pretty;
}

.why-coda a {
  color: var(--accent-ui);
  text-decoration: none;
}

.why-coda a:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
