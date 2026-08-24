<script setup lang="ts">
/* The wordmark as inline geometry, so it takes `currentColor` and needs no
 * light and dark copy. Cells read straight off brand/wordmark.svg: a 29 x 9
 * grid, ink on rows 0 2 4 6 8, 75 cells. */

withDefaults(defineProps<{ title?: string }>(), { title: 'Sign in with Ethereum' })

// [x, y, width] per ink run
const CELLS: [number, number, number][] = [
  [1, 0, 5], [9, 0, 2], [13, 0, 2], [20, 0, 2], [24, 0, 5],
  [0, 2, 3], [9, 2, 2], [13, 2, 2], [20, 2, 2], [24, 2, 2],
  [1, 4, 5], [9, 4, 2], [13, 4, 2], [17, 4, 1], [20, 4, 2], [24, 4, 4],
  [4, 6, 3], [9, 6, 2], [13, 6, 2], [16, 6, 3], [20, 6, 2], [24, 6, 2],
  [1, 8, 5], [9, 8, 2], [14, 8, 3], [18, 8, 3], [24, 8, 5]
]
</script>

<template>
  <svg
    class="wordmark"
    viewBox="0 0 29 9"
    fill="currentColor"
    shape-rendering="crispEdges"
    role="img"
    :aria-label="title"
  >
    <rect
      v-for="([x, y, w], i) in CELLS"
      :key="i"
      :x="x"
      :y="y"
      :width="w"
      height="1"
    />
  </svg>
</template>

<style>
.wordmark {
  display: block;
  height: calc(var(--u) * 9);
  width: calc(var(--u) * 29);
}
</style>
