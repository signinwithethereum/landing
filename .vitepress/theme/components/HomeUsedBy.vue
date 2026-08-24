<script setup lang="ts">
const INTEGRATORS = [
  {
    name: 'MetaMask',
    href: 'https://metamask.io/',
    mark: '/integrators/metamask.svg'
  },
  {
    name: 'OpenRouter',
    href: 'https://openrouter.ai/',
    mark: '/integrators/openrouter.svg'
  },
  {
    name: 'OpenSea',
    href: 'https://opensea.io/',
    mark: '/integrators/opensea.svg'
  },
  {
    name: 'Ambire',
    href: 'https://www.ambire.com/',
    mark: '/stories/ambire.svg',
    markClass: 'integrator-mark-image--ambire'
  },
  {
    name: 'EVM.NOW',
    href: 'https://evm.now/',
    mark: '/stories/evm-now.svg',
    markClass: 'integrator-mark-image--native'
  },
  {
    name: 'Privy',
    href: 'https://www.privy.io/',
    mark: '/integrators/privy.svg',
    markClass: 'integrator-mark-image--native'
  }
]
</script>

<template>
  <section class="band used-by" aria-labelledby="used-by-title">
    <div class="used-by-label">
      <span class="used-by-signal" aria-hidden="true"></span>
      <h2 id="used-by-title">Used by</h2>
    </div>

    <div class="used-by-marquee">
      <div class="used-by-track">
        <div
          v-for="copy in 2"
          :key="copy"
          class="used-by-set"
          :aria-hidden="copy === 2 ? 'true' : undefined"
          :inert="copy === 2"
        >
          <a
            v-for="(integrator, index) in INTEGRATORS"
            :key="integrator.name"
            class="integrator"
            :href="integrator.href"
            :aria-label="integrator.name"
            :tabindex="copy === 2 ? -1 : undefined"
            :style="`--slot: ${index}`"
            target="_blank"
            rel="noreferrer"
          >
            <span class="integrator-mark" aria-hidden="true">
              <img
                :class="['integrator-mark-image', integrator.markClass]"
                :src="integrator.mark"
                alt=""
                width="32"
                height="32"
                loading="eager"
              />
              <img
                :class="[
                  'integrator-mark-image',
                  'integrator-mark-image--cyan',
                  integrator.markClass
                ]"
                :src="integrator.mark"
                alt=""
                width="32"
                height="32"
                loading="eager"
              />
            </span>
            <span class="integrator-name">{{ integrator.name }}</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.used-by {
  --used-by-height: 124px;

  display: grid;
  grid-template-columns: 132px minmax(0, 1fr);
  height: var(--used-by-height);
  padding: 0 !important;
  overflow: hidden;
  background: var(--screen);
  color: #fff;
}

.used-by::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 2;
  background: repeating-linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.025) 0,
    rgba(255, 255, 255, 0.025) 1px,
    transparent 1px,
    transparent 3px
  );
  pointer-events: none;
}

.used-by-label {
  position: relative;
  z-index: 3;
  display: flex;
  gap: 10px;
  align-items: center;
  padding-inline: var(--s5);
  border-inline-end: 1px solid #25252a;
  background: #000;
}

.used-by-label h2 {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--t-label);
  font-weight: 550;
  line-height: 1;
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  white-space: nowrap;
  color: #fff;
}

.used-by-signal {
  width: 6px;
  height: 6px;
  flex: 0 0 auto;
  background: var(--accent);
  box-shadow: 0 0 14px rgba(0, 234, 242, 0.72);
}

.used-by-marquee {
  position: relative;
  z-index: 1;
  min-width: 0;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(
    to right,
    transparent,
    #000 36px,
    #000 calc(100% - 36px),
    transparent
  );
  mask-image: linear-gradient(
    to right,
    transparent,
    #000 36px,
    #000 calc(100% - 36px),
    transparent
  );
}

.used-by-marquee::before,
.used-by-marquee::after {
  content: '';
  position: absolute;
  inset-block: 0;
  z-index: 2;
  width: 48px;
  pointer-events: none;
}

