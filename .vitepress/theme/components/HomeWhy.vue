<script setup lang="ts">
const FEATURES = [
  {
    title: 'An open standard',
    body: 'ERC-4361 defines the message and verification rules. There is no hosted service to join.'
  },
  {
    title: 'Existing Ethereum accounts',
    body: 'Users authenticate with the account they already use, including smart contract accounts.'
  },
  {
    title: 'Readable requests',
    body: 'The domain, account, chain, nonce and expiry are visible to people and parseable by wallets.'
  },
  {
    title: 'Sessions you control',
    body: 'The signature proves control of an account. Your application still decides how its session works.'
  },
  {
    title: 'No transaction',
    body: 'Signing does not broadcast anything, change onchain state or cost gas.'
  }
]
</script>

<template>
  <section class="band overview">
    <div class="shell overview-grid">
      <header>
        <h2>What is SIWE?</h2>
        <p>
          A standard way to use an Ethereum account for authentication without
          turning identity into another platform dependency.
        </p>
      </header>

      <ul>
        <li v-for="feature in FEATURES" :key="feature.title">
          <strong>{{ feature.title }}</strong>
          <span>{{ feature.body }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.overview-grid {
  display: grid;
  gap: var(--s7);
  align-items: start;
}

@media (min-width: 820px) {
  .overview-grid {
    grid-template-columns: minmax(0, 0.58fr) minmax(0, 1fr);
    gap: var(--s8);
  }
}

.overview header {
  display: grid;
  gap: var(--s3);
}

.overview h2 {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.015em;
}

.overview header p {
  margin: 0;
  max-width: 32rem;
  font-size: var(--t-small);
  line-height: 1.65;
  color: var(--ink-2);
  text-wrap: pretty;
}

.overview ul {
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--rule);
  list-style: none;
}

.overview li {
  display: grid;
  gap: 5px var(--s5);
  padding-block: var(--s4);
  border-bottom: 1px solid var(--rule);
}

@media (min-width: 600px) {
  .overview li {
    grid-template-columns: minmax(11rem, 0.55fr) minmax(0, 1fr);
  }
}

.overview strong {
  font-size: var(--t-small);
  font-weight: 550;
  color: var(--ink);
}

.overview span {
  font-size: var(--t-small);
  line-height: 1.55;
  color: var(--ink-2);
  text-wrap: pretty;
}
</style>
