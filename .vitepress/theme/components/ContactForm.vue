<script setup lang="ts">
import { reactive, ref } from 'vue'

import { postJson } from '../lib/api'

const form = reactive({
  name: '',
  email: '',
  company: '',
  message: '',
  /* The honeypot. Hidden from people, filled by bots; the API answers a
   * filled one with a yes and stores nothing. */
  website: ''
})

const state = ref<'idle' | 'sending' | 'sent'>('idle')
const error = ref('')

async function submit() {
  if (state.value === 'sending') return
  state.value = 'sending'
  error.value = ''

  const result = await postJson('/contact', { ...form })

  if (result.ok) {
    state.value = 'sent'
  } else {
    state.value = 'idle'
    error.value = result.error
  }
}
</script>

<template>
  <div class="contact">
    <div v-if="state === 'sent'" class="contact-sent" role="status">
      <strong>Message sent.</strong>
      <span>
        Thanks — it is on its way to the maintainers. Replies come from a
        person, by email, to the address you gave.
      </span>
    </div>

    <form v-else class="contact-form" @submit.prevent="submit">
      <div class="contact-row">
        <label>
          <span>Name</span>
          <input
            v-model="form.name"
            type="text"
            name="name"
            autocomplete="name"
            maxlength="200"
            required
          />
        </label>

        <label>
          <span>Email</span>
          <input
            v-model="form.email"
            type="email"
            name="email"
            autocomplete="email"
            maxlength="254"
            required
          />
        </label>
      </div>

      <label>
        <span>Company <em>optional</em></span>
        <input
          v-model="form.company"
          type="text"
          name="company"
          autocomplete="organization"
          maxlength="200"
        />
      </label>

      <label>
        <span>Message</span>
        <textarea
          v-model="form.message"
          name="message"
          rows="6"
          maxlength="5000"
          required
          placeholder="Your stack, where sign-in lives today, and what it should do."
        ></textarea>
      </label>

      <div class="contact-trap" aria-hidden="true">
        <label>
          Website
          <input
            v-model="form.website"
            type="text"
            name="website"
            tabindex="-1"
            autocomplete="off"
          />
        </label>
      </div>

      <p v-if="error" class="contact-error" role="alert">
        {{ error }} Or write to
        <a href="mailto:contact@siwe.xyz">contact@siwe.xyz</a>.
      </p>

      <div class="contact-actions">
        <button class="btn" type="submit" :disabled="state === 'sending'">
          {{ state === 'sending' ? 'Sending…' : 'Send message' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.contact {
  max-width: 40rem;
  margin-top: var(--s6);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: var(--s4);
}

.contact-row {
  display: grid;
  gap: var(--s4);
}

@media (min-width: 560px) {
  .contact-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.contact label {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.contact label > span {
  font-family: var(--font-mono);
  font-size: var(--t-label);
  font-weight: 500;
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--ink-3);
}

.contact label em {
  font-style: normal;
  text-transform: none;
  letter-spacing: normal;
  color: var(--ink-3);
}

.contact input,
.contact textarea {
  width: 100%;
  min-width: 0;
  padding: 9px var(--s3);
  border: 1px solid var(--rule);
  border-radius: var(--radius);
  background: var(--canvas-2);
  color: var(--ink);
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
  line-height: 1.6;
}

.contact textarea {
  resize: vertical;
}

.contact input:focus,
.contact textarea:focus {
  border-color: var(--rule-strong);
  outline: none;
}

/* Visually removed rather than display:none, so filling it stays cheap for a
 * bot and impossible for a person. */
.contact-trap {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

.contact-error {
  margin: 0;
  font-size: var(--t-small);
  line-height: 1.55;
  color: var(--danger);
}

.contact-error a {
  color: inherit;
}

.contact-actions {
  display: flex;
  align-items: center;
  gap: var(--s4);
}

.contact button {
  cursor: pointer;
}

.contact button:disabled {
  opacity: 0.6;
  cursor: default;
}

.contact-sent {
  display: grid;
  gap: 5px;
  padding: var(--s5);
  border: 1px solid var(--rule);
  border-left: 2px solid var(--ok);
  border-radius: var(--radius);
  background: var(--canvas-2);
}

.contact-sent strong {
  font-size: var(--t-small);
  font-weight: 550;
  color: var(--ink);
}

.contact-sent span {
  font-size: var(--t-small);
  line-height: 1.55;
  color: var(--ink-2);
}
</style>
