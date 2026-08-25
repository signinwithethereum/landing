/* Publish the device pixel ratio to CSS.
 *
 * The mark draws in whole cells and renders with `shape-rendering: crispEdges`,
 * which snaps every edge to a device pixel. That is what keeps it looking like
 * a grid rather than a blurred one — but it only works if a cell *is* a whole
 * number of device pixels. On a fractional ratio (1.8125 is a real one, a
 * scaled display) a 1.5px cell is 2.72 device pixels, so the rasteriser rounds
 * some of the mark's lines to three and others to two, and five lines that are
 * equal by construction come out at visibly different weights.
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
