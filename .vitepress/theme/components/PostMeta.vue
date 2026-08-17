<script setup lang="ts">
/* The byline under a post's title.
 *
 * Rendered by the layout for anything under /blog/ that is not an index, so a
 * post file only ever contains frontmatter and prose. */

import { computed } from 'vue'
import { useData } from 'vitepress'
import { categoryOf } from '../data/categories'

const { frontmatter, page } = useData()

const category = computed(() => {
  const parts = page.value.relativePath.split('/')
  return parts.length > 2 ? categoryOf(parts[1]) : undefined
})

const date = computed(() => {
  const raw = frontmatter.value.date
  if (!raw) return null
  const d = new Date(raw)
  d.setUTCHours(12, 0, 0, 0)
  return {
    iso: d.toISOString().slice(0, 10),
    label: d.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    })
  }
})
</script>

<template>
  <p v-if="date || category || frontmatter.author" class="pm">
    <a v-if="category" :href="`/blog/${category.slug}/`">{{ category.label }}</a>
    <time v-if="date" :datetime="date.iso">{{ date.label }}</time>
    <span v-if="frontmatter.author">{{ frontmatter.author }}</span>
  </p>
</template>

<style scoped>
.pm {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s4);
  margin: 0 0 var(--s5);
  font-family: var(--font-mono);
  font-size: var(--t-label);
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--ink-3);
}

.pm a {
  color: var(--accent-ui);
  text-decoration: none;
}

.pm a:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
