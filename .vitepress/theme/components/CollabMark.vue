<script setup lang="ts">
/* Partner + SIWE lockup for success stories.
 *
 * /blog/ (`row`) is partner, plus, S. The article (`inline`) is partner,
 * plus, the full SIWE wordmark. Both sit to the left of the copy.
 *
 * Diagonal square (parked): partner whole top-left, SIWE S whole
 * bottom-right, white hairline from bottom-left to top-right. `.collab`
 * was `float: right; width: min(42%, 16rem); aspect-ratio: 1` with a
 * `.screen` field, logos at 38% in the corners, `.collab-cut::before` a
 * 1px white line `rotate(-45deg)` through the centre. */

import { computed, ref } from 'vue'
import { useData } from 'vitepress'
import { logoForStory, orgForStory, storySlug } from '../data/collab'
import Mark from './Mark.vue'
import Wordmark from './Wordmark.vue'

const props = withDefaults(
  defineProps<{
    layout?: 'inline' | 'row'
    src?: string
    label?: string
  }>(),
  { layout: 'inline', src: undefined, label: undefined }
)

const { frontmatter, page } = useData()
const broken = ref(false)

const slug = computed(() => storySlug(page.value.relativePath))

const src = computed(() => {
  if (props.src) return props.src
  return logoForStory(slug.value, frontmatter.value.logo)
})

const label = computed(() => props.label || orgForStory(slug.value))

const show = computed(() => Boolean(src.value) && !broken.value)

const unit = computed(() => (props.layout === 'row' ? '3px' : '4px'))

function onError() {
  broken.value = true
}
</script>

<template>
  <div
    v-if="show"
    class="collab"
    :class="`collab-${layout}`"
    role="img"
    :aria-label="label ? `${label} and Sign in with Ethereum` : undefined"
  >
    <img class="collab-them" :src="src" alt="" @error="onError" />
    <span class="collab-plus" aria-hidden="true">+</span>
    <span class="collab-us" aria-hidden="true">
      <Wordmark v-if="layout === 'inline'" />
      <Mark v-else canvas="icon" :background="false" :unit="unit" />
    </span>
  </div>
</template>

<style scoped>
.collab {
  display: flex;
  flex-shrink: 0;
  align-items: center;
}

.collab-them {
  object-fit: contain;
}

.collab-us {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
}

.collab-plus {
  font-family: var(--font-mono);
  font-size: var(--t-small);
  line-height: 1;
  color: var(--ink-3);
}

.collab-inline {
  gap: var(--s3);
  --u: 4px;
}

.collab-inline .collab-them {
  height: calc(var(--u) * 9);
  max-width: 4.5rem;
}

.collab-row {
  gap: var(--s2);
}

.collab-row .collab-them {
  height: 28px;
  max-width: 3.5rem;
}

.collab-row .collab-plus {
  padding: 0 var(--s1);
}
</style>
