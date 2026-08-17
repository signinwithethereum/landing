<script setup lang="ts">
import { LIBRARIES, INTEGRATIONS } from '../data/libraries'
import CopyLine from './CopyLine.vue'
</script>

<template>
  <section id="libraries" class="band">
    <div class="shell">
      <header class="lib-head">
        <p class="t-label">Implementations</p>
        <h2 class="t-h2">Five languages, one corpus of test vectors</h2>
        <p class="t-body">
          Each library is checked against the same shared vectors, so a message
          built in one parses in all of them. Pick the one your server already
          speaks &mdash; or, if you are on <a href="https://viem.sh/">viem</a>
          already, use the SIWE functions it ships and skip a dependency.
        </p>
      </header>

      <ul class="lib-list">
        <li v-for="l in LIBRARIES" :key="l.name">
          <div class="lib-main">
            <h3 class="t-h3">
              <a :href="l.docs">{{ l.name }}</a>
            </h3>
            <code class="lib-pkg">{{ l.pkg }}</code>
            <p class="lib-note">{{ l.note }}</p>
          </div>
          <div class="lib-side">
            <CopyLine :text="l.install" />
            <p class="lib-links">
              <a :href="l.docs">Docs</a>
              <a :href="l.repo">Source</a>
              <a :href="l.registry">Registry</a>
            </p>
          </div>
        </li>
      </ul>

      <div class="lib-integrations">
        <p class="t-label">Or skip the code entirely</p>
        <ul>
          <li v-for="i in INTEGRATIONS" :key="i.name">
            <a class="tile" :href="i.link">
              <strong>{{ i.name }}</strong>
              <span>{{ i.what }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.lib-head {
  display: flex;
  flex-direction: column;
  gap: var(--s4);
  max-width: 58ch;
  margin-bottom: var(--s7);
}

.lib-list {
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--rule);
}

.lib-list li {
  display: grid;
  gap: var(--s4);
  padding: var(--s5) 0;
  border-bottom: 1px solid var(--rule);
}

@media (min-width: 860px) {
  .lib-list li {
    grid-template-columns: minmax(0, 1fr) minmax(280px, 0.72fr);
    gap: var(--s7);
    align-items: start;
  }
}

.lib-main h3 a {
  color: var(--ink);
  text-decoration: none;
}

.lib-main h3 a:hover {
  color: var(--accent-ui);
}

.lib-pkg {
  display: block;
  margin-top: 4px;
  padding: 0;
  background: none;
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
  color: var(--ink-3);
}

.lib-note {
  margin: var(--s3) 0 0;
  max-width: 52ch;
  font-size: var(--t-small);
  line-height: 1.6;
  color: var(--ink-2);
  text-wrap: pretty;
}

.lib-side {
  display: flex;
  flex-direction: column;
  gap: var(--s3);
}

.lib-links {
  display: flex;
  gap: var(--s4);
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
}

.lib-links a {
  color: var(--ink-3);
  text-decoration: none;
}

.lib-links a:hover {
  color: var(--accent-ui);
}

/* --------------------------------------------------------- integrations */

.lib-integrations {
  margin-top: var(--s7);
}

.lib-integrations ul {
  display: grid;
  gap: var(--s3);
  margin: var(--s4) 0 0;
  padding: 0;
  list-style: none;
}

@media (min-width: 720px) {
  .lib-integrations ul {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1080px) {
  .lib-integrations ul {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.lib-integrations .tile {
  display: flex;
  flex-direction: column;
  gap: var(--s2);
  height: 100%;
  padding: var(--s4);
}

.lib-integrations strong {
  font-size: var(--t-small);
  font-weight: 500;
  color: var(--ink);
}

.lib-integrations span {
  font-size: var(--t-tiny);
  line-height: 1.55;
  color: var(--ink-2);
  text-wrap: pretty;
}
</style>
