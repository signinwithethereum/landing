<script setup lang="ts">
const STEPS = [
  {
    title: 'Tell us about your app',
    body: 'Your stack, where sign-in lives today, and what it should do. A few sentences is plenty.'
  },
  {
    title: 'Get a scoped plan',
    body: 'We reply with the approach: which library fits, what changes on your backend, and roughly how much work it is.'
  },
  {
    title: 'Ship it',
    body: 'Build on the plan yourself, or have us alongside through review until sign-in runs in production.'
  }
]
</script>

<template>
  <section id="integration-help" class="band integrate">
    <div class="shell integrate-grid">
      <header>
        <p class="t-label">Integration support</p>
        <h2>Need help integrating?</h2>
        <p>
          The team that maintains the SIWE libraries and this site also helps
          products get sign&#8209;in with Ethereum into production. Tell us
          where you are and we take it from there.
        </p>
        <div class="integrate-cta">
          <a class="btn" href="/contact">Get in touch</a>
          <a class="integrate-alt" href="/docs/quickstart/">
            Prefer to self&#8209;serve? Quickstart <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </header>

      <ol>
        <li v-for="(step, index) in STEPS" :key="step.title">
          <span class="integrate-num" aria-hidden="true">0{{ index + 1 }}</span>
          <div>
            <strong>{{ step.title }}</strong>
            <span>{{ step.body }}</span>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.integrate-grid {
  display: grid;
  gap: var(--s7);
  align-items: start;
}

@media (min-width: 820px) {
  .integrate-grid {
    grid-template-columns: minmax(0, 0.58fr) minmax(0, 1fr);
    gap: var(--s8);
  }
}

.integrate header {
  display: grid;
  gap: var(--s3);
}

.integrate h2 {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.015em;
}

.integrate header > p:not(.t-label) {
  margin: 0;
  max-width: 32rem;
  font-size: var(--t-small);
  line-height: 1.65;
  color: var(--ink-2);
  text-wrap: pretty;
}

.integrate-cta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s4) var(--s5);
  align-items: center;
  margin-top: var(--s4);
}

.integrate-alt {
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
  color: var(--ink-2);
  text-decoration: none;
}

.integrate-alt:hover {
  color: var(--ink);
}

.integrate ol {
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--rule);
  list-style: none;
}

.integrate li {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--s4);
  padding-block: var(--s4);
  border-bottom: 1px solid var(--rule);
}

.integrate-num {
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
  line-height: 1.7;
  color: var(--ink-3);
}

.integrate li div {
  display: grid;
  gap: 5px;
}

.integrate li strong {
  font-size: var(--t-small);
  font-weight: 550;
  color: var(--ink);
}

.integrate li span {
  font-size: var(--t-small);
  line-height: 1.55;
  color: var(--ink-2);
  text-wrap: pretty;
}
</style>
