<script setup lang="ts">
import { ref } from 'vue'

import { postJson } from '../lib/api'

const email = ref('')
/* The honeypot — see ContactForm.vue. */
const website = ref('')

const state = ref<'idle' | 'sending' | 'sent'>('idle')
const error = ref('')

async function submit() {
  if (state.value === 'sending') return
  state.value = 'sending'
  error.value = ''

  const result = await postJson('/newsletter', {
    email: email.value,
    source: 'home',
    website: website.value
  })

  if (result.ok) {
    state.value = 'sent'
  } else {
    state.value = 'idle'
    error.value = result.error
  }
}
</script>

<template>
  <section id="newsletter" class="band newsletter">
    <div class="shell newsletter-grid">
      <header>
        <p class="t-label">Newsletter</p>
        <h2>Hear when the standard moves</h2>
        <p>
          Occasional email about ERC&#8209;4361, the libraries and notable
          integrations. No schedule, no tracking, unsubscribe any time.
        </p>
      </header>

      <div class="newsletter-side">
        <p v-if="state === 'sent'" class="newsletter-sent" role="status">
          <strong>Subscribed.</strong>
          <span>You are on the list — the next update lands in your inbox.</span>
        </p>

        <form v-else class="newsletter-form" @submit.prevent="submit">
          <label class="sr-only" for="newsletter-email">Email address</label>
          <input
            id="newsletter-email"
            v-model="email"
            type="email"
            name="email"
            autocomplete="email"
            maxlength="254"
            required
            placeholder="you@example.com"
          />
          <div class="newsletter-trap" aria-hidden="true">
            <label>
              Website
              <input v-model="website" type="text" name="website" tabindex="-1" autocomplete="off" />
            </label>
          </div>
          <button class="btn" type="submit" :disabled="state === 'sending'">
            {{ state === 'sending' ? 'Subscribing…' : 'Subscribe' }}
          </button>
        </form>

        <p v-if="error" class="newsletter-error" role="alert">{{ error }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.newsletter-grid {
  display: grid;
  gap: var(--s6);
  align-items: start;
}

@media (min-width: 820px) {
  .newsletter-grid {
    grid-template-columns: minmax(0, 0.58fr) minmax(0, 1fr);
    gap: var(--s8);
  }
}

.newsletter header {
  display: grid;
  gap: var(--s3);
}

.newsletter h2 {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.015em;
}

.newsletter header p:not(.t-label) {
  margin: 0;
  max-width: 32rem;
  font-size: var(--t-small);
  line-height: 1.65;
  color: var(--ink-2);
  text-wrap: pretty;
}

.newsletter-side {
  display: grid;
  gap: var(--s3);
}

@media (min-width: 820px) {
  /* Optically level with the header's first line, past the label above it. */
  .newsletter-side {
    padding-top: var(--s5);
  }
}

.newsletter-form {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s3);
}

.newsletter-form input {
  flex: 1 1 240px;
  min-width: 0;
  height: 40px;
  padding-inline: var(--s3);
  border: 1px solid var(--rule);
  border-radius: var(--radius);
  background: var(--canvas-2);
  color: var(--ink);
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
}

.newsletter-form input:focus {
  border-color: var(--rule-strong);
  outline: none;
}

.newsletter-form button {
  cursor: pointer;
}

.newsletter-form button:disabled {
  opacity: 0.6;
  cursor: default;
}

.newsletter-trap {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

.newsletter-error {
  margin: 0;
  font-size: var(--t-small);
  color: var(--danger);
}

.newsletter-sent {
  display: grid;
  gap: 5px;
  margin: 0;
  padding: var(--s4) var(--s5);
  border: 1px solid var(--rule);
  border-left: 2px solid var(--ok);
  border-radius: var(--radius);
  background: var(--canvas-2);
}

.newsletter-sent strong {
  font-size: var(--t-small);
  font-weight: 550;
  color: var(--ink);
}

.newsletter-sent span {
  font-size: var(--t-small);
  line-height: 1.55;
  color: var(--ink-2);
}
</style>
