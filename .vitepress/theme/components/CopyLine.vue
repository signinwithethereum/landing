<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ text: string; prefix?: string }>()

const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

async function copy() {
  try {
    await navigator.clipboard.writeText(props.text)
    copied.value = true
    clearTimeout(timer)
    timer = setTimeout(() => (copied.value = false), 1600)
  } catch {
    /* Clipboard refused; the text is selectable, so there is still a way. */
  }
}
</script>

<template>
  <div class="copyline">
    <code><span v-if="prefix" class="copyline-prefix">{{ prefix }}</span>{{ text }}</code>
    <button type="button" @click="copy" :aria-label="`Copy ${text}`">
      {{ copied ? 'Copied' : 'Copy' }}
    </button>
  </div>
</template>

<style scoped>
.copyline {
  display: flex;
  align-items: center;
  gap: var(--s3);
  min-height: 38px;
  padding: 0 var(--s2) 0 var(--s3);
  border: 1px solid var(--rule);
  border-radius: var(--radius);
  background: var(--canvas-2);
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
}

.copyline code {
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  white-space: nowrap;
  background: none;
  padding: 0;
  font-size: inherit;
  color: var(--ink);
}

.copyline-prefix {
  color: var(--ink-3);
  user-select: none;
}

.copyline button {
  flex: none;
  padding: 4px 8px;
  border: 0;
  border-radius: 2px;
  background: transparent;
  color: var(--ink-3);
  font-family: inherit;
  font-size: var(--t-label);
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  cursor: pointer;
  transition: color 0.15s var(--ease);
}

.copyline button:hover {
  color: var(--ink);
}
</style>
