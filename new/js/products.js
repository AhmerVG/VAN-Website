/* Products and soil chemistry page. Needs js/site.js and data/brands.js.
   Every control works without GSAP. In calm mode nothing loops: the soil drawing shows its dots at rest.
   Test states can be read from the URL: ?problem=1|2|3&mode=van|std, ?method=foliar, ?cat=K, ?brand=vital-urea. */
(function () {
  'use strict';

  var V = window.VANSite || {};
  var $ = V.$ || function (s, el) { return (el || document).querySelector(s); };
  var $$ = V.$$ || function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var calm = V.calm !== undefined ? V.calm : document.documentElement.classList.contains('calm');
  var BRANDS = window.VAN_BRANDS || [];
  var CATS = window.VAN_CATEGORIES || [];
  var SVGNS = 'http://www.w3.org/2000/svg';
  var params = {};
  window.location.search.replace(/^\?/, '').split('&').forEach(function (kv) {
    var p = kv.split('='); if (p[0]) params[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || '');
  });

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }
  function svgEl(tag, attrs) {
    var n = document.createElementNS(SVGNS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }
  function catLabel(key) {
    for (var i = 0; i < CATS.length; i++) if (CATS[i].key === key) return CATS[i].label;
    return key;
  }

  /* ---------- 1. Hero ---------- */
  var heroTitle = $('#heroTitle');
  if (heroTitle && V.animate && V.splitWords) {
    var words = V.splitWords(heroTitle);
    words.forEach(function (w, i) { w.style.transitionDelay = (i * 45) + 'ms'; });
    requestAnimationFrame(function () { requestAnimationFrame(function () { heroTitle.classList.add('is-in'); }); });
  }
  if (V.hasGsap && $('#heroFig')) {
    gsap.to('#heroFig .granules', { yPercent: -7, ease: 'none',
      scrollTrigger: { trigger: '.phero', start: 'top top', end: 'bottom top', scrub: true } });
  }

  /* ---------- 2. Soil cross-section ---------- */
  var SOIL = {
    n: {
      tab: 'tab-n', kicker: 'Nitrogen · nutrient 1 of 3', stdName: 'Urea', vanName: 'Vital Urea', slug: 'vital-urea',
      std: {
        head: 'Nitrogen lost to the air and to water',
        text: ['In soil with a pH above 8, part of the nitrogen from urea left on the soil surface is lost to the air as ammonia before the crop can use it.',
          'Irrigation water also carries nitrate down below the roots. The nitrogen in that nitrate is lost to water.'],
        cap: 'The drawing shows urea granules on the soil surface. Ammonia (NH₃) rises into the air. Nitrate (NO₃⁻) moves down with the irrigation water to below the roots.'
      },
      van: {
        head: 'Vital Urea is urea coated with sulfur', spec: 'N 32% min · S 13% min',
        text: ['Volatilisation is the loss of nitrogen to the air as ammonia. The coating reduces how much nitrogen is exposed to volatilisation at any one time. The coating does not stop volatilisation.',
          'In our field observation, the nitrogen is released over several days after the first irrigation.',
          'The sulfur stays where the granule was placed and oxidises there. In the soil, bacteria oxidise the elemental sulfur to sulfate. Sulfate is the form of sulfur that roots take up.',
          'Pakistan Patent 144684 covers the coating of Vital Urea. The patent was granted in 2026.'],
        cap: 'The drawing shows Vital Urea granules in the same place as the urea granules. In our field observation, nitrogen leaves each granule over several days. Some nitrogen is still lost to the air and to water. The coating does not stop volatilisation.'
      }
    },
    p: {
      tab: 'tab-p', kicker: 'Phosphate · nutrient 2 of 3', stdName: 'DAP', vanName: 'Green Phosphate', slug: 'green-phosphate',
      std: {
        head: 'Phosphate bound by calcium',
        text: ['The drawing compares Green Phosphate with diammonium phosphate (DAP). The soil around a DAP granule stays alkaline.',
          'In soil above pH 8 that contains free lime, phosphate dissolving from a granule meets calcium within a few centimetres.',
          'In calcareous soil, free calcium binds most of the phosphate applied as fertiliser before the roots can take it up.'],
        cap: 'The drawing shows a DAP granule in the soil. Phosphate that dissolves from the granule meets calcium within a few centimetres.'
      },
      van: {
        head: 'Green Phosphate has acidic, humic-coated granules', spec: 'N 6% · P₂O₅ 32%',
        text: ['Green Phosphate is granulated in an acidic mix and coated with humic material.',
          'The soil around each Green Phosphate granule is acidic at first. This acidic zone is a few centimetres wide.',
          'Green Phosphate is designed so that the acidic zone slows the reaction of phosphate with calcium during the weeks a root needs to reach the granule.',
          'The acidic zone does not change the result of a soil test.'],
        cap: 'The drawing shows a Green Phosphate granule with its black humic coating. The dashed ring marks the acidic zone around the granule. Some phosphate is still bound by calcium, later than in the drawing of DAP.'
      }
    },
    k: {
      tab: 'tab-k', kicker: 'Potash · nutrient 3 of 3', stdName: 'Fertiliser use in 2023', vanName: 'Vital Potash', slug: 'vital-potash',
      std: {
        head: 'Too little potash applied',
        text: ['Potash is the fertiliser that supplies potassium.',
          'In 2023, Pakistan applied 83 kg of nitrogen (N) for every 1 kg of potash (K₂O), according to FAOSTAT.',
          'With so little potash applied, crops take most of their potassium from what the soil already holds.'],
        cap: 'The grid above the soil has 84 squares. 83 squares stand for nitrogen (N). The 1 square marked K stands for potash (K₂O). In the soil, potassium (K⁺) moves to the roots from what the soil already holds.'
      },
      van: {
        head: 'Vital Potash is potash coated with boron', spec: 'N 11% · K₂O 44%',
        text: ['Vital Potash is a fully water-soluble potash fertiliser. It is applied through irrigation water. This method is called fertigation.',
          'Apply Vital Potash at the stages your crop plan gives.',
          'Each granule carries boron in 2 forms. Sodium borate releases boron quickly. Calcium borate releases boron slowly.'],
        cap: 'The drawing shows Vital Potash granules in irrigation water. The granule at the top left shows the 2 forms of boron.'
      }
    }
  };

  /* Each flow is a set of paths that dots travel along. kind sets the shape, so a state is never shown by colour alone.
     The Vital Urea scene uses the same placement as the urea scene, with fewer dots out at any one time and no more uptake dots. */
  var FLOWS = {
    'n-std': [
      { kind: 'nh3', dur: 6, per: 2, paths: [[[90, 172], [84, 120], [96, 70], [88, 26]], [[150, 170], [156, 118], [144, 70], [152, 24]], [[210, 172], [204, 122], [216, 74], [208, 28]], [[270, 172], [276, 120], [264, 72], [272, 26]], [[330, 170], [324, 122], [334, 76], [328, 30]]] },
      { kind: 'no3', dur: 9, per: 2, paths: [[[120, 200], [128, 320], [116, 440], [124, 580]], [[240, 200], [232, 330], [246, 450], [238, 580]], [[310, 200], [318, 320], [306, 450], [314, 580]]] },
      { kind: 'up', dur: 6, per: 1, paths: [[[330, 196], [350, 250], [380, 290], [400, 300]]] }
    ],
    'n-van': [
      { kind: 'nh3', dur: 6, per: 1, paths: [[[150, 168], [156, 118], [144, 70], [152, 24]], [[270, 170], [276, 120], [264, 72], [272, 26]]] },
      { kind: 'no3', dur: 9, per: 1, paths: [[[240, 200], [232, 330], [246, 450], [238, 580]]] },
      { kind: 'up', dur: 6, per: 1, paths: [[[330, 196], [350, 250], [380, 290], [400, 300]]] }
    ],
    'p-std': [
      { kind: 'p', dur: 5, per: 1, stick: true, paths: [[[262, 322], [236, 300], [212, 280]], [[262, 322], [286, 296], [306, 274]], [[262, 322], [226, 328], [198, 334]], [[262, 322], [240, 348], [222, 368]], [[262, 322], [292, 350], [318, 374]], [[262, 322], [264, 360], [266, 394]], [[262, 322], [260, 284], [260, 252]]] }
    ],
    'p-van': [
      { kind: 'p', dur: 8, per: 2, paths: [[[272, 318], [282, 320], [292, 325]], [[270, 330], [280, 334], [294, 328]], [[262, 304], [278, 308], [292, 322]]] },
      { kind: 'p', dur: 14, per: 1, stick: true, paths: [[[262, 322], [236, 300], [212, 280]], [[262, 322], [292, 350], [318, 374]]] }
    ],
    'k-std': [
      { kind: 'k', dur: 9, per: 1, paths: [[[150, 330], [240, 350], [338, 332]], [[330, 450], [390, 440], [440, 420]], [[610, 420], [570, 440], [520, 440]], [[650, 360], [620, 350], [580, 340]], [[380, 250], [400, 280], [400, 300]], [[690, 250], [650, 258], [600, 262]]] }
    ],
    'k-van': []
  };

  var stage = $('#soilStage');
  if (stage) {
    var layer = $('#soilParticles');
    var svg = $('#soilSvg');
    var state = { problem: 'n', mode: 'std' };
    var dots = [];
    var clock = 0, last = 0, raf = 0, onScreen = false;

    // The 83 to 1 grid: 84 squares, the last one stands for K2O and carries a K mark.
    var grid = $('#ratioGrid');
    if (grid) {
      for (var i = 0; i < 84; i++) {
        var gx = 30 + (i % 12) * 20, gy = 24 + Math.floor(i / 12) * 20;
        if (i < 83) grid.appendChild(svgEl('rect', { x: gx, y: gy, width: 16, height: 16, rx: 3 }));
        else {
          grid.appendChild(svgEl('rect', { x: gx - 1, y: gy - 1, width: 18, height: 18, rx: 3, fill: '#EFE2BF', stroke: '#171A16', 'stroke-width': 2 }));
          var kt = svgEl('text', { x: gx + 8, y: gy + 13, 'text-anchor': 'middle', 'font-family': 'JetBrains Mono, monospace', 'font-size': 12, 'font-weight': 700, fill: '#171A16', stroke: 'none' });
          kt.textContent = 'K'; grid.appendChild(kt);
        }
      }
    }

    function makeDot(kind) {
      if (kind === 'nh3') return svgEl('circle', { r: 5, fill: '#FFFFFF', stroke: '#171A16', 'stroke-width': 1.6 });
      if (kind === 'no3') return svgEl('circle', { r: 4.2, fill: '#24486B', stroke: '#F7F4EE', 'stroke-width': 1 });
      if (kind === 'up') return svgEl('circle', { r: 4, fill: '#2D5A3C', stroke: '#F7F4EE', 'stroke-width': 1.2 });
      if (kind === 'p') return svgEl('path', { d: 'M0 -5.5 L5 3.6 L-5 3.6 Z', fill: '#C8742A', stroke: '#3A2410', 'stroke-width': 1.1 });
      if (kind === 'k') return svgEl('rect', { x: -4.5, y: -4.5, width: 9, height: 9, rx: 1.5, fill: '#F3E7C2', stroke: '#3A2F10', 'stroke-width': 1.3 });
      return svgEl('path', { d: 'M0 -6 L5 0 L0 6 L-5 0 Z', fill: '#6F7A80', stroke: '#F7F4EE', 'stroke-width': 1.1 });
    }
    function pointOn(path, t) {
      var n = path.length - 1, f = Math.min(Math.max(t, 0), 0.9999) * n, i = Math.floor(f), u = f - i;
      return [path[i][0] + (path[i + 1][0] - path[i][0]) * u, path[i][1] + (path[i + 1][1] - path[i][1]) * u];
    }
    function buildDots() {
      while (layer.firstChild) layer.removeChild(layer.firstChild);
      dots = [];
      (FLOWS[state.problem + '-' + state.mode] || []).forEach(function (flow) {
        flow.paths.forEach(function (path, pi) {
          for (var j = 0; j < flow.per; j++) {
            var node = makeDot(flow.kind);
            layer.appendChild(node);
            dots.push({ node: node, path: path, dur: flow.dur, stick: !!flow.stick, phase: (j / flow.per) + (pi * 0.37 % 1) });
          }
        });
      });
      place();
    }
    function place() {
      dots.forEach(function (d) {
        // In calm mode the dots rest part of the way along their path.
        var t = calm ? (0.3 + (d.phase % 1) * 0.5) : ((clock / d.dur + d.phase) % 1);
        var pt, op;
        if (d.stick) { pt = pointOn(d.path, Math.min(t / 0.6, 1)); op = calm ? 1 : Math.min(1, t * 8, (1 - t) * 8); if (calm) pt = pointOn(d.path, 1); }
        else { pt = pointOn(d.path, t); op = calm ? 1 : Math.min(1, t * 6, (1 - t) * 6); }
        d.node.setAttribute('transform', 'translate(' + pt[0].toFixed(1) + ' ' + pt[1].toFixed(1) + ')');
        d.node.setAttribute('opacity', op.toFixed(2));
      });
    }
    function tick(now) {
      raf = 0;
      if (!onScreen || document.hidden) return;
      var dt = Math.min((now - last) / 1000, 0.1); last = now; clock += dt;
      place();
      raf = requestAnimationFrame(tick);
    }
    function run() {
      if (calm || raf || !onScreen || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { onScreen = en[0].isIntersecting; run(); }, { threshold: 0.05 }).observe(svg);
    } else { onScreen = true; }
    document.addEventListener('visibilitychange', run);

    var tabs = $$('.soil__tab', stage), modes = $$('.soil__mode', stage);
    function render(focusTab) {
      var d = SOIL[state.problem], c = d[state.mode], van = state.mode === 'van';
      stage.setAttribute('data-problem', state.problem);
      stage.setAttribute('data-mode', state.mode);
      tabs.forEach(function (t) {
        var on = t.getAttribute('data-problem') === state.problem;
        t.classList.toggle('is-on', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        if (on && focusTab) t.focus();
      });
      modes.forEach(function (m) {
        var on = m.getAttribute('data-mode') === state.mode;
        m.classList.toggle('is-on', on);
        m.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      $('#soilPanel').setAttribute('aria-labelledby', d.tab);
      $('#modeStd').textContent = d.stdName;
      $('#modeVan').textContent = d.vanName;
      $('#soilKicker').textContent = van ? d.kicker.replace('nutrient', 'our product for nutrient') : d.kicker;
      $('#soilHead').textContent = c.head;
      var spec = $('#soilSpec');
      spec.hidden = !van; spec.textContent = van ? 'Declared analysis: ' + c.spec : '';
      var text = $('#soilText');
      while (text.firstChild) text.removeChild(text.firstChild);
      c.text.forEach(function (p) { text.appendChild(el('p', '', p)); });
      $('#soilCap').textContent = c.cap;
      var prod = $('#soilProduct');
      prod.hidden = !van;
      prod.href = 'https://www.van.com.pk/brands/' + d.slug + '.html';
      $('#soilPack').src = 'img/packs/' + d.slug + '.webp';
      $('#soilProductName').textContent = d.vanName;
      $('#soilProductLink').textContent = 'Open the live page for ' + d.vanName;
      $$('.sc', svg).forEach(function (g) { g.classList.toggle('is-on', g.getAttribute('data-scene') === state.problem + '-' + state.mode); });
      buildDots();
      run();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { state.problem = t.getAttribute('data-problem'); state.mode = 'std'; render(); });
      t.addEventListener('keydown', function (e) {
        var to = -1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') to = (i + 1) % tabs.length;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') to = (i + tabs.length - 1) % tabs.length;
        if (e.key === 'Home') to = 0;
        if (e.key === 'End') to = tabs.length - 1;
        if (to < 0) return;
        e.preventDefault();
        state.problem = tabs[to].getAttribute('data-problem'); state.mode = 'std'; render(true);
      });
    });
    modes.forEach(function (m) {
      m.addEventListener('click', function () { state.mode = m.getAttribute('data-mode'); render(); });
    });
    var pmap = { '1': 'n', '2': 'p', '3': 'k', n: 'n', p: 'p', k: 'k' };
    if (pmap[params.problem]) state.problem = pmap[params.problem];
    if (params.mode === 'van' || params.mode === 'std') state.mode = params.mode;
    render();
  }

  /* ---------- 3. Catalogue ---------- */
  // Nutrient family colours from the brand master (N, P, K, NPK, micronutrients, biologicals). The brand master gives none for
  // secondary nutrients; ochre is used for them until Tahir sets one.
  var FAM = { N: '#2F7D3F', P: '#00598E', K: '#0F7A72', NPK: '#D2751A', MICRO: '#6E4A8E', SEC: '#A8791C', BIO: '#7A5230' };
  var METHODS = [['broadcast', 'Broadcast'], ['fertigation', 'Fertigation'], ['foliar', 'Foliar']];
  function methodsOf(b) { return b.filters; }
  var MARK = { N: ['N', '#E6BE3C', '#FFFFFF'], P: ['P', '#1F1B18', '#7A5638'], K: ['K', '#8D979C', '#EFE2BF'], NPK: ['NPK', '#2D5A3C', '#EFE2BF'], MICRO: ['Zn', '#855610', '#EDE6D3'], SEC: ['S', '#C88A2E', '#F7EDCF'], BIO: ['OM', '#3A2A1A', '#8A6B4A'] };
  function markSvg(cat, cls) {
    var m = MARK[cat] || MARK.NPK;
    var s = svgEl('svg', { viewBox: '0 0 120 120', 'class': cls, 'aria-hidden': 'true', focusable: 'false' });
    s.appendChild(svgEl('circle', { cx: 60, cy: 60, r: 54, fill: m[1] }));
    s.appendChild(svgEl('circle', { cx: 60, cy: 60, r: 44, fill: m[2], stroke: 'rgba(23,26,22,0.35)', 'stroke-width': 1 }));
    s.appendChild(svgEl('circle', { cx: 60, cy: 60, r: 30, fill: 'none', stroke: 'rgba(23,26,22,0.35)', 'stroke-width': 1, 'stroke-dasharray': '2 5' }));
    s.appendChild(svgEl('path', { d: 'M60 6 V20 M60 100 V114 M6 60 H20 M100 60 H114', stroke: '#F7F4EE', 'stroke-width': 1.5 }));
    var dark = cat === 'BIO' || cat === 'P';
    var t = svgEl('text', { x: 60, y: 70, 'text-anchor': 'middle', 'font-family': 'Instrument Serif, Georgia, serif', 'font-size': m[0].length > 2 ? 26 : 34, fill: dark ? '#F7F4EE' : '#171A16' });
    t.textContent = m[0]; s.appendChild(t);
    return s;
  }

  var gridEl = $('#catGrid');
  var filter = { method: 'all', cat: 'all' };
  var drawer = $('#drawer'), panel = $('#drawerPanel'), dBody = $('#drawerBody');
  var opener = null, closeTimer = 0;

  function byMethod(b, m) { return m === 'all' || methodsOf(b).indexOf(m) > -1; }
  function byCat(b, c) { return c === 'all' || b.cat === c; }
  function matches(b) {
    return byMethod(b, filter.method) && byCat(b, filter.cat);
  }
  function applyFilter() {
    var shown = 0;
    $$('.card', gridEl).forEach(function (li, i) {
      var ok = matches(BRANDS[i]);
      li.hidden = !ok; if (ok) shown++;
      // A filtered list shows its cards at once. The scroll reveal is only for the first full list.
      if (filter.method !== 'all' || filter.cat !== 'all') li.classList.add('is-in');
    });
    $('#catStatus').textContent = 'Showing ' + shown + ' of ' + BRANDS.length + ' brands.';
    $('#catEmpty').hidden = shown > 0;
    $$('#methodChips .chip').forEach(function (c) {
      var m = c.getAttribute('data-method'), on = m === filter.method;
      var n = BRANDS.filter(function (b) { return byMethod(b, m) && byCat(b, filter.cat); }).length;
      c.querySelector('.fig').textContent = n; c.disabled = !on && n === 0 && m !== 'all';
      c.classList.toggle('is-on', on); c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    $$('#catChips .chip').forEach(function (c) {
      var k = c.getAttribute('data-cat'), on = k === filter.cat;
      var n = BRANDS.filter(function (b) { return byCat(b, k) && byMethod(b, filter.method); }).length;
      var f = c.querySelector('.fig'); if (f) f.textContent = n; c.disabled = !on && n === 0 && k !== 'all';
      c.classList.toggle('is-on', on); c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    // The address keeps the filters, so a filtered list can be shared. Back is not affected.
    try {
      var u = new URL(window.location.href);
      if (filter.method === 'all') u.searchParams.delete('method'); else u.searchParams.set('method', filter.method);
      if (filter.cat === 'all') u.searchParams.delete('cat'); else u.searchParams.set('cat', filter.cat);
      history.replaceState(null, '', u.pathname + u.search + u.hash);
    } catch (e) {}
    if (V.hasGsap && window.ScrollTrigger) ScrollTrigger.refresh();
  }

  if (gridEl && BRANDS.length) {
    // Counts on the method chips come from the data, so they always match the list.
    $$('#methodChips .chip').forEach(function (c) {
      var m = c.getAttribute('data-method');
      var n = BRANDS.filter(function (b) { return byMethod(b, m); }).length;
      $('.fig', c).textContent = n;
      c.addEventListener('click', function () { filter.method = m; applyFilter(); });
    });
    var catChips = $('#catChips');
    $('.chip', catChips).addEventListener('click', function () { filter.cat = 'all'; applyFilter(); });
    if (!$('.fig', $('.chip', catChips))) { $('.chip', catChips).appendChild(document.createTextNode(' ')); $('.chip', catChips).appendChild(el('span', 'fig', String(BRANDS.length))); }
    CATS.forEach(function (c) {
      var n = BRANDS.filter(function (b) { return b.cat === c.key; }).length;
      var btn = el('button', 'chip'); btn.type = 'button';
      btn.setAttribute('data-cat', c.key); btn.setAttribute('aria-pressed', 'false');
      btn.appendChild(document.createTextNode(c.label + ' '));
      btn.appendChild(el('span', 'fig', String(n)));
      btn.addEventListener('click', function () { filter.cat = c.key; applyFilter(); });
      catChips.appendChild(btn);
    });
    $('#catClear').addEventListener('click', function () { filter.method = 'all'; filter.cat = 'all'; applyFilter(); $('#methodChips .chip').focus(); });

    BRANDS.forEach(function (b, i) {
      var li = el('li', 'card'); li.setAttribute('data-reveal', ''); li.style.setProperty('--fam', FAM[b.cat] || '#2D5A3C');
      var btn = el('button', 'card__btn'); btn.type = 'button';
      btn.setAttribute('data-cursor', 'Details');
      btn.setAttribute('aria-haspopup', 'dialog');
      btn.setAttribute('aria-label', b.name + '. ' + catLabel(b.cat) + '. Open the technical details.');
      var st = el('span', 'card__stage');
      st.appendChild(el('span', 'card__catk', catLabel(b.cat)));
      if (b.img) {
        var im = el('img', 'card__img');
        im.src = 'img/packs/' + b.img + '.webp?v=2'; im.alt = ''; im.loading = 'lazy';
        st.appendChild(im);
      } else {
        st.appendChild(markSvg(b.cat, 'card__mark'));
        st.appendChild(el('span', 'card__markcap', 'Drawn mark'));
      }
      btn.appendChild(st);
      var body = el('span', 'card__body');
      body.appendChild(el('span', 'card__name', b.name));
      body.appendChild(el('span', 'card__analysis', b.analysis));
      var tags = el('span', 'card__tags');
      if (b.filters.length) METHODS.forEach(function (m) { if (b.filters.indexOf(m[0]) > -1) tags.appendChild(el('span', 'tag', m[1])); });
      else b.methods.forEach(function (m) { tags.appendChild(el('span', 'tag', m)); });
      body.appendChild(tags);
      body.appendChild(el('span', 'card__more', 'Technical details'));
      btn.appendChild(body);
      btn.addEventListener('click', function () { openDrawer(b, btn); });
      if (V.animate && V.finePointer && b.img) {
        st.classList.add('has-tilt');
        btn.addEventListener('pointermove', function (e) {
          var r = st.getBoundingClientRect();
          st.firstChild.nextSibling.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * 22).toFixed(1) + 'deg');
          st.firstChild.nextSibling.style.setProperty('--rx', ((0.5 - (e.clientY - r.top) / r.height) * 10).toFixed(1) + 'deg');
        });
        btn.addEventListener('pointerleave', function () {
          st.firstChild.nextSibling.style.setProperty('--ry', '0deg'); st.firstChild.nextSibling.style.setProperty('--rx', '0deg');
        });
      }
      li.appendChild(btn);
      gridEl.appendChild(li);
      if (V.observe) V.observe(li, i);
    });
    if (params.method && /^(broadcast|fertigation|foliar)$/.test(params.method)) filter.method = params.method;
    if (params.cat && catLabel(params.cat) !== params.cat) filter.cat = params.cat;
    applyFilter();
  }

  /* Drawer */
  function section(title) {
    var s = el('section', 'd__sec');
    s.appendChild(el('h3', 'd__h', title));
    return s;
  }
  function nutrientTable(rows, unit, caption) {
    var wrap = el('div', 'd__scroll'), t = el('table', 'd__table');
    if (caption) t.appendChild(el('caption', '', caption));
    var th = el('thead'), tr = el('tr');
    tr.appendChild(el('th', '', 'Nutrient'));
    var h2 = el('th', 'num', 'Declared, ' + unit); tr.appendChild(h2); th.appendChild(tr); t.appendChild(th);
    var tb = el('tbody');
    rows.forEach(function (r) {
      var row = el('tr'), c1 = el('td', '', r[0]);
      var bar = el('span', 'd__bar'), fill = document.createElement('i');
      fill.style.width = Math.min(parseFloat(r[1]) || 0, 100) + '%';
      bar.appendChild(fill); bar.setAttribute('aria-hidden', 'true'); c1.appendChild(bar);
      row.appendChild(c1); row.appendChild(el('td', 'num', r[1]));
      tb.appendChild(row);
    });
    t.appendChild(tb); wrap.appendChild(t);
    return wrap;
  }
  function fillDrawer(b) {
    while (dBody.firstChild) dBody.removeChild(dBody.firstChild);
    $('#drawerCat').textContent = catLabel(b.cat);
    panel.style.setProperty('--fam', FAM[b.cat] || '#2D5A3C');
    var top = el('div', 'd__top');
    if (b.img) { var im = el('img', 'd__img'); im.src = 'img/packs/' + b.img + '.webp?v=2'; im.alt = b.imgAlt; top.appendChild(im); }
    else top.appendChild(markSvg(b.cat, 'd__mark'));
    var tt = el('div');
    var h = el('h2', 'd__name', b.name); h.id = 'drawerTitle'; tt.appendChild(h);
    tt.appendChild(el('p', 'd__analysis', b.analysis));
    if (b.picNote) tt.appendChild(el('p', 'note d__picnote', b.picNote));
    top.appendChild(tt); dBody.appendChild(top);

    var about = el('div', 'd__about');
    b.about.forEach(function (p) { about.appendChild(el('p', '', p)); });
    dBody.appendChild(about);

    var s1 = section('Declared analysis by nutrient');
    if (b.grades) b.grades.forEach(function (g) { s1.appendChild(nutrientTable(g.nutrients, b.unit, g.name)); });
    else s1.appendChild(nutrientTable(b.nutrients, b.unit));
    s1.appendChild(el('p', 'note', 'The percentages are as declared on the bag or in the library.'));
    dBody.appendChild(s1);

    var s2 = section('Form, packs and method');
    var dl = el('dl', 'd__dl');
    function row(k, v) { if (!v) return; dl.appendChild(el('dt', '', k)); dl.appendChild(el('dd', '', v)); }
    row('Physical form', b.form);
    row('Pack sizes', b.packs.join(' · '));
    row('Application', b.methods.join(b.methods.length && /\.$/.test(b.methods[0]) ? ' ' : ' · '));
    row('Crop stages on the product card', b.stages.join(' · '));
    s2.appendChild(dl); dBody.appendChild(s2);

    if (b.stageList || b.guidance.length || b.wheat.length) {
      var s3 = section('Stage guidance');
      if (b.stageList) {
        var ul = el('ul', 'd__list');
        b.stageList.forEach(function (x) { ul.appendChild(el('li', '', x)); });
        s3.appendChild(ul);
        s3.appendChild(el('p', 'note', b.stageSource));
      }
      if (b.guidance.length) {
        var gp = el('div', 'd__p');
        b.guidance.forEach(function (x) { gp.appendChild(el('p', '', x)); });
        s3.appendChild(gp);
      }
      if (b.wheat.length) {
        s3.appendChild(el('p', 'note d__between', 'The product card and the wheat plan can give different crop stages. The wheat plan lists every crop stage at which the plan uses this product.'));
        var wrap = el('div', 'd__scroll'), t = el('table', 'd__table');
        t.appendChild(el('caption', '', 'Stages in the wheat plan'));
        var th = el('thead'), tr = el('tr');
        ['Stage', 'Rate per acre', 'Method', 'Pack'].forEach(function (x) { tr.appendChild(el('th', '', x)); });
        th.appendChild(tr); t.appendChild(th);
        var tb = el('tbody');
        b.wheat.forEach(function (w) { var r = el('tr'); w.forEach(function (x) { r.appendChild(el('td', '', x)); }); tb.appendChild(r); });
        t.appendChild(tb); wrap.appendChild(t); s3.appendChild(wrap);
      }
      dBody.appendChild(s3);
    }

    if (b.registration.length) {
      var s4 = section('Registration');
      var rp = el('div', 'd__p');
      b.registration.forEach(function (x) { rp.appendChild(el('p', '', x)); });
      s4.appendChild(rp); dBody.appendChild(s4);
    }

    var act = el('div', 'd__actions');
    if (b.live !== false) {
      var a1 = el('a', 'btn'); a1.href = b.url; a1.target = '_blank'; a1.rel = 'noopener';
      a1.appendChild(el('span', '', 'Open the live page for ' + b.name)); act.appendChild(a1);
    }
    var a2 = el('button', 'btn btn--ghost'); a2.type = 'button';
    a2.appendChild(el('span', '', 'Order ' + b.name));
    a2.addEventListener('click', function () {
      closeDrawer(true);
      var sel = $('#oProduct');
      if (sel) { sel.value = b.slug; sel.dispatchEvent(new Event('change')); }
      var target = $('#orderForm') || $('#order');
      if (V.lenis) V.lenis.scrollTo(target, { offset: -120 }); else target.scrollIntoView({ behavior: calm ? 'auto' : 'smooth' });
      if (sel) sel.focus({ preventScroll: true });
    });
    act.appendChild(a2);
    /* White label: Tahir ruled on 24 Nov 2026 that every one of our own formulations can be made under a partner's brand. */
    var wl = el('p', 'd__wl note');
    wl.appendChild(document.createTextNode(b.slug === 'sop' ? 'This product can also be supplied under your brand. ' : 'This formulation can also be made under your brand. '));
    var wla = el('a', '', 'See how we make products for partner brands.');
    wla.href = 'partner/index.html#library';
    wl.appendChild(wla); act.appendChild(wl);
    dBody.appendChild(act);
    dBody.scrollTop = 0;
  }
  function focusables() {
    return $$('a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])', panel).filter(function (n) { return n.offsetParent !== null; });
  }
  function openDrawer(b, from) {
    if (!drawer) return;
    clearTimeout(closeTimer);
    opener = from || document.activeElement;
    fillDrawer(b);
    drawer.hidden = false;
    document.documentElement.classList.add('drawer-open');
    if (V.lenis) V.lenis.stop();
    void drawer.offsetWidth;
    drawer.classList.add('is-open');
    $('#drawerClose').focus({ preventScroll: true });
  }
  function closeDrawer(skipFocus) {
    if (!drawer || drawer.hidden) return;
    drawer.classList.remove('is-open');
    document.documentElement.classList.remove('drawer-open');
    if (V.lenis) V.lenis.start();
    var done = function () { drawer.hidden = true; };
    if (calm) done(); else closeTimer = setTimeout(done, 620);
    if (!skipFocus && opener && opener.focus) opener.focus({ preventScroll: true });
    opener = null;
  }
  if (drawer) {
    $('#drawerClose').addEventListener('click', function () { closeDrawer(); });
    $('#drawerVeil').addEventListener('click', function () { closeDrawer(); });
    document.addEventListener('keydown', function (e) {
      if (drawer.hidden || !drawer.classList.contains('is-open')) return;
      if (e.key === 'Escape') { e.preventDefault(); closeDrawer(); return; }
      if (e.key !== 'Tab') return;
      var f = focusables(); if (!f.length) return;
      var first = f[0], lastEl = f[f.length - 1];
      if (!panel.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---------- 4. Lab report ---------- */
  var vForm = $('#verifyForm');
  if (vForm) {
    vForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = $('#batchInput').value.trim().toUpperCase();
      var status = $('#batchStatus');
      window.open('https://www.van.com.pk/verify.html', '_blank', 'noopener');
      var plain = 'The Verify page has opened in a new tab. Type your batch number there.';
      if (!val || !navigator.clipboard || !navigator.clipboard.writeText) { status.textContent = plain; return; }
      navigator.clipboard.writeText(val).then(function () {
        status.textContent = 'The Verify page has opened in a new tab. We copied ' + val + ', so you can paste it there.';
      }, function () { status.textContent = plain; });
    });
  }

  /* ---------- 5. Order ---------- */
  var oProduct = $('#oProduct');
  if (oProduct && BRANDS.length) {
    var oPack = $('#oPack'), oQty = $('#oQty'), oDistrict = $('#oDistrict');
    BRANDS.forEach(function (b) { var o = el('option', '', b.name); o.value = b.slug; oProduct.appendChild(o); });
    var bySlug = function (s) { for (var i = 0; i < BRANDS.length; i++) if (BRANDS[i].slug === s) return BRANDS[i]; return BRANDS[0]; };
    var fillPacks = function () {
      while (oPack.firstChild) oPack.removeChild(oPack.firstChild);
      bySlug(oProduct.value).packs.forEach(function (p) { var o = el('option', '', p); o.value = p; oPack.appendChild(o); });
    };
    var update = function () {
      var b = bySlug(oProduct.value);
      var q = parseInt(oQty.value, 10);
      var d = oDistrict.value.trim().replace(/\s+/g, ' ').slice(0, 60);
      var msg = 'Hello VAN. I would like to order ' + b.name + '. Pack size: ' + oPack.value + '.';
      if (q > 0) msg += ' Quantity: ' + q + (q === 1 ? ' pack.' : ' packs.');
      if (d) msg += ' My district: ' + d + '.';
      $('#oPreview').textContent = msg;
      $('#oSend').href = 'https://wa.me/923005003041?text=' + encodeURIComponent(msg);
    };
    oProduct.addEventListener('change', function () { fillPacks(); update(); });
    [oPack, oQty, oDistrict].forEach(function (n) { n.addEventListener('input', update); n.addEventListener('change', update); });
    $('#orderForm').addEventListener('submit', function (e) { e.preventDefault(); });
    fillPacks(); update();
  }

  /* Test state from the URL */
  if (params.brand && drawer) {
    for (var bi = 0; bi < BRANDS.length; bi++) if (BRANDS[bi].slug === params.brand) { openDrawer(BRANDS[bi], null); break; }
  }

  /* Pins on the 3D granules: each opens a card with the reviewed text for that product. */
  $$('.gpin').forEach(function (p) {
    p.addEventListener('click', function () {
      var card = document.getElementById(p.getAttribute('aria-controls')), open = p.getAttribute('aria-expanded') === 'true';
      $$('.gpin').forEach(function (q) { q.setAttribute('aria-expanded', 'false'); });
      $$('.gcard').forEach(function (c) { c.hidden = true; });
      if (!open) { p.setAttribute('aria-expanded', 'true'); card.hidden = false; }
    });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { $$('.gcard').forEach(function (c) { c.hidden = true; }); $$('.gpin').forEach(function (q) { q.setAttribute('aria-expanded', 'false'); }); } });
})();
