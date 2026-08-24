<script setup lang="ts">
import { useData } from "vitepress";

import CopyLine from "./CopyLine.vue";

const { isDark } = useData();
</script>

<template>
  <section class="band hero">
    <div class="shell hero-in">
      <div class="hero-copy">
        <p class="hero-status">
          <span>ERC&#8209;4361</span>
        </p>

        <h1>Sign in with Ethereum</h1>

        <p class="hero-lede">
          Ditch passwords and third&#8209;party providers. An open standard for
          signing into apps with an Ethereum account. Onboard millions of
          Ethereum users to your app.
        </p>

        <div class="hero-start">
          <a class="btn" href="/docs/quickstart/">Start integrating</a>
          <a class="hero-spec" href="https://eips.ethereum.org/EIPS/eip-4361">
            Read ERC&#8209;4361 <span aria-hidden="true">&rarr;</span>
          </a>
        </div>

        <CopyLine prefix="$ " text="npm i @signinwithethereum/siwe" />
      </div>

      <figure :class="['hero-art', { 'hero-art--dark': isDark }]">
        <img
          src="/hero/siwe-illustration.webp"
          width="1024"
          height="1024"
          alt="A person at a computer beneath a globe-wide digital network."
          fetchpriority="high"
          decoding="async"
        />
      </figure>
    </div>
  </section>
</template>

<style scoped>
.hero {
  display: flex;
  min-height: 586px;
  padding-block: 0;
  overflow: hidden;
}

.hero-in {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
}

.hero-copy {
  width: min(55%, 35rem);
  min-width: 0;
  padding-block: 72px;
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
  max-width: 10ch;
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2.75rem, 5.2vw, 4.5rem);
  font-weight: var(--wt-display);
  line-height: 0.98;
  letter-spacing: -0.05em;
  text-wrap: balance;
}

.hero-lede {
  max-width: 35rem;
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

.hero-art {
  position: absolute;
  z-index: 0;
  inset-block: 0;
  inset-inline-end: 0;
  width: 50%;
  margin: 0;
  overflow: hidden;
  background: #99c8d4;
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    rgba(0, 0, 0, 0.12) 24%,
    #000 68%
  );
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    rgba(0, 0, 0, 0.12) 24%,
    #000 68%
  );
}

.hero-art img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(1);
  transform: scaleX(-1);
}

.hero-art::after {
  content: "";
  position: absolute;
  inset: 0;
  background: #99c8d4;
  mix-blend-mode: hard-light;
  opacity: 1;
  pointer-events: none;
}

.hero-art--dark::after {
  opacity: 0.33;
}

@media (max-width: 820px) {
  .hero {
    min-height: 760px;
  }

  .hero-in {
    align-items: flex-start;
  }

  .hero-copy {
    width: 100%;
    padding-block: var(--s8) 240px;
  }

  .hero h1 {
    max-width: 12ch;
  }

  .hero-art {
    inset-block: auto 0;
    width: 100%;
    height: 450px;
    -webkit-mask-image: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.16) 24%,
      #000 66%
    );
    mask-image: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.16) 24%,
      #000 66%
    );
  }

  .hero-art img {
    transform: none;
  }
}

@media (max-width: 640px) {
  .hero {
    min-height: 720px;
  }

  .hero h1 {
    max-width: 10ch;
  }

  .hero-copy {
    padding-bottom: 210px;
  }

  .hero-art {
    height: 420px;
  }
}
</style>
