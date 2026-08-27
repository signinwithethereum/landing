<script setup lang="ts">
/* Ecosystem directory.
 *
 * Layout follows the editorial mockup: a left-aligned hero (the right cell is
 * intentionally empty, no stats), text filters, a notable board (2x2 spotlights
 * plus a four-up strip), and a two-column index. Marks come from data/marks.ts;
 * a letter is used when none is on disk. */

import { computed, ref } from 'vue'
import { ECOSYSTEM, TYPES, type EcosystemType, type Entry } from '../data/ecosystem'
import { MARKS } from '../data/marks'
import { PUBLISHED_STORIES } from '../data/stories'

const SUBMIT = 'https://github.com/signinwithethereum/landing-next/issues/new'

const SPOTLIGHT_NAMES = ['OpenRouter', 'Polymarket', 'MetaMask', 'Privy'] as const
const STRIP_NAMES = ['WalletConnect', 'Ambire', 'Safe', 'OpenSea'] as const

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

const spotlights = computed(() =>
  SPOTLIGHT_NAMES.map((name) => ECOSYSTEM.find((e) => e.name === name)).filter(
    (e): e is Entry => e != null
  )
)

const strip = computed(() =>
  STRIP_NAMES.map((name) => ECOSYSTEM.find((e) => e.name === name)).filter(
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
      <h1>Ecosystem</h1>
      <p class="eco-lede">
        In the shadows, behind the scenes, everyone is using SIWE.
      </p>
      <a
        class="eco-submit"
        :href="SUBMIT"
        target="_blank"
        rel="noopener noreferrer"
      >
        Submit integration <span aria-hidden="true">↗</span>
      </a>
    </header>

    <section class="eco-browse" aria-label="Browse integrations">
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

    <section v-if="browsingDefault" class="eco-block" aria-labelledby="eco-notable-title">
      <h2 id="eco-notable-title">Notable integrations</h2>
      <div class="eco-board">
        <div class="eco-spotlights">
          <component
            :is="e.story ? 'a' : 'article'"
            v-for="e in spotlights"
            :key="e.name"
            class="eco-spot"
            :href="e.story || undefined"
          >
            <span class="eco-spot-mark" aria-hidden="true">
              <img v-if="mark(e)" :src="mark(e)" alt="" width="72" height="72" />
              <span v-else class="eco-letter eco-letter--lg">{{ initial(e.name) }}</span>
            </span>
            <div class="eco-spot-body">
              <h3>{{ e.name }}</h3>
              <p v-if="e.note" class="eco-blurb">{{ e.note }}</p>
              <span v-if="e.story" class="eco-story">
                View success story <span aria-hidden="true">↗</span>
              </span>
            </div>
          </component>
        </div>
        <div class="eco-strip">
          <article v-for="e in strip" :key="e.name" class="eco-chip">
            <span class="eco-chip-mark" aria-hidden="true">
              <img v-if="mark(e)" :src="mark(e)" alt="" width="48" height="48" />
              <span v-else class="eco-letter eco-letter--md">{{ initial(e.name) }}</span>
            </span>
            <h3>{{ e.name }}</h3>
            <p v-if="e.note" class="eco-blurb">{{ e.note }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="eco-block" aria-labelledby="eco-all-title">
      <h2 id="eco-all-title">All integrations</h2>

      <p v-if="!shown.length" class="eco-empty">
        Nothing matches <code>{{ query }}</code>.
        <button type="button" @click="reset">Clear</button>
      </p>

      <div v-else class="eco-index">
        <div v-for="(col, i) in columns" :key="i" class="eco-col">
          <a
            v-for="e in col"
            :key="e.name + e.type"
            class="eco-row"
            :href="e.link"
            rel="noopener noreferrer"
            target="_blank"
          >
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
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.eco {
  margin-top: 0;
  color: var(--ink);
}

.eco h1,
.eco h2,
.eco h3,
.eco p,
.eco ul {
  margin: 0;
  padding: 0;
  border: 0;
  list-style: none;
}

.eco a {
  margin: 0;
  color: inherit;
  font-weight: 400;
  text-decoration: none;
}

/* ----------------------------------------------------------------- hero */

.eco-hero {
  padding: 0 0 var(--s8);
}

.eco h1 {
  font-family: var(--font-display);
  font-size: var(--t-h1);
  font-weight: var(--wt-display);
  line-height: var(--lh-snug);
  letter-spacing: var(--track-h);
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

/* ------------------------------------------------------------- notable */

.eco-block {
  margin-top: var(--s5);
}

.eco-block h2 {
  margin-bottom: var(--s4);
}

.eco-board {
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
}

.eco-spotlights {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.eco-spot {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: var(--s4);
  align-items: start;
  padding: var(--s6) var(--s5) var(--s5);
}

a.eco-spot:is(:hover, :focus-visible) h3,
a.eco-spot:is(:hover, :focus-visible) .eco-story {
  color: var(--accent-ui);
}

a.eco-spot:is(:hover, :focus-visible) .eco-blurb {
  color: var(--ink);
}

.eco-spot:nth-child(even) {
  border-left: 1px solid var(--rule);
}

.eco-spot:nth-child(n + 3) {
  border-top: 1px solid var(--rule);
}

.eco-spot-mark {
  display: flex;
  width: 72px;
  height: 72px;
  align-items: center;
  justify-content: center;
}

.eco-spot-mark img {
  display: block;
  width: 72px;
  height: 72px;
  object-fit: contain;
}

.eco-spot-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
}

.eco-spot h3,
.eco-chip h3 {
  font-family: var(--font-sans);
  font-weight: 500;
  color: var(--ink);
}

.eco-spot h3 {
  font-size: 1.5rem;
  letter-spacing: -0.03em;
  transition: color 0.15s var(--ease);
}

.eco-kind {
  font-family: var(--font-mono);
  font-size: var(--t-label);
  font-weight: 500;
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--ink-3);
}

.eco-blurb {
  margin-top: var(--s3);
  font-size: var(--t-small);
  line-height: 1.45;
  color: var(--ink-2);
  text-wrap: pretty;
}

.eco-spot .eco-blurb {
  text-wrap: balance;
  transition: color 0.15s var(--ease);
}

.eco-story {
  display: inline-flex;
  gap: 0.4em;
  align-items: center;
  margin-top: var(--s4);
  font-size: var(--t-small);
  color: var(--ink);
  transition: color 0.15s var(--ease);
}

.eco-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border-top: 1px solid var(--rule);
}

.eco-chip {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: var(--s5);
}

.eco-chip + .eco-chip {
  border-left: 1px solid var(--rule);
}

.eco-chip-mark {
  display: flex;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
}

.eco-chip-mark img {
  display: block;
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.eco-chip h3 {
  margin-top: var(--s4);
  font-size: 1.125rem;
  letter-spacing: -0.022em;
}

/* ------------------------------------------------------------------ list */

.eco-index {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  border-top: 1px solid var(--rule);
}

.eco-col {
  min-width: 0;
}

.eco-col + .eco-col {
  border-left: 1px solid var(--rule);
}

.eco-row {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr) auto;
  grid-template-rows: 28px;
  column-gap: var(--s4);
  align-items: center;
  padding: var(--s4);
  border-bottom: 1px solid var(--rule);
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
  line-height: 1;
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

.eco-letter--md {
  width: 48px;
  height: 48px;
  font-size: 0.9375rem;
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

@media (max-width: 899px) {
  .eco-strip {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .eco-chip:nth-child(2n + 1) {
    border-left: 0;
  }

  .eco-chip:nth-child(n + 3) {
    border-top: 1px solid var(--rule);
  }
}

@media (max-width: 639px) {
  .eco-spotlights,
  .eco-strip,
  .eco-index {
    grid-template-columns: minmax(0, 1fr);
  }

  .eco-spot {
    grid-template-columns: minmax(0, 1fr);
  }

  .eco-spot:nth-child(even),
  .eco-chip + .eco-chip,
  .eco-col + .eco-col {
    border-left: 0;
  }

  .eco-spot + .eco-spot,
  .eco-chip + .eco-chip,
  .eco-col + .eco-col {
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
