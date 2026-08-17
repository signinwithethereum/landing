<script setup lang="ts">
/* The anatomy.
 *
 * The one interactive moment on the page, and it carries information rather
 * than atmosphere: pick a field and the message dims to the lines that field
 * occupies. Nine fields, nine reasons they exist. This is the section that
 * teaches the standard, so it is the section that gets the width. */

import { computed, ref } from 'vue'
import { ANATOMY, OPTIONAL, exampleMessage } from '../lib/example'
import MessageBlock from './MessageBlock.vue'

const message = exampleMessage()
const picked = ref<number | null>(null)

const active = computed(() => (picked.value === null ? null : ANATOMY[picked.value].lines))

function pick(i: number) {
  picked.value = i
}

function toggle(i: number) {
  picked.value = picked.value === i ? null : i
}
</script>

<template>
  <section id="anatomy" class="band">
    <div class="shell">
      <header class="an-head">
        <p class="t-label">The message</p>
        <h2 class="t-h2">Nine lines, and every one of them is doing a job</h2>
        <p class="t-body">
          ERC&#8209;4361 fixes the wording and the order so that a wallet can render
          the message, a person can read it, and a server can parse it without
          guessing. Pick a field to see where it sits and what it protects.
        </p>
      </header>

      <div class="an-grid">
        <div class="screen an-screen">
          <div class="an-screen-in">
            <MessageBlock :message="message" :active="active" numbers />
          </div>
        </div>

        <ul class="an-list" @mouseleave="picked = null">
          <li v-for="(f, i) in ANATOMY" :key="f.key">
            <button
              type="button"
              class="an-item"
              :class="{ 'is-picked': picked === i }"
              :aria-expanded="picked === i"
              @mouseenter="pick(i)"
              @focus="pick(i)"
              @click="toggle(i)"
            >
              <span class="an-key">{{ f.key }}</span>
              <span class="an-note">{{ f.note }}</span>
              <span v-if="f.defends" class="an-defends">{{ f.defends }}</span>
            </button>
          </li>
        </ul>
      </div>

      <div class="an-optional">
        <p class="t-label">Also allowed, and left out above</p>
        <dl>
          <div v-for="f in OPTIONAL" :key="f.key">
            <dt>{{ f.key }}</dt>
            <dd>{{ f.note }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>

<style scoped>
.an-head {
  display: flex;
  flex-direction: column;
  gap: var(--s4);
  max-width: 60ch;
  margin-bottom: var(--s7);
}

.an-grid {
  display: grid;
  gap: var(--s6);
  align-items: start;
}

@media (min-width: 1000px) {
  .an-grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: var(--s8);
  }

  .an-screen {
    position: sticky;
    top: calc(var(--vp-nav-height) + var(--s6));
  }
}

.an-screen-in {
  position: relative;
  z-index: 3;
  padding: var(--s6) var(--s6) var(--s6) calc(var(--s6) + 2.25em);
}

/* ----------------------------------------------------------------- list */

.an-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--rule);
}

.an-list li {
  border-bottom: 1px solid var(--rule);
}

.an-item {
  display: grid;
  gap: 4px 0;
  width: 100%;
  padding: var(--s4) 0 var(--s4) var(--s4);
  border: 0;
  border-left: 2px solid transparent;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s var(--ease);
}

.an-item.is-picked {
  border-left-color: var(--accent);
}

.an-key {
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
  font-weight: 500;
  color: var(--ink);
}

.an-item.is-picked .an-key {
  color: var(--accent-ui);
}

.an-note {
  font-size: var(--t-small);
  line-height: 1.55;
  color: var(--ink-2);
  text-wrap: pretty;
}

.an-defends {
  font-size: var(--t-tiny);
  line-height: 1.5;
  color: var(--ink-3);
}

.an-defends::before {
  content: 'Defends ';
  font-family: var(--font-mono);
  font-size: 0.8125em;
  letter-spacing: var(--track-label);
  text-transform: uppercase;
}

/* ------------------------------------------------------------- optional */

.an-optional {
  margin-top: var(--s7);
  padding-top: var(--s5);
  border-top: 1px solid var(--rule);
}

.an-optional dl {
  display: grid;
  gap: var(--s5);
  margin: var(--s4) 0 0;
}

@media (min-width: 720px) {
  .an-optional dl {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.an-optional dt {
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
  font-weight: 500;
  color: var(--ink);
}

.an-optional dd {
  margin: 4px 0 0;
  font-size: var(--t-small);
  line-height: 1.55;
  color: var(--ink-2);
}
</style>
