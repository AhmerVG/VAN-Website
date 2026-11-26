/* Landing hero: a 3D cross-section of soil.
   It shows pale calcareous soil with white lime flecks, 3 wheat seedlings with their roots,
   6 sulfur-coated urea granules just below the surface, and nitrogen (green points) moving
   slowly from each granule to the nearest root and up the root.
   The drawing is a schematic. It is not to scale.
   window.VANSoil.init({ wrap, canvas, calm }) starts it. Scroll sets VANSoil.target.grow (0 to 1). */
(function () {
  'use strict';

  var api = { ready: false, target: { grow: 0.55 }, init: init, setActive: setActive, anchors: [] };
  window.VANSoil = api;

  var renderer, scene, camera, group, wrap, canvas, calm = false, active = true, visible = true, raf = 0;
  var roots = [], rootPts = [], granules = [], nPos, nGeo, nMeta = [], start = 0, last = 0, grow = 0.55;
  var pointer = { x: 0, y: 0, sx: 0, sy: 0 }, labelEls = [], tmp;

  function rng(seed) { var s = seed; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  function lin(hex) { return new THREE.Color(hex).convertSRGBToLinear(); }

  function init(opts) {
    wrap = opts.wrap; canvas = opts.canvas; calm = !!opts.calm; labelEls = opts.labels || [];
    if (!window.THREE) { wrap.classList.add('no-webgl'); return false; }
    try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance' }); }
    catch (e) { wrap.classList.add('no-webgl'); return false; }
    renderer.setClearColor(0x000000, 0);
    renderer.outputEncoding = THREE.sRGBEncoding;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60);
    camera.position.set(0, 0.2, 8.4);
    tmp = new THREE.Vector3();

    scene.add(new THREE.HemisphereLight(0xfff2da, 0x7a5a36, 0.9));
    var key = new THREE.DirectionalLight(0xffe2b4, 1.25); key.position.set(-3, 5, 4); scene.add(key);
    var rim = new THREE.DirectionalLight(0xd6ead6, 0.45); rim.position.set(4, 1, -3); scene.add(rim);

    group = new THREE.Group();
    scene.add(group);
    var r = rng(4242), small = window.innerWidth < 800;
    var W = 2.3, D = 0.75, TOP = 0.35, BOTTOM = -1.95;

    // Soil grains: pale brown, with about 1 grain in 8 white, for the lime of calcareous soil.
    var N = small ? 760 : 1700;
    var soil = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), new THREE.MeshStandardMaterial({ roughness: 0.95, metalness: 0 }), N);
    soil.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(N * 3), 3);
    var browns = [lin('#B89A76'), lin('#A88860'), lin('#C9AE8A'), lin('#96784F')], lime = lin('#F1EBDD'), dark = lin('#6E5536');
    var m = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), p = new THREE.Vector3();
    for (var i = 0; i < N; i++) {
      var y = BOTTOM + Math.pow(r(), 0.8) * (TOP - BOTTOM);
      // Most grains sit behind the roots, so the cut face shows the roots, the granules and the nitrogen.
      p.set((r() * 2 - 1) * W, y, r() < 0.9 ? -D + r() * D * 0.86 : (r() * 2 - 1) * D);
      var s = 0.04 + r() * 0.06;
      sc.set(s * (0.8 + r() * 0.5), s * (0.7 + r() * 0.4), s);
      q.setFromEuler(new THREE.Euler(r() * 3, r() * 3, r() * 3));
      m.compose(p, q, sc); soil.setMatrixAt(i, m);
      var c = r() < 0.125 ? lime : (y > TOP - 0.22 ? dark : browns[Math.floor(r() * 4)]);
      soil.instanceColor.setXYZ(i, c.r, c.g, c.b);
    }
    soil.frustumCulled = false;
    group.add(soil);

    // 3 wheat seedlings and their roots.
    var leafMat = new THREE.MeshStandardMaterial({ color: lin('#3F7F4E'), roughness: 0.7, side: THREE.DoubleSide });
    var rootMat = new THREE.MeshStandardMaterial({ color: lin('#EFE3C8'), roughness: 0.8 });
    [-1.25, 0.05, 1.3].forEach(function (px, pi) {
      var base = new THREE.Vector3(px, TOP, (r() - 0.5) * 0.3);
      for (var l = 0; l < 3; l++) {
        var lean = (l - 1) * (0.34 + r() * 0.2), h = 0.9 + r() * 0.5;
        var curve = new THREE.CatmullRomCurve3([base.clone(), base.clone().add(new THREE.Vector3(lean * 0.25, h * 0.5, 0)), base.clone().add(new THREE.Vector3(lean, h, (r() - 0.5) * 0.3))]);
        var leaf = new THREE.Mesh(new THREE.TubeGeometry(curve, 14, 0.035, 5, false), leafMat);
        leaf.scale.z = 0.35; group.add(leaf);
      }
      for (var k = 0; k < 5; k++) {
        var ang = (k / 4 - 0.5) * 1.5 + (r() - 0.5) * 0.25, len = 1.1 + r() * 0.9, pts = [base.clone()];
        for (var j = 1; j <= 5; j++) {
          var f = j / 5;
          pts.push(new THREE.Vector3(px + Math.sin(ang) * len * f + (r() - 0.5) * 0.14, TOP - Math.cos(ang) * len * f * 0.95 - f * 0.12, base.z + (r() - 0.5) * 0.3));
        }
        var rc = new THREE.CatmullRomCurve3(pts);
        var geo = new THREE.TubeGeometry(rc, 30, 0.026 - k % 2 * 0.007, 5, false);
        var mesh = new THREE.Mesh(geo, rootMat);
        group.add(mesh);
        roots.push({ mesh: mesh, total: geo.index.count });
        rootPts.push(rc.getSpacedPoints(24));
      }
    });

    // 6 sulfur-coated urea granules: a yellow coating, drawn just below the soil surface.
    var gMat = new THREE.MeshStandardMaterial({ color: lin('#E6BE3C'), roughness: 0.6 });
    for (var g = 0; g < 6; g++) {
      var gp = new THREE.Vector3(-1.9 + g * 0.76 + (r() - 0.5) * 0.2, TOP - 0.3 - r() * 0.3, 0.2 + r() * 0.25);
      var gm = new THREE.Mesh(new THREE.SphereGeometry(0.13, 22, 16), gMat);
      gm.position.copy(gp); group.add(gm); granules.push(gp);
    }

    // Nitrogen: green points that leave each granule, reach the nearest root and travel up it.
    var P = small ? 110 : 220;
    nPos = new Float32Array(P * 3);
    for (i = 0; i < P; i++) {
      var gi = i % granules.length, best = 0, bestK = 6, bd = 1e9;
      for (var ri = 0; ri < rootPts.length; ri++) {
        for (var kk = 5; kk < 20; kk += 3) {
          var d = rootPts[ri][kk].distanceToSquared(granules[gi]);
          if (d < bd) { bd = d; best = ri; bestK = kk; }
        }
      }
      nMeta.push({ g: gi, root: best, k: bestK, phase: r(), speed: 0.045 + r() * 0.03, jx: (r() - 0.5) * 0.24, jy: (r() - 0.5) * 0.2, jz: (r() - 0.5) * 0.2 });
    }
    nGeo = new THREE.BufferGeometry();
    nGeo.setAttribute('position', new THREE.BufferAttribute(nPos, 3));
    group.add(new THREE.Points(nGeo, new THREE.PointsMaterial({ color: 0x3E9A52, size: 0.085, transparent: true, opacity: 0.95, depthWrite: false, depthTest: false })));

    // Points in the drawing that the page's labels follow.
    api.anchors = [new THREE.Vector3(0.7, -1.35, 0.75), granules[1].clone(), rootPts[7][14].clone()];

    resize();
    window.addEventListener('resize', debounce(resize, 150));
    wrap.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      var b = wrap.getBoundingClientRect();
      pointer.x = ((e.clientX - b.left) / b.width) * 2 - 1; pointer.y = ((e.clientY - b.top) / b.height) * 2 - 1; kick();
    }, { passive: true });
    wrap.addEventListener('pointerleave', function () { pointer.x = 0; pointer.y = 0; kick(); });
    document.addEventListener('visibilitychange', function () { visible = !document.hidden; if (visible) kick(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { setActive(en[0].isIntersecting); }, { threshold: 0.02 }).observe(wrap);
    }
    canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); wrap.classList.add('no-webgl'); active = false; });
    api.ready = true; start = performance.now(); kick();
    return true;
  }

  function resize() {
    if (!renderer) return;
    var b = canvas.getBoundingClientRect(), w = Math.max(1, b.width), h = Math.max(1, b.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 800 ? 1.5 : 1.75));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // A narrow frame needs the camera further back to keep the whole soil block in view.
    camera.position.z = camera.aspect < 0.9 ? 8.4 / Math.max(0.55, camera.aspect) * 0.86 : 8.4;
    camera.updateProjectionMatrix();
    kick();
  }

  function setActive(on) { active = on; if (on) kick(); }
  function kick() { if (!api.ready || raf || !active || !visible) return; raf = requestAnimationFrame(loop); }
  var still = 0;
  function loop() {
    raf = 0;
    if (!active || !visible) return;
    var moved = frame();
    if (calm) { still = moved ? 0 : still + 1; if (still > 20) return; }
    raf = requestAnimationFrame(loop);
  }

  function frame() {
    var now = performance.now(), dt = Math.min((now - (last || now)) / 1000, 1.5); last = now;
    var t = calm ? 6 : (now - start) / 1000;
    var before = grow + pointer.sx + pointer.sy;
    var e = calm ? 1 : 1 - Math.exp(-dt * 4);
    grow += (api.target.grow - grow) * (dt === 0 ? 0.1 : e);
    pointer.sx += (pointer.x - pointer.sx) * (1 - Math.exp(-dt * 3));
    pointer.sy += (pointer.y - pointer.sy) * (1 - Math.exp(-dt * 3));

    // Roots lengthen as the visitor scrolls.
    for (var i = 0; i < roots.length; i++) roots[i].mesh.geometry.setDrawRange(0, Math.floor(roots[i].total * Math.min(1, grow * (0.85 + (i % 5) * 0.06)) / 3) * 3);

    for (i = 0; i < nMeta.length; i++) {
      var n = nMeta[i], u = (t * n.speed + n.phase) % 1, G = granules[n.g], R = rootPts[n.root], x, y, z;
      var reach = Math.min(n.k, Math.floor(24 * grow));
      if (u < 0.55) {
        var a = u / 0.55, T = R[reach];
        x = G.x + n.jx * (1 - a) + (T.x - G.x) * a; y = G.y + n.jy * (1 - a) + (T.y - G.y) * a; z = G.z + n.jz * (1 - a) + (T.z - G.z) * a;
      } else {
        var b = (u - 0.55) / 0.45, f = reach * (1 - b), i0 = Math.floor(f), fr = f - i0, A = R[i0], B = R[Math.min(reach, i0 + 1)];
        x = A.x + (B.x - A.x) * fr; y = A.y + (B.y - A.y) * fr; z = A.z + (B.z - A.z) * fr;
      }
      nPos[i * 3] = x; nPos[i * 3 + 1] = y; nPos[i * 3 + 2] = z;
    }
    nGeo.attributes.position.needsUpdate = true;

    group.rotation.y = -0.34 + Math.sin(t * 0.22) * 0.07 + pointer.sx * 0.22;
    group.rotation.x = 0.1 + pointer.sy * 0.1;
    group.position.y = 0.55 - grow * 0.45;
    renderer.render(scene, camera);

    // Place the page's labels over their points in the drawing.
    if (labelEls.length) {
      var w = canvas.clientWidth, h = canvas.clientHeight, boxes = [];
      for (i = 0; i < labelEls.length && i < api.anchors.length; i++) {
        tmp.copy(api.anchors[i]); group.localToWorld(tmp); tmp.project(camera);
        var lw = labelEls[i].offsetWidth + 14, lh = labelEls[i].offsetHeight;
        var lx = Math.max(14, Math.min((tmp.x * 0.5 + 0.5) * w, w - lw - 4)), ly = (-tmp.y * 0.5 + 0.5) * h;
        // Move the label down until it clears every label already placed.
        for (var pass = 0; pass < 4; pass++) {
          var hit = false;
          for (var j = 0; j < boxes.length; j++) {
            var o = boxes[j];
            if (lx < o.x + o.w && lx + lw > o.x && ly - 14 < o.y - 14 + o.h + 6 && ly - 14 + lh + 6 > o.y - 14) { ly = o.y + o.h + 8; hit = true; }
          }
          if (!hit) break;
        }
        ly = Math.min(ly, h - lh + 10);
        boxes.push({ x: lx, y: ly, w: lw, h: lh });
        labelEls[i].style.transform = 'translate(' + lx.toFixed(1) + 'px,' + ly.toFixed(1) + 'px)';
        labelEls[i].classList.add('is-placed');
      }
    }
    return Math.abs(grow + pointer.sx + pointer.sy - before) > 0.0004;
  }

  function debounce(fn, ms) { var id; return function () { clearTimeout(id); id = setTimeout(fn, ms); }; }
})();
