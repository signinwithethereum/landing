/* Publish the device pixel ratio to CSS.
 *
 * The mark draws in whole cells, and its bars are pills, so it is rasterised
 * smooth rather than snapped to the pixel grid. A cell that is not a whole
 * number of device pixels then lands its edges and its caps mid-pixel, and the
 * mark goes soft. On a fractional ratio (1.8125 is a real one, a scaled
 * display) a 1.5px cell is 2.72 device pixels, and the five lines that are
 * equal by construction pick up visibly different weights.
 *
 * CSS cannot read the ratio, so it is handed one, and `Mark.vue` rounds each
 * cell to the nearest whole device pixel before drawing. The ratio changes when
 * the window moves to another display or the page is zoomed; a media query
 * pinned to the current value is the way to hear about it, so the listener is
 * rebuilt around each new reading. */

export function trackDevicePixelRatio(): void {
  if (typeof window === 'undefined') return

  let media: MediaQueryList | null = null

  function read() {
    const dpr = window.devicePixelRatio || 1
    document.documentElement.style.setProperty('--dpr', String(dpr))
    media?.removeEventListener('change', read)
    media = window.matchMedia(`(resolution: ${dpr}dppx)`)
    media.addEventListener('change', read)
  }

  read()
}
