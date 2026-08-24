<script setup lang="ts">
import CopyLine from './CopyLine.vue'
</script>

<template>
  <section class="band hero">
    <div class="shell hero-in">
      <p class="hero-status">
        <span>ERC&#8209;4361</span>
        <span aria-hidden="true">·</span>
        <span>Final standard</span>
      </p>

      <h1>Sign in with Ethereum</h1>

      <p class="hero-lede">
        An open standard for signing into apps with an Ethereum account. Users
        sign a readable message. Your server verifies it. No passwords or
        identity provider required.
      </p>

      <div class="hero-start">
        <a class="btn" href="/docs/quickstart/">Start integrating</a>
        <a class="hero-spec" href="https://eips.ethereum.org/EIPS/eip-4361">
          Read ERC&#8209;4361 <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <CopyLine prefix="$ " text="npm i @signinwithethereum/siwe" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding-block: 88px 80px;
}

.hero-in {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.hero-status {
  display: flex;
  gap: 0.65em;
  margin: 0 0 var(--s5);
  font-family: var(--font-mono);
  font-size: var(--t-label);
  font-weight: 500;
  line-height: 1;
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--ink-3);
}

.hero h1 {
  max-width: 14ch;
  margin: 0;
  font-size: clamp(2.75rem, 5.2vw, 4.5rem);
  font-weight: 500;
  line-height: 0.98;
  letter-spacing: -0.045em;
  text-wrap: balance;
}

.hero-lede {
  max-width: 43rem;
  margin: var(--s5) 0 0;
  font-size: clamp(1.0625rem, 1.6vw, 1.25rem);
  line-height: 1.55;
  letter-spacing: -0.012em;
  color: var(--ink-2);
  text-wrap: pretty;
}

.hero-start {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s4) var(--s5);
  align-items: center;
  margin-top: var(--s6);
}

.hero-spec {
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
  color: var(--ink-2);
  text-decoration: none;
}

.hero-spec:hover {
  color: var(--ink);
}

.hero :deep(.copyline) {
  width: min(100%, 390px);
  margin-top: var(--s4);
}

@media (max-width: 640px) {
  .hero {
    padding-block: var(--s8);
  }

  .hero h1 {
    max-width: 10ch;
  }
}
</style>
