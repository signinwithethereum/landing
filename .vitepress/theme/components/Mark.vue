<script setup lang="ts">
/* The mark.
 *
 * Renders one of the five canvases from the brand engine and runs a state on
 * it. A state only runs while it can be seen, and `prefers-reduced-motion` is
 * handled inside the engine — it holds a state's end frame rather than running
 * it. Size with `--u`; colour is inherited — the engine writes
 * `var(--ink)`, `var(--field)` and `var(--accent)` straight onto the cells, so
 * a mark inside a `.screen` panel picks up the screen palette by itself. */

import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
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

/* A one-shot tells the parent when it has finished, which is what lets an
 * interaction hand the mark back — a press can run `confirm` to the end and
 * only then fall back to whatever hover state it interrupted. Loops never
 * resolve, so they never emit. */
const emit = defineEmits<{ done: [MarkState] }>()

const host = ref<HTMLElement | null>(null)

/* shallowRef, not ref: the engine keeps typed arrays, DOM nodes and a rAF
 * handle on the instance and writes to all of them every frame. Deep
 * reactivity would proxy that hot path for no benefit. */
const mark = shallowRef<Mark | null>(null)

let observer: IntersectionObserver | null = null
let onScreen = true

/* A state only runs when it can actually be seen. Off-screen is the obvious
 * half of that; a hidden document is the half that bites, because the browser
 * pauses requestAnimationFrame there — a one-shot started in a background tab
 * freezes on frame two and the mark sits in a half-dark frame until the tab is
 * focused. Resting is the right thing to show instead. */
function canRun() {
  return onScreen && typeof document !== 'undefined' && !document.hidden
}

/* Bumped on every apply, so a one-shot that was superseded — by a new state,
 * by the mark leaving the viewport — resolves into nothing. */
let run = 0

function apply() {
  const m = mark.value
  if (!m) return
  const token = ++run
  const state = props.state
  if (state && canRun()) {
    void m.play(state).then(() => {
      if (token === run) emit('done', state)
    })
  } else {
    m.stop().rest()
  }
}

function onVisibility() {
  apply()
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
        if (entry.isIntersecting === onScreen) return
        onScreen = entry.isIntersecting
        apply()
      },
      { rootMargin: '96px' }
    )
    observer.observe(host.value)
  }

  document.addEventListener('visibilitychange', onVisibility)
  apply()
})

watch(() => props.state, apply)

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
  document.removeEventListener('visibilitychange', onVisibility)
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
  --cell: var(--u);

  display: block;
  width: calc(var(--cell) * var(--cw));
  height: calc(var(--cell) * var(--ch));
}

/* `crispEdges` snaps every cell edge to a device pixel, so a cell that is not a
 * whole number of them gets rounded — one of the mark's lines to three pixels,
 * the next to two, and lines that are equal by construction stop looking it.
 * Rounding the cell first is what holds them level. The ratio comes from
 * `lib/dpr.ts`; browsers without `round()` keep the unsnapped size, which is
 * the behaviour this replaces. */
@supports (width: round(1px, 1px)) {
  .markbox > svg {
    --cell: calc(max(1px, round(var(--u) * var(--dpr, 1), 1px)) / var(--dpr, 1));
  }
}

.markbox .mark-bg {
  fill: var(--canvas);
}
</style>
