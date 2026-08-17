<script setup lang="ts">
/* An ERC-4361 message, rendered one line per element so another component can
 * light the lines it is talking about. The message is plain text on purpose —
 * that is the whole security property, and it is the reason this is set in the
 * mono face at a size you can actually read rather than shrunk into a corner. */

import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    message: string
    /** Zero-indexed lines to hold at full strength; the rest dim. */
    active?: number[] | null
    /** Show a gutter of line numbers. */
    numbers?: boolean
  }>(),
  { active: null, numbers: false }
)

const lines = computed(() => props.message.split('\n'))
const dimming = computed(() => !!props.active?.length)

function isActive(i: number) {
  return !dimming.value || props.active!.includes(i)
}
</script>

<template>
  <pre class="msg" :class="{ 'msg-dimming': dimming }"><span
    v-for="(line, i) in lines"
    :key="i"
    class="msg-line"
    :class="{ 'is-active': isActive(i), 'is-blank': line === '' }"
  ><span v-if="numbers" class="msg-n" aria-hidden="true">{{ i + 1 }}</span>{{ line || ' ' }}</span></pre>
</template>

<style scoped>
.msg {
  margin: 0;
  padding: 0;
  font-family: var(--font-mono);
  font-size: clamp(0.75rem, 1.05vw, 0.875rem);
  line-height: 1.85;
  letter-spacing: -0.01em;
  color: var(--ink);
  white-space: pre-wrap;
  overflow-wrap: break-word;
  background: none;
  border: 0;
}

.msg-line {
  display: block;
  transition: color 0.2s var(--ease), opacity 0.2s var(--ease);
}

.msg-line.is-blank {
  min-height: 1em;
}

.msg-dimming .msg-line {
  color: var(--ink-3);
  opacity: 0.55;
}

.msg-dimming .msg-line.is-active {
  color: var(--ink);
  opacity: 1;
}

.msg-n {
  display: inline-block;
  width: 2.25em;
  margin-left: -2.25em;
  color: var(--ink-3);
  opacity: 0.5;
  user-select: none;
}
</style>
