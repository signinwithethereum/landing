<script setup lang="ts">
/* Message validator.
 *
 * Paste an ERC-4361 message, get back everything wrong with it. Runs entirely
 * in the page — the message never leaves the browser, which matters because
 * real messages carry real addresses and real nonces.
 *
 * The engine is the linter that shipped on docs.siwe.xyz, moved across
 * unchanged; only this interface is new. */

import { computed, ref, watch } from 'vue'
import {
  AutoFixer,
  SiweMessageParser,
  ValidationEngine,
  type ValidationError,
  type ValidationResult
} from '../lib/siwe'
import { freshMessage } from '../lib/example'

const BROKEN = `example.com wants you to sign in with your ethereum account:
0x742d35cc6c4c1ca5d428d9ee0e9b1e1234567890
Sign in.
URI: example.com
Version: 2
Chain ID: 1
Nonce: 1234
Issued At: 17/08/2026`

const input = ref('')
const strict = ref(true)
const result = ref<ValidationResult | null>(null)

/* Debounced so typing does not run the whole rule set on every keystroke. */
let timer: ReturnType<typeof setTimeout> | undefined
watch([input, strict], () => {
  clearTimeout(timer)
  if (!input.value.trim()) {
    result.value = null
    return
  }
  timer = setTimeout(run, 180)
})

function run() {
  result.value = ValidationEngine.validate(input.value, {
    profile: strict.value ? ValidationEngine.PROFILES.strict : ValidationEngine.PROFILES.basic
  })
}

const parsed = computed(() => (input.value.trim() ? SiweMessageParser.parse(input.value) : null))

const fields = computed(() => {
  const f = parsed.value?.fields
  if (!f) return []
  return Object.entries(f)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => ({ key: k, value: Array.isArray(v) ? v.join(', ') : String(v) }))
})

const groups = computed(() => {
  const r = result.value
  if (!r) return []
  return [
    { key: 'error', label: 'Errors', items: r.errors },
    { key: 'warning', label: 'Warnings', items: r.warnings as ValidationError[] },
    { key: 'info', label: 'Suggestions', items: r.suggestions as ValidationError[] }
  ].filter((g) => g.items.length)
})

const fixable = computed(
  () =>
    !!result.value &&
    [...result.value.errors, ...result.value.warnings, ...result.value.suggestions].some(
      (e) => e.fixable
    )
)

const verdict = computed(() => {
  const r = result.value
  if (!r) return null
  if (r.errors.length) return { tone: 'bad', text: `${r.errors.length} error${r.errors.length > 1 ? 's' : ''}` }
  if (r.warnings.length) return { tone: 'warn', text: `Valid, with ${r.warnings.length} warning${r.warnings.length > 1 ? 's' : ''}` }
  return { tone: 'ok', text: 'Valid ERC-4361 message' }
})

/* Lines carrying an issue, for the gutter marks. */
const flagged = computed(() => {
  const r = result.value
  if (!r) return new Map<number, string>()
  const map = new Map<number, string>()
  const rank: Record<string, number> = { info: 0, warning: 1, error: 2 }
  for (const e of [...r.suggestions, ...r.warnings, ...r.errors] as ValidationError[]) {
    const prev = map.get(e.line)
    if (!prev || rank[e.severity] > rank[prev]) map.set(e.line, e.severity)
  }
  return map
})

function fix() {
  if (!parsed.value || !result.value) return
  const all = [...result.value.errors, ...result.value.warnings, ...result.value.suggestions]
  const out = AutoFixer.fixMessage(parsed.value, all as ValidationError[])
  if (out.fixed) input.value = out.message
}

function loadExample() {
  input.value = freshMessage()
}

function loadBroken() {
  input.value = BROKEN
}

function clear() {
  input.value = ''
}
</script>

