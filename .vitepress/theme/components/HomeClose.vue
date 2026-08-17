<script setup lang="ts">
/* The close. Bookends the hero: the mark once more, at size, on the page's own
 * ground rather than on a screen. */

import Mark from './Mark.vue'
</script>

<template>
  <section class="band close">
    <div class="shell close-in">
      <Mark state="confirm" label="Sign-In with Ethereum" />

      <div class="close-copy">
        <h2 class="t-h2">A standard, and therefore yours</h2>
        <p class="t-body">
          ERC&#8209;4361 was written in the open and is maintained in the open. There
          is no company to sign up with, no key to be issued, and no terms that
          can change under you. Implement either side of it and you are done.
        </p>
        <div class="close-actions">
          <a class="btn" href="/docs/quickstart/">Start integrating</a>
          <a class="btn btn-ghost" href="https://github.com/signinwithethereum">GitHub</a>
        </div>
        <p class="close-links">
          <a href="https://eips.ethereum.org/EIPS/eip-4361">Read ERC&#8209;4361</a>
          <a href="/tools/validator">Check a message</a>
          <a href="/blog/">Blog</a>
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.close {
  padding-bottom: var(--s9);
}

.close-in {
  display: grid;
  gap: var(--s7);
  align-items: center;
}

@media (min-width: 900px) {
  .close-in {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: var(--s9);
  }
}

.close-in :deep(.markbox) {
  --u: clamp(6px, 1.5vw, 13px);
  color: var(--ink);
}

.close-copy {
  display: flex;
  flex-direction: column;
  gap: var(--s4);
  align-items: start;
}

.close-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s3);
  margin-top: var(--s2);
}

.close-links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s5);
  margin: var(--s3) 0 0;
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
}

.close-links a {
  color: var(--ink-3);
  text-decoration: none;
}

.close-links a:hover {
  color: var(--accent-ui);
}
</style>
