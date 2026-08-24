<script setup lang="ts">
const STEPS = [
  {
    n: '1',
    title: 'Issue a nonce',
    body: 'Your server creates a random, single-use value and stores it with the session.'
  },
  {
    n: '2',
    title: 'Build the message',
    body: 'Add the domain, account, chain, nonce, statement and expiry in the ERC-4361 format.'
  },
  {
    n: '3',
    title: 'Ask for a signature',
    body: 'The wallet shows the request and signs the exact message. Nothing is broadcast.'
  },
  {
    n: '4',
    title: 'Verify and start a session',
    body: 'Your server checks the signer and its own domain, nonce and time constraints.'
  }
]
</script>

<template>
  <section id="how" class="band flow">
    <div class="shell">
      <header class="flow-head">
        <h2>How it works</h2>
        <p>Four steps turn a wallet signature into an application session.</p>
      </header>

      <div class="flow-grid">
        <ol>
          <li v-for="step in STEPS" :key="step.n">
            <span class="flow-number" aria-hidden="true">{{ step.n }}</span>
            <span class="flow-copy">
              <strong>{{ step.title }}</strong>
              <span>{{ step.body }}</span>
            </span>
          </li>
        </ol>

        <div class="flow-code vp-doc">
          <slot />
        </div>
      </div>

      <p class="flow-more">
        <a href="/docs/quickstart/">Read the full quickstart &rarr;</a>
      </p>
    </div>
  </section>
</template>

<style scoped>
.flow-head {
  display: grid;
  gap: var(--s3);
  max-width: 38rem;
}

.flow h2 {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.015em;
}

.flow-head p {
  margin: 0;
  font-size: var(--t-small);
  line-height: 1.65;
  color: var(--ink-2);
}

.flow-grid {
  display: grid;
  gap: var(--s6);
  align-items: start;
  min-width: 0;
  margin-top: var(--s6);
}

.flow-grid > * {
  min-width: 0;
}

@media (min-width: 820px) {
  .flow-grid {
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1fr);
    gap: var(--s7);
  }
}

.flow ol {
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--rule);
  list-style: none;
}

.flow li {
  display: grid;
  grid-template-columns: 2rem minmax(0, 1fr);
  gap: var(--s3);
  padding-block: var(--s4);
  border-bottom: 1px solid var(--rule);
}

.flow-number {
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
  line-height: 1.55;
  color: var(--accent-ui);
}

.flow-copy {
  display: grid;
  gap: 4px;
}

.flow-copy strong {
  font-size: var(--t-small);
  font-weight: 550;
  color: var(--ink);
}

.flow-copy > span {
  font-size: var(--t-small);
  line-height: 1.55;
  color: var(--ink-2);
  text-wrap: pretty;
}

.flow-code :deep(div[class*='language-']) {
  margin: 0;
}

.flow-code {
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

.flow-more {
  margin: var(--s5) 0 0;
}

.flow-more a {
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
  color: var(--accent-ui);
  text-decoration: none;
}

.flow-more a:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
