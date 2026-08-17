<script setup lang="ts">
/* The wordmark as inline geometry, so it takes `currentColor` and needs no
 * light and dark copy. Cells read straight off brand/wordmark.svg: a 31 x 9
 * grid, ink on rows 0 2 4 6 8, 80 cells. */

withDefaults(defineProps<{ title?: string }>(), { title: 'Sign-In with Ethereum' })

// [x, y, width] per ink run
const CELLS: [number, number, number][] = [
  [2, 0, 5], [9, 0, 4], [15, 0, 2], [22, 0, 2], [26, 0, 5],
  [0, 2, 3], [10, 2, 2], [15, 2, 2], [22, 2, 2], [26, 2, 2],
  [1, 4, 5], [10, 4, 2], [15, 4, 2], [22, 4, 2], [26, 4, 4],
  [4, 6, 3], [10, 6, 2], [15, 6, 2], [18, 6, 3], [22, 6, 2], [26, 6, 2],
  [1, 8, 5], [9, 8, 4], [15, 8, 4], [20, 8, 4], [26, 8, 5]
]
</script>

<template>
  <svg
    class="wordmark"
    viewBox="0 0 31 9"
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
  width: calc(var(--u) * 31);
}
</style>
