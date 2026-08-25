<script setup lang="ts">
/* Post list.
 *
 * Used twice: on /blog/ with no `category`, where it lists everything and shows
 * which category each post is in, and on a category index with `category` set,
 * where it lists that category alone. */

import { computed } from 'vue'
import { data as posts } from '../data/posts.data'
import { CATEGORIES, categoryOf } from '../data/categories'

const props = withDefaults(defineProps<{ category?: string }>(), { category: undefined })

const shown = computed(() =>
  props.category ? posts.filter((p) => p.category === props.category) : posts
)

const counts = computed(() =>
  Object.fromEntries(
    CATEGORIES.map((c) => [c.slug, posts.filter((p) => p.category === c.slug).length])
  )
)

/* An empty category is a category that is not ready to be linked to. */
const listed = computed(() => CATEGORIES.filter((c) => counts.value[c.slug] > 0))
</script>

<template>
  <div class="bl">
    <nav v-if="!category" class="bl-cats" aria-label="Categories">
      <a v-for="c in listed" :key="c.slug" :href="`/blog/${c.slug}/`">
        {{ c.label }} <span>{{ counts[c.slug] }}</span>
      </a>
    </nav>

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

.bl-cats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s2);
  padding-bottom: var(--s5);
  border-bottom: 1px solid var(--rule);
}

.bl-cats a {
  display: inline-flex;
  gap: 0.5em;
  align-items: baseline;
  height: 30px;
  padding-inline: var(--s3);
  border: 1px solid var(--rule);
  border-radius: var(--radius);
  color: var(--ink-2);
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
  text-decoration: none;
  transition: border-color 0.15s var(--ease), color 0.15s var(--ease);
}

.bl-cats a:hover {
  border-color: var(--ink);
  color: var(--ink);
}

.bl-cats a span {
  color: var(--ink-3);
  font-size: 0.85em;
}

.bl-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.bl-list li {
  border-bottom: 1px solid var(--rule);
}

.bl-list a {
  display: block;
  padding: var(--s5) 0 var(--s5) var(--s4);
  border-left: 2px solid transparent;
  color: inherit;
  text-decoration: none;
  transition: border-color 0.15s var(--ease);
}

.bl-list a:hover {
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
