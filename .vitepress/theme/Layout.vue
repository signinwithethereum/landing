<script setup lang="ts">
import DefaultTheme from 'vitepress/theme-without-fonts'
import Wordmark from './components/Wordmark.vue'

const { Layout: Default } = DefaultTheme
</script>

<template>
  <Default>
    <template #nav-bar-title-before>
      <Wordmark class="nav-wordmark" title="Sign-In with Ethereum" />
    </template>
  </Default>
</template>

<style>
.nav-wordmark {
  --u: 2px;
  color: var(--ink);
}
</style>
