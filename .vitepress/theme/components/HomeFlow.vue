<script setup lang="ts">
/* How it works.
 *
 * Numbered, because this genuinely is a sequence and the order is the security
 * argument: the nonce exists before the message, the message names the domain
 * before it is signed, and the server checks its own values rather than the
 * ones that arrived. The code comes in through the slot so VitePress
 * highlights it. */

const STEPS = [
  {
    n: '1',
    title: 'Your server issues a nonce',
    body: 'Random, single-use, and stored against the session. The client never invents it.'
  },
  {
    n: '2',
    title: 'The message is assembled',
    body: 'Your domain, the user’s address, the nonce, a statement, an expiry. Plain text, fixed order.'
  },
  {
    n: '3',
    title: 'The wallet signs it',
    body: 'A personal_sign over that exact string. Nothing is broadcast and no gas is spent.'
  },
  {
    n: '4',
    title: 'Your server verifies',
    body: 'Recover the signer, then check the domain, the nonce and the clock against values you control.'
  }
]
</script>

<template>
  <section id="how" class="band">
    <div class="shell">
      <header class="flow-head">
        <p class="t-label">How it works</p>
        <h2 class="t-h2">Four steps, and the server never trusts the client</h2>
      </header>

      <div class="flow-grid">
        <ol class="flow-steps">
          <li v-for="s in STEPS" :key="s.n">
            <span class="flow-n" aria-hidden="true">{{ s.n }}</span>
            <span class="flow-body">
              <strong>{{ s.title }}</strong>
              <span>{{ s.body }}</span>
            </span>
          </li>
        </ol>

        <!-- `vp-doc` because the default theme scopes all of its code-block
             styling to it, and `layout: page` does not add the class itself.
             The slot only ever holds a fence, so nothing else is affected. -->
        <div class="flow-code vp-doc">
          <slot />
        </div>
      </div>

      <p class="flow-more">
        <a class="btn btn-ghost btn-mono" href="/docs/quickstart/">Full quickstart, front and back</a>
      </p>
    </div>
  </section>
</template>

<style scoped>
.flow-head {
  display: flex;
  flex-direction: column;
  gap: var(--s4);
  max-width: 58ch;
  margin-bottom: var(--s7);
}

.flow-grid {
  display: grid;
  gap: var(--s7);
  align-items: start;
}

@media (min-width: 1000px) {
  .flow-grid {
    grid-template-columns: minmax(0, 0.72fr) minmax(0, 1fr);
    gap: var(--s8);
  }
}

/* ---------------------------------------------------------------- steps */

.flow-steps {
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: none;
}

.flow-steps li {
  display: grid;
  grid-template-columns: 2.5rem minmax(0, 1fr);
  gap: 0 var(--s3);
  padding: var(--s4) 0;
  border-top: 1px solid var(--rule);
}

.flow-steps li:last-child {
  border-bottom: 1px solid var(--rule);
}

.flow-n {
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
  line-height: 1.6;
  color: var(--accent-ui);
}

.flow-body {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.flow-body strong {
  font-size: var(--t-body);
  font-weight: 500;
  letter-spacing: -0.01em;
  color: var(--ink);
}

.flow-body > span {
  font-size: var(--t-small);
  line-height: 1.55;
  color: var(--ink-2);
  text-wrap: pretty;
}

/* ----------------------------------------------------------------- code */

.flow-code :deep(div[class*='language-']) {
  margin: 0;
}

.flow-more {
  margin: var(--s7) 0 0;
}
</style>
