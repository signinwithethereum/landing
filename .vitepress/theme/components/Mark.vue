<script setup lang="ts">
/* The mark.
 *
 * Renders one of the five canvases from the brand engine and runs a state on
 * it. Loops only run while the mark is on screen, and `prefers-reduced-motion`
 * is handled inside the engine — it holds a state's end frame rather than
 * running it. Size with `--u`; colour is inherited — the engine writes
 * `var(--ink)`, `var(--field)` and `var(--accent)` straight onto the cells, so
 * a mark inside a `.screen` panel picks up the screen palette by itself. */

import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { loadMarkEngine, type Mark, type MarkCanvas, type MarkState } from '../mark'

const props = withDefaults(
  defineProps<{
    canvas?: MarkCanvas
    /** State to run. Loops pause off-screen; one-shots run once on mount. */
    state?: MarkState | null
    /** Draw the canvas ground. Defaults to on for the field canvas. */
    background?: boolean
    /** One cell, any CSS length. */
    unit?: string
    /** Accessible name. Omit for a mark that repeats adjacent text. */
    label?: string
  }>(),
  { canvas: 'mark', state: null, background: undefined, unit: undefined, label: undefined }
)

const host = ref<HTMLElement | null>(null)
const mark = ref<Mark | null>(null)
let observer: IntersectionObserver | null = null
let visible = true

function apply() {
  const m = mark.value
  if (!m) return
  if (!props.state) {
    m.stop().rest()
    return
  }
  if (visible) m.play(props.state)
  else m.stop().rest()
}

onMounted(async () => {
  if (!host.value) return
  const engine = await loadMarkEngine()
  if (!host.value) return

  mark.value = engine.mount(host.value, {
    canvas: props.canvas,
    ...(props.background === undefined ? {} : { background: props.background })
  })

  if (typeof IntersectionObserver === 'function') {
    observer = new IntersectionObserver(
      ([entry]) => {
        const next = entry.isIntersecting
        if (next === visible) return
        visible = next
        apply()
      },
      { rootMargin: '96px' }
    )
    observer.observe(host.value)
  }

  apply()
})

watch(() => props.state, apply)

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
  mark.value?.stop()
  mark.value = null
})

defineExpose({ mark })
</script>

<template>
  <span
    ref="host"
    class="markbox"
    :class="`markbox-${canvas}`"
    :style="unit ? { '--u': unit } : undefined"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
  />
</template>

<style>
.markbox {
  display: block;
  line-height: 0;
}

/* The SVG publishes its own cell count, so one rule sizes every canvas. */
.markbox > svg {
  display: block;
  width: calc(var(--u) * var(--cw));
  height: calc(var(--u) * var(--ch));
}

.markbox .mark-bg {
  fill: var(--canvas);
}
</style>
