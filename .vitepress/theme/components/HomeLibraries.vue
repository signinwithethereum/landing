<script setup lang="ts">
import { computed, ref } from 'vue'
import { LIBRARIES } from '../data/libraries'
import { PUBLISHED_STORIES } from '../data/stories'
import CopyLine from './CopyLine.vue'

const selectedIndex = ref(0)
const selected = computed(() => LIBRARIES[selectedIndex.value])
const latestStories = PUBLISHED_STORIES.slice(0, 3)
</script>

<template>
  <section id="libraries" class="band libraries">
    <div class="shell">
      <header class="libraries-head">
        <h2>Use the library for your stack</h2>
        <p>
          Official implementations share the same message format and test
          vectors. Choose a language and start with its package.
        </p>
      </header>

      <div class="install">
        <div class="install-options" aria-label="Choose a language">
          <button
            v-for="(library, index) in LIBRARIES"
            :key="library.name"
            type="button"
            :aria-pressed="selectedIndex === index"
            @click="selectedIndex = index"
          >
            {{ library.name }}
          </button>
        </div>

        <CopyLine :text="selected.install" />

        <p class="install-links">
          <code>{{ selected.pkg }}</code>
          <span aria-hidden="true">·</span>
          <a :href="selected.docs">Documentation</a>
          <a :href="selected.repo">Source</a>
        </p>
      </div>

      <div class="production">
        <header>
          <h2>Used in production</h2>
          <a href="/blog/success-stories">See all success stories &rarr;</a>
        </header>

        <ul>
          <li v-for="story in latestStories" :key="story.org">
            <a :href="story.link">
              <strong>{{ story.org }}</strong>
              <span>{{ story.claim }}</span>
              <span aria-hidden="true">&rarr;</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.libraries-head {
  display: grid;
  gap: var(--s3);
  max-width: 42rem;
}

.libraries h2 {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.015em;
}

.libraries-head p {
  margin: 0;
  font-size: var(--t-small);
  line-height: 1.65;
  color: var(--ink-2);
}

.install {
  margin-top: var(--s6);
  border: 1px solid var(--rule);
  border-radius: var(--radius);
  background: var(--canvas-2);
}

.install-options {
  display: flex;
  gap: 0;
  overflow-x: auto;
  border-bottom: 1px solid var(--rule);
}

.install-options button {
  flex: none;
  min-height: 42px;
  padding-inline: var(--s4);
  border: 0;
  border-right: 1px solid var(--rule);
  background: transparent;
  color: var(--ink-3);
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
  cursor: pointer;
}

.install-options button:hover {
  color: var(--ink);
}

.install-options button[aria-pressed='true'] {
  box-shadow: inset 0 -2px 0 var(--ink);
  color: var(--ink);
}

.install :deep(.copyline) {
  margin: var(--s4);
  border-color: var(--rule-strong);
  background: var(--canvas);
}

.install-links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s2) var(--s4);
  align-items: center;
  margin: 0;
  padding: 0 var(--s4) var(--s4);
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
  color: var(--ink-3);
}

.install-links code {
  padding: 0;
  background: none;
  font-size: inherit;
  color: var(--ink-2);
}

.install-links a {
  color: var(--ink-2);
  text-decoration: none;
}

.install-links a:hover {
  color: var(--ink);
}

.production {
  margin-top: var(--s8);
}

.production > header {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s3) var(--s5);
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: var(--s4);
}

.production > header a {
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
  color: var(--ink-3);
  text-decoration: none;
}

.production > header a:hover {
  color: var(--ink);
}

.production ul {
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--rule);
  list-style: none;
}

.production li {
  border-bottom: 1px solid var(--rule);
}

.production li a {
  display: grid;
  grid-template-columns: minmax(8rem, 0.5fr) minmax(0, 1fr) auto;
  gap: var(--s4);
  align-items: baseline;
  padding-block: var(--s4);
  color: inherit;
  text-decoration: none;
}

.production strong {
  font-size: var(--t-small);
  font-weight: 550;
  color: var(--ink);
}

.production li span {
  font-size: var(--t-small);
  color: var(--ink-2);
}

.production li span:last-child {
  font-family: var(--font-mono);
  color: var(--ink-3);
}

.production li a:hover span:last-child {
  color: var(--accent-ui);
}

@media (max-width: 560px) {
  .production li a {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 4px var(--s3);
  }

  .production li span:nth-child(2) {
    grid-column: 1;
  }

  .production li span:last-child {
    grid-column: 2;
    grid-row: 1 / span 2;
  }
}
</style>
