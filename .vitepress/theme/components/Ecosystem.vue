<script setup lang="ts">
/* Ecosystem directory.
 *
 * Layout follows the editorial mockup: a left-aligned hero (the right cell is
 * intentionally empty, no stats), text filters, a three-up featured strip,
 * and a two-column index. Marks come from data/marks.ts; a letter is used
 * when none is on disk. */

import { computed, ref } from 'vue'
import { ECOSYSTEM, TYPES, type EcosystemType, type Entry } from '../data/ecosystem'
import { MARKS } from '../data/marks'
import { PUBLISHED_STORIES } from '../data/stories'

const SUBMIT =
  'https://github.com/signinwithethereum/landing-next/edit/main/.vitepress/theme/data/ecosystem.ts'

const FEATURED_NAMES = ['MetaMask', 'Privy', 'Polymarket'] as const

const query = ref('')
const type = ref<EcosystemType | 'all' | 'stories'>('all')
const publishedStories = new Set(PUBLISHED_STORIES.map((story) => story.link))

function hasPublishedStory(entry: Entry) {
  return !!entry.story && publishedStories.has(entry.story)
}

const counts = computed(() => ({
  all: ECOSYSTEM.length,
  stories: ECOSYSTEM.filter(hasPublishedStory).length,
  wallet: ECOSYSTEM.filter((e) => e.type === 'wallet').length,
  app: ECOSYSTEM.filter((e) => e.type === 'app').length,
  tool: ECOSYSTEM.filter((e) => e.type === 'tool').length
}))

const featured = computed(() =>
  FEATURED_NAMES.map((name) => ECOSYSTEM.find((e) => e.name === name)).filter(
    (e): e is Entry => e != null
  )
)

const browsingDefault = computed(() => type.value === 'all' && query.value.trim() === '')

const shown = computed(() => {
  const q = query.value.trim().toLowerCase()
  return ECOSYSTEM.filter((e) => {
    if (type.value === 'stories' && !hasPublishedStory(e)) return false
    if (type.value !== 'all' && type.value !== 'stories' && e.type !== type.value) return false
    if (!q) return true
    return (
      e.name.toLowerCase().includes(q) ||
      (e.note ?? '').toLowerCase().includes(q) ||
      e.type.includes(q)
    )
  }).sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }))
})

const columns = computed(() => {
  const items = shown.value
  const mid = Math.ceil(items.length / 2)
  return [items.slice(0, mid), items.slice(mid)].filter((col) => col.length)
})

function label(t: EcosystemType) {
  return TYPES.find((x) => x.key === t)!.label
}

function mark(e: Entry) {
  return MARKS[e.name]
}

function initial(name: string) {
  const ch = name.match(/[A-Za-z0-9]/)?.[0]
  return (ch ?? '?').toUpperCase()
}

function reset() {
  query.value = ''
  type.value = 'all'
}
</script>

