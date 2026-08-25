<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'

import NavMark from './components/NavMark.vue'
import PostMeta from './components/PostMeta.vue'
import SiteFooter from './components/SiteFooter.vue'

const { Layout: Default } = DefaultTheme
const { page } = useData()

/* A post is anything under blog/ that is not a section index. The byline is
 * rendered here rather than in each file, so a post is frontmatter and prose
 * and nothing else. */
const isPost = computed(() => {
  const p = page.value.relativePath
  return p.startsWith('blog/') && !p.endsWith('index.md')
})
</script>

<template>
  <Default>
    <template #nav-bar-title-before>
      <NavMark />
    </template>

    <template #doc-before>
      <PostMeta v-if="isPost" />
    </template>

    <template #layout-bottom>
      <SiteFooter />
    </template>
  </Default>
</template>

<style>
/* The default footer is replaced by SiteFooter, which renders on every layout
 * rather than only where there is no sidebar. */
.VPFooter {
  display: none;
}
</style>
