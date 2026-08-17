<script setup lang="ts">
/* What structure buys at the wallet.
 *
 * Two prompts, the same cryptography, the same `personal_sign` call. One is an
 * arbitrary string and one is an ERC-4361 message, and the difference is that
 * the second one parses — so the wallet can name the site, name the account,
 * show the expiry, and compare the domain in the message against the origin
 * that actually asked.
 *
 * The one control flips both panels into a relay attack. The point of the
 * interaction is that only one of them moves: the blind prompt is
 * byte-for-byte identical, because there is nothing in it to check.
 *
 * The chrome here is deliberately unbranded. Depicting it as any particular
 * wallet would be putting words in that wallet's mouth; MetaMask and Ambire are
 * named in the prose, with links, and the Ambire case study describes a real
 * implementation field by field. */

import { computed, ref } from 'vue'
import { EXAMPLE } from '../lib/example'

/** The origin the wallet sees the request coming from. */
const HONEST_ORIGIN = 'app.example.com'
const ATTACKER_ORIGIN = 'app-example.com'

const attack = ref(false)

const origin = computed(() => (attack.value ? ATTACKER_ORIGIN : HONEST_ORIGIN))

/* The message is the real site's either way. That is what a relay is: the
 * attacker's page hands your wallet a message it did not author, hoping you
 * sign it so the signature can be presented to the site it names. */
const mismatch = computed(() => attack.value)

const short = `${EXAMPLE.address.slice(0, 6)}…${EXAMPLE.address.slice(-4)}`

/* An unstructured login string. There is no grammar, so there is nothing here a
 * wallet could label, verify, or refuse. */
const BLIND = 'Login: 8f4e2a91c7d0'

/* Human labels, not ERC-4361 field names — relabelling the parsed fields for a
 * reader is exactly the work a wallet does with them. */
const rows = computed(() => [
  { label: 'Site', value: EXAMPLE.domain, flag: mismatch.value },
  { label: 'Account', value: short, flag: false },
  { label: 'Network', value: 'Ethereum', flag: false },
  { label: 'Nonce', value: EXAMPLE.nonce, flag: false },
  { label: 'Expires', value: '10 minutes', flag: false }
])

const CANNOT = [
  'Which site is asking — the string does not say',
  'Whether this is a sign-in or a permission grant',
  'Whether it has been used before',
  'When it stops being valid'
]

const CAN = [
  'Which site is asking, and whether it is the site that asked',
  'Which account, on which chain',
  'That the nonce is single-use and the message expires',
  'That the statement is a sentence, not a payload'
]
</script>

