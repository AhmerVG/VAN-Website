/* Products page hero: 3 coated granules cut open, drawn in 3D with three.js (r128).
   Vital Urea: white urea core, yellow sulfur coating. Green Phosphate: brown phosphate core, black humic coating.
   Vital Potash: cream potash core, boron coating in 2 forms (2 tones of grey).
   The drawing is a diagram and is not to scale. The pins open cards whose text is taken from the reviewed product text.
   If WebGL is not available, the page keeps the drawn SVG granules. */
(function () {
  'use strict';
  var fig = document.getElementById('heroFig'), canvas = document.getElementById('granCanvas');
  if (!fig || !canvas || !window.THREE) return;
  var calm = document.documentElement.classList.contains('calm');
  var renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); } catch (e) { return; }
  if (!renderer || !renderer.getContext()) return;
  fig.classList.add('is-3d');

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
  var scene = new THREE.Scene();
  var cam = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  cam.position.set(0, 0.4, 12);

  // Warm studio light from the upper left, a cool fill, and a rim from behind.
  scene.add(new THREE.HemisphereLight(0xfff4e0, 0x1b211c, 0.55));
  var key = new THREE.DirectionalLight(0xffe7c2, 2.4); key.position.set(-5, 6, 7); scene.add(key);
  var fill = new THREE.DirectionalLight(0x9fb7c9, 0.5); fill.position.set(6, -1, 4); scene.add(fill);
  var rim = new THREE.DirectionalLight(0xffffff, 1.1); rim.position.set(2, 4, -6); scene.add(rim);

  // Procedural textures: a noise canvas used as colour variation and as a bump map.
  function noiseCanvas(size, base, spread, grain, seed) {
    var c = document.createElement('canvas'); c.width = c.height = size;
    var g = c.getContext('2d'), img = g.createImageData(size, size), s = seed || 1;
    function rnd() { s = (s * 16807) % 2147483647; return s / 2147483647; }
    for (var i = 0; i < size * size; i++) {
      var n = (rnd() - 0.5) * spread, k = rnd() < grain ? (rnd() - 0.5) * spread * 3 : 0;
      img.data[i * 4] = Math.max(0, Math.min(255, base[0] + n + k));
      img.data[i * 4 + 1] = Math.max(0, Math.min(255, base[1] + n + k));
      img.data[i * 4 + 2] = Math.max(0, Math.min(255, base[2] + n + k));
      img.data[i * 4 + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    var t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.encoding = THREE.sRGBEncoding;
    return t;
  }
  function crystals(size, base, seed) {
    // Facets for a crystalline core: polygons in slightly different shades.
    var c = document.createElement('canvas'); c.width = c.height = size;
    var g = c.getContext('2d'), s = seed || 3;
    function rnd() { s = (s * 16807) % 2147483647; return s / 2147483647; }
    g.fillStyle = 'rgb(' + base.join(',') + ')'; g.fillRect(0, 0, size, size);
    for (var i = 0; i < 260; i++) {
      var x = rnd() * size, y = rnd() * size, r = 6 + rnd() * 26, d = (rnd() - 0.5) * 34;
      g.fillStyle = 'rgb(' + base.map(function (v) { return Math.round(Math.max(0, Math.min(255, v + d))); }).join(',') + ')';
      g.beginPath();
      for (var k = 0; k < 6; k++) { var a = k / 6 * Math.PI * 2 + rnd() * 0.5; g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); }
      g.closePath(); g.fill();
    }
    var t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.encoding = THREE.sRGBEncoding;
    return t;
  }

  var GRAN = [
    { id: 'urea', x: -3.3, y: 0.55, r: 1.35, coat: 0.2, coreTex: crystals(256, [244, 242, 234], 5), coatTex: noiseCanvas(256, [222, 182, 58], 26, 0.08, 7), coatRough: 0.82 },
    { id: 'phos', x: 0.15, y: -0.35, r: 1.25, coat: 0.17, coreTex: noiseCanvas(256, [134, 100, 66], 34, 0.18, 11), coatTex: noiseCanvas(256, [33, 29, 26], 18, 0.1, 13), coatRough: 0.95 },
    { id: 'pot', x: 3.4, y: 0.45, r: 1.2, coat: 0.18, coreTex: crystals(256, [239, 227, 196], 17), coatTex: null, coatRough: 0.7 }
  ];
  // Vital Potash coating: 2 tones of grey, for the 2 forms of boron.
  (function () {
    var c = document.createElement('canvas'); c.width = 256; c.height = 256; var g = c.getContext('2d');
    for (var y = 0; y < 256; y += 16) { g.fillStyle = (y / 16) % 2 ? '#C7CDD0' : '#8D979C'; g.fillRect(0, y, 256, 16); }
    var t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.encoding = THREE.sRGBEncoding; t.repeat.set(1, 2);
    GRAN[2].coatTex = t;
  })();

  var groups = [], cut = Math.PI * 0.55, FACE = Math.PI / 2 - cut / 2 - 0.45; // the wedge cut out of each granule, so the core shows
  GRAN.forEach(function (G) {
    var grp = new THREE.Group(); grp.position.set(G.x, G.y, 0);
    var core = new THREE.Mesh(new THREE.SphereGeometry(G.r - G.coat, 64, 48),
      new THREE.MeshStandardMaterial({ map: G.coreTex, bumpMap: G.coreTex, bumpScale: 0.025, roughness: 0.62, metalness: 0 }));
    var coat = new THREE.Mesh(new THREE.SphereGeometry(G.r, 72, 54, cut, Math.PI * 2 - cut),
      new THREE.MeshStandardMaterial({ map: G.coatTex, bumpMap: G.coatTex, bumpScale: 0.04, roughness: G.coatRough, metalness: 0, side: THREE.DoubleSide }));
    // The cut faces of the coating: 2 half rings that show its thickness.
    var ringMat = new THREE.MeshStandardMaterial({ map: G.coatTex, roughness: G.coatRough, side: THREE.DoubleSide });
    [cut, Math.PI * 2].forEach(function (phi) {
      var ring = new THREE.Mesh(new THREE.RingGeometry(G.r - G.coat, G.r, 48, 1, -Math.PI / 2, Math.PI), ringMat);
      ring.rotation.y = Math.PI + phi; // the half ring lies on the meridian at angle phi, where the cut begins or ends
      grp.add(ring);
    });
    grp.add(core); grp.add(coat);
    grp.rotation.set(0.25, -0.9 + groups.length * 0.15, 0);
    scene.add(grp);
    groups.push({ g: grp, G: G, spin: 0.12 + groups.length * 0.03 });
  });

  // A soft shadow under each granule on the dark stage.
  var shadowTex = (function () {
    var c = document.createElement('canvas'); c.width = c.height = 128; var g = c.getContext('2d');
    var gr = g.createRadialGradient(64, 64, 4, 64, 64, 62); gr.addColorStop(0, 'rgba(0,0,0,0.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c);
  })();
  groups.forEach(function (o) {
    var sh = new THREE.Mesh(new THREE.PlaneGeometry(o.G.r * 2.6, o.G.r * 0.9), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
    sh.position.set(o.G.x, o.G.y - o.G.r - 0.35, -0.6); scene.add(sh);
  });

  // Pins: HTML buttons that follow a point on each granule.
  var pins = Array.prototype.slice.call(fig.querySelectorAll('[data-pin]'));
  var anchor = new THREE.Vector3();
  function size() {
    var w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false); cam.aspect = w / h;
    // Fit the 3 granules: half the row is about 5.2 units wide and 2.6 units high.
    var v = THREE.MathUtils.degToRad(cam.fov) / 2, hz = Math.atan(Math.tan(v) * cam.aspect);
    cam.position.z = Math.max(4.75 / Math.tan(hz), 2.4 / Math.tan(v)); cam.updateProjectionMatrix();
  }
  size(); window.addEventListener('resize', size);

  var px = 0, py = 0, tx = 0, ty = 0, t0 = performance.now(), visible = true, raf = 0;
  fig.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;
    var b = fig.getBoundingClientRect(); tx = ((e.clientX - b.left) / b.width - 0.5); ty = ((e.clientY - b.top) / b.height - 0.5); kick();
  });
  fig.addEventListener('pointerleave', function () { tx = 0; ty = 0; kick(); });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) kick(); }).observe(fig);
  function kick() { if (!raf && visible) raf = requestAnimationFrame(loop); }
  var still = 0;
  function loop() {
    raf = 0;
    var t = (performance.now() - t0) / 1000;
    px += (tx - px) * 0.06; py += (ty - py) * 0.06;
    groups.forEach(function (o, i) {
      // Each granule turns gently around the angle that shows its cut, so the core stays in view.
      o.g.rotation.y = FACE + (calm ? 0 : Math.sin(t * o.spin * 2 + i * 1.7) * 0.5) + px * 0.6;
      o.g.rotation.x = 0.25 + py * 0.35;
      o.g.position.y = o.G.y + (calm ? 0 : Math.sin(t * 0.8 + i) * 0.06);
    });
    renderer.render(scene, cam);
    var w = canvas.clientWidth, h = canvas.clientHeight;
    pins.forEach(function (p, i) {
      var o = groups[i]; if (!o) return;
      anchor.set(o.G.x + o.G.r * 0.55, o.G.y + o.G.r * 0.85, 0).project(cam);
      p.style.transform = 'translate(' + ((anchor.x * 0.5 + 0.5) * w).toFixed(1) + 'px,' + ((-anchor.y * 0.5 + 0.5) * h).toFixed(1) + 'px)';
      p.classList.add('is-placed');
    });
    if (calm) { if (++still > 30) return; }
    raf = requestAnimationFrame(loop);
  }
  kick();
})();
