/**
 * Generates assets/animations/ink-trap-splash.json
 * Ink drops converge, stroop color bar flips, timer shrinks — Stroop trap motif.
 */
const fs = require('fs');
const path = require('path');

const W = 400;
const H = 400;
const FR = 30;
const DURATION = 90;

const C = {
  bg: [15 / 255, 15 / 255, 20 / 255, 1],
  accent: [124 / 255, 77 / 255, 1, 1],
  red: [229 / 255, 57 / 255, 53 / 255, 1],
  blue: [30 / 255, 136 / 255, 229 / 255, 1],
  green: [67 / 255, 160 / 255, 71 / 255, 1],
  yellow: [253 / 255, 216 / 255, 53 / 255, 1],
  track: [42 / 255, 42 / 255, 56 / 255, 1],
};

function solid(name, color, opacity = 100) {
  return {
    ty: 'fl',
    nm: name,
    c: {a: 0, k: color},
    o: {a: 0, k: opacity},
    r: 1,
  };
}

function ellipse(size, fill) {
  return {
    ty: 'gr',
    nm: 'drop',
    it: [
      {
        ty: 'el',
        p: {a: 0, k: [0, 0]},
        s: {a: 0, k: [size, size]},
      },
      fill,
      {
        ty: 'tr',
        p: {a: 0, k: [0, 0]},
        a: {a: 0, k: [0, 0]},
        s: {a: 0, k: [100, 100]},
        r: {a: 0, k: 0},
        o: {a: 0, k: 100},
      },
    ],
  };
}

function rect(w, h, fill, radius = 0) {
  return {
    ty: 'gr',
    nm: 'rect',
    it: [
      {
        ty: 'rc',
        p: {a: 0, k: [0, 0]},
        s: {a: 0, k: [w, h]},
        r: {a: 0, k: radius},
      },
      fill,
      {
        ty: 'tr',
        p: {a: 0, k: [0, 0]},
        a: {a: 0, k: [0, 0]},
        s: {a: 0, k: [100, 100]},
        r: {a: 0, k: 0},
        o: {a: 0, k: 100},
      },
    ],
  };
}

function moveLayer(name, shapes, position, scaleKeyframes) {
  return {
    ddd: 0,
    ind: Math.floor(Math.random() * 10000),
    ty: 4,
    nm: name,
    sr: 1,
    ks: {
      o: {a: 0, k: 100},
      r: {a: 0, k: 0},
      p: {a: 0, k: position},
      a: {a: 0, k: [0, 0]},
      s: scaleKeyframes || {a: 0, k: [100, 100]},
    },
    ao: 0,
    shapes,
    ip: 0,
    op: DURATION,
    st: 0,
    bm: 0,
  };
}

function dropLayer(name, color, from, to, delay) {
  const start = delay;
  const end = delay + 24;
  return {
    ddd: 0,
    ty: 4,
    nm: name,
    sr: 1,
    ks: {
      o: {
        a: 1,
        k: [
          {t: start, s: [0], i: {x: [0.4], y: [1]}, o: {x: [0.6], y: [0]}},
          {t: start + 8, s: [100]},
        ],
      },
      r: {a: 0, k: 0},
      p: {
        a: 1,
        k: [
          {t: start, s: from, i: {x: [0.2], y: [1]}, o: {x: [0.8], y: [0]}},
          {t: end, s: to},
        ],
      },
      a: {a: 0, k: [0, 0]},
      s: {
        a: 1,
        k: [
          {t: start, s: [40, 40], i: {x: [0.4], y: [1]}, o: {x: [0.6], y: [0]}},
          {t: end, s: [100, 100]},
          {
            t: end + 20,
            s: [110, 110],
            i: {x: [0.4], y: [1]},
            o: {x: [0.6], y: [0]},
          },
          {t: DURATION, s: [100, 100]},
        ],
      },
    },
    ao: 0,
    shapes: [ellipse(36, solid('fill', color))],
    ip: 0,
    op: DURATION,
    st: 0,
    bm: 0,
  };
}