<template>
  <div class="val">
    <div class="val-bar">
      <div class="val-samples">
        <button type="button" @click="loadExample">Load a good message</button>
        <button type="button" @click="loadBroken">Load a broken one</button>
        <button v-if="input" type="button" @click="clear">Clear</button>
      </div>
      <label class="val-strict">
        <input v-model="strict" type="checkbox" />
        <span>Strict: include security and best-practice checks</span>
      </label>
    </div>

    <div class="val-grid">
      <div class="val-editor">
        <label class="t-label" for="val-input">Message</label>
        <div class="val-input-wrap">
          <div class="val-gutter" aria-hidden="true">
            <span
              v-for="(_, i) in input.split('\n')"
              :key="i"
              :class="flagged.get(i + 1) ? `is-${flagged.get(i + 1)}` : ''"
            >{{ i + 1 }}</span>
          </div>
          <textarea
            id="val-input"
            v-model="input"
            spellcheck="false"
            autocapitalize="off"
            autocomplete="off"
            rows="14"
            placeholder="Paste an ERC-4361 message here. Nothing is sent anywhere."
          />
        </div>

        <p v-if="fields.length" class="val-fields">
          <span class="t-label">Parsed</span>
          <span v-for="f in fields" :key="f.key" class="val-field">
            <b>{{ f.key }}</b><i>{{ f.value }}</i>
          </span>
        </p>
      </div>

      <div class="val-results">
        <div v-if="!result" class="val-idle">
          <p class="t-label">Result</p>
          <p>Paste a message, or load one of the samples above.</p>
        </div>

        <template v-else>
          <p class="val-verdict" :class="`is-${verdict!.tone}`">
            {{ verdict!.text }}
          </p>

          <p v-if="fixable" class="val-fixrow">
            <button type="button" class="btn btn-ghost btn-mono" @click="fix">
              Fix what can be fixed
            </button>
          </p>

          <div v-for="g in groups" :key="g.key" class="val-group">
            <p class="t-label">{{ g.label }}</p>
            <ul>
              <li v-for="(e, i) in g.items" :key="g.key + i" :class="`is-${e.severity}`">
                <p class="val-issue">
                  <span class="val-loc">{{ e.line }}:{{ e.column }}</span>
                  <span class="val-msg">{{ e.message }}</span>
                </p>
                <p v-if="e.suggestion" class="val-sugg">{{ e.suggestion }}</p>
                <p class="val-meta">
                  <span>{{ e.field }}</span>
                  <span>{{ e.type }}</span>
                  <code>{{ e.code }}</code>
                </p>
              </li>
            </ul>
          </div>

          <p v-if="!groups.length" class="val-clean">
            Every field parses, every value is well formed, and nothing here would
            weaken the sign-in.
          </p>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.val {
  margin-top: var(--s5);
}

/* ------------------------------------------------------------------ bar */

.val-bar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s4);
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--s4);
  border-bottom: 1px solid var(--rule);
}

.val-samples {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s2);
}

.val-samples button {
  height: 30px;
  padding-inline: var(--s3);
  border: 1px solid var(--rule);
  border-radius: var(--radius);
  background: transparent;
  color: var(--ink-2);
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
  cursor: pointer;
  transition: border-color 0.15s var(--ease), color 0.15s var(--ease);
}

.val-samples button:hover {
  border-color: var(--ink);
  color: var(--ink);
}

.val-strict {
  display: flex;
  gap: var(--s2);
  align-items: center;
  font-size: var(--t-tiny);
  color: var(--ink-2);
  cursor: pointer;
}

.val-strict input {
  accent-color: var(--accent);
}

/* ----------------------------------------------------------------- grid */

.val-grid {
  display: grid;
  gap: var(--s6);
  margin-top: var(--s5);
  align-items: start;
}

@media (min-width: 1000px) {
  .val-grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: var(--s7);
  }
}

/* --------------------------------------------------------------- editor */

.val-editor > .t-label {
  display: block;
  margin-bottom: var(--s2);
}

.val-input-wrap {
  display: flex;
  border: 1px solid var(--rule);
  border-radius: var(--radius);
  background: var(--canvas-2);
  overflow: hidden;
}

.val-input-wrap:focus-within {
  border-color: var(--rule-strong);
}

