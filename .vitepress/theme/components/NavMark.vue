<script setup lang="ts">
/* The wordmark in the nav, with the engine behind it.
 *
 * Two marks share one grid cell. The inline `Wordmark` is the same 29 x 9
 * geometry as the engine's bare canvas, so it stands in during SSR and for the
 * moment between hydration and the engine's dynamic import landing — the nav
 * never pops a logo in. Once the engine has mounted it takes the cell, and the
 * static copy steps aside without anything moving.
 *
 * Reaching for the mark means reaching for the link, so hover and focus are
 * read off the whole title anchor rather than off the 58 x 18 box the mark
 * occupies. Hover runs `scan` — the mark describing itself. A press runs
 * `confirm`, the state the brand uses for a signature coming back, and it is
 * allowed to finish before the mark returns to resting, or to scanning under a
 * pointer that never left. */

import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import Mark from './Mark.vue'
import Wordmark from './Wordmark.vue'
import type { MarkState } from '../mark'

const host = ref<HTMLElement | null>(null)
const live = ref<InstanceType<typeof Mark> | null>(null)

/* Pointer and keyboard are tracked apart rather than as one flag, because a
 * click on the link fires `focusin` before `click`: folded together, the mouse
 * that is still sitting on the mark would be forgotten the moment it pressed,
 * and the press would hand back to a resting mark instead of a scanning one. */
const over = ref(false)
const keyed = ref(false)
const hot = computed(() => over.value || keyed.value)

/* A press is playing out, and outranks hover until it finishes. */
const signing = ref(false)

const state = computed<MarkState | null>(() =>
  signing.value ? 'confirm' : hot.value ? 'scan' : null
)

const mounted = computed(() => !!live.value?.mark)

function onDone(finished: MarkState) {
  if (finished === 'confirm') signing.value = false
}

/* Touch has no hover to report — a tap would otherwise leave the mark scanning
 * for as long as the page is open. It gets the press and nothing else. */
function enter(event: PointerEvent) {
  if (event.pointerType !== 'touch') over.value = true
}

function out() {
  over.value = false
}

function focus(event: FocusEvent) {
  keyed.value = !!(event.target as Element | null)?.matches?.(':focus-visible')
}

function blur() {
  keyed.value = false
}

/* A second press should read as a second press, and the engine only restarts a
 * state it is handed again — so drop back to resting for one tick first. */
async function press() {
  if (signing.value) {
    signing.value = false
    await nextTick()
  }
  signing.value = true
}

/* [event, handler] pairs, so the two lists cannot drift apart. */
const BINDINGS: [string, EventListener][] = [
  ['pointerenter', enter as EventListener],
  ['pointerleave', out],
  ['focusin', focus as EventListener],
  ['focusout', blur],
  ['click', press]
]

let trigger: HTMLElement | null = null

onMounted(() => {
  trigger = host.value?.closest('a') ?? host.value
  for (const [type, handler] of BINDINGS) trigger?.addEventListener(type, handler)
})

onBeforeUnmount(() => {
  for (const [type, handler] of BINDINGS) trigger?.removeEventListener(type, handler)
  trigger = null
})
</script>

<template>
  <span ref="host" class="navmark" role="img" aria-label="Sign in with Ethereum">
    <Wordmark v-show="!mounted" aria-hidden="true" />
    <Mark ref="live" canvas="mark" :state="state" :background="false" @done="onDone" />
  </span>
</template>

<style scoped>
.navmark {
  --u: 2px;
  /* One cell, two marks: whichever is showing sets the size, and the handover
   * from the static copy to the engine's canvas moves nothing. */
  display: grid;
  color: var(--ink);
}

.navmark > * {
  grid-area: 1 / 1;
}
</style>