const layers = [
  moveLayer('Background', [rect(W, H, solid('bg', C.bg))], [W / 2, H / 2]),
  {
    ddd: 0,
    ty: 4,
    nm: 'Glow Ring',
    sr: 1,
    ks: {
      o: {
        a: 1,
        k: [
          {t: 12, s: [0], i: {x: [0.4], y: [1]}, o: {x: [0.6], y: [0]}},
          {t: 28, s: [55]},
          {t: 60, s: [40]},
          {t: DURATION, s: [0]},
        ],
      },
      r: {a: 0, k: 0},
      p: {a: 0, k: [200, 175]},
      a: {a: 0, k: [0, 0]},
      s: {
        a: 1,
        k: [
          {t: 12, s: [70, 70], i: {x: [0.4], y: [1]}, o: {x: [0.6], y: [0]}},
          {t: 40, s: [115, 115]},
          {t: DURATION, s: [130, 130]},
        ],
      },
    },
    ao: 0,
    shapes: [
      {
        ty: 'gr',
        it: [
          {
            ty: 'el',
            p: {a: 0, k: [0, 0]},
            s: {a: 0, k: [160, 160]},
          },
          {
            ty: 'st',
            c: {a: 0, k: C.accent},
            o: {a: 0, k: 100},
            w: {a: 0, k: 6},
          },
          {ty: 'tr', p: {a: 0, k: [0, 0]}, a: {a: 0, k: [0, 0]}, s: {a: 0, k: [100, 100]}, r: {a: 0, k: 0}, o: {a: 0, k: 100}},
        ],
      },
    ],
    ip: 0,
    op: DURATION,
    st: 0,
    bm: 0,
  },
  dropLayer('Red Drop', C.red, [-20, 60], [130, 150], 0),
  dropLayer('Blue Drop', C.blue, [420, 60], [270, 150], 4),
  dropLayer('Green Drop', C.green, [-20, 290], [130, 210], 8),
  dropLayer('Yellow Drop', C.yellow, [420, 290], [270, 210], 12),
  {
    ddd: 0,
    ty: 4,
    nm: 'Stroop Bar',
    sr: 1,
    ks: {
      o: {
        a: 1,
        k: [
          {t: 30, s: [0], i: {x: [0.4], y: [1]}, o: {x: [0.6], y: [0]}},
          {t: 42, s: [100]},
        ],
      },
      r: {a: 0, k: 0},
      p: {a: 0, k: [200, 178]},
      a: {a: 0, k: [0, 0]},
      s: {
        a: 1,
        k: [
          {t: 30, s: [60, 60], i: {x: [0.4], y: [1]}, o: {x: [0.6], y: [0]}},
          {t: 42, s: [100, 100]},
        ],
      },
    },
    ao: 0,
    shapes: [
      rect(120, 28, solid('track', C.track), 8),
      {
        ty: 'gr',
        it: [
          {
            ty: 'rc',
            p: {a: 0, k: [0, 0]},
            s: {a: 0, k: [100, 20]},
            r: {a: 0, k: 6},
          },
          {
            ty: 'fl',
            c: {
              a: 1,
              k: [
                {t: 42, s: C.blue},
                {t: 54, s: C.red},
                {t: 66, s: C.green},
                {t: 78, s: C.yellow},
                {t: DURATION, s: C.blue},
              ],
            },
            o: {a: 0, k: 100},
            r: 1,
          },
          {ty: 'tr', p: {a: 0, k: [0, 0]}, a: {a: 0, k: [0, 0]}, s: {a: 0, k: [100, 100]}, r: {a: 0, k: 0}, o: {a: 0, k: 100}},
        ],
      },
    ],
    ip: 0,
    op: DURATION,
    st: 0,
    bm: 0,
  },
  {
    ddd: 0,
    ty: 4,
    nm: 'Timer Track',
    sr: 1,
    ks: {
      o: {
        a: 1,
        k: [
          {t: 36, s: [0], i: {x: [0.4], y: [1]}, o: {x: [0.6], y: [0]}},
          {t: 48, s: [100]},
        ],
      },
      r: {a: 0, k: 0},
      p: {a: 0, k: [200, 248]},
      a: {a: 0, k: [0, 0]},
      s: {a: 0, k: [100, 100]},
    },
    ao: 0,
    shapes: [rect(200, 10, solid('track', C.track), 5)],
    ip: 0,
    op: DURATION,
    st: 0,
    bm: 0,
  },
  {
    ddd: 0,
    ty: 4,
    nm: 'Timer Fill',
    sr: 1,
    ks: {
      o: {
        a: 1,
        k: [
          {t: 36, s: [0], i: {x: [0.4], y: [1]}, o: {x: [0.6], y: [0]}},
          {t: 48, s: [100]},
        ],
      },
      r: {a: 0, k: 0},
      p: {a: 0, k: [102, 248]},
      a: {a: 0, k: [-98, 0]},
      s: {
        a: 1,
        k: [
          {t: 48, s: [100, 100], i: {x: [0.4], y: [1]}, o: {x: [0.6], y: [0]}},
          {t: DURATION, s: [8, 100]},
        ],
      },
    },
    ao: 0,
    shapes: [rect(196, 10, solid('fill', C.accent), 5)],
    ip: 0,
    op: DURATION,
    st: 0,
    bm: 0,
  },
];

const lottie = {
  v: '5.7.4',
  fr: FR,
  ip: 0,
  op: DURATION,
  w: W,
  h: H,
  nm: 'Ink Trap Splash',
  ddd: 0,
  assets: [],
  layers: layers.reverse(),
};

const out = path.join(__dirname, '../assets/animations/ink-trap-splash.json');
fs.writeFileSync(out, JSON.stringify(lottie, null, 2));
console.log('Wrote', out);