<template>
  <section id="wallet" class="band">
    <div class="shell">
      <header class="wc-head">
        <p class="t-label">At the wallet</p>
        <h2 class="t-h2">A wallet can only warn you about what it can read</h2>
        <p class="t-body">
          Both of these are a <code>personal_sign</code> over a string, and both
          produce the same kind of signature. The difference is that one of them
          has a grammar. Because an ERC&#8209;4361 message parses, the wallet knows
          which site is asking, which account, which chain and until when — so it
          can render a sign-in screen instead of a blob, and say something when
          the site asking is not the site the message names. Handed an arbitrary
          string, a wallet has nothing to check and nothing to tell you.
        </p>
      </header>

      <div class="wc-control">
        <button
          type="button"
          class="btn btn-ghost btn-mono"
          :aria-pressed="attack"
          @click="attack = !attack"
        >
          {{ attack ? 'Back to the honest request' : 'Relay it from a lookalike site' }}
        </button>
        <p class="wc-control-note" aria-live="polite">
          <template v-if="attack">
            Both prompts now show <b>{{ ATTACKER_ORIGIN }}</b> as the site asking,
            and both carry a message written for <b>{{ EXAMPLE.domain }}</b>. Only
            one of them can tell.
          </template>
          <template v-else>
            Both prompts are the honest case. Flip it and watch which one notices.
          </template>
        </p>
      </div>

      <div class="wc-grid">
        <!-- Blind ------------------------------------------------------- -->
        <div class="wc-col">
          <p class="wc-kind">
            <span class="t-label">An arbitrary string</span>
            <span class="wc-verdict is-bad">Nothing to verify</span>
          </p>

          <div class="wc-wallet">
            <div class="wc-chrome">
              <span class="wc-dot" aria-hidden="true" />
              <span>Wallet</span>
            </div>
            <div class="wc-body">
              <p class="wc-title">Signature request</p>
              <p class="wc-origin">{{ origin }}</p>
              <p class="wc-sub">is requesting your signature</p>

              <p class="wc-blob-label t-label">Message</p>
              <pre class="wc-blob">{{ BLIND }}</pre>

              <div class="wc-actions">
                <span class="wc-btn">Reject</span>
                <span class="wc-btn is-primary">Sign</span>
              </div>
            </div>
          </div>

          <ul class="wc-list is-cannot">
            <li v-for="c in CANNOT" :key="c">{{ c }}</li>
          </ul>
        </div>

        <!-- ERC-4361 ---------------------------------------------------- -->
        <div class="wc-col">
          <p class="wc-kind">
            <span class="t-label">An ERC&#8209;4361 message</span>
            <span class="wc-verdict" :class="mismatch ? 'is-bad' : 'is-ok'">
              {{ mismatch ? 'Mismatch caught' : 'Parsed and checked' }}
            </span>
          </p>

          <div class="wc-wallet" :class="{ 'is-warning': mismatch }">
            <div class="wc-chrome">
              <span class="wc-dot" aria-hidden="true" />
              <span>Wallet</span>
              <span class="wc-net">on Ethereum</span>
            </div>
            <div class="wc-body">
              <p class="wc-title">Sign-in request</p>
              <p class="wc-origin">{{ origin }}</p>
              <p class="wc-sub">wants to prove you own this account</p>

              <p v-if="mismatch" class="wc-alert" role="status">
                <b>Deceptive request</b>
                The site asking is not the site named in the message. This may be
                an attempt to sign you in somewhere else.
              </p>

              <dl class="wc-rows">
                <div v-for="r in rows" :key="r.label" :class="{ 'is-flagged': r.flag }">
                  <dt>{{ r.label }}</dt>
                  <dd>{{ r.value }}</dd>
                </div>
              </dl>

              <div class="wc-actions">
                <span class="wc-btn">Reject</span>
                <span class="wc-btn" :class="mismatch ? 'is-disabled' : 'is-primary'">
                  Sign in
                </span>
              </div>
            </div>
          </div>

          <ul class="wc-list is-can">
            <li v-for="c in CAN" :key="c">{{ c }}</li>
          </ul>
        </div>
      </div>

      <div class="wc-coda">
        <p>
          None of this is the wallet being generous. ERC&#8209;4361 puts it in
          capitals: wallet implementers <b>MUST</b> display the domain, address,
          statement and resources, and <b>MUST</b> prevent phishing by verifying
          the origin of the request against the <code>scheme</code> and
          <code>domain</code> fields. A standard is what makes that a requirement
          somebody can be held to rather than a nicety.
        </p>
        <p>
          <a href="https://docs.metamask.io/wallet/how-to/sign-data/siwe/">MetaMask</a>
          and
          <a href="https://www.ambire.com/">Ambire</a>
          both ship this today. Ambire promotes a parsed message to a first-class
          request type in the wallet core and compares host <em>and</em> port, so
          a sibling subdomain cannot pass as a match &mdash;
          <a href="/blog/success-stories/ambire">we wrote that one up</a>.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.wc-head {
  display: flex;
  flex-direction: column;
  gap: var(--s4);
  max-width: 64ch;
  margin-bottom: var(--s6);
}

/* -------------------------------------------------------------- control */

.wc-control {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s3) var(--s5);
  align-items: center;
  padding-bottom: var(--s5);
}

/* `.btn` sets `white-space: nowrap`, which is right for the short labels it was
 * written for and wrong for a sentence. Let this one wrap and grow rather than
 * push the section wider than the phone. */
.wc-control .btn {
  height: auto;
  min-height: 40px;
  padding-block: 8px;
  white-space: normal;
  text-align: left;
}

.wc-control-note {
  margin: 0;
  max-width: 52ch;
  font-size: var(--t-tiny);
  line-height: 1.55;
  color: var(--ink-2);
}

.wc-control-note b {
  font-family: var(--font-mono);
  font-weight: 500;
  color: var(--ink);
}

/* ----------------------------------------------------------------- grid */

/* The two cards are held to the same height so the capability lists below them
 * line up and the comparison stays scannable. The blind prompt is left with
 * visible empty space, which is honest — there genuinely is nothing more to
 * show. */
.wc-grid {
  display: grid;
  gap: var(--s6);
  align-items: stretch;
}

@media (min-width: 880px) {
  .wc-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--s6);
  }
}

.wc-col {
  display: flex;
  flex-direction: column;
  gap: var(--s3);
}

.wc-kind {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s2) var(--s4);
  align-items: baseline;
  justify-content: space-between;
  margin: 0;
}

.wc-verdict {
  font-family: var(--font-mono);
  font-size: var(--t-label);
  font-weight: 500;
  letter-spacing: var(--track-label);
  text-transform: uppercase;
}

.wc-verdict.is-ok {
  color: var(--ok);
}

.wc-verdict.is-bad {
  color: var(--danger);
}

/* --------------------------------------------------------- wallet chrome */

/* Unbranded on purpose. This is the shape of a wallet prompt, not any
 * particular wallet's. */
