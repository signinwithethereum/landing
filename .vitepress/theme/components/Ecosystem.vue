<script setup lang="ts">
/* The ecosystem index.
 *
 * A typographic list rather than a logo wall: name, kind, and a note where
 * there is something worth saying. The old page showed logos with no names,
 * which meant you had to recognise a logo to read the page. */

import { computed, ref } from 'vue'
import { ECOSYSTEM, TYPES, type EcosystemType } from '../data/ecosystem'

const query = ref('')
const type = ref<EcosystemType | 'all' | 'stories'>('all')

const counts = computed(() => ({
  all: ECOSYSTEM.length,
  stories: ECOSYSTEM.filter((e) => e.story).length,
  wallet: ECOSYSTEM.filter((e) => e.type === 'wallet').length,
  app: ECOSYSTEM.filter((e) => e.type === 'app').length,
  tool: ECOSYSTEM.filter((e) => e.type === 'tool').length
}))

const shown = computed(() => {
  const q = query.value.trim().toLowerCase()
  return ECOSYSTEM.filter((e) => {
    if (type.value === 'stories' && !e.story) return false
    if (type.value !== 'all' && type.value !== 'stories' && e.type !== type.value) return false
    if (!q) return true
    return e.name.toLowerCase().includes(q) || (e.note ?? '').toLowerCase().includes(q)
  }).sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }))
})

function label(t: EcosystemType) {
  return TYPES.find((x) => x.key === t)!.label
}

function reset() {
  query.value = ''
  type.value = 'all'
}
</script>

<template>
  <div class="eco">
    <div class="eco-controls">
      <div class="eco-filters" role="group" aria-label="Filter ecosystem">
        <button
          type="button"
          :class="{ 'is-on': type === 'all' }"
          :aria-pressed="type === 'all'"
          @click="type = 'all'"
        >
          All <span>{{ counts.all }}</span>
        </button>
        <button
          v-for="t in TYPES"
          :key="t.key"
          type="button"
          :class="{ 'is-on': type === t.key }"
          :aria-pressed="type === t.key"
          @click="type = t.key"
        >
          {{ t.plural }} <span>{{ counts[t.key] }}</span>
        </button>
        <button
          type="button"
          :class="{ 'is-on': type === 'stories' }"
          :aria-pressed="type === 'stories'"
          @click="type = 'stories'"
        >
          Case studies <span>{{ counts.stories }}</span>
        </button>
      </div>

      <label class="eco-search">
        <span class="sr-only">Search the ecosystem</span>
        <input v-model="query" type="search" placeholder="Search" autocomplete="off" />
      </label>
    </div>

    <p v-if="!shown.length" class="eco-empty">
      Nothing matches <code>{{ query }}</code>.
      <button type="button" @click="reset">Clear</button>
    </p>

    <ul v-else class="eco-list">
      <li v-for="e in shown" :key="e.name + e.type">
        <a class="eco-name" :href="e.link" rel="noopener">{{ e.name }}</a>
        <span class="eco-type">{{ label(e.type) }}</span>
        <span class="eco-note">
          <template v-if="e.note">{{ e.note }}</template>
          <a v-if="e.story" :href="e.story">Case study &rarr;</a>
        </span>
      </li>
    </ul>

    <p class="eco-add">
      Signing people in with ERC&#8209;4361 and not on this list?
      <a
        href="https://github.com/signinwithethereum/landing-next/edit/main/.vitepress/theme/data/ecosystem.ts"
        >Add yourself</a
      >
      &mdash; it is one entry in one file.
    </p>
  </div>
</template>

<style scoped>
.eco {
  margin-top: var(--s6);
}

/* ------------------------------------------------------------- controls */

.eco-controls {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s4);
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--s4);
}

.eco-filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s2);
}

.eco-filters button {
  display: inline-flex;
  gap: 0.5em;
  align-items: baseline;
  height: 30px;
  padding-inline: var(--s3);
  border: 1px solid var(--rule);
  border-radius: var(--radius);
  background: transparent;
  color: var(--ink-2);
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
  cursor: pointer;
  transition:
    border-color 0.15s var(--ease),
    color 0.15s var(--ease);
}

.eco-filters button span {
  color: var(--ink-3);
  font-size: 0.85em;
}

.eco-filters button:hover {
  border-color: var(--rule-strong);
  color: var(--ink);
}

.eco-filters button.is-on {
  border-color: var(--ink);
  color: var(--ink);
}

.eco-search input {
  width: 190px;
  height: 30px;
  padding-inline: var(--s3);
  border: 1px solid var(--rule);
  border-radius: var(--radius);
  background: var(--canvas);
  color: var(--ink);
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
}

.eco-search input::placeholder {
  color: var(--ink-3);
}

/* ----------------------------------------------------------------- list */

.eco-list {
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--rule);
}

.eco-list li {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 2px var(--s5);
  padding: var(--s3) 0;
  border-bottom: 1px solid var(--rule);
}

@media (min-width: 720px) {
  .eco-list li {
    grid-template-columns: minmax(0, 15rem) 5rem minmax(0, 1fr);
    align-items: baseline;
  }
}

.eco-name {
  font-size: var(--t-small);
  font-weight: 500;
  color: var(--ink);
  text-decoration: none;
}

.eco-name:hover {
  color: var(--accent-ui);
}

.eco-type {
  font-family: var(--font-mono);
  font-size: var(--t-label);
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--ink-3);
}

.eco-note {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s2) var(--s4);
  font-size: var(--t-tiny);
  line-height: 1.55;
  color: var(--ink-2);
  text-wrap: pretty;
}

.eco-note a {
  font-family: var(--font-mono);
  color: var(--accent-ui);
  text-decoration: none;
  white-space: nowrap;
}

.eco-note a:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* ---------------------------------------------------------------- other */

.eco-empty {
  margin: var(--s6) 0;
  font-size: var(--t-small);
  color: var(--ink-2);
}

.eco-empty button {
  border: 0;
  background: none;
  color: var(--accent-ui);
  font: inherit;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.eco-add {
  margin: var(--s6) 0 0;
  font-size: var(--t-small);
  color: var(--ink-2);
}
</style>
