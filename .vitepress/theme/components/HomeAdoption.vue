<script setup lang="ts">
/* Who uses it.
 *
 * Three written case studies, then the count. The count comes off the data file
 * rather than being typed in, so it cannot drift from the ecosystem page. */

import { computed } from 'vue'
import { ECOSYSTEM } from '../data/ecosystem'
import { STORIES } from '../data/stories'

const total = computed(() => ECOSYSTEM.length)

/* Names, not logos. Third-party marks arrive in mixed polarity and a logo wall
 * says less than the names do. Deliberately short — the full list is a page. */
const STRIP = [
  'MetaMask',
  'Rainbow',
  'Ledger',
  'Safe',
  'Trust Wallet',
  'OpenSea',
  'Snapshot',
  'Farcaster',
  'Polymarket',
  'Lens',
  'WalletConnect',
  'RainbowKit'
]
</script>

<template>
  <section class="band">
    <div class="shell">
      <header class="ad-head">
        <p class="t-label">In production</p>
        <h2 class="t-h2">Three teams, and what they actually built</h2>
      </header>

      <ul class="ad-stories">
        <li v-for="s in STORIES" :key="s.org">
          <a class="tile ad-story" :href="s.link">
            <span class="ad-logo"><img :src="s.logo" :alt="`${s.org} logo`" loading="lazy" /></span>
            <span class="ad-org">{{ s.org }}</span>
            <strong class="t-h3">{{ s.claim }}</strong>
            <span class="ad-body">{{ s.body }}</span>
            <span class="ad-more">Read the case study &rarr;</span>
          </a>
        </li>
      </ul>

      <div class="ad-strip">
        <p class="t-label">Also signing people in this way</p>
        <ul>
          <li v-for="n in STRIP" :key="n">{{ n }}</li>
        </ul>
        <p class="ad-all">
          <a href="/ecosystem">All {{ total }} wallets, apps and tools &rarr;</a>
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ad-head {
  display: flex;
  flex-direction: column;
  gap: var(--s4);
  margin-bottom: var(--s6);
}

.ad-stories {
  display: grid;
  gap: var(--s3);
  margin: 0;
  padding: 0;
  list-style: none;
}

@media (min-width: 900px) {
  .ad-stories {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.ad-story {
  display: flex;
  flex-direction: column;
  gap: var(--s3);
  height: 100%;
  padding: var(--s5);
}

.ad-logo {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius);
  background: #fff;
  box-shadow: inset 0 0 0 1px var(--rule);
  overflow: hidden;
}

.ad-logo img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.ad-org {
  font-family: var(--font-mono);
  font-size: var(--t-label);
  font-weight: 500;
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--ink-3);
}

.ad-story strong {
  color: var(--ink);
}

.ad-body {
  flex: 1;
  font-size: var(--t-small);
  line-height: 1.6;
  color: var(--ink-2);
  text-wrap: pretty;
}

.ad-more {
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
  color: var(--accent-ui);
}

/* ---------------------------------------------------------------- strip */

.ad-strip {
  margin-top: var(--s7);
  padding-top: var(--s5);
  border-top: 1px solid var(--rule);
}

.ad-strip ul {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s2) 0;
  margin: var(--s4) 0 0;
  padding: 0;
  list-style: none;
}

.ad-strip li {
  font-size: var(--t-small);
  color: var(--ink-2);
  white-space: nowrap;
}

.ad-strip li:not(:last-child)::after {
  content: '·';
  margin-inline: 0.7em;
  color: var(--rule-strong);
}

.ad-strip .ad-all {
  margin: var(--s4) 0 0;
}

.ad-strip a {
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
  color: var(--accent-ui);
  text-decoration: none;
}

.ad-strip a:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
