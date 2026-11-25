/* The granule scene.
   Hero: about 600 small granules orbit 1 large coated granule, which opens to show its core.
   Story: the small granules regroup into 6 shapes, 1 for each statement.
   Coatings: the large granule returns, cut open, and shows 4 coatings in turn:
   sulfur-coated urea, boron-coated potash, humic-coated phosphate and dual-coated potash.
   `target.P` is the scroll position: 0 = hero, 1 to 6 = story statements, 7 to 10 = coatings. */
(function () {
  'use strict';

  var api = {
    ready: false,
    target: { P: 0, opacity: 1 },
    intro: { k: 1 },
    init: init,
    setActive: setActive,
    poke: kick
  };
  window.VANScene = api;

  var renderer, scene, camera, world, cut, inst, dust, stage, canvas;
  var N = 0, forms = [], calm = false, active = true, visible = true, raf = 0;
  var baseSize, delay, lane;
  var cur = 0, start = 0, last = 0, pos = null;
  var pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  var mats = {}, lid, halo, E = [0, 0, 0, 1];

  // Yaw, pitch and sway of the small granules for each formation.
  var POSE = [
    [0.0, 0.42, 0.18], [0.45, 0.05, 0.50], [-0.60, 0.46, 0.10], [0.15, 0.12, 0.28],
    [0.28, 0.08, 0.10], [0.30, 0.06, 0.45], [0.50, 0.12, 0.60],
    [0, 0.1, 0.2], [0, 0.1, 0.2], [0, 0.1, 0.2], [0, 0.1, 0.2]
  ];

  // The 4 coatings, in the natural colours of the materials: white urea, yellow sulfur, cream potash,
  // brown phosphate and black humic material. Boron compounds are white, so boron is shown in teal to be visible.
  var CONCEPT = [
    { core: '#F7F5EE', c1: '#E6BE3C', c2: '#E6BE3C', halo: 0 },     // sulfur-coated urea
    { core: '#EFE6D2', c1: '#2E8C86', c2: '#8CCFC6', halo: 0 },     // boron-coated potash: calcium borate inside, sodium borate outside
    { core: '#B08A63', c1: '#2B2A2C', c2: '#2B2A2C', halo: 0.16 },   // humic-coated phosphate, with its acidic zone
    { core: '#EFE6D2', c1: '#1F6F6A', c2: '#8CCFC6', halo: 0 }      // dual-coated potash: boric acid inside, sodium borate outside
  ];
  // How the small granules leave each coated granule: 2 speeds, or a hovering zone.
  var EMIT = [
    { a: 0.05, b: 0.035, hover: false },
    { a: 0.2, b: 0.045, hover: false },
    { a: 0, b: 0, hover: true },
    { a: 0.05, b: 0.05, hover: false }
  ];
  var R0 = 0.78, R1 = 0.93, R2 = 1.08;

  function rng(seed) {
    var s = seed;
    return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  }
  function lin(hex) { return new THREE.Color(hex).convertSRGBToLinear(); }

  /* ---------- The formations of the small granules ---------- */
  function build() {
    var C = {
      amber: [lin('#E08A2E'), lin('#F2B866'), lin('#C46A14')],
      green: lin('#2F7D3F'), greenLight: lin('#7DB873'), cream: lin('#F6ECDA'),
      navy: lin('#0E3550'), teal: lin('#0F7A72'), yellow: lin('#E6BE3C'), zone: lin('#D8D2C6'), silver: lin('#AEBBC6')
    };
    var r = rng(20261122);
    var amber = function () { return C.amber[Math.floor(r() * 3)]; };
    var make = function () { return { p: new Float32Array(N * 3), c: new Float32Array(N * 3), s: new Float32Array(N) }; };
    var put = function (f, i, x, y, z, col, s) {
      f.p[i * 3] = x; f.p[i * 3 + 1] = y; f.p[i * 3 + 2] = z;
      f.c[i * 3] = col.r; f.c[i * 3 + 1] = col.g; f.c[i * 3 + 2] = col.b;
      f.s[i] = s;
    };
    var i, f, a, u, x, y, z, rad, q;

    // 0. Hero: a swarm of granules around the large granule.
    f = make();
    for (i = 0; i < N; i++) {
      // A flat ring, so the large granule stays in clear view.
      a = r() * Math.PI * 2; rad = 1.55 + r() * 1.05; u = (r() + r() + r() - 1.5) * 0.16;
      put(f, i, Math.cos(a) * rad, u * rad, Math.sin(a) * rad, r() < 0.1 ? C.green : amber(), 0.55 + r() * 1.0);
    }
    forms.push(f);

    // 1. A bag with a blank label: the product is sold under the partner's brand.
    f = make();
    for (i = 0; i < N; i++) {
      x = (r() - 0.5) * 1.5; y = (r() - 0.5) * 2.1;
      var pinch = y > 0.72 ? 1 - ((y - 0.72) / 0.33) * 0.5 : 1;
      var bulge = 1 - Math.pow(x / 0.75, 2) * 0.45;
      z = (r() < 0.5 ? 1 : -1) * 0.3 * bulge * pinch * (0.75 + r() * 0.25);
      x *= pinch;
      var col = amber();
      if (Math.abs(x) < 0.46 && y > -0.3 && y < 0.4) col = C.cream;
      else if (y < -0.72) col = C.green;
      put(f, i, x, y, z, col, 0.85);
    }
    forms.push(f);

    // 2. 5 production lines that pass under a test gate.
    f = make();
    for (i = 0; i < N; i++) {
      if (i % 6 === 0) {
        a = r() * Math.PI;
        put(f, i, 0.55 + (r() - 0.5) * 0.08, Math.sin(a) * 0.95 - 0.25, Math.cos(a) * 1.2, r() < 0.5 ? C.teal : C.navy, 0.8);
        lane[i] = 0;
      } else {
        var ln = i % 5;
        put(f, i, r() * 3.2 - 1.6, -0.25 + (r() - 0.5) * 0.05, (ln - 2) * 0.4 + (r() - 0.5) * 0.09, amber(), 0.75);
        lane[i] = 1;
      }
    }
    forms.push(f);

    // 3. A hub and 6 routes to market.
    f = make();
    for (i = 0; i < N; i++) {
      if (i % 7 === 0) {
        a = r() * Math.PI * 2; u = r() * 2 - 1; rad = Math.cbrt(r()) * 0.34; q = Math.sqrt(1 - u * u);
        put(f, i, Math.cos(a) * q * rad, u * rad, Math.sin(a) * q * rad, C.green, 0.9);
      } else {
        var sp = i % 7 - 1;
        var node = r() < 0.38;
        u = node ? 1 : r();
        a = sp * (Math.PI * 2 / 6) + 0.25 + u * 0.55;
        rad = 0.45 + u * 1.45;
        var j = node ? 0.17 : 0.03;
        put(f, i, Math.cos(a) * rad + (r() - 0.5) * j * 2, Math.sin(a) * rad * 0.88 + (r() - 0.5) * j * 2,
          (r() - 0.5) * j * 2 + Math.sin(sp * 2.1) * u * 0.3, node ? amber() : C.cream, node ? 0.9 : 0.5);
      }
    }
    forms.push(f);

    // 4. The formulation library: a grid of formulations, 1 of them picked out.
    f = make();
    for (i = 0; i < N; i++) {
      var k = i % 24, cx = (k % 6 - 2.5) * 0.62, cy = (Math.floor(k / 6) - 1.5) * 0.62;
      var hit = k === 9;
      a = r() * Math.PI * 2; u = r() * 2 - 1; rad = Math.cbrt(r()) * (hit ? 0.27 : 0.17); q = Math.sqrt(1 - u * u);
      put(f, i, cx + Math.cos(a) * q * rad, cy + u * rad, Math.sin(a) * q * rad + (hit ? 0.35 : 0),
        hit ? amber() : (k % 3 === 0 ? C.green : (k % 3 === 1 ? C.greenLight : C.cream)), hit ? 1.05 : 0.58);
    }
    forms.push(f);

    // 5. A laboratory flask with a new formulation in it.
    f = make();
    var flaskR = function (yy) {
      if (yy > 0.55) return yy > 1.25 ? 0.31 : 0.24;
      return 0.24 + (0.55 - yy) / 1.65 * 0.88;
    };
    for (i = 0; i < N; i++) {
      a = r() * Math.PI * 2;
      if (i % 5 < 2) {
        y = -1.1 + Math.pow(r(), 0.8) * 2.45; rad = flaskR(y);
        put(f, i, Math.cos(a) * rad, y, Math.sin(a) * rad, C.cream, 0.5);
      } else {
        y = -1.06 + r() * 0.92; rad = Math.sqrt(r()) * flaskR(y) * 0.9;
        put(f, i, Math.cos(a) * rad, y, Math.sin(a) * rad, y > -0.3 ? C.amber[1] : (r() < 0.12 ? C.greenLight : amber()), 0.85);
      }
    }
    forms.push(f);

    // 6. 1 granule made of granules: the partner's own formulation.
    f = make();
    for (i = 0; i < N; i++) {
      y = 1 - (i + 0.5) / N * 2; rad = Math.sqrt(1 - y * y); a = i * 2.399963;
      var coat = y + Math.sin(a * 3) * 0.12 > 0.05;
      put(f, i, Math.cos(a) * rad * 1.2, y * 1.2, Math.sin(a) * rad * 1.2, coat ? (r() < 0.25 ? C.greenLight : C.green) : amber(), 0.95);
    }
    forms.push(f);

    // 7 to 10. Nutrients leaving each coated granule. Positions here are directions only.
    var emitCols = [
      function () { return C.green; },                                    // nitrogen only: the sulfur stays where the granule was placed
      function (n) { return n % 2 ? C.teal : C.amber[1]; },               // boron: a slow form and a quick form
      function () { return C.zone; },                                     // the acidic zone
      function (n) { return n % 2 ? C.teal : C.silver; }                  // boron and silicon
    ];
    var emitShare = [0.42, 0.5, 0.75, 0], emitSize = [0.8, 0.75, 0.42, 0.75];
    for (var e = 0; e < 4; e++) {
      f = make();
      for (i = 0; i < N; i++) {
        y = 1 - (i + 0.5) / N * 2; rad = Math.sqrt(1 - y * y); a = i * 2.399963 + e;
        put(f, i, Math.cos(a) * rad, y, Math.sin(a) * rad, emitCols[e](i), r() < emitShare[e] ? emitSize[e] : 0);
      }
      forms.push(f);
    }
  }

  /* ---------- The large coated granule, with a quarter cut away ---------- */
  function speckle() {
    var c = document.createElement('canvas'); c.width = c.height = 256;
    var g = c.getContext('2d'), d = g.createImageData(256, 256), r = rng(9);
    for (var i = 0; i < d.data.length; i += 4) {
      var v = 150 + Math.floor(r() * 105);
      d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255;
    }
    g.putImageData(d, 0, 0);
    var t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(5, 3);
    return t;
  }

  function buildCut(detail) {
    var g = new THREE.Group();
    var tex = speckle();
    var solid = function (bump) {
      return new THREE.MeshStandardMaterial({ roughness: 0.72, metalness: 0, side: THREE.DoubleSide, bumpMap: bump ? tex : null, bumpScale: 0.02 });
    };
    mats.core = solid(false); mats.c1 = solid(false); mats.c2 = solid(true);
    mats.lid = solid(true); mats.lid.transparent = true;

    var open = Math.PI * 1.5;                       // 3 quarters of each sphere are kept
    var shell = function (rad, mat) { return new THREE.Mesh(new THREE.SphereGeometry(rad, detail, Math.round(detail * 0.7), 0, open), mat); };
    g.add(shell(R0, mats.core)); g.add(shell(R1, mats.c1)); g.add(shell(R2, mats.c2));

    // Flat faces on the 2 cut planes, so each layer reads as solid.
    var faces = function (rotY) {
      var grp = new THREE.Group();
      grp.add(new THREE.Mesh(new THREE.CircleGeometry(R0, detail, Math.PI / 2, Math.PI), mats.core));
      grp.add(new THREE.Mesh(new THREE.RingGeometry(R0, R1, detail, 1, Math.PI / 2, Math.PI), mats.c1));
      grp.add(new THREE.Mesh(new THREE.RingGeometry(R1, R2, detail, 1, Math.PI / 2, Math.PI), mats.c2));
      grp.rotation.y = rotY;
      return grp;
    };
    g.add(faces(0)); g.add(faces(-Math.PI / 2));

    // The removed quarter of the outer coat. It lifts away as the granule opens.
    lid = new THREE.Mesh(new THREE.SphereGeometry(R2, Math.round(detail / 2), Math.round(detail * 0.7), open, Math.PI / 2), mats.lid);
    g.add(lid);

    // A soft zone around the granule, used for the acidic zone of the humic-coated phosphate.
    halo = new THREE.Mesh(new THREE.SphereGeometry(1.62, 40, 28),
      new THREE.MeshBasicMaterial({ color: 0xB9B2A6, transparent: true, opacity: 0, depthWrite: false }));
    g.add(halo);
    return g;
  }

  /* ---------- Layout ---------- */
  function layout() {
    var w = window.innerWidth || 1280, h = window.innerHeight || 800, aspect = w / h;
    var halfH = Math.tan((35 * Math.PI) / 360) * 7;
    var halfW = halfH * aspect;
    if (w <= 760) {
      return {
        hero: { x: halfW * 0.34, y: halfH * 0.58, scale: Math.min(0.42, halfW * 0.34) },
        story: { x: 0, y: halfH * 0.44, scale: Math.min(0.52, halfW * 0.42) },
        coat: { x: 0, y: halfH * 0.46, scale: Math.min(0.5, halfW * 0.4) }
      };
    }
    if (w <= 1000) {
      return {
        hero: { x: halfW * 0.48, y: halfH * 0.5, scale: 0.46 },
        story: { x: 0, y: halfH * 0.42, scale: 0.6 },
        coat: { x: 0, y: halfH * 0.44, scale: 0.56 }
      };
    }
    return {
      hero: { x: halfW * 0.58, y: halfH * 0.04, scale: Math.min(0.74, halfW * 0.235) },
      story: { x: -halfW * 0.46, y: 0, scale: Math.min(0.8, halfW * 0.25) },
      coat: { x: halfW * 0.46, y: 0, scale: Math.min(0.92, halfW * 0.27) }
    };
  }

  function init(opts) {
    stage = opts.stage; canvas = opts.canvas; calm = !!opts.calm;
    if (!window.THREE) { stage.classList.add('no-webgl'); return false; }
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (err) {
      stage.classList.add('no-webgl');
      return false;
    }
    renderer.setClearColor(0x000000, 0);
    renderer.outputEncoding = THREE.sRGBEncoding;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(35, 1, 0.1, 60);
    camera.position.z = 7;

    // Warm studio light: a soft sky, a key light from the upper left, a cool rim from behind.
    scene.add(new THREE.HemisphereLight(0xfff3df, 0x8a5a2b, 0.85));
    var key = new THREE.DirectionalLight(0xffe6c2, 1.2); key.position.set(-3, 4, 5); scene.add(key);
    var rim = new THREE.DirectionalLight(0xcfe8d2, 0.5); rim.position.set(4, -1, -4); scene.add(rim);

    world = new THREE.Group();
    scene.add(world);

    var small = window.innerWidth < 800;
    N = small ? 330 : 600;
    baseSize = new Float32Array(N); delay = new Float32Array(N); lane = new Uint8Array(N);
    var r = rng(77);
    for (var i = 0; i < N; i++) { baseSize[i] = 0.05 + r() * 0.04; delay[i] = r(); }
    build();

    inst = new THREE.InstancedMesh(
      new THREE.IcosahedronGeometry(1, small ? 1 : 2),
      new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0.02 }),
      N
    );
    inst.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(N * 3), 3);
    inst.frustumCulled = false;
    world.add(inst);

    cut = buildCut(small ? 40 : 64);
    scene.add(cut);

    // Fine dust that drifts through the light.
    var D = small ? 70 : 150, dp = new Float32Array(D * 3);
    for (i = 0; i < D; i++) { dp[i * 3] = (r() - 0.5) * 7; dp[i * 3 + 1] = (r() - 0.5) * 6; dp[i * 3 + 2] = (r() - 0.5) * 4; }
    var dg = new THREE.BufferGeometry();
    dg.setAttribute('position', new THREE.BufferAttribute(dp, 3));
    dust = new THREE.Points(dg, new THREE.PointsMaterial({ color: 0xC89B5A, size: 0.035, transparent: true, opacity: 0.55, depthWrite: false }));
    world.add(dust);

    CONCEPT.forEach(function (c) { c.coreL = lin(c.core); c.c1L = lin(c.c1); c.c2L = lin(c.c2); });

    resize();
    window.addEventListener('resize', debounce(resize, 150));
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      kick();
    }, { passive: true });
    document.addEventListener('visibilitychange', function () { visible = !document.hidden; if (visible) kick(); });
    canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); stage.classList.add('no-webgl'); active = false; });

    api.ready = true;
    start = performance.now();
    kick();
    return true;
  }

  function resize() {
    if (!renderer) return;
    var w = window.innerWidth || 1280, h = window.innerHeight || 800;
    pos = layout();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, w < 800 ? 1.5 : 1.75));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    kick();
  }

  function setActive(on) { active = on; stage.style.visibility = on ? 'visible' : 'hidden'; if (on) kick(); }

  function kick() {
    if (!api.ready || raf || !active || !visible) return;
    raf = requestAnimationFrame(loop);
  }

  var still = 0;
  function loop() {
    raf = 0;
    if (!active || !visible) return;
    var moved = frame();
    // In calm mode the scene is drawn only while something is changing.
    if (calm) { still = moved ? 0 : still + 1; if (still > 20) return; }
    raf = requestAnimationFrame(loop);
  }

  function smooth(x) { x = x < 0 ? 0 : x > 1 ? 1 : x; return x * x * (3 - 2 * x); }
  function mixColor(target, a, b, k) { target.setRGB(a.r + (b.r - a.r) * k, a.g + (b.g - a.g) * k, a.b + (b.b - a.b) * k); }

  // Position of small granule i in a coating formation. The result goes into E.
  function emit(fi, i, t) {
    var F = forms[fi], m = EMIT[fi - 7], i3 = i * 3, rad, mul = 1;
    if (m.hover) {
      rad = 1.3 + delay[i] * 0.42 + Math.sin(t * 0.5 + delay[i] * 6.28) * 0.03;
    } else {
      var u = (t * (i % 2 ? m.b : m.a) * (0.7 + delay[i] * 0.6) + delay[i] * 5.7) % 1;
      rad = 1.14 + u * 0.95; mul = Math.sin(Math.PI * u);
    }
    E[0] = F.p[i3] * rad; E[1] = F.p[i3 + 1] * rad; E[2] = F.p[i3 + 2] * rad; E[3] = mul;
  }

  function frame() {
    var t = calm ? 3.2 : (performance.now() - start) / 1000;
    var before = cur + pointer.sx + pointer.sy;
    // Damping uses real time, so the scene settles at the same speed on a slow device.
    var now = performance.now(), dt = Math.min((now - (last || now)) / 1000, 1.5); last = now;
    var ease = calm ? 1 : 1 - Math.exp(-dt * 5.2), pe = 1 - Math.exp(-dt * 3);
    cur += (api.target.P - cur) * (dt === 0 ? 0.085 : ease);
    pointer.sx += (pointer.x - pointer.sx) * pe;
    pointer.sy += (pointer.y - pointer.sy) * pe;
    var P = cur;

    var top = forms.length - 2;
    var a = Math.min(Math.floor(P), top); if (a < 0) a = 0;
    var b = a + 1, fr = P - a;
    var k = smooth((fr - 0.18) / 0.64);
    var A = forms[a], B = forms[b];
    var M = inst.instanceMatrix.array, Cc = inst.instanceColor.array;
    var flow = t * 0.32, orbit = t * 0.11;

    for (var i = 0; i < N; i++) {
      var i3 = i * 3;
      var ki = smooth(k * 1.4 - delay[i] * 0.4);
      var ax = A.p[i3], ay = A.p[i3 + 1], az = A.p[i3 + 2], as = A.s[i];
      var bx = B.p[i3], by = B.p[i3 + 1], bz = B.p[i3 + 2], bs = B.s[i];
      if (a === 0) {            // the hero swarm orbits the large granule
        var an = orbit * (0.5 + delay[i]), ca = Math.cos(an), sa = Math.sin(an);
        var ox = ax * ca - az * sa; az = ax * sa + az * ca; ax = ox;
        ay += Math.sin(t * 0.6 + delay[i] * 6.28) * 0.05;
      }
      if (lane[i]) {            // granules travel along the 5 lines
        if (a === 2) { ax = ((ax + 1.6 + flow) % 3.2) - 1.6; }
        if (b === 2) { bx = ((bx + 1.6 + flow) % 3.2) - 1.6; }
      }
      if (a >= 7) { emit(a, i, t); ax = E[0]; ay = E[1]; az = E[2]; as *= E[3]; }
      if (b >= 7) { emit(b, i, t); bx = E[0]; by = E[1]; bz = E[2]; bs *= E[3]; }
      var arc = Math.sin(ki * Math.PI) * (a >= 7 ? 0.08 : 0.4);
      var x = ax + (bx - ax) * ki - (az + bz) * 0.5 * arc;
      var y = ay + (by - ay) * ki + arc * (delay[i] - 0.5) * 0.9;
      var z = az + (bz - az) * ki + (ax + bx) * 0.5 * arc;
      var s = baseSize[i] * (as + (bs - as) * ki);
      var m = i * 16;
      M[m] = s; M[m + 1] = 0; M[m + 2] = 0; M[m + 3] = 0;
      M[m + 4] = 0; M[m + 5] = s; M[m + 6] = 0; M[m + 7] = 0;
      M[m + 8] = 0; M[m + 9] = 0; M[m + 10] = s; M[m + 11] = 0;
      M[m + 12] = x; M[m + 13] = y; M[m + 14] = z; M[m + 15] = 1;
      Cc[i3] = A.c[i3] + (B.c[i3] - A.c[i3]) * ki;
      Cc[i3 + 1] = A.c[i3 + 1] + (B.c[i3 + 1] - A.c[i3 + 1]) * ki;
      Cc[i3 + 2] = A.c[i3 + 2] + (B.c[i3 + 2] - A.c[i3 + 2]) * ki;
    }
    inst.instanceMatrix.needsUpdate = true;
    inst.instanceColor.needsUpdate = true;

    var pa = POSE[a], pb = POSE[b];
    var yaw = pa[0] + (pb[0] - pa[0]) * k, pitch = pa[1] + (pb[1] - pa[1]) * k, sway = pa[2] + (pb[2] - pa[2]) * k;
    world.rotation.y = yaw + Math.sin(t * 0.38) * sway + pointer.sx * 0.38;
    world.rotation.x = pitch + pointer.sy * 0.22;

    var toStory = smooth(P / 0.9), toCoat = smooth((P - 6.1) / 0.8), h = pos.hero, st = pos.story, co = pos.coat;
    var wx = h.x + (st.x - h.x) * toStory, wy = h.y + (st.y - h.y) * toStory, ws = h.scale + (st.scale - h.scale) * toStory;
    wx += (co.x - wx) * toCoat; wy += (co.y - wy) * toCoat; ws += (co.scale - ws) * toCoat;
    world.position.set(wx + pointer.sx * 0.08, wy - pointer.sy * 0.06, 0);
    // The group shrinks a little while it crosses the page, so it does not cover the text.
    ws *= 1 - 0.3 * Math.sin(Math.PI * toStory) * (1 - toCoat);
    world.scale.setScalar(ws * api.intro.k);

    // The large coated granule: in the hero it opens and then leaves. In the coatings section it returns, open.
    var inHero = 1 - smooth(P / 0.62), inCoat = smooth((P - 6.25) / 0.7);
    var size = Math.max(inHero, inCoat);
    cut.visible = size > 0.002;
    if (cut.visible) {
      var opened = inCoat > 0 ? smooth((P - 6.5) / 0.5) : smooth((api.intro.k - 0.6) / 0.4);
      var ci = Math.max(0, Math.min(3, P - 7)), c0 = Math.floor(ci), c1 = Math.min(3, c0 + 1), ck = smooth((ci - c0 - 0.2) / 0.6);
      var X = CONCEPT[c0], Y = CONCEPT[c1];
      mixColor(mats.core.color, X.coreL, Y.coreL, ck);
      mixColor(mats.c1.color, X.c1L, Y.c1L, ck);
      mixColor(mats.c2.color, X.c2L, Y.c2L, ck);
      mats.lid.color.copy(mats.c2.color);
      mats.lid.opacity = 1 - opened;
      lid.visible = opened < 0.98;
      lid.position.set(-0.6 * opened, 0.35 * opened, -0.6 * opened);
      halo.material.opacity = (X.halo + (Y.halo - X.halo) * ck) * inCoat;
      halo.visible = halo.material.opacity > 0.005;
      cut.position.copy(world.position);
      cut.scale.setScalar(ws * api.intro.k * size);
      // The open quarter faces the viewer, a little to the right.
      cut.rotation.y = 2.75 + Math.sin(t * 0.3) * 0.22 + pointer.sx * 0.35;
      cut.rotation.x = 0.32 + pointer.sy * 0.2;
    }

    dust.rotation.y = t * 0.03; dust.position.y = Math.sin(t * 0.2) * 0.15;
    dust.material.opacity = 0.55 * (1 - toStory * 0.5);

    stage.style.opacity = api.target.opacity;
    renderer.render(scene, camera);
    return Math.abs(cur + pointer.sx + pointer.sy - before) > 0.0004;
  }

  function debounce(fn, ms) { var id; return function () { clearTimeout(id); id = setTimeout(fn, ms); }; }
})();