<template>
  <div class="eco">
    <header class="eco-hero">
      <div class="eco-hero-copy">
        <p class="eco-kicker">ERC&#8209;4361 / Ecosystem</p>
        <h1>Ecosystem</h1>
        <p class="eco-lede">The wallets, apps, and tools that make sign-in portable.</p>
        <a class="eco-submit" :href="SUBMIT">
          Submit integration <span aria-hidden="true">↗</span>
        </a>
      </div>
    </header>

    <section class="eco-browse" aria-labelledby="eco-browse-title">
      <h2 id="eco-browse-title">Browse integrations</h2>
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
            type="button"
            :class="{ 'is-on': type === 'stories' }"
            :aria-pressed="type === 'stories'"
            @click="type = 'stories'"
          >
            Stories <span>{{ counts.stories }}</span>
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
        </div>

        <label class="eco-search">
          <span class="sr-only">Search the ecosystem</span>
          <svg
            class="eco-search-icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="6.75" cy="6.75" r="5" stroke="currentColor" stroke-width="1.25" />
            <path
              d="M10.5 10.5 14.25 14.25"
              stroke="currentColor"
              stroke-width="1.25"
              stroke-linecap="square"
            />
          </svg>
          <input
            v-model="query"
            type="search"
            placeholder="Search ecosystem"
            autocomplete="off"
            spellcheck="false"
          />
        </label>
      </div>
    </section>

    <section v-if="browsingDefault" class="eco-block" aria-labelledby="eco-featured-title">
      <h2 id="eco-featured-title">Featured</h2>
      <div class="eco-featured">
        <article v-for="e in featured" :key="e.name" class="eco-feature">
          <span class="eco-feature-mark" aria-hidden="true">
            <img v-if="mark(e)" :src="mark(e)" alt="" width="72" height="72" />
            <span v-else class="eco-letter eco-letter--lg">{{ initial(e.name) }}</span>
          </span>
          <h3>{{ e.name }}</h3>
          <p class="eco-kind">{{ label(e.type) }}</p>
          <a class="eco-view" :href="e.link" rel="noopener noreferrer" target="_blank">
            View integration <span aria-hidden="true">↗</span>
          </a>
        </article>
      </div>
    </section>

    <section class="eco-block" aria-labelledby="eco-all-title">
      <h2 id="eco-all-title">All integrations</h2>

      <p v-if="!shown.length" class="eco-empty">
        Nothing matches <code>{{ query }}</code>.
        <button type="button" @click="reset">Clear</button>
      </p>

      <div v-else class="eco-index">
        <ul v-for="(col, i) in columns" :key="i" class="eco-col">
          <li v-for="e in col" :key="e.name + e.type">
            <a class="eco-row" :href="e.link" rel="noopener noreferrer" target="_blank">
              <span class="eco-row-mark" aria-hidden="true">
                <img v-if="mark(e)" :src="mark(e)" alt="" width="28" height="28" />
                <span v-else class="eco-letter">{{ initial(e.name) }}</span>
              </span>
              <span class="eco-row-name">{{ e.name }}</span>
              <span class="eco-row-meta">
                <span class="eco-kind">{{ label(e.type) }}</span>
                <span v-if="e.unverified" class="eco-unverified">Unverified</span>
              </span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.eco {
  margin-top: 0;
  padding-bottom: var(--s8);
  color: var(--ink);
}

.eco h1,
.eco h2,
.eco h3,
.eco p,
.eco ul,
.eco a {
  margin: 0;
  padding: 0;
  border: 0;
}

.eco ul {
  list-style: none;
}

.eco a {
  color: inherit;
  font-weight: 400;
  text-decoration: none;
}

/* ----------------------------------------------------------------- hero */

.eco-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  padding: var(--s7) 0 var(--s8);
}

.eco-kicker {
  margin: 0 0 var(--s5);
  font-family: var(--font-mono);
  font-size: var(--t-label);
  font-weight: 500;
  line-height: 1;
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--ink-3);
}

.eco h1 {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 3.75rem);
  font-weight: var(--wt-display);
  line-height: 0.98;
  letter-spacing: var(--track-display);
}

.eco-lede {
  max-width: 22em;
  margin: var(--s4) 0 0;
  font-size: var(--t-lede);
  line-height: 1.5;
  letter-spacing: -0.012em;
  color: var(--ink-2);
  text-wrap: pretty;
}

.eco-submit {
  display: inline-flex;
  gap: 0.4em;
  align-items: center;
  margin-top: var(--s5);
  font-size: var(--t-small);
  color: var(--ink);
}

.eco-submit:hover {
  color: var(--accent-ui);
}

/* --------------------------------------------------------------- browse */

.eco-browse h2,
.eco-block h2 {
  font-family: var(--font-sans);
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: -0.022em;
  color: var(--ink);
}

.eco-controls {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s4);
  align-items: center;
  justify-content: space-between;
  margin-top: var(--s4);
  padding-bottom: var(--s2);
}

.eco-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
}

