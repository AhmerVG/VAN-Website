/* VAN flagship site, research page. 22 Nov 2026.
   Needs js/site.js before it. Every drawing on this page is built here as SVG; no photograph, no WebGL.
   Motion rules followed here:
   - full mode: timed tweens and idle loops run; calm mode: only scroll and direct input change a drawing.
   - Loops use real elapsed time (dt), run only while their drawing is on screen and the tab is visible.
   - If GSAP is missing, every drawing is still built and every control still works; nothing is pinned.
   - Pinned ScrollTriggers carry an explicit refreshPriority in page order: timeline 50, chemistry 49. */
(function () {
  'use strict';

  var V = window.VANSite || {};
  var root = document.documentElement;
  var calm = typeof V.calm === 'boolean' ? V.calm : root.classList.contains('calm');
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  var animate = hasGsap && !calm;   // timed GSAP tweens allowed
  var lively = !calm;               // timed motion of our own allowed
  var $ = V.$ || function (s, e) { return (e || document).querySelector(s); };
  var $$ = V.$$ || function (s, e) { return Array.prototype.slice.call((e || document).querySelectorAll(s)); };
  var NS = 'http://www.w3.org/2000/svg';

  root.classList.add('r-js');
  /* Test hooks, for still screenshots only. They change nothing unless the address carries them.
     ?only=chemistry leaves only that section on screen. ?step=N shows step N of each stepped drawing, with nothing pinned.
     With both, the section's pinned scene (if it has one) is laid over the window, as it sits when pinned.
     Either hook also shows every reveal at once, because a still cannot wait for the scroll. */
  var ONLY = (function () { var m = /[?&]only=([a-z]+)/.exec(window.location.search); return m && document.getElementById(m[1]) ? m[1] : ''; })();
  if (ONLY) $$('main > section').forEach(function (sec) { if (sec.id !== ONLY) sec.style.display = 'none'; });
  function stillPin(node, bg) {
    if (!ONLY || !node || !node.closest('#' + ONLY)) return;
    var st = node.style;
    st.position = 'fixed'; st.left = '0'; st.right = '0'; st.top = '0'; st.zIndex = '55';
    st.paddingLeft = 'var(--gutter)'; st.paddingRight = 'var(--gutter)'; st.background = bg;
  }
  var STEP = (function () { var m = /[?&]step=(\d+)/.exec(window.location.search); return m ? parseInt(m[1], 10) : 0; })();
  if (ONLY || STEP) $$('[data-reveal]').forEach(function (n) { n.classList.add('is-in'); });

  /* ---------- helpers ---------- */
  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    if (attrs) for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function smooth(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }
  function lerp(a, b, f) { return a + (b - a) * f; }
  function rng(seed) {
    var s = seed >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function scrollToY(y) {
    y = Math.max(0, Math.round(y));
    if (V.lenis) V.lenis.scrollTo(y);
    else window.scrollTo({ top: y, behavior: calm ? 'auto' : 'smooth' });
  }
  function onMedia(mq, fn) {
    if (mq.addEventListener) mq.addEventListener('change', fn);
    else if (mq.addListener) mq.addListener(fn);
  }
  function press(buttons, index) {
    buttons.forEach(function (b, i) { b.setAttribute('aria-pressed', i === index ? 'true' : 'false'); });
  }
  /* A frame loop that runs only in full mode, while the target is on screen and the tab is visible. */
  function viewLoop(target, frame) {
    var inView = false, gen = 0, running = false;
    function start() {
      var mine = ++gen, last = performance.now();
      running = true;
      (function tick(now) {
        if (mine !== gen) return;
        var dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
        last = now;
        frame(dt);
        requestAnimationFrame(tick);
      })(last);
    }
    function update() {
      var should = lively && inView && !document.hidden;
      if (should && !running) start();
      else if (!should && running) { running = false; gen++; }
    }
    if (!('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (es) {
      inView = es[es.length - 1].isIntersecting;
      update();
    }, { rootMargin: '8% 0px' }).observe(target);
    document.addEventListener('visibilitychange', update);
  }
  /* Runs fn once, the first time the target comes on screen. */
  function onceVisible(target, fn, margin) {
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { io.disconnect(); fn(); } });
    }, { rootMargin: margin || '0px 0px -15% 0px', threshold: 0.15 });
    io.observe(target);
  }

  /* line icons, used by Figure 4 and by the timeline scene for 2023 */
  var ICONS = [
    'M-24 15H24M-14 15V-5M-14 3c-6-2-8-6-8-10M-14 -1c6-2 8-6 8-10M0 15V-15M0 1c-6-2-8-6-8-10M0 -5c6-2 8-6 8-10M14 15V-5M14 3c-6-2-8-6-8-10M14 -1c6-2 8-6 8-10',
    'M-22 -3h44v20h-44zM-8 -3v20M8 -3v20M-16 -10l8 -8M-2 -10l8 -8M12 -10l8 -8',
    'M-18 20V-6a14 14 0 0 1 28 0V20M-24 20H28M16 20V-22h8V20M-4 13c-7-4-6-11 0-17c6 6 7 13 0 17z',
    'M-26 16c9-2 12-22 26-22s17 20 26 22zM-8 7h.1M3 1h.1M11 9h.1M-1 11h.1',
    'M-20 -14h26v22a13 10 0 0 1-26 0zM-7 -24v20M-13 -4h12M6 -6h14v14M20 22c-3-4-3-6 0-10c3 4 3 6 0 10z',
    'M-16 -21h32l-4 8v27a4 4 0 0 1-4 4h-16a4 4 0 0 1-4-4v-27zM-5 -4v16M-5 5l10-9M-1 2l7 10'
  ];

  /* ---------- opening ---------- */
  (function hero() {
    var title = $('#heroTitle');
    if (title && animate && V.splitWords) {
      gsap.from(V.splitWords(title), { yPercent: 112, duration: 1.15, ease: 'power4.out', stagger: 0.055, delay: 0.12 });
    }
    if (!$('#heroFig')) return;
    if (animate) {
      gsap.from('#heroCutA', { attr: { width: 0 }, duration: 1.7, ease: 'power3.inOut', delay: 0.5 });
      gsap.from('#heroCutB', { attr: { width: 0 }, duration: 1.7, ease: 'power3.inOut', delay: 0.8 });
    }
    if (hasGsap) {
      var trig = { trigger: '.r-hero', start: 'top top', end: 'bottom top', scrub: calm ? true : 0.6, refreshPriority: 60 };
      gsap.to('#heroSpinA', { rotation: 70, svgOrigin: '190 190', ease: 'none', scrollTrigger: trig });
      gsap.to('#heroSpinB', { rotation: -90, svgOrigin: '400 372', ease: 'none',
        scrollTrigger: { trigger: '.r-hero', start: 'top top', end: 'bottom top', scrub: calm ? true : 0.6, refreshPriority: 60 } });
    }
  })();

  /* ---------- 1. timeline ---------- */
  (function timeline() {
    var pin = $('#tlPin'), list = $('#tlList'), track = $('#tlTrack'), yearText = $('#tlYearText');
    if (!pin || !list || !track) return;
    var items = $$('.tl__item', list), n = items.length;
    if (n < 2) return;
    var Y0 = 2009, Y1 = 2026, TRIALS = 2009;
    var pos = function (y) { return (y - Y0) / (Y1 - Y0) * 100; };
    var years = items.map(function (it) { return parseFloat(it.getAttribute('data-year')); });
    var div = function (cls, parent) { var d = document.createElement('div'); d.className = cls; (parent || track).appendChild(d); return d; };

    div('tl__line');
    for (var y = Y0; y <= Y1; y++) div('tl__tick').style.left = pos(y) + '%';
    items.forEach(function (it) {
      var to = it.getAttribute('data-span');
      if (!to) return;
      var s = div('tl__span');
      var from = parseFloat(it.getAttribute('data-from') || it.getAttribute('data-year'));
      s.style.left = pos(from) + '%';
      s.style.width = (pos(parseFloat(to)) - pos(from)) + '%';
    });
    var bar = div('tl__bar');
    bar.style.left = pos(TRIALS) + '%';
    bar.style.width = (pos(Y1) - pos(TRIALS)) + '%';
    var barLabel = div('tl__bar-label');
    barLabel.style.left = pos(TRIALS) + '%';
    barLabel.textContent = 'Trials on our research farms';
    var marker = div('tl__marker');
    marker.setAttribute('aria-hidden', 'true');

    var dots = items.map(function (it, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'tl__dot' + (it.classList.contains('tl__item--outside') ? ' tl__dot--outside' : '');
      b.style.left = pos(years[i]) + '%';
      var h = $('h3', it);
      b.setAttribute('aria-label', it.getAttribute('data-label') + ': ' + (h ? h.textContent : ''));
      b.setAttribute('data-cursor', it.getAttribute('data-label'));
      var dot = document.createElement('i'), lab = document.createElement('span');
      lab.textContent = it.getAttribute('data-label');
      b.appendChild(dot); b.appendChild(lab);
      b.addEventListener('click', function () { go(i); });
      b.addEventListener('keydown', function (e) {
        var j = e.key === 'ArrowRight' ? i + 1 : (e.key === 'ArrowLeft' ? i - 1 : -1);
        if (j < 0 || j >= n) return;
        e.preventDefault();
        go(j); dots[j].focus();
      });
      track.appendChild(b);
      return b;
    });

    /* ----- 1 drawn scene for each entry. Colours come from the page's CSS variables, except natural material colours. ----- */
    var INK = 'var(--ink)', AMBER = 'var(--amber)', EMERALD = 'var(--emerald)', CLAY = 'var(--clay)', CANVAS = 'var(--canvas)', SOIL = 'var(--soil)', SULFUR = 'var(--sulfur)';
    var TEAL = '#2F8F8F', UREA = '#FBFAF6';
    function makeScene(svg) {
      var sc = { svg: svg, strokes: [], fills: [], move: null, t: 0, raf: 0 };
      svg.setAttribute('viewBox', '0 0 640 420');
      var mk = function (tag, attrs, parent) {
        var n = el(tag, null, parent || svg);
        for (var k in attrs) {
          if ((k === 'fill' || k === 'stroke') && String(attrs[k]).indexOf('var(') === 0) n.style[k] = attrs[k];
          else n.setAttribute(k, attrs[k]);
        }
        return n;
      };
      sc.mk = mk;
      /* a line that draws itself */
      sc.ln = function (tag, attrs, parent) {
        var a = { fill: 'none', stroke: INK, 'stroke-width': 1.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': 1 };
        for (var k in attrs) a[k] = attrs[k];
        var n = mk(tag, a, parent); sc.strokes.push(n); return n;
      };
      /* a shape that fades in after the lines */
      sc.fl = function (tag, attrs, parent) { var n = mk(tag, attrs, parent); n.__o = attrs.opacity != null ? +attrs.opacity : 1; sc.fills.push(n); return n; };
      sc.tx = function (str, x, y, size, anchor, cls, parent) {
        var n = mk('text', { x: x, y: y, 'font-size': size, 'text-anchor': anchor || 'start' }, parent);
        if (cls) n.setAttribute('class', cls);
        n.textContent = str; sc.fills.push(n); return n;
      };
      mk('rect', { x: 0, y: 0, width: 640, height: 420, rx: 18, fill: CLAY });
      return sc;
    }
    function setScene(sc, t) {
      var a = t / 1.2, off = (1 - smooth(a * 1.5)).toFixed(3), op = smooth((a - 0.4) / 0.6).toFixed(2), i;
      for (i = 0; i < sc.strokes.length; i++) sc.strokes[i].setAttribute('stroke-dashoffset', off);
      for (i = 0; i < sc.fills.length; i++) sc.fills[i].style.opacity = (op * (sc.fills[i].__o == null ? 1 : sc.fills[i].__o)).toFixed(2);
      if (sc.move) sc.move(smooth((t - 0.5) / 1.9));
    }
    function playScene(sc) {
      if (!sc) return;
      if (sc.raf) { cancelAnimationFrame(sc.raf); sc.raf = 0; }
      if (!lively || STEP) { setScene(sc, 99); return; }
      var last = performance.now();
      sc.t = 0; setScene(sc, 0);
      sc.raf = requestAnimationFrame(function tick(now) {
        sc.t += Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now;
        setScene(sc, sc.t);
        sc.raf = sc.t < 2.5 ? requestAnimationFrame(tick) : 0;
      });
    }

    var SCENES = {
      '2009': function (sc) {
        var r, c, j, crops = [];
        sc.fl('polygon', { points: '44,104 626,104 604,384 14,384', fill: SOIL, opacity: 0.22 });
        sc.tx('Trial plots', 44, 66, 15);
        for (r = 0; r < 3; r++) for (c = 0; c < 4; c++) {
          var w = 118, h = 62, sk = 14, x0 = 84 + c * 134 - r * 14, y0 = 126 + r * 82;
          var pts = x0 + ',' + y0 + ' ' + (x0 + w) + ',' + y0 + ' ' + (x0 + w - sk) + ',' + (y0 + h) + ' ' + (x0 - sk) + ',' + (y0 + h);
          sc.fl('polygon', { points: pts, fill: SOIL, opacity: 0.5 });
          sc.ln('polygon', { points: pts, 'stroke-width': 1.3 });
          for (j = 0; j < 5; j++) {
            var fx = x0 + (j + 0.5) / 5 * w;
            crops.push(sc.mk('line', { x1: fx - 1.5, y1: y0 + 7, x2: fx - sk + 1.5, y2: y0 + h - 7, stroke: EMERALD, 'stroke-width': 3.4, 'stroke-dasharray': '1.5 6.5', 'stroke-linecap': 'round' }));
          }
          sc.ln('line', { x1: x0 - sk + 9, y1: y0 + h, x2: x0 - sk + 9, y2: y0 + h - 24 });
          sc.fl('rect', { x: x0 - sk + 2, y: y0 + h - 34, width: 14, height: 10, fill: CANVAS, stroke: INK, 'stroke-width': 1.2 });
        }
        sc.move = function (q) { for (var i = 0; i < crops.length; i++) crops[i].style.opacity = q.toFixed(2); };
      },
      '2014': function (sc) {
        var pts = [[46, 136], [192, 214], [448, 206], [592, 300]], gr = [], i;
        sc.tx('Plain granules', 40, 96, 15);
        sc.tx('Coating drum', 320, 96, 15, 'middle');
        sc.tx('Boron-coated granules', 604, 392, 15, 'end');
        sc.ln('path', { d: 'M28 118 L192 204 M22 150 L186 236' });
        sc.ln('path', { d: 'M520 296 L532 330 L616 330 L628 296' });
        sc.ln('path', { d: 'M232 290 L212 356 M412 276 L432 356 M176 356 H468' });
        sc.fl('path', { d: 'M200 150 L440 130 L440 270 L200 290 Z', fill: CANVAS, opacity: 0.75 });
        sc.ln('path', { d: 'M200 150 L440 130 M440 270 L200 290' });
        sc.fl('ellipse', { cx: 200, cy: 220, rx: 26, ry: 70, fill: CANVAS });
        sc.ln('ellipse', { cx: 200, cy: 220, rx: 26, ry: 70 });
        sc.ln('ellipse', { cx: 440, cy: 200, rx: 26, ry: 70 });
        sc.ln('path', { d: 'M280 143 a26 70 0 0 1 0 140 M360 137 a26 70 0 0 1 0 140', 'stroke-width': 1.1 });
        for (i = 0; i < 8; i++) {
          var g = sc.mk('g', {});
          sc.mk('circle', { r: 11, fill: UREA, stroke: INK, 'stroke-width': 1.3 }, g);
          var ring = sc.mk('circle', { r: 11, fill: 'none', stroke: TEAL, 'stroke-width': 4.5 }, g);
          var spot = sc.mk('line', { x1: -5, y1: 0, x2: 5, y2: 0, stroke: INK, 'stroke-width': 1, opacity: 0.5 }, g);
          gr.push({ g: g, ring: ring, spot: spot });
        }
        sc.move = function (q) {
          for (var k = 0; k < gr.length; k++) {
            var f = clamp(k / 7 + (q - 1) * 0.32, 0, 1) * 3, s = Math.min(2, Math.floor(f)), u = f - s;
            var x = lerp(pts[s][0], pts[s + 1][0], u), y = lerp(pts[s][1], pts[s + 1][1], u) - (k % 2) * 9;
            gr[k].g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + (x * 2.4).toFixed(0) + ')');
            gr[k].g.style.opacity = smooth(q * 3).toFixed(2);
            gr[k].ring.style.opacity = smooth((f - 1.45) / 0.5).toFixed(2);
          }
        };
      },
      '2015': function (sc) {
        var rows = [], i;
        var plant = function (x, y, broad) {
          sc.ln('path', { d: 'M' + x + ' ' + (y + 46) + ' V' + (y - 40), stroke: EMERALD, 'stroke-width': 3 });
          sc.ln('path', { d: broad
            ? 'M' + x + ' ' + (y + 10) + ' c-34 -4 -44 -24 -40 -40 c26 2 40 16 40 40 M' + x + ' ' + (y - 8) + ' c34 -4 44 -24 40 -40 c-26 2 -40 16 -40 40'
            : 'M' + x + ' ' + (y + 20) + ' c-10 -22 -26 -30 -40 -30 M' + x + ' ' + y + ' c10 -22 26 -30 40 -30 M' + x + ' ' + (y - 16) + ' c-8 -18 -20 -26 -32 -26 M' + x + ' ' + (y - 40) + ' c-4 -14 4 -24 0 -34',
            stroke: EMERALD, 'stroke-width': 2.4 });
          sc.ln('line', { x1: x - 44, y1: y + 46, x2: x + 44, y2: y + 46 });
        };
        plant(104, 124, false); plant(104, 286, true);
        sc.fl('rect', { x: 482, y: 82, width: 104, height: 88, fill: '#D9BE94', stroke: INK, 'stroke-width': 1.3 });
        sc.fl('rect', { x: 482, y: 246, width: 104, height: 88, fill: SOIL, stroke: INK, 'stroke-width': 1.3 });
        var rr = rng(15);
        for (i = 0; i < 44; i++) sc.fl('circle', { cx: (488 + rr() * 92).toFixed(1), cy: (88 + rr() * 76).toFixed(1), r: 1.6, fill: SOIL });
        sc.ln('path', { d: 'M494 268 l18 10 l-8 14 l20 12 M548 252 l-10 22 l16 10 l-6 24 M520 300 l22 18', 'stroke-width': 1.2 });
        sc.fl('rect', { x: 250, y: 74, width: 140, height: 262, rx: 6, fill: CANVAS, stroke: INK, 'stroke-width': 1.5 });
        sc.fl('rect', { x: 266, y: 92, width: 108, height: 14, fill: INK });
        for (i = 0; i < 7; i++) {
          sc.fl('rect', { x: 266, y: 126 + i * 28, width: 12, height: 12, fill: i % 2 ? EMERALD : AMBER });
          rows.push(sc.mk('line', { x1: 288, y1: 132 + i * 28, x2: 374, y2: 132 + i * 28, stroke: INK, 'stroke-width': 2, pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1, opacity: 0.6 }));
        }
        sc.ln('path', { d: 'M152 124 C200 124 204 170 250 176 M152 286 C200 286 204 240 250 234 M482 126 C440 126 436 170 390 176 M482 290 C440 290 436 240 390 234', stroke: AMBER, 'stroke-width': 2 });
        sc.tx('Each crop', 104, 386, 15, 'middle');
        sc.tx('Crop plan', 320, 372, 15, 'middle');
        sc.tx('Each type of soil', 534, 386, 15, 'middle');
        sc.move = function (q) { for (var k = 0; k < rows.length; k++) rows[k].setAttribute('stroke-dashoffset', (1 - smooth(q * 1.6 - k * 0.08)).toFixed(3)); };
      },
      '2016 to 2018': function (sc) {
        var map = window.VAN_DATA && window.VAN_DATA.map, dots = [], i, rr = rng(31);
        if (map && map.districts) {
          var k = 384 / map.height, g = sc.mk('g', { transform: 'translate(44 18) scale(' + k.toFixed(4) + ')' }), spots = [];
          Object.keys(map.districts).forEach(function (name) {
            var d = map.districts[name].d;
            sc.fl('path', { d: d, fill: CANVAS, stroke: INK, 'stroke-width': 1.4 }, g);
            var re = /M(-?[\d.]+) (-?[\d.]+)/g, m;
            while ((m = re.exec(d))) spots.push([parseFloat(m[1]) + 2.5, parseFloat(m[2]) + 2.9]);
          });
          var n = Math.min(520, spots.length), step = spots.length / n;
          for (i = 0; i < n; i++) { var p = spots[Math.floor(i * step)]; dots.push(sc.mk('circle', { cx: p[0], cy: p[1], r: 5.2, fill: SOIL }, g)); }
        } else {
          sc.ln('rect', { x: 44, y: 40, width: 310, height: 340, rx: 10 });
          for (i = 0; i < 260; i++) dots.push(sc.mk('circle', { cx: (58 + rr() * 282).toFixed(1), cy: (54 + rr() * 312).toFixed(1), r: 3, fill: SOIL }));
        }
        dots.sort(function () { return rr() - 0.5; });
        sc.tx('Punjab soil testing programme', 392, 92, 13, 'start', 'tl-wide');
        sc.tx('770,160', 388, 176, 66, 'start', 'ser');
        sc.tx('soil samples tested', 392, 204, 15);
        sc.tx('36', 388, 300, 66, 'start', 'ser');
        sc.tx('districts of Punjab', 392, 328, 15);
        sc.move = function (q) { var on = q * dots.length; for (var j = 0; j < dots.length; j++) dots[j].style.opacity = j < on ? 1 : 0; };
      },
      '2019': function (sc) {
        var cx = 236, cy = 214, R = 142, defs = sc.mk('defs', {});
        var p1 = sc.mk('pattern', { id: 'tlSpS', width: 9, height: 9, patternUnits: 'userSpaceOnUse' }, defs);
        sc.mk('circle', { cx: 2, cy: 3, r: 1.2, fill: INK, opacity: 0.28 }, p1); sc.mk('circle', { cx: 6.5, cy: 7, r: 1, fill: CANVAS, opacity: 0.5 }, p1);
        var p2 = sc.mk('pattern', { id: 'tlSpU', width: 11, height: 11, patternUnits: 'userSpaceOnUse' }, defs);
        sc.mk('circle', { cx: 3, cy: 4, r: 1, fill: '#DDD8CB' }, p2); sc.mk('circle', { cx: 8.5, cy: 9, r: 0.8, fill: '#E4DFD2' }, p2);
        var cut = sc.mk('rect', { x: cx, y: cy - R - 4, width: R + 4, height: R * 2 + 8 }, sc.mk('clipPath', { id: 'tlCut' }, defs));
        sc.fl('circle', { cx: cx, cy: cy, r: R, fill: SULFUR });
        sc.fl('circle', { cx: cx, cy: cy, r: R, fill: 'url(#tlSpS)' });
        var face = sc.mk('g', { 'clip-path': 'url(#tlCut)' });
        sc.fl('circle', { cx: cx, cy: cy, r: R, fill: SULFUR }, face);
        sc.fl('circle', { cx: cx, cy: cy, r: R, fill: INK, opacity: 0.12 }, face);
        sc.fl('circle', { cx: cx, cy: cy, r: R - 20, fill: UREA }, face);
        sc.fl('circle', { cx: cx, cy: cy, r: R - 20, fill: 'url(#tlSpU)' }, face);
        sc.fl('circle', { cx: cx, cy: cy, r: R - 20, fill: 'none', stroke: INK, 'stroke-width': 1.1, opacity: 0.6 }, face);
        sc.fl('line', { x1: cx + 0.6, y1: cy - R, x2: cx + 0.6, y2: cy + R, stroke: INK, 'stroke-width': 1.2, opacity: 0.6 }, face);
        sc.ln('circle', { cx: cx, cy: cy, r: R, 'stroke-width': 1.3 });
        sc.ln('path', { d: 'M318 228 H432 M340 118 L432 96', 'stroke-width': 1.2 });
        sc.tx('Urea', 442, 233, 16);
        sc.tx('Coating of fine', 442, 92, 16);
        sc.tx('elemental sulfur', 442, 113, 16);
        sc.move = function (q) { cut.setAttribute('width', ((R + 4) * q).toFixed(1)); };
      },
      '2023': function (sc) {
        var xs = [92, 244, 396, 548], names = ['Crop residue', 'Boiler', 'Ash', 'Fertiliser'], ico = [1, 2, 3, 5], y = 234, i;
        sc.tx('Potassium', 92, 122, 15, 'middle');
        sc.fl('line', { x1: 92, y1: 144, x2: 548, y2: 144, stroke: AMBER, 'stroke-width': 1.6, 'stroke-dasharray': '2 7', 'stroke-linecap': 'round' });
        for (i = 0; i < 4; i++) {
          sc.fl('circle', { cx: xs[i], cy: y, r: 56, fill: CANVAS });
          sc.ln('circle', { cx: xs[i], cy: y, r: 56 });
          sc.ln('path', { d: ICONS[ico[i]], transform: 'translate(' + xs[i] + ' ' + y + ') scale(1.55)', 'stroke-width': 1.2 });
          sc.tx(names[i], xs[i], y + 88, 15, 'middle');
          if (i < 3) sc.ln('path', { d: 'M' + (xs[i] + 64) + ' ' + y + ' H' + (xs[i + 1] - 66) + ' m-9 -7 l9 7 l-9 7', 'stroke-width': 1.8 });
        }
        var dot = sc.mk('circle', { cx: 92, cy: 144, r: 9, fill: AMBER, stroke: INK, 'stroke-width': 1.2 });
        sc.move = function (q) { dot.setAttribute('cx', lerp(92, 548, q).toFixed(1)); dot.style.opacity = smooth(q * 4).toFixed(2); };
      },
      '2024': function (sc) {
        var liq = [], i;
        sc.fl('rect', { x: 196, y: 46, width: 248, height: 66, fill: CANVAS, stroke: INK, 'stroke-width': 1.8 });
        sc.tx('LAB 336', 320, 95, 44, 'middle', 'ser');
        sc.tx('8 of 21 fertiliser tests', 320, 140, 15, 'middle');
        sc.fl('rect', { x: 50, y: 316, width: 540, height: 20, fill: CANVAS, stroke: INK, 'stroke-width': 1.5 });
        sc.ln('path', { d: 'M82 336 V392 M558 336 V392 M40 392 H600' });
        liq.push(sc.mk('path', { d: 'M110 282 H194 L204 304 a6 6 0 0 1 -5 9 H105 a6 6 0 0 1 -5 -9 Z', fill: AMBER, opacity: 0.75 }));
        sc.ln('path', { d: 'M134 196 H170 M140 196 V236 L100 304 a6 6 0 0 0 5 10 H199 a6 6 0 0 0 5 -10 L164 236 V196' });
        liq.push(sc.mk('rect', { x: 246, y: 262, width: 72, height: 50, fill: EMERALD, opacity: 0.6 }));
        sc.ln('path', { d: 'M238 214 H246 V308 a6 6 0 0 0 6 6 H312 a6 6 0 0 0 6 -6 V214 H326 M246 240 H258 M246 262 H258 M246 284 H258' });
        liq.push(sc.mk('path', { d: 'M362 278 H438 A38 38 0 0 1 362 278 Z', fill: SULFUR, opacity: 0.8 }));
        sc.ln('path', { d: 'M390 172 H410 M392 172 V240 A38 38 0 1 0 408 240 V172 M392 204 H408' });
        for (i = 0; i < 3; i++) {
          liq.push(sc.mk('rect', { x: 484 + i * 30, y: 268, width: 14, height: 32, rx: 6, fill: i === 1 ? AMBER : EMERALD, opacity: 0.6 }));
          sc.ln('path', { d: 'M' + (484 + i * 30) + ' 222 V294 a7 7 0 0 0 14 0 V222' });
        }
        sc.ln('path', { d: 'M470 250 H572 M470 306 H572 M476 250 V316 M566 250 V316' });
        sc.move = function (q) { for (var k = 0; k < liq.length; k++) liq[k].style.opacity = (q * (k === 2 ? 0.8 : 0.65)).toFixed(2); };
      },
      '2026': function (sc) {
        var col = [], i, rr = rng(77), dishes = [[430, 132, 60], [544, 250, 50], [414, 296, 48]];
        sc.fl('rect', { x: 66, y: 44, width: 236, height: 332, rx: 4, fill: CANVAS, stroke: INK, 'stroke-width': 1.6 });
        sc.tx('Pakistan Patent', 184, 96, 15, 'middle');
        sc.tx('144684', 184, 162, 50, 'middle', 'ser');
        sc.tx('Vital Urea', 184, 196, 15, 'middle');
        sc.ln('path', { d: 'M96 116 H272 M96 232 H272 M96 256 H272 M96 280 H272 M96 304 H236 M96 328 H256 M96 352 H200', 'stroke-width': 1.2, opacity: 0.55 });
        dishes.forEach(function (d, k) {
          sc.fl('circle', { cx: d[0], cy: d[1], r: d[2], fill: CANVAS });
          sc.ln('circle', { cx: d[0], cy: d[1], r: d[2] });
          sc.ln('circle', { cx: d[0], cy: d[1], r: d[2] - 8, 'stroke-width': 1 });
          for (i = 0; i < 16; i++) {
            var a = rr() * 6.283, r0 = Math.sqrt(rr()) * (d[2] - 18);
            col.push(sc.mk('circle', { cx: (d[0] + Math.cos(a) * r0).toFixed(1), cy: (d[1] + Math.sin(a) * r0).toFixed(1), r: (2.5 + rr() * 4.5).toFixed(1), fill: [EMERALD, AMBER, SOIL][k] }));
          }
        });
        sc.tx('Biological laboratory', 474, 388, 15, 'middle');
        sc.move = function (q) { var on = q * col.length; for (var j = 0; j < col.length; j++) col[j].style.opacity = j < on ? 0.85 : 0; };
      }
    };
    var scenes = items.map(function (it) {
      var svg = $('.tl__svg', it), fn = SCENES[it.getAttribute('data-label')];
      if (!svg || !fn) return null;
      var sc = makeScene(svg);
      fn(sc);
      setScene(sc, lively && !STEP ? 0 : 99);
      return sc;
    });
    /* In the stacked list each scene draws itself once, when it comes on screen. In the pinned view setActive() plays it. */
    scenes.forEach(function (sc) { if (sc && lively && !STEP) onceVisible(sc.svg, function () { if (!pin.classList.contains('tl--live')) playScene(sc); }); });

    var active = -1, st = null;
    function setActive(i) {
      if (i === active) return;
      var dir = i > active ? 1 : -1;
      active = i;
      items.forEach(function (it, k) { it.classList.toggle('is-active', k === i); });
      if (pin.classList.contains('tl--live')) playScene(scenes[i]);
      dots.forEach(function (d, k) { if (k === i) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
      if (yearText) {
        yearText.textContent = items[i].getAttribute('data-label');
        yearText.parentNode.classList.toggle('is-long', items[i].getAttribute('data-label').length > 4);
        if (animate) gsap.fromTo(yearText, { yPercent: dir * 34, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.55, ease: 'power3.out', overwrite: true });
      }
    }
    function setProgress(p) {
      var f = clamp(p, 0, 1) * (n - 1), i0 = Math.min(n - 1, Math.floor(f)), i1 = Math.min(n - 1, i0 + 1);
      var yr = lerp(years[i0], years[i1], f - i0);
      marker.style.left = pos(yr) + '%';
      bar.style.transform = 'scaleX(' + clamp((yr - TRIALS) / (Y1 - TRIALS), 0, 1).toFixed(4) + ')';
      setActive(Math.round(f));
    }
    function go(i) {
      if (st) scrollToY(st.start + (i / (n - 1)) * (st.end - st.start));
      else setProgress(i / (n - 1));
    }

    if (STEP) {
      if (window.matchMedia('(min-width: 900px)').matches) { pin.classList.add('tl--live'); stillPin(pin, 'var(--canvas)'); }
      setProgress((clamp(STEP, 1, n) - 1) / (n - 1));
      return;
    }
    if (!hasGsap) return;
    var mm = gsap.matchMedia();
    mm.add('(min-width: 900px) and (min-height: 640px)', function () {
      pin.classList.add('tl--live');
      var proxy = { p: 0 };
      setProgress(0);
      var tween = gsap.to(proxy, {
        p: 1, ease: 'none',
        onUpdate: function () { setProgress(proxy.p); },
        scrollTrigger: {
          trigger: pin, start: 'top top',
          end: function () { return '+=' + Math.round(window.innerHeight * 0.5 * (n - 1)); },
          pin: true, scrub: calm ? true : 0.5,
          refreshPriority: 50, invalidateOnRefresh: true, anticipatePin: 1
        }
      });
      st = tween.scrollTrigger;
      return function () {
        st = null; active = -1;
        pin.classList.remove('tl--live');
        items.forEach(function (it) { it.classList.remove('is-active'); });
      };
    });
  })();

  /* ---------- 1b. soil samples: a field of 1,000 dots ---------- */
  (function samples() {
    var svg = $('#dotField'), pick = $('#condPick');
    var panels = $$('#condPanels .cond');
    if (!svg || !pick || !panels.length) return;
    var buttons = $$('button', pick);
    var mq = window.matchMedia('(max-width: 700px)');
    var circles = [], current = 0, shown = false;

    function build() {
      var cols = mq.matches ? 25 : 50, rows = 1000 / cols, s = 10;
      svg.setAttribute('viewBox', '0 0 ' + (cols * s) + ' ' + (rows * s));
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      circles = [];
      for (var i = 0; i < 1000; i++) {
        var c = el('circle', { cx: (i % cols) * s + s / 2, cy: Math.floor(i / cols) * s + s / 2, r: 3.2 }, svg);
        if (lively) c.style.transitionDelay = Math.round(i * 0.55) + 'ms';
        circles.push(c);
      }
      if (shown) paint();
    }
    function paint() {
      var share = parseFloat(panels[current].getAttribute('data-share'));
      var k = Math.round(share * 10);
      for (var i = 0; i < circles.length; i++) circles[i].classList.toggle('on', i < k);
    }
    function choose(i) {
      current = i;
      press(buttons, i);
      panels.forEach(function (p, k) { p.classList.toggle('is-active', k === i); });
      if (shown) paint();
    }
    buttons.forEach(function (b, i) { b.addEventListener('click', function () { choose(i); }); });
    build();
    choose(0);
    onMedia(mq, build);
    onceVisible(svg, function () { shown = true; paint(); });
  })();

  /* ---------- 2. chemistry of calcareous soil ---------- */
  (function chemistry() {
    var frame = $('#chemFrame'), svg = $('#chemSvg'), divider = $('#chemDivider'), pinEl = $('#chemPin');
    if (!frame || !svg || !divider) return;
    var stageButtons = $$('#chemStages button');
    var stageTexts = $$('#chemRead .chem__st');
    var mq = window.matchMedia('(max-width: 700px)');
    var S = { t: 0, d: 0.5, clock: 0, stage: -1, touched: false };
    var L = null, P = null, live = null;
    var NN = 26, NP = 14, NSUL = 34;

    function label(group, lines, x, y, anchor, fs) {
      var t = el('text', { x: x, y: y, 'text-anchor': anchor, 'font-size': fs, stroke: '#EFE6D6', 'stroke-width': fs * 0.3, 'stroke-linejoin': 'round', 'paint-order': 'stroke' }, group);
      lines.forEach(function (ln, i) {
        var s = el('tspan', { x: x, dy: i === 0 ? 0 : fs * 1.2 }, t);
        s.textContent = ln;
      });
      return t;
    }

    /* The drawing has 2 sites, one in each half. Each site holds a nitrogen granule above a phosphate granule.
       The left layer draws plain urea and DAP at both sites. The right layer draws Vital Urea and Green Phosphate
       at the same 2 sites. With the divider in the middle, each half shows its own pair of granules. */
    function build() {
      var tall = mq.matches;
      L = tall
        ? { W: 600, H: 820, surf: 150, sx: [150, 450], ny: 320, py: 600, fs: 21, rN: 34, rP: 31, Z: 96, spread: 92, seedDx: 92, flecks: 110 }
        : { W: 1200, H: 600, surf: 104, sx: [300, 900], ny: 250, py: 415, fs: 17, rN: 34, rP: 31, Z: 104, spread: 115, seedDx: 124, flecks: 170 };
      var W = L.W, H = L.H, r = rng(7), i, k;
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      P = { sites: [], lab: [] };

      var defs = el('defs', null, svg);
      P.clipL = el('rect', { x: 0, y: 0, width: W / 2, height: H }, el('clipPath', { id: 'chemClipL' }, defs));
      P.clipR = el('rect', { x: W / 2, y: 0, width: W / 2, height: H }, el('clipPath', { id: 'chemClipR' }, defs));

      /* shared ground: air, soil, irrigation water, lime, and a seed with its shoot and root at each site */
      var bg = el('g', null, svg);
      el('rect', { x: 0, y: 0, width: W, height: L.surf, fill: '#EFEBE2' }, bg);
      el('rect', { x: 0, y: L.surf, width: W, height: H - L.surf, fill: '#CBB08D' }, bg);
      for (i = 0; i < L.flecks; i++) {
        el('circle', { cx: (r() * W).toFixed(1), cy: (L.surf + 6 + r() * (H - L.surf - 8)).toFixed(1), r: (0.8 + r() * 1.8).toFixed(1), fill: '#B0926D' }, bg);
      }
      P.wet = el('rect', { x: 0, y: L.surf, width: W, height: 0, fill: '#84643F', opacity: 0.5 }, bg);
      P.front = el('line', { x1: 0, x2: W, y1: L.surf, y2: L.surf, stroke: '#4F7F99', 'stroke-width': 3, 'stroke-dasharray': '2 9', 'stroke-linecap': 'round', opacity: 0 }, bg);
      var fleck = function (x, y, size) {
        var a = r() * Math.PI, pts = [], q, m = 5;
        for (q = 0; q < m; q++) {
          var ang = a + q / m * Math.PI * 2, rad = size * (0.55 + r() * 0.6);
          pts.push((x + Math.cos(ang) * rad * 1.25).toFixed(1) + ',' + (y + Math.sin(ang) * rad * 0.8).toFixed(1));
        }
        el('polygon', { points: pts.join(' '), fill: '#FFFFFF', stroke: '#DCD2BF', 'stroke-width': 0.6 }, bg);
      };
      var clear = function (x, y) {
        for (var c = 0; c < 2; c++) {
          if (Math.hypot(x - L.sx[c], y - L.ny) < L.rN + 16 || Math.hypot(x - L.sx[c], y - L.py) < L.rP + 14) return false;
        }
        return true;
      };
      for (i = 0; i < L.flecks; i++) {
        var fx = r() * W, fy = L.surf + 12 + r() * (H - L.surf - 20);
        if (clear(fx, fy)) fleck(fx, fy, 3 + r() * 4.5);
      }
      /* lime close to each phosphate granule: the calcium that dissolving phosphate meets */
      var nearLime = [];
      for (i = 0; i < NP; i++) {
        var la = (i / NP) * Math.PI * 2 + r() * 0.3, lr = L.rP + 20 + r() * (L.Z - L.rP - 30);
        nearLime.push([Math.cos(la) * lr, Math.sin(la) * lr]);
      }
      for (k = 0; k < 2; k++) for (i = 0; i < NP; i++) fleck(L.sx[k] + nearLime[i][0], L.py + nearLime[i][1], 5.5);
      var surfD = 'M0 ' + L.surf;
      for (i = 1; i <= 24; i++) surfD += ' L' + (W * i / 24).toFixed(1) + ' ' + (L.surf + (r() - 0.5) * 5).toFixed(1);
      el('path', { d: surfD, fill: 'none', stroke: '#5C4A33', 'stroke-width': 2 }, bg);
      label(bg, ['Soil above pH 8'], 14, L.surf + L.fs * 1.1, 'start', L.fs * 0.82).setAttribute('opacity', 0.8);

      /* dot seeds, the same at both sites and on both sides, so that only the timing differs between the sides */
      P.seedN = [];
      for (i = 0; i < NN; i++) {
        var fate = i % 3;                       // 0 rises to the air, 1 goes down with the water, 2 stays in the root zone
        var dx, ty, rel = false, dur;
        if (fate === 0) { dx = (r() - 0.5) * 2 * L.spread; ty = L.surf - 18 - r() * 50; dur = 0.75; }
        else if (fate === 1) { dx = (r() - 0.5) * 2 * L.spread * 0.9; ty = H - 14 - r() * 30; dur = 0.9; }
        else { var a2 = r() * Math.PI * 2, d2 = 44 + r() * (L.spread - 50); dx = Math.cos(a2) * d2; ty = Math.sin(a2) * d2 * 0.8; rel = true; dur = 0.4; }
        P.seedN.push({ fate: fate, u: (i + r() * 0.8) / NN, dx: dx, ty: ty, rel: rel, dur: dur, ph: r() * 6.28 });
      }
      P.seedP = [];
      for (i = 0; i < NP; i++) {
        var a3 = r() * Math.PI * 2, d3 = L.rP + 14 + r() * (L.Z - L.rP - 30);
        P.seedP.push({ u: (i + r() * 0.8) / NP, bx: nearLime[i][0] + 6, by: nearLime[i][1] - 6, fx: Math.cos(a3) * d3, fy: Math.sin(a3) * d3,
          free: i % 5 === 0,                    // on the DAP side most phosphate binds and a few dots stay free
          late: i % 5 === 2,                    // on the Green Phosphate side a few dots bind by the last stage
          ph: r() * 6.28 });
      }

      var gL = el('g', { 'clip-path': 'url(#chemClipL)' }, svg);
      var gR = el('g', { 'clip-path': 'url(#chemClipR)' }, svg);
      var fs = L.fs, lh = fs * 1.2;
      var dotN = function (g) { return el('circle', { r: 4.6, fill: '#FBFAF6', stroke: '#171A16', 'stroke-width': 1.6, opacity: 0 }, g); };
      var dotP = function (g) { return el('circle', { r: 4.6, fill: '#B4642A', stroke: '#FBFAF6', 'stroke-width': 1.3, opacity: 0 }, g); };

      for (k = 0; k < 2; k++) {
        var x = L.sx[k], T = { x: x, nL: [], nR: [], pL: [], pR: [], sul: [], lab: {} };
        /* seed, shoot and root, in the shared ground */
        var sx = x + L.seedDx, sy = L.surf + 30, ex = x + L.rP + 16, ey = L.py - 44;
        var rootD = 'M' + sx + ' ' + sy + ' C' + (sx + 18) + ' ' + lerp(sy, ey, 0.4) + ' ' + (ex + (sx - ex) * 0.8) + ' ' + lerp(sy, ey, 0.75) + ' ' + ex + ' ' + ey;
        T.rootEdge = el('path', { d: rootD, fill: 'none', stroke: '#6B5536', 'stroke-width': 6.5, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 0.88 }, bg);
        T.root = el('path', { d: rootD, fill: 'none', stroke: '#F4ECD9', 'stroke-width': 3.6, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 0.88 }, bg);
        T.shoot = el('path', { d: 'M' + sx + ' ' + sy + ' C' + (sx - 6) + ' ' + (sy - 30) + ' ' + (sx + 8) + ' ' + (L.surf - 30) + ' ' + (sx + 2) + ' ' + (L.surf - 60), fill: 'none', stroke: '#2D5A3C', 'stroke-width': 4, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1 }, bg);
        el('ellipse', { cx: sx, cy: sy, rx: 9, ry: 6.5, fill: '#C9A45C', stroke: '#6B5536', 'stroke-width': 1.4 }, bg);

        /* left layer: plain urea and DAP */
        T.urea = el('circle', { cx: x, cy: L.ny, r: L.rN, fill: '#FBFAF6', stroke: '#8E897B', 'stroke-width': 1.5 }, gL);
        T.dap = el('circle', { cx: x, cy: L.py, r: L.rP, fill: '#6E4A2E', stroke: '#3F2A18', 'stroke-width': 1.5 }, gL);
        for (i = 0; i < NN; i++) T.nL.push(dotN(gL));
        for (i = 0; i < NP; i++) T.pL.push(dotP(gL));
        label(gL, ['Plain urea'], x, L.ny - L.rN - 12, 'middle', fs);
        label(gL, ['DAP'], x, L.py - L.rP - 12, 'middle', fs);
        T.lab.air = label(gL, ['Ammonia lost', 'to the air'], x, L.surf - lh - 12, 'middle', fs * 0.92);
        T.lab.down = label(gL, ['Nitrogen carried', 'below the roots'], x, H - lh - 14, 'middle', fs * 0.92);
        T.lab.bound = label(gL, ['Phosphate bound', 'by calcium'], x, L.py + L.rP + 28, 'middle', fs * 0.92);

        /* right layer: Vital Urea and Green Phosphate */
        T.zone = el('circle', { cx: x, cy: L.py, r: L.Z, fill: 'rgba(196,106,44,0.28)', stroke: '#7A3E12', 'stroke-width': 1.6, 'stroke-dasharray': '7 6', opacity: 0 }, gR);
        T.scuCore = el('circle', { cx: x, cy: L.ny, r: L.rN - 7, fill: '#FBFAF6', stroke: '#8E897B', 'stroke-width': 1 }, gR);
        T.scuCoat = el('circle', { cx: x, cy: L.ny, r: L.rN - 3.5, fill: 'none', stroke: '#E6BE3C', 'stroke-width': 7 }, gR);
        T.scuEdge = el('circle', { cx: x, cy: L.ny, r: L.rN, fill: 'none', stroke: '#9C7A12', 'stroke-width': 1.2 }, gR);
        for (i = 0; i < NSUL; i++) {
          var sa = (i / NSUL) * Math.PI * 2, sr = L.rN - 3.5 + (r() - 0.5) * 7;
          T.sul.push(el('circle', { cx: (x + Math.cos(sa) * sr).toFixed(1), cy: (L.ny + Math.sin(sa) * sr).toFixed(1), r: 2.7, fill: '#E6BE3C', stroke: '#8C6C0C', 'stroke-width': 0.8, opacity: 0 }, gR));
        }
        T.gpCore = el('circle', { cx: x, cy: L.py, r: L.rP - 6, fill: '#7A5233', stroke: '#3F2A18', 'stroke-width': 1 }, gR);
        T.gpCoat = el('circle', { cx: x, cy: L.py, r: L.rP - 3, fill: 'none', stroke: '#2B2B28', 'stroke-width': 6 }, gR);
        for (i = 0; i < NN; i++) T.nR.push(dotN(gR));
        for (i = 0; i < NP; i++) T.pR.push(dotP(gR));
        label(gR, ['Vital Urea'], x, L.ny - L.rN - 12, 'middle', fs);
        T.lab.sul = label(gR, ['Fine sulfur stays', 'in place'], x, L.ny + L.rN + 26, 'middle', fs * 0.92);
        label(gR, ['Green Phosphate'], x, L.py - L.rP - 12, 'middle', fs);
        T.lab.zone = label(gR, ['Acidic zone, a few', 'centimetres wide'], x, L.py + L.rP + 28, 'middle', fs * 0.92);
        P.sites.push(T);
      }

      setD(S.d);
      S.stage = -1;
      render();
    }

    function setD(d) {
      S.d = clamp(d, 0.03, 0.97);
      if (!L) return;
      var x = S.d * L.W;
      P.clipL.setAttribute('width', x.toFixed(1));
      P.clipR.setAttribute('x', x.toFixed(1));
      P.clipR.setAttribute('width', (L.W - x).toFixed(1));
      divider.style.left = (S.d * 100).toFixed(2) + '%';
      var pc = Math.round(S.d * 100);
      divider.setAttribute('aria-valuenow', pc);
      divider.setAttribute('aria-valuetext', pc + '% of the drawing shows plain urea and DAP');
    }

    function placeN(nodes, x, release, t) {
      for (var i = 0; i < NN; i++) {
        var s = P.seedN[i], c = nodes[i], pr = clamp((t - release(s.u)) / s.dur, 0, 1);
        if (pr <= 0) { c.setAttribute('opacity', 0); continue; }
        var e = smooth(pr), px = x + s.dx * e, py = lerp(L.ny, s.rel ? L.ny + s.ty : s.ty, e), op = 1;
        if (s.fate === 0) op = 1 - smooth((pr - 0.72) / 0.28);
        if (s.fate === 1) op = 1 - 0.75 * smooth((pr - 0.8) / 0.2);
        if (lively && pr > 0.05) { px += Math.sin(S.clock * 1.3 + s.ph) * 2.4; py += Math.cos(S.clock * 1.1 + s.ph * 1.7) * 2.4; }
        c.setAttribute('cx', px.toFixed(1)); c.setAttribute('cy', py.toFixed(1)); c.setAttribute('opacity', op.toFixed(2));
      }
    }
    function fade(node, v) { node.setAttribute('opacity', clamp(v, 0, 1).toFixed(2)); }
    function paintP(c, bound) {
      c.setAttribute('fill', bound ? '#8C8C84' : '#B4642A');
      c.setAttribute('stroke', bound ? '#FFFFFF' : '#FBFAF6');
      c.setAttribute('stroke-width', bound ? 2.2 : 1.3);
    }

    function render() {
      if (!L) return;
      var t = S.t, i, k, H = L.H;
      var wetH = smooth((t - 0.18) / 0.72) * (H - L.surf);
      P.wet.setAttribute('height', wetH.toFixed(1));
      P.front.setAttribute('y1', (L.surf + wetH).toFixed(1)); P.front.setAttribute('y2', (L.surf + wetH).toFixed(1));
      fade(P.front, (t > 0.18 && wetH < H - L.surf - 3) ? 0.9 : 0);
      var grow = (1 - (0.12 + 0.88 * smooth((t - 0.9) / 1.1))).toFixed(3);
      var shoot = (1 - smooth((t - 0.95) / 1.05)).toFixed(3);
      var open = smooth((t - 0.45) / 0.55);
      var sulR = (2.7 * (1 - 0.35 * smooth((t - 1) / 1.2))).toFixed(2);
      var zone = smooth((t - 0.5) / 0.4) * (1 - 0.7 * smooth((t - 1.55) / 0.45));   // the acidic zone fades at the last stage
      var relL = function (u) { return 0.4 + 0.42 * u; }, relR = function (u) { return 0.5 + 2.0 * u; };

      for (k = 0; k < 2; k++) {
        var T = P.sites[k], x = T.x;
        T.root.setAttribute('stroke-dashoffset', grow); T.rootEdge.setAttribute('stroke-dashoffset', grow);
        T.shoot.setAttribute('stroke-dashoffset', shoot);

        /* left: the plain urea granule dissolves in the first irrigation, so all of its nitrogen is in the soil water at once */
        T.urea.setAttribute('r', (L.rN * (1 - smooth((t - 0.38) / 0.5))).toFixed(1));
        T.dap.setAttribute('r', (L.rP * (1 - 0.45 * smooth((t - 0.6) / 1.3))).toFixed(1));
        placeN(T.nL, x, relL, t);
        for (i = 0; i < NP; i++) {
          var s = P.seedP[i], c = T.pL[i], pr = clamp((t - (0.7 + 0.85 * s.u)) / 0.45, 0, 1);
          if (pr <= 0) { c.setAttribute('opacity', 0); continue; }
          var e = smooth(pr);
          c.setAttribute('cx', (x + (s.free ? s.fx : s.bx) * e).toFixed(1));
          c.setAttribute('cy', (L.py + (s.free ? s.fy : s.by) * e).toFixed(1));
          c.setAttribute('opacity', 1);
          paintP(c, !s.free && pr >= 1);
        }
        fade(T.lab.air, smooth((t - 0.85) / 0.3));
        fade(T.lab.down, smooth((t - 1.0) / 0.3));
        fade(T.lab.bound, smooth((t - 1.25) / 0.3));

        /* right: nitrogen leaves the coated granule over several days; the fine sulfur stays where the granule was placed */
        T.scuCore.setAttribute('r', ((L.rN - 7) * (1 - 0.8 * smooth((t - 0.5) / 1.6))).toFixed(1));
        fade(T.scuCoat, 1 - open); fade(T.scuEdge, 1 - open);
        for (i = 0; i < NSUL; i++) { T.sul[i].setAttribute('opacity', open.toFixed(2)); T.sul[i].setAttribute('r', sulR); }
        placeN(T.nR, x, relR, t);
        fade(T.zone, zone);
        T.gpCore.setAttribute('r', ((L.rP - 6) * (1 - 0.3 * smooth((t - 0.6) / 1.4))).toFixed(1));
        fade(T.gpCoat, 1 - 0.5 * smooth((t - 0.5) / 0.9));
        for (i = 0; i < NP; i++) {
          var s2 = P.seedP[i], c2 = T.pR[i], pr2 = clamp((t - (0.7 + 0.85 * s2.u)) / 0.45, 0, 1);
          if (pr2 <= 0) { c2.setAttribute('opacity', 0); continue; }
          var e2 = smooth(pr2), q = s2.late ? smooth((t - 1.55) / 0.35) : 0;
          var x2 = x + lerp(s2.fx * e2, s2.bx, q), y2 = L.py + lerp(s2.fy * e2, s2.by, q);
          if (lively && q < 1) { x2 += Math.sin(S.clock * 1.2 + s2.ph) * 2.2; y2 += Math.cos(S.clock * 1.4 + s2.ph * 1.3) * 2.2; }
          c2.setAttribute('cx', x2.toFixed(1)); c2.setAttribute('cy', y2.toFixed(1)); c2.setAttribute('opacity', 1);
          paintP(c2, q >= 1);
        }
        fade(T.lab.sul, smooth((t - 0.9) / 0.3));
        fade(T.lab.zone, smooth((t - 0.75) / 0.3));
      }

      var stage = clamp(Math.round(t), 0, 2);
      if (stage !== S.stage) {
        S.stage = stage;
        press(stageButtons, stage);
        stageTexts.forEach(function (n, j) { n.classList.toggle('is-active', j === stage); });
      }
    }

    function goStage(i) {
      if (live) { scrollToY(live.start + (i / 2) * (live.end - live.start)); return; }
      if (animate) gsap.to(S, { t: i, duration: 1.5, ease: 'power2.inOut', overwrite: true, onUpdate: render });
      else { S.t = i; render(); }
    }
    stageButtons.forEach(function (b, i) { b.addEventListener('click', function () { goStage(i); }); });

    /* divider: pointer and keyboard. Only the handle takes the drag, so the drawing never blocks touch scrolling. */
    var dragging = false;
    function fromEvent(e) {
      var rect = frame.getBoundingClientRect();
      if (rect.width > 0) setD((e.clientX - rect.left) / rect.width);
    }
    divider.addEventListener('pointerdown', function (e) {
      dragging = true; S.touched = true;
      divider.classList.add('is-drag');
      if (divider.setPointerCapture) { try { divider.setPointerCapture(e.pointerId); } catch (err) {} }
      e.preventDefault();
      divider.focus();
    });
    divider.addEventListener('pointermove', function (e) { if (dragging) fromEvent(e); });
    var endDrag = function () { dragging = false; divider.classList.remove('is-drag'); };
    divider.addEventListener('pointerup', endDrag);
    divider.addEventListener('pointercancel', endDrag);
    divider.addEventListener('lostpointercapture', endDrag);
    divider.addEventListener('keydown', function (e) {
      var d = S.d;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') d -= 0.04;
      else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') d += 0.04;
      else if (e.key === 'PageDown') d -= 0.2;
      else if (e.key === 'PageUp') d += 0.2;
      else if (e.key === 'Home') d = 0;
      else if (e.key === 'End') d = 1;
      else return;
      e.preventDefault(); S.touched = true;
      setD(d);
    });
    frame.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('#chemDivider')) return;
      S.touched = true;
      var rect = frame.getBoundingClientRect();
      if (rect.width <= 0) return;
      var to = clamp((e.clientX - rect.left) / rect.width, 0.03, 0.97);
      if (animate) { var o = { d: S.d }; gsap.to(o, { d: to, duration: 0.7, ease: 'power3.out', onUpdate: function () { setD(o.d); } }); }
      else setD(to);
    });

    build();
    onMedia(mq, build);
    viewLoop(frame, function (dt) { S.clock += dt; render(); });
    if (animate) {
      onceVisible(frame, function () {
        if (S.touched) return;
        var o = { d: S.d };
        gsap.timeline({ onUpdate: function () { if (!S.touched) setD(o.d); } })
          .to(o, { d: 0.66, duration: 0.9, ease: 'power2.inOut' })
          .to(o, { d: 0.36, duration: 1.1, ease: 'power2.inOut' })
          .to(o, { d: 0.5, duration: 0.8, ease: 'power2.inOut' });
      }, '0px 0px -30% 0px');
    }

    if (STEP) {
      if (pinEl && window.matchMedia('(min-width: 900px)').matches) { pinEl.classList.add('chem--live'); stillPin(pinEl, 'var(--clay)'); }
      S.t = clamp(STEP, 1, 3) - 1; S.touched = true;
      render();
      return;
    }
    if (!hasGsap || !pinEl) return;
    var mm = gsap.matchMedia();
    var drive = function (trigger) {
      var proxy = { p: S.t };
      var tween = gsap.fromTo(proxy, { p: 0 }, { p: 2, ease: 'none', onUpdate: function () { S.t = proxy.p; render(); }, scrollTrigger: trigger });
      live = tween.scrollTrigger;
    };
    /* wide and tall enough: the scene is pinned and the scroll moves it through its 3 stages */
    mm.add('(min-width: 900px) and (min-height: 800px)', function () {
      pinEl.classList.add('chem--live');
      drive({ trigger: pinEl, start: 'top top', end: '+=170%', pin: true, scrub: calm ? true : 0.6, refreshPriority: 49, invalidateOnRefresh: true, anticipatePin: 1 });
      return function () { live = null; pinEl.classList.remove('chem--live'); };
    });
    /* smaller screens: nothing is pinned; the scroll past the drawing moves it through the same stages */
    mm.add('(max-width: 899px), (max-height: 799px)', function () {
      drive({ trigger: frame, start: 'top 62%', end: 'bottom 38%', scrub: calm ? true : 0.6, refreshPriority: 49, invalidateOnRefresh: true });
      return function () { live = null; };
    });
  })();

  /* ---------- 3. circular economy: the potash loop ---------- */
  (function circular() {
    var svg = $('#circSvg'), frame = $('#circFrame');
    var steps = $$('#circSteps .circ__step');
    if (!svg || !steps.length) return;
    var mq = window.matchMedia('(max-width: 700px)');
    var S = { scroll: hasGsap ? 0 : 1, clock: 0, active: 0, fromScroll: -1 };
    var G = null, NK = 16;
    var NAMES = ['The field', 'The harvest', 'The boiler', 'The ash', 'Recovery at VAN', 'Fertiliser'];
    var FLASK = 'M-6 -16h12M-4 -16v10l-10 18a3 3 0 0 0 3 4h22a3 3 0 0 0 3-4l-10-18v-10';

    function text(parent, lines, x, y, anchor, fs, extra) {
      var a = { x: x, y: y, 'text-anchor': anchor, 'font-size': fs, stroke: '#171A16', 'stroke-width': fs * 0.35, 'stroke-linejoin': 'round', 'paint-order': 'stroke' };
      if (extra) for (var k in extra) a[k] = extra[k];
      var t = el('text', a, parent);
      lines.forEach(function (ln, i) { var s = el('tspan', { x: x, dy: i === 0 ? 0 : fs * 1.22 }, t); s.textContent = ln; });
      return t;
    }

    function build() {
      var tall = mq.matches;
      var W = tall ? 600 : 1200, H = tall ? 980 : 720;
      var x0 = tall ? 150 : 150, y0 = tall ? 200 : 190, x1 = tall ? 450 : 960, y1 = tall ? 800 : 530, rr = tall ? 130 : 155;
      var R = tall ? 50 : 62, fs = tall ? 22 : 21, ik = tall ? 1.05 : 1.35;
      var my = (y0 + y1) / 2, i;
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      var d = 'M' + x0 + ' ' + my + ' L' + x0 + ' ' + (y0 + rr) + ' A' + rr + ' ' + rr + ' 0 0 1 ' + (x0 + rr) + ' ' + y0 +
        ' L' + (x1 - rr) + ' ' + y0 + ' A' + rr + ' ' + rr + ' 0 0 1 ' + x1 + ' ' + (y0 + rr) +
        ' L' + x1 + ' ' + (y1 - rr) + ' A' + rr + ' ' + rr + ' 0 0 1 ' + (x1 - rr) + ' ' + y1 +
        ' L' + (x0 + rr) + ' ' + y1 + ' A' + rr + ' ' + rr + ' 0 0 1 ' + x0 + ' ' + (y1 - rr) + ' Z';
      el('path', { d: d, fill: 'none', stroke: 'rgba(247,244,238,0.16)', 'stroke-width': 1.2, 'stroke-dasharray': '2 7' }, svg);
      var loop = el('path', { d: d, fill: 'none', stroke: 'rgba(247,244,238,0.72)', 'stroke-width': 1.6 }, svg);
      var len = loop.getTotalLength();
      loop.setAttribute('stroke-dasharray', len.toFixed(1));
      var at = function (f) { return loop.getPointAtLength((((f % 1) + 1) % 1) * len); };

      /* direction marks between the stations */
      var chev = [];
      for (i = 0; i < 6; i++) {
        var f = (i + 0.5) / 6, p = at(f), q = at(f + 0.004);
        var ang = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI;
        chev.push(el('path', { d: 'M-7 -6L3 0L-7 6', fill: 'none', stroke: '#E7B866', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', transform: 'translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ') rotate(' + ang.toFixed(1) + ')' }, svg));
      }
      var kd = [];
      for (i = 0; i < NK; i++) kd.push(el('circle', { r: tall ? 5.5 : 5, fill: '#E7B866' }, svg));

      var pts = [];
      for (i = 0; i < 6; i++) pts.push(at(i / 6));
      var boiler = pts[2], ash = pts[3], fert = pts[5];

      /* carbon and water leave at the boiler */
      var cTop = boiler.y - R - (tall ? 62 : 58);
      el('path', { d: 'M' + boiler.x + ' ' + (boiler.y - R - 6) + ' V' + (cTop + 8) + ' M' + (boiler.x - 6) + ' ' + (cTop + 16) + ' L' + boiler.x + ' ' + (cTop + 6) + ' L' + (boiler.x + 6) + ' ' + (cTop + 16), fill: 'none', stroke: 'rgba(247,244,238,0.6)', 'stroke-width': 1.5, 'stroke-dasharray': '1 6', 'stroke-linecap': 'round' }, svg);
      text(svg, ['Carbon and water', 'released by burning'], tall ? Math.min(boiler.x, W - 122) : boiler.x, cTop - fs * 1.5, 'middle', fs * 0.86, { opacity: 0.8 });

      /* silicon: dashed, still in research and development */
      var six = tall ? ash.x + R + 46 : ash.x + R + 84;
      el('path', { d: 'M' + (ash.x + R + 4) + ' ' + ash.y + ' H' + (six - 24), fill: 'none', stroke: '#F7F4EE', 'stroke-width': 1.5, 'stroke-dasharray': '6 6', opacity: 0.75 }, svg);
      el('circle', { cx: six, cy: ash.y, r: tall ? 26 : 34, fill: 'none', stroke: '#F7F4EE', 'stroke-width': 1.3, 'stroke-dasharray': '5 5', opacity: 0.75 }, svg);
      el('path', { d: FLASK, fill: 'none', stroke: '#F7F4EE', 'stroke-width': 1.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', transform: 'translate(' + (six - 1) + ' ' + (ash.y - 2) + ') scale(' + (tall ? 0.7 : 0.95) + ')' }, svg);
      for (i = 0; i < 3; i++) el('circle', { cx: ash.x + R + 14 + i * 9, cy: ash.y - 9 + (i % 2) * 4, r: 3, fill: '#F7F4EE', opacity: 0.55 }, svg);
      text(svg, ['Silicon:', 'research and', 'development'], tall ? W - 6 : six, ash.y + (tall ? -86 : 62), tall ? 'end' : 'middle', fs * 0.8, { opacity: 0.85 });

      /* imported potash also enters the plant */
      var ix = fert.x - (tall ? 118 : 150), iy = fert.y + (tall ? 128 : 132), ux = fert.x - R * 0.74, uy = fert.y + R * 0.74;
      el('path', { d: 'M' + ix + ' ' + iy + ' L' + (ux - 6) + ' ' + (uy + 6), fill: 'none', stroke: 'rgba(247,244,238,0.6)', 'stroke-width': 1.5 }, svg);
      text(svg, ['Imported potash'], tall ? 14 : ix - 10, iy + (tall ? 24 : 6), tall ? 'start' : 'end', fs * 0.86, { opacity: 0.8 });

      /* stations */
      var st = [];
      for (i = 0; i < 6; i++) {
        var g = el('g', { 'class': 'st', transform: 'translate(' + pts[i].x.toFixed(1) + ' ' + pts[i].y.toFixed(1) + ')' }, svg);
        el('circle', { 'class': 'st__disc', r: R }, g);
        el('path', { 'class': 'st__ico', d: ICONS[i], transform: 'scale(' + ik + ')' }, g);
        text(g, [(i + 1) + '  ' + NAMES[i]], 0, R + fs * 1.45, 'middle', fs, { 'font-weight': 600 });
        (function (k) { g.addEventListener('click', function () { setActive(k); }); })(i);
        st.push(g);
      }
      G = { loop: loop, len: len, at: at, kd: kd, st: st, chev: chev };
      setActive(S.active);
      render();
    }

    function setActive(i) {
      S.active = i;
      press(steps, i);
      if (G) G.st.forEach(function (g, k) { g.setAttribute('class', k === i ? 'st is-active' : 'st'); });
    }
    function render() {
      if (!G) return;
      var draw = clamp(S.scroll * 2.4, 0, 1);
      G.loop.setAttribute('stroke-dashoffset', (G.len * (1 - draw)).toFixed(1));
      var off = S.scroll * 0.55 + S.clock * 0.028;
      for (var i = 0; i < NK; i++) {
        var f = (((i / NK + off) % 1) + 1) % 1, p = G.at(f);
        G.kd[i].setAttribute('cx', p.x.toFixed(1)); G.kd[i].setAttribute('cy', p.y.toFixed(1));
        G.kd[i].setAttribute('opacity', f < draw ? 1 : 0);
      }
      for (var c = 0; c < G.chev.length; c++) G.chev[c].setAttribute('opacity', (c + 0.5) / 6 < draw ? 1 : 0);
    }
    steps.forEach(function (b, i) {
      b.addEventListener('click', function () { setActive(i); });
      b.addEventListener('focus', function () { setActive(i); });
    });

    build();
    onMedia(mq, build);
    viewLoop(svg, function (dt) { S.clock += dt; render(); });
    if (STEP) { S.scroll = 1; setActive(clamp(STEP, 1, 6) - 1); render(); }
    else if (hasGsap) {
      var proxy = { p: 0 };
      gsap.to(proxy, {
        p: 1, ease: 'none',
        onUpdate: function () {
          S.scroll = proxy.p;
          var idx = Math.floor(clamp((proxy.p - 0.3) / 0.5, 0, 0.999) * 6);
          if (idx !== S.fromScroll) { S.fromScroll = idx; setActive(idx); }
          render();
        },
        scrollTrigger: { trigger: frame || svg, start: 'top 88%', end: 'bottom 12%', scrub: calm ? true : 0.6, refreshPriority: 40, invalidateOnRefresh: true }
      });
    }
  })();

  /* ---------- 4. laboratory: 2 buildings and the path of 1 coded sample ---------- */
  (function laboratory() {
    var svg = $('#labSvg'), list = $('#labSteps');
    if (!svg || !list) return;
    var stepEls = $$('.lab__step', list), buttons = $$('.lab__btn', list);
    var mq = window.matchMedia('(max-width: 899px)');
    var S = { target: 0, cur: 0, active: -1, raf: 0, last: 0 };
    var G = null;
    var LIFT = 0.35, TOP = 0.85;
    /* The route of the sample. The division into 3 portions is shown as a marker on the route between the 2 buildings,
       because the site does not say where the sample is divided. */
    var MAIN = [
      [[-2.4, 2.3, LIFT], [1.5, 2.3, LIFT]],
      [[1.5, 2.3, LIFT], [3.0, 2.3, LIFT]],
      [[3.0, 2.3, LIFT], [6.5, 2.3, LIFT]],
      [[6.5, 2.3, LIFT], [8.8, 2.3, LIFT], [11.1, 1.25, TOP]],
      [[11.1, 1.25, TOP], [13.2, 1.25, LIFT], [14.55, 2.65, TOP]],
      [[14.55, 2.65, TOP], [14.55, 5.9, LIFT], [2.5, 5.9, LIFT], [2.5, 3.4, LIFT], [-2.4, 3.4, LIFT]]
    ];
    var SECOND = [
      [[6.5, 2.3, LIFT], [8.8, 2.3, LIFT], [11.1, 3.85, TOP]],
      [[11.1, 3.85, TOP], [13.2, 3.85, LIFT], [14.55, 2.65, TOP]]
    ];
    var BADGE = [[-2.4, 1.5], [1.5, 3.1], [3.0, 3.1], [6.5, 3.2], [9.2, 1.7], [14.55, 3.75], [-2.4, 4.25]];
    var BACK = 0.78;   // share of the last segment at which the report is back inside Sample Reception

    function along(points, f) {
      var lens = [], total = 0, i;
      for (i = 1; i < points.length; i++) { var l = Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]); lens.push(l); total += l; }
      var want = clamp(f, 0, 1) * total;
      for (i = 0; i < lens.length; i++) {
        if (want <= lens[i] || i === lens.length - 1) {
          var k = lens[i] > 0 ? clamp(want / lens[i], 0, 1) : 0, a = points[i], b = points[i + 1];
          return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
        }
        want -= lens[i];
      }
      return points[points.length - 1];
    }

    function build() {
      var small = mq.matches;
      var W = small ? 600 : 1000, H = small ? 400 : 640, k = small ? 27.6 : 46, ox = small ? 180 : 300, oy = small ? 64 : 104;
      var fs = small ? 19 : 14, br = 13, tr = small ? 8.5 : 10;
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      var pr = function (x, y, z) { return [ox + (x - y) * 0.866 * k, oy + (x + y) * 0.5 * k - (z || 0) * k]; };
      var ps = function (arr) { return arr.map(function (p) { var q = pr(p[0], p[1], p[2]); return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' '); };
      var poly = function (arr, fill, stroke, extra) {
        var a = { points: ps(arr), fill: fill, stroke: stroke || '#171A16', 'stroke-width': 1.2, 'stroke-linejoin': 'round' };
        if (extra) for (var key in extra) a[key] = extra[key];
        return el('polygon', a, svg);
      };
      var box = function (x, y, w, d, h, top, left, right, z0) {
        z0 = z0 || 0;
        poly([[x, y + d, z0], [x + w, y + d, z0], [x + w, y + d, h], [x, y + d, h]], left);
        poly([[x + w, y, z0], [x + w, y + d, z0], [x + w, y + d, h], [x + w, y, h]], right);
        poly([[x, y, h], [x + w, y, h], [x + w, y + d, h], [x, y + d, h]], top);
      };
      var building = function (x, y, w, d) {
        box(x, y, w, d, 0, '#E4DCCB', '#CFC5B0', '#BFB49D', -0.28);                                   // floor slab
        poly([[x, y, 0], [x + w, y, 0], [x + w, y, 1.4], [x, y, 1.4]], '#F7F4EE');                      // back wall
        poly([[x, y, 0], [x, y + d, 0], [x, y + d, 1.4], [x, y, 1.4]], '#EDE6D3');                      // side wall
        var gx;
        for (gx = 1; gx < w; gx++) el('polyline', { points: ps([[x + gx, y, 0], [x + gx, y + d, 0]]), fill: 'none', stroke: 'rgba(23,26,22,0.1)', 'stroke-width': 1 }, svg);
        for (gx = 1; gx < d; gx++) el('polyline', { points: ps([[x, y + gx, 0], [x + w, y + gx, 0]]), fill: 'none', stroke: 'rgba(23,26,22,0.1)', 'stroke-width': 1 }, svg);
      };
      var label = function (str, x, y, z, size, anchor) {
        var q = pr(x, y, z);
        var t = el('text', { x: q[0].toFixed(1), y: q[1].toFixed(1), 'text-anchor': anchor || 'middle', 'font-size': size, 'font-weight': 500, 'letter-spacing': '0.02em' }, svg);
        t.textContent = str;
        return t;
      };
      var pill = function (str, size, dark) {
        var g = el('g', null, svg), w = str.length * size * 0.66 + size * 1.3, h = size * 1.7;
        el('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: dark ? '#171A16' : '#F0DDB6', stroke: '#171A16', 'stroke-width': 1.2 }, g);
        var t = el('text', { y: (size * 0.35).toFixed(1), 'text-anchor': 'middle', 'font-size': size, 'font-weight': 500 }, g);
        t.textContent = str;
        t.style.fill = dark ? '#F7F4EE' : '#171A16';
        return g;
      };

      building(0, 0, 5, 4.4);
      building(8, 0, 8, 5.4);

      /* routes on the ground: the sample (dashed) and the report (dotted) */
      var route = function (segs, dash, stroke) {
        segs.forEach(function (seg) { el('polyline', { points: ps(seg.map(function (p) { return [p[0], p[1], 0.02]; })), fill: 'none', stroke: stroke, 'stroke-width': 1.7, 'stroke-dasharray': dash, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg); });
      };
      route(MAIN.slice(0, 5), '6 5', '#171A16');
      route(SECOND, '6 5', '#171A16');
      route([MAIN[5]], '1 6', '#855610');
      /* the division into 3 portions: a marker on the route, with no building around it */
      poly([[6.15, 2.3, 0.03], [6.5, 1.95, 0.03], [6.85, 2.3, 0.03], [6.5, 2.65, 0.03]], '#C88A2E');

      /* furniture, back to front */
      box(1.1, 0.9, 1.5, 0.8, 0.55, '#F7F4EE', '#D9D0BD', '#C6BBA4');     // reception desk
      box(2.75, 0.9, 0.8, 0.8, 0.8, '#2D5A3C', '#24492F', '#1C3A25');     // the system that issues the code
      box(9.8, 0.8, 2.6, 0.9, 0.6, '#F7F4EE', '#D9D0BD', '#C6BBA4');      // bench, analyst A
      box(9.4, 2.5, 3.6, 0.12, 1.0, '#EDE6D3', '#D9D0BD', '#C6BBA4');     // partition between the 2 analysts
      box(9.8, 3.4, 2.6, 0.9, 0.6, '#F7F4EE', '#D9D0BD', '#C6BBA4');      // bench, analyst B
      box(13.9, 2.1, 1.3, 1.1, 0.6, '#F0DDB6', '#D9C08C', '#C4A970');     // QC Manager's desk

      label('Sample Reception', 2.5, 0, 1.8, fs, 'middle');
      label('Laboratory', 12, 0, 1.8, fs, 'middle');
      if (!small) {
        el('polyline', { points: ps([[5.15, 0, 0.7], [7.85, 0, 0.7]]), fill: 'none', stroke: '#855610', 'stroke-width': 1.4 }, svg);
        el('polyline', { points: ps([[5.15, 0, 0.55], [5.15, 0, 0.85]]), fill: 'none', stroke: '#855610', 'stroke-width': 1.4 }, svg);
        el('polyline', { points: ps([[7.85, 0, 0.55], [7.85, 0, 0.85]]), fill: 'none', stroke: '#855610', 'stroke-width': 1.4 }, svg);
        label('Separate buildings', 6.9, 0, 2.3, fs * 0.9, 'middle').style.fill = '#855610';
        label('Analyst A', 12.6, 0.6, 0.9, fs * 0.86, 'start');
        label('Analyst B', 9.6, 4.75, 0, fs * 0.86, 'end');
        label('QC Manager', 15.6, 3.3, 0, fs * 0.86, 'start');
      }

      BADGE.forEach(function (b, i) {
        var q = pr(b[0], b[1], 0);
        var g = el('g', { transform: 'translate(' + q[0].toFixed(1) + ' ' + q[1].toFixed(1) + ')' }, svg);
        el('circle', { r: br, fill: '#F7F4EE', stroke: '#171A16', 'stroke-width': 1.2 }, g);
        var t = el('text', { y: (fs * 0.36).toFixed(1), 'text-anchor': 'middle', 'font-size': fs }, g);
        t.textContent = String(i + 1);
      });

      /* the third portion: a tag only. The site does not say where the portion is kept. */
      var kept = pill('Kept for 24 months', fs * 0.82, false);
      var kq = pr(6.5, 4.35, 0);
      kept.setAttribute('transform', 'translate(' + kq[0].toFixed(1) + ' ' + (kq[1] + (small ? 10 : 6)).toFixed(1) + ')');
      kept.setAttribute('opacity', 0);

      /* the moving parts: each can be drawn as a sample (a dot) or as a sheet of paper */
      var mover = function () {
        var g = el('g', null, svg);
        var dot = el('circle', { r: tr, fill: '#171A16', stroke: '#F7F4EE', 'stroke-width': 1.5 }, g);
        var sheet = el('rect', { x: -tr * 0.8, y: -tr * 1.05, width: tr * 1.6, height: tr * 2.1, rx: 2, fill: '#F7F4EE', stroke: '#171A16', 'stroke-width': 1.5, opacity: 0 }, g);
        return { g: g, dot: dot, sheet: sheet };
      };
      var second = mover(), token = mover();
      second.g.setAttribute('opacity', 0);
      var tags = {};
      [['name', 'Name', false], ['code', 'Code', true], ['results', 'Results', true]].forEach(function (d) {
        var p = pill(d[1], fs * 0.9, d[2]);
        token.g.appendChild(p);
        p.setAttribute('transform', 'translate(0 ' + (-tr - fs * 0.9 * 0.85 - 8).toFixed(1) + ')');
        p.setAttribute('opacity', 0);
        tags[d[0]] = p;
      });

      G = { pr: pr, kept: kept, second: second, token: token, tags: tags, state: '' };
      render();
    }

    function put(node, p) {
      var q = G.pr(p[0], p[1], p[2]);
      node.setAttribute('transform', 'translate(' + q[0].toFixed(1) + ' ' + q[1].toFixed(1) + ')');
    }
    function shape(m, asSheet, named) {
      m.dot.setAttribute('opacity', asSheet ? 0 : 1);
      m.sheet.setAttribute('opacity', asSheet ? 1 : 0);
      m.dot.setAttribute('fill', named ? '#C88A2E' : '#171A16');
      m.dot.setAttribute('stroke', named ? '#171A16' : '#F7F4EE');
    }
    function render() {
      if (!G) return;
      var s = clamp(S.cur, 0, 6), i = Math.min(5, Math.floor(s)), f = s - i;
      put(G.token.g, along(MAIN[i], f));
      /* Name up to step 2. Code from step 3. From the 2 analysts to the QC Manager, 2 sheets of results travel, not the sample.
         After the signature the report carries the code until it is back at Sample Reception, where the name is linked to it again. */
      var state = s < 1.5 ? 'name' : (s <= 4.02 ? 'code' : (s <= 5 ? 'results' : (s < 5 + BACK ? 'code' : 'name')));
      var paper = s > 4.02;
      if (state + paper !== G.state) {
        G.state = state + paper;
        for (var key in G.tags) G.tags[key].setAttribute('opacity', key === state ? 1 : 0);
        shape(G.token, paper, state === 'name');
      }
      G.kept.setAttribute('opacity', s >= 3 ? 1 : 0);
      if (s >= 3 && s <= 5) {
        G.second.g.setAttribute('opacity', 1);
        put(G.second.g, along(SECOND[s < 4 ? 0 : 1], s < 4 ? s - 3 : s - 4));
        shape(G.second, paper, false);
      } else G.second.g.setAttribute('opacity', 0);
      var a = clamp(Math.round(s), 0, 6);
      if (a !== S.active) {
        S.active = a;
        stepEls.forEach(function (n, j) { n.classList.toggle('is-active', j === a); });
        press(buttons, a);
      }
    }

    function anchor() { return window.innerHeight * (mq.matches ? 0.74 : 0.52); }
    function centres() {
      return stepEls.map(function (n) { var r = n.getBoundingClientRect(); return r.top + Math.min(r.height, 150) * 0.5; });
    }
    function measure() {
      var c = centres(), a = anchor(), s = 0, n = c.length;
      if (a <= c[0]) s = 0;
      else if (a >= c[n - 1]) s = n - 1;
      else for (var i = 0; i < n - 1; i++) if (a >= c[i] && a < c[i + 1]) { s = i + (a - c[i]) / Math.max(1, c[i + 1] - c[i]); break; }
      S.target = s;
      if (!lively) { S.cur = s; render(); return; }
      if (!S.raf) { S.last = performance.now(); S.raf = requestAnimationFrame(step); }
    }
    function step(now) {
      var dt = Math.min(0.05, Math.max(0, (now - S.last) / 1000));
      S.last = now;
      S.cur += (S.target - S.cur) * (1 - Math.exp(-dt * 7));
      if (Math.abs(S.target - S.cur) < 0.002) { S.cur = S.target; S.raf = 0; render(); return; }
      render();
      S.raf = requestAnimationFrame(step);
    }
    var queued = false;
    function onScroll() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; measure(); });
    }
    buttons.forEach(function (b, i) {
      b.addEventListener('click', function () {
        var c = centres();
        scrollToY(window.scrollY + c[i] - anchor() + 2);
      });
    });

    build();
    if (STEP) { S.cur = S.target = clamp(STEP, 1, 7) - 1; render(); return; }
    onMedia(mq, function () { build(); measure(); });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    measure();
  })();

  /* ---------- the 21 tests: a staggered reveal in full mode ---------- */
  (function tests() {
    var grid = $('#testsGrid');
    if (!grid || !animate || !('IntersectionObserver' in window)) return;
    $$('li', grid).forEach(function (li, i) { li.style.setProperty('--i', i); });
    grid.classList.add('is-armed');
    onceVisible(grid, function () { grid.classList.add('is-in'); }, '0px 0px -8% 0px');
  })();

  if (hasGsap) window.addEventListener('load', function () { ScrollTrigger.refresh(); });

  /* Test hook: ?probe=1 prints the scroll triggers on the page; with &y=N it first scrolls to N pixels. */
  if (/[?&]probe=1/.test(window.location.search)) {
    var probeErrors = [];
    window.addEventListener('error', function (e) { probeErrors.push(e.message); });
    (function () {
      var my = /[?&]y=(\d+)/.exec(window.location.search);
      setTimeout(function () {
        if (hasGsap) ScrollTrigger.refresh();
        if (my) { window.scrollTo(0, parseInt(my[1], 10)); if (hasGsap) ScrollTrigger.update(); }
        setTimeout(function () {
          var lines = ['scrollY ' + Math.round(window.scrollY) + ' of ' + document.documentElement.scrollHeight + ', window ' + window.innerWidth + ' x ' + window.innerHeight,
            'gsap ' + hasGsap + ', calm ' + calm + ', lenis ' + !!V.lenis + ', errors ' + (probeErrors.join(' | ') || 'none')];
          if (hasGsap) ScrollTrigger.getAll().forEach(function (t) {
            var tr = t.trigger;
            lines.push((tr ? (tr.id || tr.className || tr.tagName) : '?') + ' pin ' + !!t.pin + ' start ' + Math.round(t.start) + ' end ' + Math.round(t.end) + ' prio ' + (t.vars.refreshPriority || 0) + ' progress ' + t.progress.toFixed(2));
          });
          var pre = document.createElement('pre');
          pre.textContent = lines.join('\n');
          pre.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:999;margin:0;padding:10px;background:#fff;color:#000;font:12px/1.4 monospace;max-width:96vw;white-space:pre-wrap';
          document.body.appendChild(pre);
        }, 900);
      }, 1800);
    })();
  }
})();