.used-by-marquee::before {
  inset-inline-start: 0;
  background: linear-gradient(to right, #000, transparent);
}

.used-by-marquee::after {
  inset-inline-end: 0;
  background: linear-gradient(to left, #000, transparent);
}

.used-by-track {
  display: flex;
  width: max-content;
  height: 100%;
  animation: used-by-scroll 42s linear infinite;
  will-change: transform;
}

.used-by-marquee:hover .used-by-track,
.used-by-marquee:focus-within .used-by-track {
  animation-play-state: paused;
}

.used-by-set {
  display: flex;
  flex: 0 0 auto;
}

.integrator {
  --pulse-delay: calc(var(--slot) * -1.9s);

  display: flex;
  width: 174px;
  height: var(--used-by-height);
  flex: 0 0 174px;
  gap: var(--s3);
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.88);
  text-decoration: none;
  transition: background 160ms var(--ease);
}

.integrator:hover,
.integrator:focus-visible {
  background: rgba(255, 255, 255, 0.045);
  outline: none;
}

.integrator:focus-visible {
  box-shadow: inset 0 0 0 1px var(--accent);
}

.integrator-mark {
  position: relative;
  display: block;
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  overflow: hidden;
}

.integrator-mark-image {
  position: absolute;
  inset: 0;
  display: block;
  width: 32px;
  height: 32px;
  object-fit: contain;
  filter: grayscale(1) brightness(0) invert(1);
  opacity: 0.88;
}

.integrator-mark-image--ambire {
  inset-inline-end: auto;
  width: auto;
  max-width: none;
}

.integrator-mark-image--cyan {
  filter: brightness(0) saturate(100%) invert(81%) sepia(96%) saturate(1450%)
    hue-rotate(127deg) brightness(100%) contrast(105%);
  opacity: 0;
  animation: used-by-mark-pulse 11.4s ease-in-out infinite;
  animation-delay: var(--pulse-delay);
}

.integrator-mark-image--native {
  filter: none;
  opacity: 1;
}

.integrator-mark-image--cyan.integrator-mark-image--native {
  display: none;
}

.integrator-name {
  font-size: 0.9375rem;
  font-weight: 560;
  line-height: 1;
  letter-spacing: -0.018em;
  white-space: nowrap;
  animation: used-by-name-pulse 11.4s ease-in-out infinite;
  animation-delay: var(--pulse-delay);
}

@keyframes used-by-scroll {
  to {
    transform: translate3d(-50%, 0, 0);
  }
}

@keyframes used-by-mark-pulse {
  0%,
  24%,
  56%,
  100% {
    opacity: 0;
  }
  34%,
  46% {
    opacity: 1;
  }
}

@keyframes used-by-name-pulse {
  0%,
  24%,
  56%,
  100% {
    color: rgba(255, 255, 255, 0.88);
  }
  34%,
  46% {
    color: var(--accent);
  }
}

@media (max-width: 640px) {
  .used-by {
    --used-by-height: 104px;

    grid-template-columns: 96px minmax(0, 1fr);
  }

  .used-by-label {
    gap: var(--s2);
    padding-inline: var(--s4);
  }

  .integrator {
    width: 154px;
    flex-basis: 154px;
  }

  .integrator-mark {
    width: 28px;
    height: 28px;
    flex-basis: 28px;
  }

  .integrator-mark-image {
    width: 28px;
    height: 28px;
  }

  .integrator-mark-image--ambire {
    width: auto;
    max-width: none;
  }

  .integrator-name {
    font-size: var(--t-small);
  }
}

@media (prefers-reduced-motion: reduce) {
  .used-by-marquee {
    overflow-x: auto;
    -webkit-mask-image: none;
    mask-image: none;
    scrollbar-width: none;
  }

  .used-by-marquee::-webkit-scrollbar {
    display: none;
  }

  .used-by-track,
  .integrator-mark-image--cyan,
  .integrator-name {
    animation: none !important;
  }

  .used-by-set:last-child {
    display: none;
  }
}
</style>
