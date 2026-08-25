<script setup lang="ts">
import Wordmark from './Wordmark.vue'

const COLUMNS = [
  {
    label: 'Documentation',
    links: [
      { text: 'Introduction', href: '/docs/' },
      { text: 'Quickstart', href: '/docs/quickstart/' },
      { text: 'Libraries', href: '/docs/libraries/' }
    ]
  },
  {
    label: 'Explore',
    links: [
      { text: 'Ecosystem', href: '/ecosystem' },
      { text: 'Blog', href: '/blog/' },
      { text: 'Message validator', href: '/tools/validator' },
      { text: 'Message builder', href: '/tools/builder' }
    ]
  },
  {
    label: 'Source',
    links: [
      { text: 'GitHub', href: 'https://github.com/signinwithethereum' },
      { text: 'X', href: 'https://x.com/signinethereum' },
      { text: 'ERC-4361', href: 'https://eips.ethereum.org/EIPS/eip-4361' },
      { text: 'contact@siwe.xyz', href: 'mailto:contact@siwe.xyz' }
    ]
  }
]
</script>

<template>
  <footer class="ft">
    <div class="shell ft-in">
      <div class="ft-brand">
        <a href="/" aria-label="Sign in with Ethereum, home">
          <Wordmark />
        </a>
        <p>
          An open standard for authentication with Ethereum accounts. The
          libraries and this site are maintained by
          <a href="https://1001.digital">1001.digital</a>.
        </p>
      </div>

      <nav class="ft-cols" aria-label="Site">
        <div v-for="c in COLUMNS" :key="c.label">
          <p class="t-label">{{ c.label }}</p>
          <ul>
            <li v-for="l in c.links" :key="l.href">
              <a :href="l.href">{{ l.text }}</a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.ft {
  margin-top: var(--s9);
  padding-top: var(--s7);
  border-top: 1px solid var(--rule);
  box-shadow: 0 -2px 0 -1px var(--rule);
}

.ft-in {
  display: grid;
  gap: var(--s7);
  padding-bottom: var(--s7);
}

@media (min-width: 900px) {
  .ft-in {
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 2fr);
    gap: var(--s8);
  }
}

.ft-brand {
  display: flex;
  flex-direction: column;
  gap: var(--s4);
  align-items: start;
}

.ft-brand > a {
  --u: 3px;
  color: var(--ink);
  display: block;
}

.ft-brand p {
  margin: 0;
  max-width: 34ch;
  font-size: var(--t-tiny);
  line-height: 1.6;
  color: var(--ink-3);
}

.ft-brand p a {
  color: var(--ink-2);
  text-decoration: none;
  border-bottom: 1px solid var(--rule-strong);
}

.ft-brand p a:hover {
  color: var(--accent-ui);
  border-bottom-color: var(--accent-line);
}

.ft-cols {
  display: grid;
  gap: var(--s6) var(--s5);
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (min-width: 700px) {
  .ft-cols {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.ft-cols ul {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin: var(--s3) 0 0;
  padding: 0;
  list-style: none;
}

.ft-cols a {
  font-size: var(--t-tiny);
  color: var(--ink-2);
  text-decoration: none;
}

.ft-cols a:hover {
  color: var(--ink);
}

</style>