.eco-filters button {
  display: inline-flex;
  gap: 0.45em;
  align-items: baseline;
  height: 36px;
  padding: 0 var(--s3);
  border: 0;
  border-bottom: 1px solid transparent;
  background: transparent;
  color: var(--ink-2);
  font-family: var(--font-sans);
  font-size: var(--t-small);
  cursor: pointer;
  transition:
    color 0.15s var(--ease),
    border-color 0.15s var(--ease);
}

.eco-filters button span {
  color: var(--ink-3);
  font-variant-numeric: tabular-nums;
}

.eco-filters button:hover {
  color: var(--ink);
}

.eco-filters button.is-on {
  border-bottom-color: var(--accent);
  color: var(--ink);
}

.eco-search {
  position: relative;
  display: flex;
  align-items: center;
}

.eco-search-icon {
  position: absolute;
  left: 12px;
  color: var(--ink-3);
  pointer-events: none;
}

.eco-search input {
  width: 220px;
  height: 36px;
  padding: 0 var(--s4) 0 36px;
  border: 1px solid var(--rule-strong);
  border-radius: 999px;
  background: transparent;
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: var(--t-small);
}

.eco-search input::placeholder {
  color: var(--ink-3);
}

.eco-search input:focus {
  outline: none;
  border-color: var(--ink);
}

/* ------------------------------------------------------------- featured */

.eco-block {
  margin-top: var(--s8);
}

.eco-block h2 {
  margin-bottom: var(--s4);
}

.eco-featured {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
}

.eco-feature {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 280px;
  padding: var(--s6) var(--s5) var(--s5);
}

.eco-feature + .eco-feature {
  border-left: 1px solid var(--rule);
}

.eco-feature-mark {
  display: flex;
  width: 72px;
  height: 72px;
  align-items: center;
  justify-content: center;
}

.eco-feature-mark img {
  display: block;
  width: 72px;
  height: 72px;
  object-fit: contain;
}

.eco-feature h3 {
  margin-top: var(--s5);
  font-family: var(--font-sans);
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: -0.03em;
  color: var(--ink);
}

.eco-kind {
  font-family: var(--font-mono);
  font-size: var(--t-label);
  font-weight: 500;
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--ink-3);
}

.eco-feature .eco-kind {
  margin-top: var(--s2);
}

.eco-view {
  display: inline-flex;
  gap: 0.35em;
  align-items: center;
  margin-top: auto;
  padding-top: var(--s6);
  font-size: var(--t-small);
  color: var(--ink-2);
}

.eco-view:hover {
  color: var(--accent-ui);
}

/* ------------------------------------------------------------------ list */

.eco-index {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  border-top: 1px solid var(--rule);
}

.eco-col + .eco-col {
  border-left: 1px solid var(--rule);
}

.eco-col li {
  border-bottom: 1px solid var(--rule);
}

.eco-row {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr) auto;
  gap: var(--s3);
  align-items: center;
  min-height: 56px;
  padding: 0 var(--s4);
}

.eco-row:hover .eco-row-name {
  color: var(--accent-ui);
}

.eco-row-mark {
  display: flex;
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.eco-row-mark img {
  display: block;
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.eco-row-name {
  font-size: var(--t-small);
  font-weight: 500;
  color: var(--ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.eco-row-meta {
  display: flex;
  gap: var(--s2);
  align-items: baseline;
  justify-self: end;
}

.eco-unverified {
  font-family: var(--font-mono);
  font-size: var(--t-label);
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--warn);
}

.eco-letter {
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border: 1px solid var(--rule-strong);
  border-radius: 4px;
  color: var(--ink-2);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 500;
  line-height: 1;
}

.eco-letter--lg {
  width: 72px;
  height: 72px;
  font-size: 1.25rem;
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

@media (max-width: 639px) {
  .eco-hero,
  .eco-featured,
  .eco-index {
    grid-template-columns: minmax(0, 1fr);
  }

  .eco-feature {
    min-height: 0;
  }

  .eco-feature + .eco-feature,
  .eco-col + .eco-col {
    border-left: 0;
    border-top: 1px solid var(--rule);
  }

  .eco-search {
    width: 100%;
  }

  .eco-search input {
    width: 100%;
  }
}
</style>
