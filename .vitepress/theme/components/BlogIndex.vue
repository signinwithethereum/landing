<script setup lang="ts">
/* Post list.
 *
 * Used twice: on /blog/ with no `category`, where it lists everything and shows
 * which category each post is in, and on a category index with `category` set,
 * where it lists that category alone. */

import { computed } from 'vue'
import { data as posts } from '../data/posts.data'
import { categoryOf } from '../data/categories'

const props = withDefaults(defineProps<{ category?: string }>(), { category: undefined })

const shown = computed(() =>
  props.category ? posts.filter((p) => p.category === props.category) : posts
)

</script>

<template>
  <div class="bl">
    <p v-if="!shown.length" class="bl-empty">Nothing published here yet.</p>

    <ul v-else class="bl-list">
      <li v-for="p in shown" :key="p.url">
        <a :href="p.url">
          <p class="bl-meta">
            <time :datetime="p.date.iso">{{ p.date.label }}</time>
            <span v-if="!category && p.category">{{ categoryOf(p.category)?.label }}</span>
          </p>
          <h3 class="t-h3">{{ p.title }}</h3>
          <p v-if="p.description" class="bl-desc">{{ p.description }}</p>
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.bl {
  margin-top: var(--s5);
}

.bl-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.bl-list li {
  border-bottom: 1px solid var(--rule);
}

/* VitePress adds space between adjacent prose list items. These rows need to
 * meet so their left rules form an unbroken guide. */
.bl-list li + li {
  margin-top: 0;
}

.bl-list a {
  display: block;
  padding: var(--s5) 0 var(--s5) var(--s4);
  border-left: 2px solid var(--rule);
  color: inherit;
  text-decoration: none;
  transition: border-color 0.15s var(--ease);
}

.bl-list a:is(:hover, :focus-visible) {
  border-left-color: var(--accent);
}

.bl-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s4);
  margin: 0 0 var(--s2);
  font-family: var(--font-mono);
  font-size: var(--t-label);
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--ink-3);
}

.bl-list h3 {
  margin: 0;
  color: var(--ink);
}

.bl-list a:hover h3 {
  color: var(--accent-ui);
}

.bl-desc {
  margin: var(--s2) 0 0;
  max-width: 68ch;
  font-size: var(--t-small);
  line-height: 1.6;
  color: var(--ink-2);
  text-wrap: pretty;
}

.bl-empty {
  margin: var(--s6) 0;
  font-size: var(--t-small);
  color: var(--ink-2);
}
</style>
