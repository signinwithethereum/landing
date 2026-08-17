/* Loader for the vendored mark engine.
 *
 * `scanlines.js` and `icon.js` are copied byte-for-byte from the brand repo
 * (signinwithethereum/brand-experiments) so the two cannot drift. They are
 * plain scripts that attach to `window`, so they are imported dynamically and
 * only ever on the client. */

export type MarkCanvas = 'mark' | 'field' | 'icon' | 'iconE' | 'iconDiamond'

export type MarkState =
  // either canvas
  | 'pending'
  | 'tear'
  | 'dissolve'
  | 'scan'
  | 'confirm'
  | 'dissolveOut'
  // field canvas only
  | 'bloom'
  | 'run'
  | 'chase'
  | 'latch'
  | 'noise'
  | 'powerOn'
  | 'powerOff'
  // icon canvases only
  | 'morph'
  | 'cycle'
  | 'bars'
  | 'spin'
  | 'trace'
  | 'sign'
  | 'unsign'

export interface Mark {
  svg: SVGSVGElement
  nl: number
  nw: number
  n: number
  play(state: MarkState): Promise<void>
  stop(): Mark
  rest(): Mark
  level(line: number): number
}

export interface MarkEngine {
  mount(host: HTMLElement, opts?: { canvas?: MarkCanvas; background?: boolean }): Mark
  prefs: { speed: number }
  reducedMotion: boolean
  ANIMS: Record<string, { loop?: boolean; needsField?: boolean; needsIcon?: boolean }>
}

let engine: Promise<MarkEngine> | null = null

export function loadMarkEngine(): Promise<MarkEngine> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('the mark engine is client-only'))
  }
  if (!engine) {
    engine = (async () => {
      await import('./scanlines.js')
      await import('./icon.js')
      return (window as unknown as { SIWE: MarkEngine }).SIWE
    })()
  }
  return engine
}
