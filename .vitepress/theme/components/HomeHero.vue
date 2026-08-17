<script setup lang="ts">
/* The hero.
 *
 * The thesis is the message. An ERC-4361 message is a short block of plain
 * text with a rigid grammar, and its readability is the security property —
 * so it is shown at a size you can read, on the black screen panel, under the
 * mark. The mark energizes once on load and then holds; the page does not
 * animate at rest. */

import { exampleMessage } from '../lib/example'
import Mark from './Mark.vue'
import MessageBlock from './MessageBlock.vue'
import CopyLine from './CopyLine.vue'

const message = exampleMessage()
</script>

<template>
  <section class="band hero">
    <div class="shell hero-grid">
      <div class="hero-copy">
        <p class="t-label hero-eyebrow">
          <a href="https://eips.ethereum.org/EIPS/eip-4361">ERC&#8209;4361</a>
          <span aria-hidden="true">/</span>
          <span>Final since August 2025</span>
        </p>

        <h1 class="t-display hero-title">
          Secure authentication for millions of Ethereum&nbsp;users
        </h1>

        <p class="t-lede hero-lede">
          A user signs a short, readable message with the key they already hold.
          Your server checks the signature. There is no password to store, no
          provider to ask, and nobody in between who can revoke your users.
        </p>

        <div class="hero-actions">
          <a class="btn" href="/docs/quickstart/">Start integrating</a>
          <a class="btn btn-ghost" href="/docs/">Read the docs</a>
        </div>

        <CopyLine prefix="$ " text="npm i @signinwithethereum/siwe" />
      </div>

      <div class="screen hero-screen">
        <div class="hero-screen-in">
          <Mark canvas="field" state="powerOn" label="Sign-In with Ethereum" />
          <MessageBlock :message="message" />
          <p class="hero-screen-foot">
            <span class="t-label">What the user signs</span>
            <a href="#anatomy">Every line, explained &rarr;</a>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding-top: var(--s8);
}

.hero-grid {
  display: grid;
  gap: var(--s8);
  align-items: start;
}

@media (min-width: 1000px) {
  .hero-grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
    gap: var(--s9);
    align-items: center;
  }
}

.hero-copy {
  display: flex;
  flex-direction: column;
  gap: var(--s5);
  align-items: start;
}

.hero-eyebrow {
  display: flex;
  gap: 0.6em;
  align-items: center;
}

.hero-eyebrow a {
  color: var(--ink-3);
  text-decoration: none;
  transition: color 0.15s var(--ease);
}

.hero-eyebrow a:hover {
  color: var(--accent-ui);
}

.hero-title {
  max-width: 17ch;
}

@media (max-width: 999px) {
  .hero-title {
    max-width: 22ch;
  }
}

.hero-lede {
  max-width: 44ch;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s3);
}

/* --------------------------------------------------------------- screen */

.hero-screen {
  --u: clamp(4px, 0.85vw, 8px);
}

.hero-screen-in {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: var(--s6);
  padding: var(--s6);
}

@media (min-width: 640px) {
  .hero-screen-in {
    padding: var(--s7);
  }
}

.hero-screen-foot {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s2) var(--s4);
  align-items: baseline;
  justify-content: space-between;
  margin: 0;
  padding-top: var(--s4);
  border-top: 1px solid var(--rule);
}

.hero-screen-foot a {
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
  color: var(--accent-ui);
  text-decoration: none;
}

.hero-screen-foot a:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
