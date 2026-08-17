/* SIWE wordmark — scanline engine
 *
 * Two canvases, one cell model.
 *
 *   mark   31 x 9,  five lines (rows 0 2 4 6 8). The bare wordmark. Cells that
 *          are not ink are nothing at all.
 *   field  35 x 13, seven lines (rows 0 2 4 6 8 10 12). The same wordmark
 *          translated by (2, 2), inset in a field of lines that run the full
 *          width. Cells that are not ink are field grey — 165 of the 245.
 *
 * Every cell holds one tone: off, field, ink or accent. A state paints a frame
 * buffer that starts each tick as the resting canvas, so a state only describes
 * its difference from the mark, and only changed cells reach the DOM.
 *
 * A state that lights the background writes only where the base is field, so
 * those states are inert on the bare mark rather than wrong on it.
 *
 * Plain script, no modules, so it works straight off the filesystem.
 *
 *   var mark = SIWE.mount(host);                      // bare mark
 *   var big  = SIWE.mount(host, {canvas: 'field'});   // wider canvas
 *   mark.play('pending');
 *   mark.stop().rest();
 */
(function (global) {
  'use strict';

  var OFF = 0, FIELD = 1, INK = 2, ACCENT = 3;
  var TONE_FILL = [null, 'var(--field)', 'var(--ink)', 'var(--accent)'];
  var NS = 'http://www.w3.org/2000/svg';

  /* Wordmark ink per line, [x, width] pairs, read off wordmark.svg */
  var WORDMARK = [
    [[2, 5], [9, 4], [15, 2], [22, 2], [26, 5]],
    [[0, 3], [10, 2], [15, 2], [22, 2], [26, 2]],
    [[1, 5], [10, 2], [15, 2], [22, 2], [26, 4]],
    [[4, 3], [10, 2], [15, 2], [18, 3], [22, 2], [26, 2]],
    [[1, 5], [9, 4], [15, 4], [20, 4], [26, 5]]
  ];

  var prefs = { speed: 1 };
  var reduced = global.matchMedia
    ? global.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function smooth(t) { t = clamp01(t); return t * t * (3 - 2 * t); }

  /* Deterministic noise: the same cell in the same time slice always agrees */
  function hash(a, b) {
    var h = Math.imul(a + 1, 374761393) ^ Math.imul(b + 1, 668265263);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }

  function shift(rows, dx) {
    return rows.map(function (segs) {
      return segs.map(function (seg) { return [seg[0] + dx, seg[1]]; });
    });
  }

  /* ---------------------------------------------------------------- canvas */

  function makeCanvas(spec) {
    var nw = spec.w, nl = spec.lines.length, n = nw * nl;
    var base = new Uint8Array(n);
    var i, x;

    for (i = 0; i < nl; i++) {
      var fill = spec.hasField ? FIELD : OFF;
      for (x = 0; x < nw; x++) base[i * nw + x] = fill;
      var segs = spec.rows[i] || [];
      for (var s = 0; s < segs.length; s++) {
        for (var c = 0; c < segs[s][1]; c++) base[i * nw + segs[s][0] + c] = INK;
      }
    }

    /* Distance from each background cell to the nearest ink cell. A line step
       counts for more than a column step: the lines are two rows apart. */
    var dist = new Float32Array(n);
    var distMax = 0;
    for (i = 0; i < nl; i++) {
      for (x = 0; x < nw; x++) {
        var k = i * nw + x;
        if (base[k] === INK) continue;
        var best = Infinity;
        for (var j = 0; j < nl; j++) {
          for (var y = 0; y < nw; y++) {
            if (base[j * nw + y] !== INK) continue;
            var dx = x - y, dy = (i - j) * 1.8;
            var d = Math.sqrt(dx * dx + dy * dy);
            if (d < best) best = d;
          }
        }
        dist[k] = best;
        if (best > distMax) distMax = best;
      }
    }

    /* Border path, clockwise from the top left */
    var perim = [];
    for (x = 0; x < nw; x++) perim.push(x);
    for (i = 1; i < nl; i++) perim.push(i * nw + nw - 1);
    for (x = nw - 2; x >= 0; x--) perim.push((nl - 1) * nw + x);
    for (i = nl - 2; i >= 1; i--) perim.push(i * nw);

    return {
      name: spec.name, w: nw, h: spec.h, lines: spec.lines,
      nw: nw, nl: nl, n: n, hasField: !!spec.hasField,
      base: base, dist: dist, distMax: distMax, perim: perim
    };
  }

  var CANVASES = {
    mark: makeCanvas({
      name: 'mark', w: 31, h: 9,
      lines: [0, 2, 4, 6, 8],
      rows: WORDMARK,
      hasField: false
    }),
    /* the wordmark translated by (2, 2), with a clear line above and below */
    field: makeCanvas({
      name: 'field', w: 35, h: 13,
      lines: [0, 2, 4, 6, 8, 10, 12],
      rows: [[]].concat(shift(WORDMARK, 2)).concat([[]]),
      hasField: true
    })
  };

  /* ------------------------------------------------------------------ mark */

  function Mark(host, opts) {
    opts = opts || {};
    var cv = CANVASES[opts.canvas || 'mark'];
    if (!cv) throw new Error('unknown canvas: ' + opts.canvas);

    this.cv = cv;
    this.nw = cv.nw;
    this.nl = cv.nl;
    this.n = cv.n;
    this.base = cv.base;

    this.tone = new Uint8Array(cv.n);
    this.alpha = new Float32Array(cv.n);
    this.domFill = new Uint8Array(cv.n);
    this.domAlpha = new Float32Array(cv.n);
    this.cells = new Array(cv.n);

    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + cv.w + ' ' + cv.h);
    svg.setAttribute('shape-rendering', 'crispEdges');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('class', 'mark mark-' + cv.name);
    svg.style.setProperty('--cw', cv.w);
    svg.style.setProperty('--ch', cv.h);

    /* the field canvas reads as a screen, so it carries its own ground */
    var wantBg = opts.background == null ? cv.hasField : opts.background;
    if (wantBg) {
      var bg = document.createElementNS(NS, 'rect');
      bg.setAttribute('width', cv.w);
      bg.setAttribute('height', cv.h);
      bg.setAttribute('class', 'mark-bg');
      svg.appendChild(bg);
    }

    var frag = document.createDocumentFragment();
    for (var i = 0; i < cv.nl; i++) {
      for (var x = 0; x < cv.nw; x++) {
        var k = i * cv.nw + x;
        var tone = cv.base[k];
        var rect = document.createElementNS(NS, 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', cv.lines[i]);
        rect.setAttribute('width', 1);
        rect.setAttribute('height', 1);
        if (tone !== OFF) rect.style.fill = TONE_FILL[tone];
        else rect.style.opacity = 0;
        this.cells[k] = rect;
        this.tone[k] = tone;
        this.alpha[k] = 1;
        this.domFill[k] = tone;
        this.domAlpha[k] = tone === OFF ? 0 : 1;
        frag.appendChild(rect);
      }
    }
    svg.appendChild(frag);
    host.appendChild(svg);

    this.svg = svg;
    this.host = host;
    this.raf = 0;
    this.anim = null;
  }

  Mark.prototype.begin = function () {
    for (var k = 0; k < this.n; k++) {
      this.tone[k] = this.base[k];
      this.alpha[k] = 1;
    }
    return this;
  };

  Mark.prototype.put = function (k, tone, alpha) {
    if (k < 0 || k >= this.n) return;
    this.tone[k] = tone;
    this.alpha[k] = alpha == null ? 1 : alpha;
  };

  Mark.prototype.putAt = function (line, x, tone, alpha) {
    if (line < 0 || line >= this.nl || x < 0 || x >= this.nw) return;
    this.put(line * this.nw + x, tone, alpha);
  };

  /* Light a background cell. Inert where the canvas has no field. */
  Mark.prototype.putField = function (k, tone, alpha) {
    if (this.base[k] !== FIELD) return;
    this.put(k, tone, alpha);
  };

  Mark.prototype.isInk = function (k) { return this.base[k] === INK; };

  Mark.prototype.commit = function () {
    for (var k = 0; k < this.n; k++) {
      var tone = this.tone[k];
      var a = tone === OFF ? 0 : clamp01(this.alpha[k]);
      a = Math.round(a * 50) / 50;
      if (tone !== OFF && this.domFill[k] !== tone) {
        this.cells[k].style.fill = TONE_FILL[tone];
        this.domFill[k] = tone;
      }
      if (this.domAlpha[k] !== a) {
        this.cells[k].style.opacity = a;
        this.domAlpha[k] = a;
      }
    }
    return this;
  };

  Mark.prototype.rest = function () { return this.begin().commit(); };

  /* Signal carried by line i. Field grey is the baseline, not signal. */
  Mark.prototype.level = function (i) {
    var sum = 0, row = i * this.nw;
    for (var x = 0; x < this.nw; x++) {
      var tone = this.tone[row + x];
      if (tone === INK || tone === ACCENT) sum += clamp01(this.alpha[row + x]);
    }
    return sum / this.nw;
  };

  Mark.prototype.stop = function () {
    if (this.raf) global.cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.anim = null;
    return this;
  };

  Mark.prototype.render = function (anim, t, state) {
    this.begin();
    anim.frame(this, t, state);
    this.commit();
  };

  Mark.prototype.play = function (name) {
    var anim = ANIMS[name];
    if (!anim) return Promise.resolve();
    this.stop();

    var self = this;
    var state = anim.init ? anim.init(this) : null;
    this.anim = name;

    /* Reduced motion: hold the end frame instead of running the state */
    if (reduced) {
      this.render(anim, 1, state);
      return Promise.resolve();
    }

    return new Promise(function (resolve) {
      var t0 = 0;
      function step(ts) {
        if (!t0) t0 = ts;
        var t = ((ts - t0) * prefs.speed) / anim.dur;
        if (anim.loop) {
          self.render(anim, t - Math.floor(t), state);
          self.raf = global.requestAnimationFrame(step);
          return;
        }
        if (t >= 1) {
          self.render(anim, 1, state);
          self.raf = 0;
          self.anim = null;
          resolve();
          return;
        }
        self.render(anim, t, state);
        self.raf = global.requestAnimationFrame(step);
      }
      self.raf = global.requestAnimationFrame(step);
    });
  };

  /* ------------------------------------------------------------------ parts */

  /* Shift one line horizontally, carrying whatever each source cell holds */
  function shiftLine(m, i, dx) {
    for (var x = 0; x < m.nw; x++) {
      var src = x - dx;
      var k = i * m.nw + x;
      if (src < 0 || src >= m.nw) { m.put(k, OFF, 0); continue; }
      m.put(k, m.base[i * m.nw + src], 1);
    }
  }

  /* A band crossing the lines: tight leading edge, long trail */
  function bandGain(i, p, lead, trail) {
    var d = i - p;
    return d > 0 ? clamp01(1 - d / lead) : clamp01(1 + d / trail);
  }

  function shuffled(n) {
    var order = [];
    for (var k = 0; k < n; k++) order.push(k);
    for (var i = order.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = order[i]; order[i] = order[j]; order[j] = tmp;
    }
    return order;
  }

  /* -------------------------------------------------------------- the states
   *
   * needsField marks a state that has nothing to say on the bare mark.
   */

  var ANIMS = {

    /* Indeterminate. The mark drops to a low level and only brightens under
       the travelling band. */
    pending: {
      dur: 1500, loop: true,
      frame: function (m, t) {
        var p = t * (m.nl + 3) - 1.5;
        for (var i = 0; i < m.nl; i++) {
          var g = bandGain(i, p, 1.4, 2.8);
          for (var x = 0; x < m.nw; x++) {
            var k = i * m.nw + x;
            if (m.isInk(k)) m.put(k, INK, 0.32 + 0.68 * g);
            else if (g > 0.02) m.putField(k, ACCENT, 0.12 + 0.5 * g);
          }
        }
      }
    },

    /* Signal loss. Lines break off the grid by whole columns, drop out, and
       snap back. */
    tear: {
      dur: 2400, loop: true,
      init: function (m) {
        var slices = [];
        for (var s = 0; s < 8; s++) {
          var row = [];
          for (var i = 0; i < m.nl; i++) {
            row.push({
              dx: Math.round(hash(i, s) * 8) - 4,
              kill: hash(i, s + 100) < 0.14,
              hot: hash(i, s + 200) < 0.22
            });
          }
          slices.push(row);
        }
        return slices;
      },
      frame: function (m, t, slices) {
        if (t < 0.42 || t > 0.66) return;
        var row = slices[Math.min(7, Math.floor(((t - 0.42) / 0.24) * 8))];
        for (var i = 0; i < m.nl; i++) {
          var f = row[i];
          if (f.kill) {
            for (var x = 0; x < m.nw; x++) m.put(i * m.nw + x, OFF, 0);
            continue;
          }
          if (f.dx) shiftLine(m, i, f.dx);
          if (f.hot) {
            for (var x2 = 0; x2 < m.nw; x2++) {
              var k = i * m.nw + x2;
              if (m.tone[k] === FIELD) m.put(k, ACCENT, 0.5);
            }
          }
        }
      }
    },

    /* Cells leave in random order and return along the same path. */
    dissolve: {
      dur: 3400, loop: true,
      init: function (m) {
        return shuffled(m.n).filter(function (k) { return m.base[k] !== OFF; });
      },
      frame: function (m, t, order) {
        var n = order.length, j;
        if (t < 0.4) {
          var gone = Math.floor((t / 0.4) * n);
          for (j = 0; j < gone; j++) m.put(order[j], OFF, 0);
          return;
        }
        if (t < 0.5) {
          for (j = 0; j < n; j++) m.put(order[j], OFF, 0);
          return;
        }
        if (t >= 0.92) return;
        var back = Math.floor(((t - 0.5) / 0.42) * n);
        for (j = back; j < n; j++) m.put(order[j], OFF, 0);
        for (j = Math.max(0, back - 8); j < back; j++) m.put(order[j], ACCENT, 1);
      }
    },
    dissolveOut: {
      dur: 900,
      init: function (m) {
        return shuffled(m.n).filter(function (k) { return m.base[k] !== OFF; });
      },
      frame: function (m, t, order) {
        var gone = Math.floor(t * order.length);
        for (var j = 0; j < gone; j++) m.put(order[j], OFF, 0);
      }
    },

    /* One pass down, leaving the mark lit. */
    confirm: {
      dur: 900,
      frame: function (m, t) {
        var p = t * (m.nl + 2) - 1;
        for (var i = 0; i < m.nl; i++) {
          var g = bandGain(i, p, 1.5, 1.5);
          if (g <= 0.02) continue;
          for (var x = 0; x < m.nw; x++) {
            var k = i * m.nw + x;
            if (m.isInk(k)) { if (g > 0.5) m.put(k, ACCENT, 1); }
            else m.putField(k, ACCENT, 0.25 + 0.75 * g);
          }
        }
      }
    },

    /* A band runs every line. Field brightens, ink inverts to accent. */
    scan: {
      dur: 2600, loop: true,
      frame: function (m, t) {
        var p = t * (m.nl + 3) - 1.5;
        for (var i = 0; i < m.nl; i++) {
          var g = bandGain(i, p, 1.2, 2.6);
          if (g <= 0.02) continue;
          for (var x = 0; x < m.nw; x++) {
            var k = i * m.nw + x;
            if (m.isInk(k)) { if (g > 0.55) m.put(k, ACCENT, 1); }
            else m.putField(k, ACCENT, 0.28 + 0.72 * g);
          }
        }
      }
    },

    /* Accent grows out of the letterforms, fills the negative space, recedes. */
    bloom: {
      dur: 3400, loop: true, needsField: true,
      frame: function (m, t) {
        var wave = t < 0.42 ? smooth(t / 0.42)
          : t < 0.58 ? 1
          : 1 - smooth((t - 0.58) / 0.42);
        var reach = wave * (m.cv.distMax + 0.8);
        for (var k = 0; k < m.n; k++) {
          if (m.isInk(k)) continue;
          var d = m.cv.dist[k];
          if (d > reach) continue;
          m.putField(k, ACCENT, 0.35 + 0.65 * clamp01((reach - d) / 1.2));
        }
      }
    },

    /* Traffic on the lines, at one speed per line, passing behind the mark. */
    run: {
      dur: 3600, loop: true, needsField: true,
      init: function (m) {
        var lanes = [];
        for (var i = 0; i < m.nl; i++) {
          lanes.push({
            speed: 0.55 + hash(i, 3) * 0.95,
            dir: i % 2 ? -1 : 1,
            offsets: [hash(i, 11) * 0.33, hash(i, 29) * 0.33 + 0.33, hash(i, 53) * 0.33 + 0.66]
          });
        }
        return lanes;
      },
      frame: function (m, t, lanes) {
        var span = m.nw + 10;
        for (var i = 0; i < m.nl; i++) {
          var lane = lanes[i];
          for (var r = 0; r < lane.offsets.length; r++) {
            var head = ((t * lane.speed + lane.offsets[r]) % 1) * span - 5;
            for (var j = 0; j < 5; j++) {
              var pos = Math.round(head - j);
              var x = lane.dir > 0 ? pos : m.nw - 1 - pos;
              if (x < 0 || x >= m.nw) continue;
              var k = i * m.nw + x;
              if (m.isInk(k)) continue;          /* the mark occludes traffic */
              m.putField(k, ACCENT, 1 - j * 0.17);
            }
          }
        }
      }
    },

    /* A comet runs the border while the clear lines hold accent. */
    chase: {
      dur: 2600, loop: true, needsField: true,
      frame: function (m, t) {
        for (var x = 0; x < m.nw; x++) {
          m.putField(x, ACCENT, 0.3);
          m.putField((m.nl - 1) * m.nw + x, ACCENT, 0.3);
        }
        var perim = m.cv.perim, n = perim.length;
        var head = t * n;
        for (var j = 0; j < 12; j++) {
          var k = perim[(((Math.floor(head - j)) % n) + n) % n];
          m.putField(k, ACCENT, 1 - j * 0.075);
        }
      }
    },

    /* Appear and disappear: the mark hands its cells to the field and takes
       them back, and the lines never leave. */
    latch: {
      dur: 3600, loop: true, needsField: true,
      init: function (m) {
        var jitter = [];
        for (var i = 0; i < m.nl; i++) jitter.push(hash(i, 41) * 4 - 2);
        return jitter;
      },
      frame: function (m, t, jitter) {
        var out = t < 0.32, back = t >= 0.46 && t < 0.8;
        if (!out && !back) {
          if (t >= 0.32 && t < 0.46) {
            for (var k0 = 0; k0 < m.n; k0++) if (m.isInk(k0)) m.put(k0, FIELD, 1);
          }
          return;
        }
        var p = out ? t / 0.32 : (t - 0.46) / 0.34;
        var edge = p * (m.nw + 5) - 2.5;
        for (var k = 0; k < m.n; k++) {
          if (!m.isInk(k)) continue;
          var i = (k - (k % m.nw)) / m.nw;
          var d = edge + jitter[i] - (k % m.nw);
          if (d < 0) { m.put(k, out ? INK : FIELD, 1); continue; }
          if (d < 1.5) { m.put(k, ACCENT, 1); continue; }
          m.put(k, out ? FIELD : INK, 1);
        }
      }
    },

    /* Interference in the field. The mark holds. */
    noise: {
      dur: 2600, loop: true, needsField: true,
      frame: function (m, t) {
        var slice = Math.floor(t * 32);
        var burst = Math.pow(Math.max(0, Math.sin(t * Math.PI * 4)), 2);
        var density = 0.02 + 0.24 * burst;
        for (var k = 0; k < m.n; k++) {
          var h = hash(k, slice);
          if (m.isInk(k)) {
            if (h < density * 0.3) m.put(k, OFF, 0);
          } else if (h < density) {
            m.putField(k, ACCENT, 0.4 + 0.6 * hash(k, slice + 911));
          }
        }
      }
    },

    /* Lines energize top to bottom, then the ink latches in from the left. */
    powerOn: {
      dur: 1500, needsField: true,
      frame: function (m, t) {
        var lit = t / 0.4;
        for (var i = 0; i < m.nl; i++) {
          var age = lit - i / m.nl;
          for (var x = 0; x < m.nw; x++) {
            var k = i * m.nw + x;
            if (age <= 0) m.put(k, OFF, 0);
            else if (age < 0.12) m.put(k, ACCENT, 1);
            else m.put(k, FIELD, 1);
          }
        }
        if (t <= 0.42) return;
        var edge = clamp01((t - 0.42) / 0.44) * (m.nw + 3) - 1.5;
        for (var k2 = 0; k2 < m.n; k2++) {
          if (!m.isInk(k2)) continue;
          var d = edge - (k2 % m.nw);
          if (d < 0) continue;
          m.put(k2, d < 1.6 ? ACCENT : INK, 1);
        }
      }
    },

    /* Ink hands back to the field, then the lines go dark. */
    powerOff: {
      dur: 1100, needsField: true,
      frame: function (m, t) {
        var edge = (1 - clamp01(t / 0.45)) * (m.nw + 3) - 1.5;
        for (var k = 0; k < m.n; k++) {
          if (!m.isInk(k)) continue;
          var d = (k % m.nw) - edge;
          if (d < 0) continue;
          m.put(k, d < 1.6 ? ACCENT : FIELD, 1);
        }
        if (t <= 0.45) return;
        var dark = clamp01((t - 0.45) / 0.55);
        for (var i = 0; i < m.nl; i++) {
          if (dark * m.nl < m.nl - i) continue;
          for (var x = 0; x < m.nw; x++) m.put(i * m.nw + x, OFF, 0);
        }
      }
    }
  };

  /* ---------------------------------------------------------------- public */

  global.SIWE = {
    CANVASES: CANVASES,
    WORDMARK: WORDMARK,
    ANIMS: ANIMS,
    TONES: { OFF: OFF, FIELD: FIELD, INK: INK, ACCENT: ACCENT },
    /* the parts the states are built out of, so a canvas defined elsewhere can
       write states in the same terms */
    util: {
      clamp01: clamp01, smooth: smooth, hash: hash,
      bandGain: bandGain, shuffled: shuffled, shiftLine: shiftLine
    },
    prefs: prefs,
    reducedMotion: reduced,
    /* Register another canvas — same cell model, other geometry. See icon.js. */
    defineCanvas: function (spec) {
      var cv = makeCanvas(spec);
      CANVASES[cv.name] = cv;
      return cv;
    },
    mount: function (host, opts) { return new Mark(host, opts); }
  };
})(window);
