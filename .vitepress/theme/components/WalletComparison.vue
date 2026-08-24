<script setup lang="ts">
import { computed, ref } from 'vue'
import { EXAMPLE, exampleMessage } from '../lib/example'
import MessageBlock from './MessageBlock.vue'

const HONEST_ORIGIN = EXAMPLE.domain
const LOOKALIKE_ORIGIN = 'app-example.com'

const lookalike = ref(false)
const origin = computed(() => (lookalike.value ? LOOKALIKE_ORIGIN : HONEST_ORIGIN))
const shortAddress = `${EXAMPLE.address.slice(0, 6)}…${EXAMPLE.address.slice(-4)}`
const message = exampleMessage()

const rows = [
  { label: 'Site', value: EXAMPLE.domain },
  { label: 'Account', value: shortAddress },
  { label: 'Network', value: 'Ethereum' },
  { label: 'Expires', value: '10 minutes' }
]
</script>

<template>
  <section id="message" class="band proof">
    <div class="shell">
      <header class="section-head">
        <h2>A message the wallet can understand</h2>
        <p>
          ERC&#8209;4361 gives every field a fixed place. A wallet can turn the
          signed text into a clear sign-in screen and compare the site in the
          message with the site making the request.
        </p>
      </header>

      <div class="proof-control">
        <button
          type="button"
          :aria-pressed="lookalike"
          @click="lookalike = !lookalike"
        >
          {{ lookalike ? 'Show the matching request' : 'Show a lookalike request' }}
        </button>
        <p aria-live="polite">
          <template v-if="lookalike">
            <b>{{ LOOKALIKE_ORIGIN }}</b> is asking for a message written for
            <b>{{ EXAMPLE.domain }}</b>.
          </template>
          <template v-else>
            The requesting site and the signed domain match.
          </template>
        </p>
      </div>

      <div class="proof-grid">
        <article class="proof-message screen">
          <header>
            <span>Signed message</span>
            <span>Plain text</span>
          </header>
          <div class="proof-message-body">
            <MessageBlock :message="message" />
          </div>
        </article>

        <article class="wallet" :class="{ 'is-warning': lookalike }">
          <header>
            <span class="wallet-dot" aria-hidden="true" />
            <span>Wallet view</span>
            <span>Ethereum</span>
          </header>

          <div class="wallet-body">
            <p class="wallet-title">Sign-in request</p>
            <p class="wallet-origin">{{ origin }}</p>

            <p v-if="lookalike" class="wallet-warning" role="status">
              <strong>Domain mismatch</strong>
              This request was written for another site. Do not sign it.
            </p>

            <dl>
              <div
                v-for="row in rows"
                :key="row.label"
                :class="{ 'is-flagged': lookalike && row.label === 'Site' }"
              >
                <dt>{{ row.label }}</dt>
                <dd>{{ row.value }}</dd>
              </div>
            </dl>

            <div class="wallet-actions">
              <span>Reject</span>
              <span :class="{ disabled: lookalike }">Sign in</span>
            </div>
          </div>
        </article>
      </div>

      <p class="proof-foot">
        The cryptography is unchanged. The structure gives the wallet enough
        context to explain the request and catch a mismatch before signing.
        <a href="/docs/message">Read the message format &rarr;</a>
      </p>
    </div>
  </section>
</template>

<style scoped>
.section-head {
  display: grid;
  gap: var(--s3);
  max-width: 42rem;
}

.section-head h2 {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.015em;
}

.section-head p,
.proof-foot {
  margin: 0;
  font-size: var(--t-small);
  line-height: 1.65;
  color: var(--ink-2);
  text-wrap: pretty;
}

.proof-control {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s3) var(--s4);
  align-items: center;
  margin-top: var(--s6);
}

.proof-control button {
  min-height: 36px;
  padding: 7px var(--s3);
  border: 1px solid var(--rule-strong);
  border-radius: var(--radius);
  background: transparent;
  color: var(--ink);
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
  cursor: pointer;
}

.proof-control button:hover,
.proof-control button[aria-pressed='true'] {
  border-color: var(--ink);
}

.proof-control p {
  margin: 0;
  font-size: var(--t-tiny);
  line-height: 1.5;
  color: var(--ink-3);
}

.proof-control b {
  font-family: var(--font-mono);
  font-weight: 500;
  color: var(--ink-2);
}

.proof-grid {
  display: grid;
  gap: var(--s4);
  margin-top: var(--s5);
}

@media (min-width: 820px) {
  .proof-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.proof-message,
.wallet {
  min-width: 0;
  border: 1px solid var(--rule);
  border-radius: var(--radius);
  overflow: hidden;
}

.proof-message > header,
.wallet > header {
  display: flex;
  gap: var(--s2);
  align-items: center;
  min-height: 40px;
  padding-inline: var(--s4);
  border-bottom: 1px solid var(--rule);
  font-family: var(--font-mono);
  font-size: var(--t-label);
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--ink-3);
}

.proof-message > header span:last-child,
.wallet > header span:last-child {
  margin-left: auto;
}

.proof-message-body {
  position: relative;
  z-index: 3;
  padding: var(--s5);
}

.proof-message :deep(.msg) {
  font-size: 0.75rem;
  line-height: 1.7;
}

.wallet {
  background: var(--canvas);
  border-color: var(--rule-strong);
  transition: border-color 0.16s var(--ease);
}

.wallet.is-warning {
  border-color: var(--danger);
}

.wallet > header {
  background: var(--canvas-2);
}

.wallet-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--rule-strong);
}

.wallet-body {
  padding: var(--s5);
}

.wallet-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 550;
  color: var(--ink);
}

.wallet-origin {
  margin: 5px 0 0;
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
  color: var(--ink-2);
}

.wallet-warning {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin: var(--s4) 0 0;
  padding: var(--s3);
  border: 1px solid color-mix(in srgb, var(--danger) 42%, transparent);
  background: color-mix(in srgb, var(--danger) 7%, transparent);
  font-size: var(--t-tiny);
  line-height: 1.5;
  color: var(--ink-2);
}

.wallet-warning strong {
  font-family: var(--font-mono);
  font-weight: 600;
  color: var(--danger);
}

.wallet dl {
  margin: var(--s5) 0 0;
}

.wallet dl > div {
  display: grid;
  grid-template-columns: 6rem minmax(0, 1fr);
  gap: var(--s4);
  padding-block: 10px;
  border-top: 1px solid var(--rule);
  font-size: var(--t-tiny);
}

.wallet dt {
  color: var(--ink-3);
}

.wallet dd {
  min-width: 0;
  margin: 0;
  font-family: var(--font-mono);
  color: var(--ink);
  overflow-wrap: anywhere;
}

.wallet .is-flagged dd {
  color: var(--danger);
}

.wallet-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--s2);
  margin-top: var(--s5);
}

.wallet-actions span {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding-inline: var(--s4);
  border: 1px solid var(--rule-strong);
  border-radius: var(--radius);
  font-size: var(--t-tiny);
  color: var(--ink-2);
}

.wallet-actions span:last-child {
  border-color: var(--ink);
  background: var(--ink);
  color: var(--canvas);
}

.wallet-actions span.disabled {
  border-color: var(--rule);
  background: var(--canvas-2);
  color: var(--ink-3);
}

.proof-foot {
  max-width: 48rem;
  margin-top: var(--s5);
}

.proof-foot a {
  color: var(--accent-ui);
  text-decoration: none;
}

.proof-foot a:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
