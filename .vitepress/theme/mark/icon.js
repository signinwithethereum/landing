/* SIWE icon — one glyph, three forms
 *
 * Load after scanlines.js. Registers three canvases and the states that move
 * between them; the engine and the wordmark are untouched.
 *
 * The icon is 7 x 9 — the S's own box, on the wordmark's five lines. It has
 * three readings, and every one of them is exactly one segment per line:
 *
 *   s        [2,5] [0,3] [1,5] [4,3] [1,5]   the wordmark's first glyph
 *   e        [1,6] [3,2] [1,6] [3,2] [1,6]   three bars and a stem
 *   diamond  [3,2] [2,4] [1,6] [2,4] [3,2]
 *
 * One segment per line is what makes the morph possible: a form reaches
 * another by moving two edges per line, so the icon travels between readings
 * instead of cutting between them. The six-wide ETH forms sit one column in,
 * which puts all of them on the same axis and flush with the S's top arm.
 *
 *   var icon = SIWE.mount(host, {canvas: 'icon'});
 *   icon.play('morph');
 */
(function (global) {
  'use strict';

  var SIWE = global.SIWE;
  if (!SIWE) throw new Error('icon.js needs scanlines.js');

  var T = SIWE.TONES;
  var u = SIWE.util;

  var W = 7;
  var LINES = [0, 2, 4, 6, 8];
  var AXIS = W / 2;

  /* an ETH form: even widths, all on one axis, one column in from the left */
  function eth(widths) {
    return widths.map(function (w) { return [Math.round((W - w) / 2), w]; });
  }

  var FORMS = {
    /* the S, read straight off the wordmark's first glyph */
    s: SIWE.WORDMARK.map(function (segs) { return segs[0].slice(); }),
    e: eth([6, 2, 6, 2, 6]),
    diamond: eth([2, 4, 6, 4, 2])
  };

  var NAMES = ['s', 'e', 'diamond'];

  function define(name, form) {
    var cv = SIWE.defineCanvas({
      name: name, w: W, h: 9, lines: LINES,
      rows: FORMS[form].map(function (seg) { return [seg.slice()]; })
    });
    cv.icon = { forms: FORMS, names: NAMES, rest: form, axis: AXIS };
    return cv;
  }

  define('icon', 's');
  define('iconE', 'e');
  define('iconDiamond', 'diamond');

  /* ------------------------------------------------------------------ parts */

  function rest(m) { return FORMS[m.cv.icon.rest]; }

  /* Draw one form. Clears every line first, so a state describes the form it
     wants rather than the difference from the resting one.

     The icon is ink only — no accent. Everything these states have to say they
     say with geometry and level, which is also what survives at 7 px wide. */
  function putForm(m, segs, o) {
    o = o || {};
    var alpha = o.alpha == null ? 1 : o.alpha;
    for (var i = 0; i < m.nl; i++) {
      for (var x = 0; x < m.nw; x++) m.putAt(i, x, T.OFF, 0);
      var seg = segs[i];
      var w = seg[1];
      if (w <= 0) continue;
      var a = typeof alpha === 'function' ? alpha(i) : alpha;
      for (var c = 0; c < w; c++) m.putAt(i, seg[0] + c, T.INK, a);
    }
  }

  /* One segment part way between two, by its edges. Both edges travel, so a
     line that grows on one side and holds on the other reads as growth. */
  function between(a, b, e) {
    var s = Math.round(a[0] + (b[0] - a[0]) * e);
    var f = Math.round((a[0] + a[1]) + ((b[0] + b[1]) - (a[0] + a[1])) * e);
    return [s, Math.max(0, f - s)];
  }

  /* A whole form part way to another, with a per-line offset so the lines
     don't all arrive together */
  function morphTo(from, to, e, offs) {
    return from.map(function (seg, i) {
      var line = offs ? u.clamp01((e - offs[i]) / (1 - 0.34)) : e;
      return between(seg, to[i], u.smooth(line));
    });
  }

  /* Outline of a form, clockwise from its top left cell */
  function ring(m, segs) {
    var out = [], i, x, last = m.nl - 1;
    for (x = segs[0][0]; x < segs[0][0] + segs[0][1]; x++) out.push(x);
    for (i = 1; i < last; i++) out.push(i * m.nw + segs[i][0] + segs[i][1] - 1);
    for (x = segs[last][0] + segs[last][1] - 1; x >= segs[last][0]; x--) {
      out.push(last * m.nw + x);
    }
    for (i = last - 1; i > 0; i--) out.push(i * m.nw + segs[i][0]);
    return out;
  }

  /* -------------------------------------------------------------- the states
   *
   * needsIcon marks a state that has nothing to say on a canvas without the
   * three forms — the wordmark canvases, where these are inert.
   */

  /* Generative. It picks the next form, how long to travel and how long to
     hold, and staggers the five lines, so no two passes are alike. The last
     step always returns to the resting form, so the loop closes on itself. */
  SIWE.ANIMS.morph = {
    dur: 15000, loop: true, needsIcon: true,
    init: function (m) {
      if (!m.cv.icon) return null;
      var seed = Math.floor(Math.random() * 65536);
      var home = m.cv.icon.rest;
      var cur = home, steps = [], total = 0, k, i;

      for (k = 0; k < 6; k++) {
        var options = NAMES.filter(function (n) { return n !== cur; });
        var to = options[u.hash(seed + k, 1) < 0.5 ? 0 : 1];
        var offs = [];
        for (i = 0; i < m.nl; i++) offs.push(u.hash(seed + k, 10 + i) * 0.34);
        steps.push({
          from: cur, to: to, offs: offs,
          travel: 0.7 + u.hash(seed + k, 2) * 0.7,
          hold: 0.45 + u.hash(seed + k, 3) * 1.4
        });
        cur = to;
      }
      if (cur !== home) {
        var back = [];
        for (i = 0; i < m.nl; i++) back.push(u.hash(seed, 90 + i) * 0.34);
        steps.push({ from: cur, to: home, offs: back, travel: 0.9, hold: 1.1 });
      }

      var acc = 0;
      steps.forEach(function (s) { total += s.travel + s.hold; });
      steps.forEach(function (s) {
        s.t0 = acc / total; acc += s.travel;
        s.t1 = acc / total; acc += s.hold;
        s.t2 = acc / total;
      });
      return steps;
    },
    frame: function (m, t, steps) {
      if (!steps) return;
      var step = steps[steps.length - 1], i;
      for (i = 0; i < steps.length; i++) {
        if (t < steps[i].t2) { step = steps[i]; break; }
      }
      var e = u.clamp01((t - step.t0) / (step.t1 - step.t0));
      putForm(m, morphTo(FORMS[step.from], FORMS[step.to], e, step.offs));
    }
  };

  /* The same three forms, in order, evenly, with the lines in step. The one to
     read the transitions off. */
  SIWE.ANIMS.cycle = {
    dur: 5400, loop: true, needsIcon: true,
    init: function (m) {
      if (!m.cv.icon) return null;
      var home = m.cv.icon.rest;
      var order = [home].concat(NAMES.filter(function (n) { return n !== home; }));
      return order.concat([home]);
    },
    frame: function (m, t, order) {
      if (!order) return;
      var span = 1 / (order.length - 1);
      var step = Math.min(order.length - 2, Math.floor(t / span));
      var local = (t - step * span) / span;
      var e = u.clamp01((local - 0.18) / 0.62);
      putForm(m, morphTo(FORMS[order[step]], FORMS[order[step + 1]], e));
    }
  };

  /* Three lines. The in-between lines retract and come back, so the glyph is
     bare scanlines for a beat without going anywhere. */
  SIWE.ANIMS.bars = {
    dur: 2600, loop: true, needsIcon: true,
    frame: function (m, t) {
      if (!m.cv.icon) return;
      var e = t < 0.26 ? u.smooth(t / 0.26)
        : t < 0.58 ? 1
        : t < 0.84 ? 1 - u.smooth((t - 0.58) / 0.26)
        : 0;
      var segs = rest(m).map(function (seg, i) {
        if (!(i % 2)) return seg;
        var mid = seg[0] + seg[1] / 2;
        var half = (seg[1] / 2) * (1 - e);
        var s = Math.round(mid - half);
        return [s, Math.max(0, Math.round(mid + half) - s)];
      });
      putForm(m, segs);
    }
  };

  /* The glyph turns on the box axis: every line compresses toward x 3.5 down
     to a single column, then opens again. Edge on it dims, the way a turning
     surface does. */
  SIWE.ANIMS.spin = {
    dur: 3400, loop: true, needsIcon: true,
    frame: function (m, t) {
      if (!m.cv.icon) return;
      var c = Math.abs(Math.cos(t * Math.PI * 2));
      var axis = m.cv.icon.axis;
      var segs = rest(m).map(function (seg) {
        var s = Math.round(axis + (seg[0] - axis) * c);
        var f = Math.round(axis + (seg[0] + seg[1] - axis) * c);
        return [s, Math.max(1, f - s)];
      });
      putForm(m, segs, { alpha: 0.45 + 0.55 * c });
    }
  };

  /* A head runs the outline. Nothing moves; the form is traced by level. */
  SIWE.ANIMS.trace = {
    dur: 2400, loop: true, needsIcon: true,
    init: function (m) { return m.cv.icon ? ring(m, rest(m)) : null; },
    frame: function (m, t, path) {
      if (!path) return;
      putForm(m, rest(m), { alpha: 0.3 });
      var n = path.length;
      var head = t * n;
      for (var j = 0; j < 5; j++) {
        var k = path[(((Math.floor(head - j)) % n) + n) % n];
        m.put(k, T.INK, 1 - j * 0.14);
      }
    }
  };

  /* Signed in. One pass down while the glyph travels to the diamond, and it
     stays there — the icon holds a different reading than it started with. The
     band is the only thing at full level until it has passed. */
  SIWE.ANIMS.sign = {
    dur: 1400, needsIcon: true,
    frame: function (m, t) {
      if (!m.cv.icon) return;
      var e = u.smooth(u.clamp01(t / 0.66));
      var p = u.clamp01(t / 0.78) * (m.nl + 2) - 1;
      var lit = t >= 0.78;
      putForm(m, morphTo(rest(m), FORMS.diamond, e), {
        alpha: function (i) {
          return lit ? 1 : 0.4 + 0.6 * u.bandGain(i, p, 1.4, 2.2);
        }
      });
    }
  };

  /* Signed out. The diamond travels back to the resting form and dims. */
  SIWE.ANIMS.unsign = {
    dur: 1000, needsIcon: true,
    frame: function (m, t) {
      if (!m.cv.icon) return;
      var e = u.smooth(u.clamp01(t / 0.72));
      putForm(m, morphTo(FORMS.diamond, rest(m), e), {
        alpha: t > 0.5 ? 1 - 0.5 * u.smooth((t - 0.5) / 0.5) : 1
      });
    }
  };

  SIWE.ICON = {
    W: W, LINES: LINES, FORMS: FORMS, NAMES: NAMES,
    putForm: putForm, between: between, morphTo: morphTo, ring: ring
  };
})(window);