.val-gutter {
  display: flex;
  flex-direction: column;
  flex: none;
  padding: var(--s4) var(--s2) var(--s4) var(--s3);
  border-right: 1px solid var(--rule);
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
  line-height: 1.75;
  text-align: right;
  color: var(--ink-3);
  user-select: none;
}

.val-gutter span {
  position: relative;
  min-width: 1.5em;
}

.val-gutter span.is-error {
  color: var(--danger);
  font-weight: 500;
}

.val-gutter span.is-warning {
  color: var(--warn);
}

.val-gutter span.is-info {
  color: var(--accent-ui);
}

.val-input-wrap textarea {
  flex: 1;
  min-width: 0;
  padding: var(--s4);
  border: 0;
  background: transparent;
  color: var(--ink);
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
  line-height: 1.75;
  resize: vertical;
  white-space: pre;
  overflow-wrap: normal;
  overflow-x: auto;
}

.val-input-wrap textarea:focus {
  outline: none;
}

.val-input-wrap textarea::placeholder {
  color: var(--ink-3);
  white-space: pre-wrap;
}

/* --------------------------------------------------------------- parsed */

.val-fields {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s2) var(--s4);
  align-items: baseline;
  margin: var(--s4) 0 0;
}

.val-field {
  display: inline-flex;
  gap: 0.5em;
  align-items: baseline;
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
  max-width: 100%;
}

.val-field b {
  font-weight: 500;
  color: var(--ink-3);
}

.val-field i {
  font-style: normal;
  color: var(--ink);
  overflow-wrap: anywhere;
}

/* -------------------------------------------------------------- results */

.val-idle p:last-child {
  margin: var(--s2) 0 0;
  font-size: var(--t-small);
  color: var(--ink-2);
}

.val-verdict {
  margin: 0;
  padding: var(--s3) var(--s4);
  border: 1px solid var(--rule);
  border-left-width: 2px;
  border-radius: var(--radius);
  font-family: var(--font-mono);
  font-size: var(--t-tiny);
}

.val-verdict.is-ok {
  border-left-color: var(--ok);
  color: var(--ok);
}

.val-verdict.is-warn {
  border-left-color: var(--warn);
  color: var(--warn);
}

.val-verdict.is-bad {
  border-left-color: var(--danger);
  color: var(--danger);
}

.val-fixrow {
  margin: var(--s3) 0 0;
}

.val-group {
  margin-top: var(--s5);
}

.val-group ul {
  margin: var(--s3) 0 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--rule);
}

.val-group li {
  padding: var(--s3) 0 var(--s3) var(--s3);
  border-bottom: 1px solid var(--rule);
  border-left: 2px solid transparent;
}

.val-group li.is-error {
  border-left-color: var(--danger);
}

.val-group li.is-warning {
  border-left-color: var(--warn);
}

.val-group li.is-info {
  border-left-color: var(--accent-line);
}

.val-issue {
  display: flex;
  gap: var(--s3);
  margin: 0;
  align-items: baseline;
}

.val-loc {
  flex: none;
  font-family: var(--font-mono);
  font-size: var(--t-label);
  color: var(--ink-3);
}

.val-msg {
  font-size: var(--t-small);
  line-height: 1.5;
  color: var(--ink);
  text-wrap: pretty;
}

.val-sugg {
  margin: 4px 0 0 calc(var(--s3) + 2.5em);
  font-size: var(--t-tiny);
  line-height: 1.5;
  color: var(--ink-2);
}

.val-meta {
  display: flex;
  gap: var(--s3);
  margin: 6px 0 0 calc(var(--s3) + 2.5em);
  font-family: var(--font-mono);
  font-size: var(--t-label);
  letter-spacing: 0.04em;
  color: var(--ink-3);
}

.val-meta code {
  padding: 0;
  background: none;
  font-size: inherit;
  color: inherit;
}

.val-clean {
  margin: var(--s4) 0 0;
  font-size: var(--t-small);
  line-height: 1.6;
  color: var(--ink-2);
}
</style>
