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
    mark: '/integrators/ambire.svg'
  },
  {
    name: 'EVM.NOW',
    href: 'https://evm.now/',
    mark: '/integrators/evm-now-e.svg'
  },
  {
    name: 'Privy',
    href: 'https://www.privy.io/',
    mark: '/integrators/privy.svg'
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
            v-for="integrator in INTEGRATORS"
            :key="integrator.name"
            class="integrator"
            :href="integrator.href"
            :aria-label="integrator.name"
            :tabindex="copy === 2 ? -1 : undefined"
            target="_blank"
            rel="noreferrer"
          >
            <span class="integrator-mark" aria-hidden="true">
              <img
                class="integrator-mark-image"
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
  --used-by-height: 96px;

  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  height: var(--used-by-height);
  padding: 0 !important;
  overflow: hidden;
  background: var(--screen);
  color: var(--screen-ink);
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
  border-inline-end: 1px solid var(--rule);
  background: var(--screen);
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
  color: var(--screen-ink);
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
  display: flex;
  width: 150px;
  height: 100%;
  flex: 0 0 150px;
  gap: var(--s2);
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.76);
  text-decoration: none;
  opacity: 0.9;
  transition: opacity 160ms var(--ease);
}

.integrator:hover,
.integrator:focus-visible {
  opacity: 1;
  outline: none;
}

.integrator:focus-visible {
  box-shadow: inset 0 0 0 1px var(--accent);
}

.integrator-mark {
  display: flex;
  width: 30px;
  height: 21px;
  flex: 0 0 30px;
  align-items: center;
  justify-content: center;
}

.integrator-mark-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: grayscale(1) brightness(0) invert(1);
}

.integrator-name {
  font-size: 0.8125rem;
  font-weight: 560;
  line-height: 1;
  letter-spacing: -0.018em;
  white-space: nowrap;
}

@keyframes used-by-scroll {
  to {
    transform: translate3d(-50%, 0, 0);
  }
}

@media (max-width: 640px) {
  .used-by {
    --used-by-height: 80px;

    grid-template-columns: 96px minmax(0, 1fr);
  }

  .used-by-label {
    gap: var(--s2);
    padding-inline: var(--s2);
  }

  .integrator {
    width: 130px;
    flex-basis: 130px;
  }

  .integrator-mark {
    width: 27px;
    height: 19px;
    flex-basis: 27px;
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

  .used-by-track {
    animation: none;
  }

  .used-by-set:last-child {
    display: none;
  }
}
</style>