.wc-wallet {
  display: flex;
  flex-direction: column;
  flex: 1;
  border: 1px solid var(--rule-strong);
  border-radius: var(--radius-lg);
  background: var(--canvas);
  overflow: hidden;
  transition: border-color 0.2s var(--ease);
}

.wc-wallet.is-warning {
  border-color: var(--danger);
}

.wc-chrome {
  display: flex;
  gap: var(--s2);
  align-items: center;
  padding: var(--s3) var(--s4);
  border-bottom: 1px solid var(--rule);
  background: var(--canvas-2);
  font-family: var(--font-mono);
  font-size: var(--t-label);
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--ink-3);
}

.wc-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--rule-strong);
}

.wc-net {
  margin-left: auto;
  text-transform: none;
  letter-spacing: 0;
}

.wc-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: var(--s5) var(--s4) var(--s4);
}

.wc-title {
  margin: 0;
  font-size: 1.0625rem;
  font-weight: 500;
  letter-spacing: -0.012em;
  color: var(--ink);
}

.wc-origin {
  margin: var(--s3) 0 0;
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
  color: var(--ink);
  overflow-wrap: anywhere;
}

.wc-sub {
  margin: 2px 0 0;
  font-size: var(--t-tiny);
  color: var(--ink-2);
}

/* ---------------------------------------------------------------- blind */

.wc-blob-label {
  margin: var(--s5) 0 var(--s2);
}

.wc-blob {
  margin: 0;
  padding: var(--s4);
  border: 1px solid var(--rule);
  border-radius: var(--radius);
  background: var(--canvas-2);
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
  line-height: 1.7;
  color: var(--ink);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

/* ---------------------------------------------------------------- rows */

.wc-alert {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin: var(--s4) 0 0;
  padding: var(--s3);
  border: 1px solid var(--danger);
  border-left-width: 2px;
  border-radius: var(--radius);
  font-size: var(--t-tiny);
  line-height: 1.5;
  color: var(--ink-2);
}

.wc-alert b {
  font-weight: 500;
  color: var(--danger);
}

.wc-rows {
  margin: var(--s4) 0 0;
  padding: 0;
  border-top: 1px solid var(--rule);
}

.wc-rows > div {
  display: grid;
  grid-template-columns: 5.5rem minmax(0, 1fr);
  gap: var(--s3);
  align-items: baseline;
  padding: 7px 0;
  border-bottom: 1px solid var(--rule);
}

.wc-rows dt {
  font-size: var(--t-tiny);
  color: var(--ink-3);
}

.wc-rows dd {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
  color: var(--ink);
  overflow-wrap: anywhere;
}

.wc-rows > div.is-flagged dd {
  color: var(--danger);
  text-decoration: underline wavy var(--danger);
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

/* -------------------------------------------------------------- actions */

.wc-actions {
  display: flex;
  gap: var(--s2);
  margin-top: auto;
  padding-top: var(--s5);
}

/* Spans, not buttons: this is a depiction and none of it is operable. */
.wc-btn {
  flex: 1;
  padding: 8px;
  border: 1px solid var(--rule-strong);
  border-radius: var(--radius);
  font-size: var(--t-tiny);
  font-weight: 500;
  text-align: center;
  color: var(--ink-2);
  user-select: none;
}

.wc-btn.is-primary {
  border-color: var(--ink);
  background: var(--ink);
  color: var(--canvas);
}

.wc-btn.is-disabled {
  border-style: dashed;
  color: var(--ink-3);
}

/* ----------------------------------------------------------------- list */

.wc-list {
  margin: var(--s2) 0 0;
  padding: 0;
  list-style: none;
}

.wc-list li {
  display: flex;
  gap: var(--s3);
  padding: 5px 0;
  font-size: var(--t-tiny);
  line-height: 1.5;
  color: var(--ink-2);
  text-wrap: pretty;
}

.wc-list li::before {
  flex: none;
  width: 1em;
  font-family: var(--font-mono);
  color: var(--ink-3);
}

.wc-list.is-cannot li::before {
  content: '—';
}

.wc-list.is-can li::before {
  content: '+';
  color: var(--ok);
}

/* ----------------------------------------------------------------- coda */

.wc-coda {
  display: flex;
  flex-direction: column;
  gap: var(--s3);
  margin-top: var(--s7);
  padding-left: var(--s4);
  border-left: 2px solid var(--rule-strong);
}

.wc-coda p {
  margin: 0;
  max-width: 68ch;
  font-size: var(--t-small);
  line-height: 1.6;
  color: var(--ink-2);
  text-wrap: pretty;
}

.wc-coda b {
  font-weight: 500;
  color: var(--ink);
}

.wc-coda code {
  font-family: var(--font-mono);
  font-size: 0.875em;
  padding: 1px 4px;
  border-radius: 2px;
  background: var(--accent-soft);
  color: var(--ink);
}

.wc-coda a {
  color: var(--accent-ui);
  text-decoration: none;
}

.wc-coda a:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
