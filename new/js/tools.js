/* VAN flagship site, Vitalytics page (tools.html). 22 Nov 2026.
   4 tools: the Punjab Soil Atlas, the crop nutrition creator, the sowing calendar and the farm discipline simulator.
   The data and the rules come from the source of van.com.pk (see "Tools page sources.md").
   Part 1 is the engine: pure functions, tested in Node (tools-test.js in the scratch folder).
   Part 2 draws the page. Every tool works without GSAP. In calm mode nothing eases on a timer. */
(function (root) {
  'use strict';

  var DATA = root.VAN_DATA || {};
  var PL = DATA.plans, SOIL = DATA.soil, MAP = DATA.map, CAL = DATA.calendar, SIM = DATA.simulator;
  // Plain-English wording for the simulator (data/simulator-text.js, 26 Nov 2026). Only the words change.
  if (root.VAN_SIM_TEXT && SIM) Object.keys(root.VAN_SIM_TEXT).forEach(function (crop) {
    var T = root.VAN_SIM_TEXT[crop], M = SIM[crop];
    if (M && T.length === M.levers.length) M.levers.forEach(function (l, i) { ['name', 'bad', 'ok', 'best'].forEach(function (k) { if (T[i][k]) l[k] = T[i][k]; }); });
  });
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  /* ===================== Part 1: the engine ===================== */

  /* The level of a soil reading on VAN's 5-level soil scale (soilThresholds.ts, bandForValue). */
  function bandFor(param, value) {
    if (value === null || value === undefined || !isFinite(value)) return undefined;
    var ranges = PL.engine.ranges[param] || [];
    for (var i = 0; i < ranges.length; i++) {
      var r = ranges[i];
      var min = r.min === null ? -Infinity : r.min, max = r.max === null ? Infinity : r.max;
      var aboveMin = r.minOpen ? value > min : value >= min;
      var belowMax = r.maxClosed ? value <= max : value < max;
      if (aboveMin && belowMax) return r.band;
    }
    return undefined;
  }

  function group(s) { return String(s).replace(/^(\d+)(?=\D|$)/, function (m) { return m.replace(/\B(?=(\d{3})+(?!\d))/g, ','); }); }

  /* Quantity in the Nutrition creator list (NutritionCreator.tsx, fmtQty). */
  var QUARTER = { '0.25': '¼', '0.5': '½', '0.75': '¾' };
  function toBuy(n) { return n <= 0 ? 0 : Math.ceil(n * 2 - 1e-9) / 2; }
  function fmtCreator(n) {
    var r = Math.round(n * 100) / 100;
    if (r < 0) return '-' + fmtCreator(-r);
    if (r % 1 === 0) return String(r);
    var whole = Math.floor(r);
    var g = QUARTER[String(Math.round((r - whole) * 100) / 100)];
    return g ? (whole || '') + g : r.toFixed(2).replace(/0$/, '');
  }

  /* Quantity in the published plan and the shopping list (season.ts, fmtUnits): to the nearest quarter. */
  function fmtUnits(n) {
    var whole = Math.floor(n), f = n - whole;
    if (whole === 0 && n > 0 && f < 0.375) return 'under ½';
    if (f >= 0.875) return String(whole + 1);
    var frac = f >= 0.625 ? '¾' : f >= 0.375 ? '½' : f >= 0.125 ? '¼' : '';
    return ((whole || '') + frac) || '0';
  }

  /* Nutrient totals (planRange.ts, fmt and fmtPair). */
  function fmtNum(v, digits) { var m = Math.pow(10, digits); return (Math.round(v * m + (v >= 0 ? 1e-9 : -1e-9)) / m).toFixed(digits); }
  function fmtPair(a, b, digits) {
    digits = digits === undefined ? 1 : digits;
    var lo = Math.min(a, b), hi = Math.max(a, b), small = 0.5 / Math.pow(10, digits), unit = ' kg';
    if (hi - lo <= 0.05) return hi > 0 && hi < small ? 'under ' + fmtNum(small * 2, digits) + unit : fmtNum(hi, digits) + unit;
    if (hi < small) return 'under ' + fmtNum(small * 2, digits) + unit;
    if (lo < small) return 'up to ' + fmtNum(hi, digits) + unit;
    if (fmtNum(lo, digits) === fmtNum(hi, digits)) return fmtNum(hi, digits) + unit;
    return fmtNum(lo, digits) + ' to ' + fmtNum(hi, digits) + unit;
  }

  function packUnit(slug) { return slug && PL.engine.liquid.indexOf(slug) >= 0 ? 'L' : 'kg'; }
  function shownName(p) { return PL.engine.shownName[p] || p; }

  /* The Nutrition creator: planCalc.ts (calcPlan) with soilAdjustment.ts (computeSoilBumps, computeSoilSwaps).
     readings: { pH: number, OM: number, P2O: number, ... }. A reading that is absent changes nothing. */
  function calcCreator(slug, acres, readings) {
    var P = PL.plans[slug], E = PL.engine, bands = {}, k;
    readings = readings || {};
    for (k in readings) { var b = bandFor(k, readings[k]); if (b) bands[k] = b; }
    var qtyBySlug = {};
    P.cost.forEach(function (r) { if (r.slug) qtyBySlug[r.slug] = r.qtyPerAcre; });
    var bumps = {};
    P.soilMap.forEach(function (e) {
      var param = e[0], s = e[1], band = bands[param];
      if (!band) return;
      var mult = E.multiplier[band];
      var reduce = band === 'healthy' ? E.reduce[param] : undefined;
      var base = qtyBySlug[s] || 0;
      if (reduce) { bumps[s] = (bumps[s] || 0) - base * reduce; return; }
      if (mult <= 0) return;
      bumps[s] = (bumps[s] || 0) + base * 0.5 * mult;
    });
    for (k in bumps) {
      var cap = qtyBySlug[k] === undefined ? Infinity : qtyBySlug[k];
      if (bumps[k] > cap) bumps[k] = cap;
      var floor = -(qtyBySlug[k] || 0) * 0.5;
      if (bumps[k] < floor) bumps[k] = floor;
    }
    var swaps = [];
    E.substitutions.forEach(function (sub) {
      var band = bands[sub.parameter];
      if (!band) return;
      var mult = E.multiplier[band];
      if (mult <= 0) return;
      var from = null, to = null;
      P.cost.forEach(function (r) { if (!from && r.product === sub.fromProduct) from = r; if (!to && r.slug === sub.toSlug) to = r; });
      if (!from || !to) return;
      var fromPct = from.pct[sub.nutrient] || 0, toPct = to.pct[sub.nutrient] || 0;
      if (!fromPct || !toPct) return;
      var nIn = from.qtyPerAcre * from.packKg * (fromPct / 100);
      var shift = Math.min(nIn, nIn * 0.5 * mult);
      if (shift <= 0.01) return;
      swaps.push({ fromProduct: sub.fromProduct, toSlug: sub.toSlug, fromDelta: -(shift / (from.packKg * (fromPct / 100))), toDelta: shift / (to.packKg * (toPct / 100)) });
    });
    var nutrientKg = {};
    var lines = P.cost.map(function (r) {
      var bump = r.slug && bumps[r.slug] !== undefined ? bumps[r.slug] : 0;
      var swap = swaps.reduce(function (a, w) { return a + (w.fromProduct === r.product ? w.fromDelta : 0) + (r.slug && w.toSlug === r.slug ? w.toDelta : 0); }, 0);
      var qty = r.qtyPerAcre * acres, bumpQty = bump * acres, swapQty = swap * acres;
      var totalKg = (qty + bumpQty + swapQty) * r.packKg;
      for (var n in r.pct) nutrientKg[n] = (nutrientKg[n] || 0) + (totalKg * r.pct[n]) / 100;
      var shown = Math.max(0, qty + bumpQty + swapQty), unit = packUnit(r.slug);
      return { product: r.product, name: shownName(r.product), slug: r.slug, packKg: r.packKg, unit: unit, word: unit === 'L' ? 'pack' : 'bag', qty: qty, bumpPerAcre: bump, bumpQty: bumpQty, swapPerAcre: swap, swapQty: swapQty, shown: shown, total: Math.round(shown * r.packKg * 10) / 10 };
    });
    var nutrients = E.macroOrder.filter(function (n) { return nutrientKg[n] > 0.01; }).map(function (n) {
      return { key: n, label: E.nutrientLabel[n], kg: nutrientKg[n], text: fmtPair(nutrientKg[n], nutrientKg[n] + (P.delta[n] || 0) * acres) };
    });
    return { lines: lines, bands: bands, nutrientKg: nutrientKg, nutrients: nutrients, adjusted: Object.keys(bumps).length > 0 || swaps.length > 0 };
  }

  /* The published plan added up per product (season.ts, buildList). */
  function shoppingList(slug, acres) {
    var map = {}, order = [];
    PL.plans[slug].rows.forEach(function (r) {
      var key = r.product + '|' + r.unit + '|' + r.size + '|' + r.measure;
      if (!map[key]) { map[key] = { product: r.product, van: r.van, unit: r.unit, size: r.size, measure: r.measure, units: 0, stages: [] }; order.push(key); }
      map[key].units += r.units;
      if (map[key].stages.indexOf(r.stage) < 0) map[key].stages.push(r.stage);
    });
    return order.map(function (k, i) { var l = map[k]; l.units = l.units * acres; l.i = i; return l; })
      .sort(function (a, b) { return (Number(!a.van) - Number(!b.van)) || (a.i - b.i); });
  }
  function qtyText(units, unit, size, measure) {
    return group(fmtUnits(units)) + ' ' + unit + (units >= 1.125 ? 's' : '') + (size > 0 ? ' · ' + group(Math.round(units * size * 100) / 100) + ' ' + (measure || 'kg') : '');
  }

  /* Dates */
  function parseIso(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!m) return null;
    var d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return isNaN(d.getTime()) || d.getMonth() !== Number(m[2]) - 1 ? null : d;
  }
  function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  function pretty(d, year) { return d.getDate() + ' ' + MONTHS[d.getMonth()] + (year ? ' ' + d.getFullYear() : ''); }
  function daysSince(iso, now) {
    var s = parseIso(iso); if (!s) return null;
    now = now || new Date();
    return Math.round((new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() - s.getTime()) / 86400000);
  }

  /* Wheat only: days after sowing at which each growing degree day boundary is reached (sowing.ts, wheatStageDays).
     Lahore normals 1991 to 2020, daily values interpolated between mid-month normals, base 10 °C. */
  function lerpMonthly(arr, d) {
    var y = d.getFullYear(), anchors = [], yy, m;
    for (yy = y - 1; yy <= y + 1; yy++) for (m = 0; m < 12; m++) anchors.push([Date.UTC(yy, m, 15), arr[m]]);
    var t = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
    for (var i = 0; i < anchors.length - 1; i++) {
      var a = anchors[i], b = anchors[i + 1];
      if (t >= a[0] && t < b[0]) return a[1] + (b[1] - a[1]) * (t - a[0]) / (b[0] - a[0]);
    }
    return arr[d.getMonth()];
  }
  function wheatStageDays(iso) {
    var d0 = parseIso(iso); if (!d0) return null;
    var W = PL.wheat, out = [0], acc = 0, day = 0, d = new Date(d0.getTime());
    while (out.length < W.gdd.length && day < 400) {
      acc += Math.max(0, (lerpMonthly(W.tmax, d) + lerpMonthly(W.tmin, d)) / 2 - 10);
      day++;
      d.setDate(d.getDate() + 1);
      if (acc >= W.gdd[out.length]) out.push(day);
    }
    return out.length === W.gdd.length ? out : null;
  }

  /* Is the date inside the published window (sowing.ts, windowCheck). Months only. */
  function inWindow(w, m) { return w[0] <= w[1] ? m >= w[0] && m <= w[1] : m >= w[0] || m <= w[1]; }
  function windowCheck(slug, iso) {
    var d = parseIso(iso), P = PL.plans[slug];
    if (!d || !P || !P.windows.length) return null;
    var m = d.getMonth();
    if (P.windows.some(function (w) { return inWindow(w, m); })) return { inWindow: true, monthsOut: 0, direction: null };
    var best = 12, dir = 'late';
    P.windows.forEach(function (w) {
      var before = ((w[0] - m) + 12) % 12, after = ((m - w[1]) + 12) % 12;
      if (before < best) { best = before; dir = 'early'; }
      if (after < best) { best = after; dir = 'late'; }
    });
    return { inWindow: false, monthsOut: best, direction: dir };
  }

  /* The stage-by-stage timeline: the rows of the published plan, per acre and for the acreage.
     Calendar dates exist for wheat only. The published wheat table prints each stage as
     "first day to last day", where the last day is the sowing date plus the boundary day, less 1. */
  function timeline(slug, acres, iso) {
    var P = PL.plans[slug], days = slug === 'wheat' && iso ? wheatStageDays(iso) : null, sow = parseIso(iso);
    return P.stages.map(function (name, i) {
      var rows = P.rows.filter(function (r) { return r.stage === name; }).map(function (r) {
        return { product: r.product, van: r.van, analysis: r.analysis, rate: r.rate, method: r.method, range: r.range, spray: r.spray, units: r.units * acres, qty: qtyText(r.units * acres, r.unit, r.size, r.measure) };
      });
      var dates = null;
      if (days && sow) {
        if (i === 0) dates = { before: sow, text: 'Before ' + pretty(sow, true) };
        else {
          var from = i === 1 ? sow : addDays(sow, days[i - 1] - 1), to = addDays(sow, days[i] - 1);
          dates = { from: from, to: to, text: pretty(from, from.getFullYear() !== to.getFullYear()) + ' to ' + pretty(to, true) };
        }
      }
      return { n: i + 1, total: P.stages.length, name: name, rows: rows, dates: dates };
    });
  }

  /* Sowing calendar (season.ts) */
  function cropsInMonth(m) { return CAL.filter(function (c) { return c.windows.some(function (w) { return inWindow(w, m); }); }); }

  /* Soil Atlas */
  function stepOf(share) { if (share === null || share === undefined) return -1; var n = Math.round(share); return n < 33 ? 0 : n < 67 ? 1 : 2; }
  function ownMatches(measureId, level) {
    return SOIL.districts.filter(function (d) { var s = d.sh[measureId]; return s !== null && s !== undefined && Math.round(s) >= level; });
  }
  function in100(share) {
    if (share === null || share === undefined) return null;
    if (share > 0 && share < 0.5) return 'Fewer than 1';
    if (share >= 99.5 && share < 100) return 'More than 99';
    return String(Math.round(share));
  }

  /* Farm discipline simulator (leverScorecard.ts and DisciplineSimulator.tsx): Bad 0, OK 50, Best 100. */
  var SCORE = { bad: 0, ok: 50, best: 100 };
  function f1(v) { var t = v.toFixed(1); return /\.0$/.test(t) ? t.slice(0, -2) : t; }
  function simulate(crop, levels, target) {
    var M = SIM[crop], total = 0;
    var rows = M.levers.map(function (l) {
      var level = (levels && levels[l.name]) || 'ok';
      var weighted = (l.w * SCORE[level]) / 100;
      total += weighted;
      return { name: l.name, level: level, text: l[level], gain: M.base * (l.w - weighted) / 100 };
    });
    var predicted = M.base * (total / 100);
    var gains = rows.filter(function (r) { return r.gain > 0.2; }).sort(function (a, b) { return b.gain - a.gain; });
    return { rows: rows, predicted: predicted, gap: target - predicted, gains: gains, base: M.base, targetMax: Math.round(M.base * 1.3) };
  }

  var Engine = { bandFor: bandFor, fmtCreator: fmtCreator, fmtUnits: fmtUnits, fmtPair: fmtPair, calcCreator: calcCreator, shoppingList: shoppingList, qtyText: qtyText, timeline: timeline, wheatStageDays: wheatStageDays, windowCheck: windowCheck, cropsInMonth: cropsInMonth, stepOf: stepOf, ownMatches: ownMatches, in100: in100, simulate: simulate, f1: f1, parseIso: parseIso, daysSince: daysSince, group: group };
  root.VANTools = Engine;
  if (typeof module !== 'undefined' && module.exports) module.exports = Engine;
  if (typeof document === 'undefined') return;

  /* ===================== Part 2: the page ===================== */

  var VS = root.VANSite || { calm: true, animate: false, hasGsap: false, $: function (s, el) { return (el || document).querySelector(s); }, $$: function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); } };
  var $ = VS.$, $$ = VS.$$;
  var SITE = '';
  var WA = 'https://wa.me/923005003041';
  var qs = {};
  location.search.replace(/^\?/, '').split('&').forEach(function (p) { if (!p) return; var kv = p.split('='); try { qs[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || '').replace(/\+/g, ' ')); } catch (e) {} });

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmtInt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function scrollToEl(el) {
    if (VS.lenis) VS.lenis.scrollTo(el, { offset: -20 });
    else el.scrollIntoView({ behavior: VS.calm ? 'auto' : 'smooth', block: 'start' });
  }
  function store(k, v) { try { localStorage.setItem('van-tools-' + k, v); } catch (e) {} }
  function recall(k) { try { return localStorage.getItem('van-tools-' + k); } catch (e) { return null; } }
  function districtByAny(v) {
    if (!v) return null;
    var u = String(v).toUpperCase();
    return SOIL.districts.filter(function (d) { return d.key === u || d.name.toUpperCase() === u; })[0] || null;
  }
  function printOnly(cls) {
    document.body.classList.add(cls);
    var done = function () { document.body.classList.remove(cls); window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    window.print();
  }
  function shareLink(params, title, statusEl) {
    var url = location.href.split('?')[0].split('#')[0] + '?' + Object.keys(params).filter(function (k) { return params[k] !== '' && params[k] != null; }).map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]); }).join('&');
    var say = function (t) { if (statusEl) statusEl.textContent = t; };
    if (navigator.share) { navigator.share({ title: title, url: url }).catch(function () {}); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(function () { say('The link is copied.'); }, function () { say(url); });
    else say(url);
  }

  /* Opening title */
  var heroTitle = $('#heroTitle');
  if (heroTitle && VS.animate && VS.splitWords) {
    gsap.from(VS.splitWords(heroTitle), { yPercent: 112, duration: 1.1, ease: 'power3.out', stagger: 0.07, delay: 0.1 });
  }

  /* ---------- Tool 1: Soil Atlas ---------- */
  (function atlas() {
    var app = $('#atlasApp'); if (!app || !SOIL || !MAP) return;
    var svg = $('#atlasMap'), NS = 'http://www.w3.org/2000/svg';
    var state = { m: SOIL.measures[0], d: null, own: false, level: 50, sort: 'share', dir: -1 };
    var STEPS = [
      { word: 'Few', range: 'Fewer than 33 in 100 samples', icon: 0 },
      { word: 'About half', range: '33 to 66 in 100 samples', icon: 1 },
      { word: 'Most', range: '67 or more in 100 samples', icon: 2 }
    ];
    var EXPLAIN = {
      Nitrogen: 'Above pH 8, part of the nitrogen from urea left on the soil surface is lost to the air as ammonia before the crop can use it.',
      Phosphate: 'Punjab’s soil is calcareous. Calcareous soil is rich in calcium carbonate. In calcareous soil, free calcium binds most of the phosphate applied as fertiliser before the roots can take it up.',
      Potassium: 'In 2023, Pakistan applied 83 kg of nitrogen (N) for every 1 kg of potash (K₂O). The ratio is our calculation from FAOSTAT figures. Crops therefore take most of their potassium from the potassium already in the soil.',
      Zinc: 'In Punjab’s alkaline soils, zinc is held in chemical forms that roots cannot take up.',
      'Organic matter': 'Organic matter holds nutrients and water in the soil. Our humate products are made for soils with less than 1% organic matter.',
      Boron: 'The margin between enough boron and too much boron is small. The boron dose therefore has to be measured carefully.'
    };
    function icon(i) {
      var inner = i === 2 ? '<circle cx="9" cy="9" r="7.5" fill="currentColor"/>' : i === 1 ? '<circle cx="9" cy="9" r="7.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M9 1.5a7.5 7.5 0 0 1 0 15z" fill="currentColor"/>' : i === 0 ? '<circle cx="9" cy="9" r="7.5" fill="none" stroke="currentColor" stroke-width="1.5"/>' : '<circle cx="9" cy="9" r="7.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 2.5"/>';
      return '<svg class="stepicon" viewBox="0 0 18 18" width="18" height="18" aria-hidden="true">' + inner + '</svg>';
    }

    /* The map */
    svg.setAttribute('viewBox', '0 0 ' + MAP.width + ' ' + MAP.height);
    var defs = document.createElementNS(NS, 'defs');
    defs.innerHTML = '<pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" class="hatch__bg"/><line x1="0" y1="0" x2="0" y2="6" class="hatch__line"/></pattern>' +
      '<pattern id="hatchOwn" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" class="hatchown__bg"/><line x1="0" y1="0" x2="0" y2="6" class="hatchown__line"/></pattern>';
    svg.appendChild(defs);
    var layer = document.createElementNS(NS, 'g'); layer.setAttribute('class', 'atlas__districts'); svg.appendChild(layer);
    var paths = {};
    SOIL.districts.forEach(function (d) {
      var p = document.createElementNS(NS, 'path');
      p.setAttribute('d', MAP.districts[d.key].d);
      p.setAttribute('fill-rule', 'evenodd');
      p.setAttribute('class', 'dist');
      p.setAttribute('data-k', d.key);
      layer.appendChild(p); paths[d.key] = p;
    });
    var label = document.createElementNS(NS, 'g'); label.setAttribute('class', 'atlas__label'); label.setAttribute('aria-hidden', 'true');
    label.innerHTML = '<circle r="4.5"/><text y="-12" text-anchor="middle"></text>';
    label.style.display = 'none'; svg.appendChild(label);

    function pickFromPoint(evt) {
      var t = evt.target, k = t && t.getAttribute ? t.getAttribute('data-k') : null;
      if (!k) {   // a tap in a gap or beside a small district picks the nearest district within reach
        var pt = svg.createSVGPoint ? svg.createSVGPoint() : null; if (!pt || !svg.getScreenCTM()) return null;
        pt.x = evt.clientX; pt.y = evt.clientY;
        var loc = pt.matrixTransform(svg.getScreenCTM().inverse()), best = null, bd = 30 * 30;
        SOIL.districts.forEach(function (d) { var c = MAP.districts[d.key], dd = Math.pow(c.cx - loc.x, 2) + Math.pow(c.cy - loc.y, 2); if (dd < bd) { bd = dd; best = d.key; } });
        k = best;
      }
      return k;
    }
    svg.addEventListener('click', function (e) { var k = pickFromPoint(e); if (k) selectDistrict(k, true); });
    svg.addEventListener('pointermove', function (e) {
      var k = e.target.getAttribute && e.target.getAttribute('data-k');
      $$('.dist.is-hover', svg).forEach(function (p) { p.classList.remove('is-hover'); });
      if (k) paths[k].classList.add('is-hover');
    });
    svg.addEventListener('pointerleave', function () { $$('.dist.is-hover', svg).forEach(function (p) { p.classList.remove('is-hover'); }); });

    /* Questions */
    var qBox = $('#atlasQuestions');
    qBox.innerHTML = SOIL.measures.map(function (m, i) {
      return '<button type="button" role="radio" class="qbtn" data-m="' + m.id + '" aria-checked="' + (i === 0) + '"><span class="fig">' + ('0' + (i + 1)) + '</span><span class="qbtn__short">' + esc(m.short) + '</span><span class="qbtn__q">' + esc(m.question) + '</span></button>';
    }).join('');
    qBox.addEventListener('click', function (e) { var b = e.target.closest('.qbtn'); if (b) setMeasure(b.getAttribute('data-m')); });
    qBox.addEventListener('keydown', function (e) {
      if (['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].indexOf(e.key) < 0) return;
      e.preventDefault();
      var i = SOIL.measures.indexOf(state.m) + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1);
      i = (i + SOIL.measures.length) % SOIL.measures.length;
      setMeasure(SOIL.measures[i].id);
      $('.qbtn[data-m="' + SOIL.measures[i].id + '"]', qBox).focus();
    });

    /* District list */
    var sel = $('#atlasDistrict');
    sel.insertAdjacentHTML('beforeend', SOIL.districts.map(function (d) { return '<option value="' + esc(d.key) + '">' + esc(d.name) + '</option>'; }).join(''));
    sel.addEventListener('change', function () { selectDistrict(sel.value || null, false); });

    function setMeasure(id) {
      state.m = SOIL.measures.filter(function (m) { return m.id === id; })[0] || SOIL.measures[0];
      $$('.qbtn', qBox).forEach(function (b) { var on = b.getAttribute('data-m') === state.m.id; b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1; });
      $('#atlasQuestion').textContent = state.m.question;
      render();
    }
    function selectDistrict(key, fromMap) {
      state.d = key ? SOIL.districts.filter(function (d) { return d.key === key; })[0] : null;
      sel.value = state.d ? state.d.key : '';
      render();
      if (fromMap && window.matchMedia('(max-width: 1000px)').matches) scrollToEl($('#atlasCard'));
    }

    function render() {
      var m = state.m, matches = state.own ? ownMatches(m.id, state.level) : null;
      SOIL.districts.forEach(function (d) {
        var p = paths[d.key], s = d.sh[m.id], cls = 'dist';
        if (s === null || s === undefined) cls += ' is-none';
        else if (state.own) cls += Math.round(s) >= state.level ? ' is-match' : ' is-miss';
        else cls += ' is-s' + stepOf(s);
        if (state.d && state.d.key === d.key) cls += ' is-on';
        p.setAttribute('class', cls);
      });
      if (state.d) {
        var c = MAP.districts[state.d.key];
        layer.appendChild(paths[state.d.key]);
        label.style.display = '';
        label.setAttribute('transform', 'translate(' + c.cx + ' ' + c.cy + ')');
        var tx = $('text', label); tx.textContent = state.d.name;
        tx.setAttribute('text-anchor', c.cx < 90 ? 'start' : c.cx > MAP.width - 90 ? 'end' : 'middle');
      } else label.style.display = 'none';
      renderLegend(matches); renderCard(); renderOwn(matches); renderTable();
    }

    function renderLegend(matches) {
      var m = state.m, h;
      if (state.own) {
        h = '<p class="legend__title">Your map: districts where at least <span class="fig">' + state.level + '</span> in 100 samples ' + esc(m.cond) + '</p><ul class="legend__steps">' +
          '<li><span class="sw sw--match"></span><span><b>At or above your number</b><span class="legend__range"><span class="fig">' + matches.length + '</span> districts</span></span></li>' +
          '<li><span class="sw sw--miss"></span><span><b>Below your number</b><span class="legend__range"><span class="fig">' + (SOIL.districts.filter(function (d) { return d.sh[m.id] != null; }).length - matches.length) + '</span> districts</span></span></li>';
      } else {
        var counts = [0, 0, 0];
        SOIL.districts.forEach(function (d) { var s = stepOf(d.sh[m.id]); if (s >= 0) counts[s]++; });
        h = '<p class="legend__title">Share of each district’s samples that ' + esc(m.cond) + '</p><ul class="legend__steps">' + STEPS.map(function (s, i) {
          return '<li><span class="sw sw--s' + i + '"></span><span><b>' + icon(i) + s.word + '</b><span class="legend__range">' + s.range + ' · <span class="fig">' + counts[i] + '</span> districts</span></span></li>';
        }).join('');
      }
      if (SOIL.districts.some(function (d) { return d.sh[m.id] == null; })) h += '<li><span class="sw sw--none"></span><span><b>' + icon(3) + 'No valid data</b><span class="legend__range">Jhelum has no valid zinc data.</span></span></li>';
      $('#atlasLegend').innerHTML = h + '</ul>' + (state.own ? '' : '<p class="note legend__note">These 3 groups are a display choice of this page.</p>');
    }

    function medianText(d, m) { var v = d.md[m.id]; return v == null ? null : v.toFixed(m.dec) + (m.unit ? (m.unit === '%' ? '%' : ' ' + m.unit) : ''); }

    function renderCard() {
      var card = $('#atlasCard'), d = state.d, m = state.m;
      if (!d) { card.innerHTML = '<p class="dcard__empty">Choose a district to see its results.</p>'; return; }
      var s = d.sh[m.id], st = stepOf(s), h = '<p class="eyebrow">District · ' + esc(m.short) + '</p><h3 class="dcard__name">' + esc(d.name) + '</h3>';
      if (s == null) {
        h += '<p class="dcard__big"><span class="dcard__word">' + icon(3) + 'No valid data</span></p><p class="dcard__say">The programme has no valid zinc data for ' + esc(d.name) + '.</p>';
      } else {
        h += '<p class="dcard__big"><span class="fig dcard__num">' + in100(s) + '</span><span class="dcard__of">in 100 samples</span><span class="dcard__word dcard__word--s' + st + '">' + icon(st) + STEPS[st].word + '</span></p>' +
          '<p class="dcard__say">In ' + esc(d.name) + ', ' + in100(s).toLowerCase() + ' of every 100 soil samples ' + esc(m.cond) + '.</p>';
      }
      h += '<ul class="dcard__facts">';
      var med = medianText(d, m);
      if (med) h += '<li><span class="fig">' + med + '</span><span>The median ' + esc(m.medianName) + ' in ' + esc(d.name) + ' was ' + med + '. Half of the samples were below this value.</span></li>';
      h += '<li><span class="fig">' + in100(SOIL.province.sh[m.id]) + '</span><span>Across Punjab, ' + in100(SOIL.province.sh[m.id]).toLowerCase() + ' of every 100 samples ' + esc(m.cond) + '.</span></li>';
      h += '<li><span class="fig">' + fmtInt(d.n) + '</span><span>The programme tested ' + fmtInt(d.n) + ' samples from ' + esc(d.name) + ' in about 2016 to 2018.</span></li></ul>';
      if (d.flags[m.id] === 'method') h += '<p class="dcard__flag"><b>Read this figure with care.</b> Kasur’s phosphorus values are 2.5 to 5 times higher than the values of samples taken outside Kasur, within 1 km of the district boundary. This difference suggests a different laboratory method.</p>';
      h += '<p class="note">A district figure describes the samples of the whole district. Your own field needs its own soil test.</p>';

      var cond = m.condition ? SOIL.conditions.filter(function (c) { return c.nutrient === m.condition; })[0] : null;
      h += '<div class="dcard__van">';
      if (cond) {
        h += '<p class="dcard__h">What we supply for this soil condition</p><p class="dcard__why"><span class="tag">Our explanation</span> ' + EXPLAIN[m.condition] + '</p><ul class="dcard__products">' +
          cond.products.map(function (p) { return '<li><a href="' + SITE + 'brands/' + p.slug + '.html" data-cursor="Open">' + esc(p.name) + '</a></li>'; }).join('') + '</ul>' +
          '<p><a class="link-arrow" href="' + SITE + 'soil.html#soil-built" data-cursor="Open">The 7 soil conditions our products are made for, on van.com.pk</a></p>';
      } else {
        h += '<p class="dcard__h">Saline soil</p><p class="dcard__why">Fertiliser adds more salt to soil that already has too much. We do not sell a bag of fertiliser as the answer to saline soil. Send us your soil report. Our agronomy team will then tell you what the field needs.</p>' +
          '<p><a class="link-arrow" href="' + WA + '" data-cursor="Open">Ask our agronomy team on WhatsApp</a></p>';
      }
      h += '</div><div class="dcard__actions"><button type="button" class="btn btn--tool" data-act="creator"><span>Use ' + esc(d.name) + ' in the crop nutrition creator</span></button>' +
        '<button type="button" class="btn btn--ghost btn--tool" data-act="print"><span>Print this view</span></button>' +
        '<button type="button" class="btn btn--ghost btn--tool" data-act="share"><span>Share this view</span></button></div><p class="note dcard__status" role="status"></p>';
      card.innerHTML = h;
    }
    $('#atlasCard').addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]'); if (!b || !state.d) return;
      var act = b.getAttribute('data-act');
      if (act === 'print') printOnly('print-atlas');
      if (act === 'share') shareLink({ layer: state.m.id, district: state.d.name, level: state.own ? state.level : '' }, 'Punjab Soil Atlas: ' + state.d.name, $('.dcard__status'));
      if (act === 'creator' && root.VANCreator) { root.VANCreator.setDistrict(state.d.key); scrollToEl($('#creator')); }
    });

    /* Make my own map */
    var range = $('#ownLevel'), reset = $('#ownReset');
    range.addEventListener('input', function () { state.own = true; state.level = Number(range.value); render(); });
    reset.addEventListener('click', function () { state.own = false; render(); });
    function renderOwn(matches) {
      var m = state.m;
      $('#ownLabel').textContent = 'Number: at least this many samples in 100 that ' + m.cond;
      $('#ownOut').textContent = range.value + ' in 100';
      reset.hidden = !state.own;
      if (!state.own) { $('#ownResult').textContent = ''; $('#ownMatches').innerHTML = ''; return; }
      var total = SOIL.districts.filter(function (d) { return d.sh[m.id] != null; }).length;
      $('#ownResult').innerHTML = '<span class="fig">' + matches.length + '</span> of <span class="fig">' + total + '</span> districts are at or above your number.';
      $('#ownMatches').innerHTML = matches.map(function (d) { return '<button type="button" class="chip" data-k="' + esc(d.key) + '">' + esc(d.name) + ' <span class="fig">' + in100(d.sh[m.id]) + '</span></button>'; }).join('');
    }
    $('#ownMatches').addEventListener('click', function (e) { var b = e.target.closest('.chip'); if (b) selectDistrict(b.getAttribute('data-k'), false); });

    /* Table: the text alternative of the map */
    var table = $('#atlasTable');
    $$('th[data-sort] button', table).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.parentNode.getAttribute('data-sort');
        if (state.sort === key) state.dir = -state.dir; else { state.sort = key; state.dir = key === 'name' ? 1 : -1; }
        renderTable();
      });
    });
    table.addEventListener('click', function (e) { var b = e.target.closest('button[data-k]'); if (b) { selectDistrict(b.getAttribute('data-k'), false); scrollToEl($('#atlasView')); } });
    function renderTable() {
      var m = state.m, val = function (d) { return state.sort === 'name' ? d.name : state.sort === 'n' ? d.n : state.sort === 'median' ? d.md[m.id] : d.sh[m.id]; };
      var rows = SOIL.districts.slice().sort(function (a, b) {
        var x = val(a), y = val(b);
        if (x == null && y == null) return 0; if (x == null) return 1; if (y == null) return -1;
        return (typeof x === 'string' ? x.localeCompare(y) : x - y) * state.dir || a.name.localeCompare(b.name);
      });
      $$('th[data-sort]', table).forEach(function (th) { th.setAttribute('aria-sort', th.getAttribute('data-sort') === state.sort ? (state.dir > 0 ? 'ascending' : 'descending') : 'none'); });
      $('#atableNote').textContent = 'The column “Samples in 100” gives the number of samples in every 100 that ' + m.cond + '. Tap a column heading to sort the table. Tap a district name to select it.';
      $('th[data-sort="median"] button', table).textContent = 'Median ' + m.medianName;
      $('tbody', table).innerHTML = rows.map(function (d) {
        var s = d.sh[m.id], st = stepOf(s), med = medianText(d, m);
        var word = st < 0 ? icon(3) + 'No valid data' : state.own ? (Math.round(s) >= state.level ? 'At or above your number' : 'Below your number') : icon(st) + STEPS[st].word;
        return '<tr' + (state.d && state.d.key === d.key ? ' class="is-on"' : '') + '><th scope="row"><button type="button" data-k="' + esc(d.key) + '">' + esc(d.name) + '</button></th><td class="num fig">' + (s == null ? 'n.d.' : in100(s)) + '</td><td class="stepcell">' + word + (d.flags[m.id] === 'method' ? ' *' : '') + '</td><td class="num fig">' + (med || 'n.d.') + '</td><td class="num fig">' + fmtInt(d.n) + '</td></tr>';
      }).join('') + (m.id === 'p' ? '<tr class="foot"><td colspan="5">* Kasur’s phosphorus values suggest a different laboratory method. Select Kasur to read the note.</td></tr>' : '') +
        (m.id === 'zn' ? '<tr class="foot"><td colspan="5">n.d. means no valid data. Jhelum has no valid zinc data.</td></tr>' : '');
    }

    /* Opening state, from the link or from the last visit */
    var m0 = SOIL.measures.filter(function (m) { return m.id === qs.layer; })[0];
    if (m0) state.m = m0;
    var d0 = districtByAny(qs.district) || districtByAny(recall('district'));
    if (d0) state.d = d0;
    if (qs.level && isFinite(Number(qs.level))) { state.own = true; state.level = Math.max(0, Math.min(100, Math.round(Number(qs.level) / 5) * 5)); range.value = state.level; }
    sel.value = state.d ? state.d.key : '';
    setMeasure(state.m.id);

    /* The districts assemble as the map scrolls into view. Scroll drives it, so it also runs in calm mode. */
    if (VS.hasGsap) {
      var order = SOIL.districts.slice().sort(function (a, b) { return MAP.districts[b.key].cy - MAP.districts[a.key].cy; }).map(function (d) { return paths[d.key]; });
      gsap.fromTo(order, { opacity: 0, y: 26 }, { opacity: 1, y: 0, ease: 'none', stagger: 0.03,
        scrollTrigger: { trigger: svg, start: 'top 92%', end: 'top 38%', scrub: VS.calm ? true : 0.4 } });
    }
    root.VANAtlas = { select: selectDistrict };
  })();

  /* ---------- Tool 2: crop nutrition creator ---------- */
  (function creator() {
    var app = $('#creatorApp'); if (!app || !PL) return;
    var out = $('#planResult'), E = PL.engine;
    var state = { crop: PL.order[0], acres: 1, date: '', readings: {}, district: '', fromDistrict: false };
    var LABEL = { pH: 'Soil pH', OM: 'Organic matter', P2O: 'Available phosphorus (P)' }, UNIT = { pH: '', OM: '%', P2O: ' ppm' };
    var inputs = { pH: $('#soil_pH'), OM: $('#soil_OM'), P2O: $('#soil_P2O') };
    var acresNum = $('#creatorAcres'), acresRange = $('#acresRange'), dateIn = $('#creatorDate'), distSel = $('#creatorDistrict');

    $('#creatorCrops').innerHTML = PL.order.map(function (s) {
      return '<button type="button" role="radio" class="cropbtn" data-crop="' + s + '" aria-checked="false">' + esc(PL.plans[s].name) + '</button>';
    }).join('');
    $('#creatorCrops').addEventListener('click', function (e) { var b = e.target.closest('.cropbtn'); if (b) setCrop(b.getAttribute('data-crop'), true); });
    $('#creatorCrops').addEventListener('keydown', function (e) {
      if (['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].indexOf(e.key) < 0) return;
      e.preventDefault();
      var i = (PL.order.indexOf(state.crop) + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1) + PL.order.length) % PL.order.length;
      setCrop(PL.order[i], true); $('.cropbtn[data-crop="' + PL.order[i] + '"]').focus();
    });
    distSel.insertAdjacentHTML('beforeend', SOIL.districts.map(function (d) { return '<option value="' + esc(d.key) + '">' + esc(d.name) + '</option>'; }).join(''));

    function clampAcres(v) { v = Math.round(Number(v)); return !isFinite(v) || v < 1 ? 1 : v > 500 ? 500 : v; }
    acresRange.addEventListener('input', function () { state.acres = clampAcres(acresRange.value); acresNum.value = state.acres; render(); });
    acresNum.addEventListener('input', function () { if (acresNum.value === '') return; state.acres = clampAcres(acresNum.value); acresRange.value = state.acres; render(); });
    acresNum.addEventListener('blur', function () { acresNum.value = state.acres; });
    dateIn.addEventListener('input', function () { state.date = parseIso(dateIn.value) ? dateIn.value : ''; render(); });
    E.inputs.forEach(function (p) {
      inputs[p].addEventListener('input', function () { readInputs(); state.fromDistrict = false; render(); });
    });
    distSel.addEventListener('change', function () { setDistrict(distSel.value); });
    $('#soilClear').addEventListener('click', function () { E.inputs.forEach(function (p) { inputs[p].value = ''; }); distSel.value = ''; state.district = ''; state.fromDistrict = false; readInputs(); render(); });
    $('#creatorForm').addEventListener('submit', function (e) { e.preventDefault(); });

    function readInputs() {
      state.readings = {};
      E.inputs.forEach(function (p) { var v = inputs[p].value; if (v !== '' && isFinite(Number(v))) state.readings[p] = Number(v); });
    }
    function setDistrict(key) {
      var d = districtByAny(key);
      state.district = d ? d.key : ''; distSel.value = state.district;
      if (d) {
        E.inputs.forEach(function (p) { inputs[p].value = d.fill[p] === undefined ? '' : d.fill[p]; });
        state.fromDistrict = true; store('district', d.key);
      } else state.fromDistrict = false;
      readInputs(); render();
    }
    function setCrop(slug, user) {
      if (!PL.plans[slug]) return;
      state.crop = slug;
      var P = PL.plans[slug];
      $$('.cropbtn').forEach(function (b) { var on = b.getAttribute('data-crop') === slug; b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1; });
      var dateWord = P.words.date.charAt(0).toUpperCase() + P.words.date.slice(1);
      $('#dateLabel').textContent = dateWord;
      $('#dateHint').textContent = slug === 'wheat'
        ? 'Enter your sowing date. The creator works out the date of each stage from it.'
        : 'Enter your ' + P.words.date + '. We publish stage dates for wheat only. For ' + P.inline + ', the creator counts the days ' + P.words.after + '.';
      var name = function (param) { var e = P.soilMap.filter(function (x) { return x[0] === param; }).map(function (x) { var r = P.cost.filter(function (c) { return c.slug === x[1]; })[0]; return r ? shownName(r.product) : null; }).filter(Boolean); return e; };
      var ph = name('pH'), om = name('OM')[0], pp = name('P2O')[0];
      var hasUrea = P.cost.some(function (r) { return r.product === 'Urea' && r.pct.N; }) && P.cost.some(function (r) { return r.slug === 'vital-urea'; });
      $('#soilRule').innerHTML = '<b>What the readings change for ' + esc(P.inline) + '</b> With a high pH reading, the creator adds ' + esc(ph.join(' and ')) + '.' + (hasUrea ? ' With a high pH reading, the creator also replaces part of the urea with Vital Urea. The total nitrogen stays the same.' : '') +
        (om ? ' With a low organic matter reading, the creator adds ' + esc(om) + '.' : '') + (pp ? ' With a low phosphorus reading, the creator adds ' + esc(pp) + '. With a phosphorus reading at the Healthy level, the creator cuts the amount of ' + esc(pp) + ' by 1/4.' : '');
      if (user) store('crop', slug);
      render(true);
    }

    function soilSummary(res) {
      var keys = E.inputs.filter(function (p) { return state.readings[p] !== undefined; });
      if (!keys.length) return '<p class="lnote">You have entered no soil reading. The bag totals are our standard rates per acre, multiplied by your acres. If you have no soil report, follow the published crop plan. The Nutrition creator list is meant for a field with a soil report.</p>' + scaleNote();
      var d = districtByAny(state.district);
      var h = '<ul class="readings">' + keys.map(function (p) {
        var b = res.bands[p], v = state.readings[p];
        return '<li><span>' + LABEL[p] + '</span><span class="fig">' + v + UNIT[p] + '</span><span class="lvl' + (b ? ' lvl--' + b : '') + '">' + (b ? 'Level: ' + E.bandLabel[b] : 'No level') + '</span></li>';
      }).join('') + '</ul>';
      if (state.fromDistrict && d) h += '<p class="lnote">These readings are the median readings of ' + esc(d.name) + ' district from the samples that the Punjab soil testing programme tested in about 2016 to 2018. They are not a test of your field.</p>';
      if (state.readings.pH !== undefined && !res.bands.pH) h += '<p class="lnote">Our soil scale has no level for a pH below 7. A pH reading below 7 changes nothing in the plan.</p>';
      if (res.adjusted) h += '<p class="lnote lnote--pilot">The soil adjustment is a pilot. Confirm any change made for your soil with your VAN dealer before you apply it.</p>';
      return h + scaleNote();
    }
    function rangeText(r) {
      if (r.min === null) return 'Below ' + r.max;
      if (r.max === null) return 'Above ' + r.min;
      return (r.minOpen ? 'Above ' + r.min : r.min) + ' to ' + (r.maxClosed ? r.max : 'below ' + r.max);
    }
    function scaleNote() {
      var cell = function (p, band) { var r = E.ranges[p].filter(function (x) { return x.band === band; })[0]; return r ? rangeText(r) : ''; };
      return '<p class="lnote">Our soil scale has 5 levels. From the worst soil condition to the best, they are Critical, Weak, Average, Moderate and Healthy.</p>' +
        '<table class="levels"><caption>Readings and levels</caption><thead><tr><th scope="col">Level</th><th scope="col">Soil pH</th><th scope="col">Organic matter, %</th><th scope="col">Available phosphorus (P), ppm</th></tr></thead><tbody>' +
        E.bandOrder.map(function (b) { return '<tr><th scope="row">' + E.bandLabel[b] + '</th><td class="fig">' + cell('pH', b) + '</td><td class="fig">' + cell('OM', b) + '</td><td class="fig">' + cell('P2O', b) + '</td></tr>'; }).join('') + '</tbody></table>';
    }

    function waText(P, res, tl) {
      var a = state.acres, lines = ['Hello VAN. My ' + P.inline + ' plan for ' + fmtInt(a) + ' acre' + (a > 1 ? 's' : '') + ':'];
      res.lines.forEach(function (l) { lines.push('• ' + l.name + ': your field needs ' + group(l.total) + ' ' + l.unit + '. Buy ' + group(fmtCreator(toBuy(l.shown))) + ' ' + l.word + (toBuy(l.shown) > 1 ? 's' : '') + ' of ' + l.packKg + ' ' + l.unit + ' each.'); });
      var d = districtByAny(state.district);
      if (d) lines.push('My district: ' + d.name + '.');
      var keys = E.inputs.filter(function (p) { return state.readings[p] !== undefined; });
      if (keys.length) lines.push((state.fromDistrict && d ? 'Soil: no test of my own. The soil readings are the district survey median: ' : 'My soil readings: ') + keys.map(function (p) { return LABEL[p] + ' ' + state.readings[p] + UNIT[p]; }).join(', ') + '.');
      if (state.date) lines.push(P.words.started + ': ' + pretty(parseIso(state.date), true) + '.');
      lines.push('', 'Timeline, per acre:');
      tl.forEach(function (s) {
        if (!s.rows.length) return;
        lines.push(s.name + (s.dates ? ' (' + s.dates.text + ')' : '') + ': ' + s.rows.map(function (r) { return r.product + ' ' + r.rate; }).join('; ') + '.');
      });
      lines.push('', 'Please confirm pricing and availability.');
      if (!d) lines.push('Please confirm my nearest dealer. My district is:');
      return lines.join('\n');
    }

    function render(cropChanged) {
      var P = PL.plans[state.crop], a = state.acres, res = calcCreator(state.crop, a, state.readings), tl = timeline(state.crop, a, state.date);
      var acresText = fmtInt(a) + ' acre' + (a > 1 ? 's' : '');
      var sowD = parseIso(state.date);
      var h = '<div class="ledger__head"><p class="eyebrow">Your plan</p><h3 class="ledger__title">' + esc(P.name) + ' · <span class="fig">' + fmtInt(a) + '</span> acre' + (a > 1 ? 's' : '') + (sowD ? ' · ' + P.words.started.toLowerCase() + ' <span class="fig">' + pretty(sowD, true) + '</span>' : '') + '</h3></div>';

      /* Date line */
      if (sowD) {
        var wc = windowCheck(state.crop, state.date), ds = daysSince(state.date), bits = [];
        if (wc && wc.inWindow) bits.push('Your date is inside our ' + P.words.window + ' for ' + P.inline + ', ' + P.sowing + '.');
        else if (wc) bits.push('Your date is about ' + wc.monthsOut + ' month' + (wc.monthsOut === 1 ? '' : 's') + ' ' + (wc.direction === 'early' ? 'before' : 'after') + ' our ' + P.words.window + ' for ' + P.inline + ', ' + P.sowing + '.');
        if (ds !== null && ds >= 0) bits.push('Today is day <span class="fig">' + ds + '</span> ' + P.words.after + '.');
        h += '<p class="lnote lnote--date">' + bits.join(' ') + '</p>';
      }

      /* 1. Bag totals */
      h += '<section class="lsec"><h4 class="lsec__h"><span class="fig">A</span> Bags and packs for ' + acresText + '</h4>' + soilSummary(res) +
        '<div class="ltable" role="table" aria-label="Bags and packs for ' + acresText + '"><div class="lrow lrow--head" role="row"><span role="columnheader">Product</span><span role="columnheader">Total weight or volume</span><span role="columnheader">Bags or packs to buy</span></div>' +
        res.lines.map(function (l) {
          var notes = [];
          var kg = function (q) { return group(fmtNum(Math.abs(q) * l.packKg, 1).replace(/\.0$/, '')) + ' ' + l.unit; };
          if (l.bumpPerAcre > 0) notes.push('<span class="chg chg--up">This product has ' + kg(l.bumpQty) + ' more because of your soil readings.</span>');
          if (l.bumpPerAcre < 0) notes.push('<span class="chg chg--down">This product has ' + kg(l.bumpQty) + ' less because of your soil readings.</span>');
          if (l.swapPerAcre > 0.001) notes.push('<span class="chg chg--up">This product has ' + kg(l.swapQty) + ' more because it now carries the nitrogen moved from urea.</span>');
          if (l.swapPerAcre < -0.001) notes.push('<span class="chg chg--down">This product has ' + kg(l.swapQty) + ' less because its nitrogen moved to Vital Urea.</span>');
          return '<div class="lrow' + (notes.length ? ' is-changed' : '') + '" role="row"><span role="cell" class="lrow__p">' + (l.slug ? '<img class="lrow__img" src="img/packs/' + l.slug + '.webp?v=2" alt="" loading="lazy" width="40" height="56">' : '<span class="lrow__img lrow__img--none" aria-hidden="true"></span>') + '<b>' + esc(l.name) + '</b>' + (l.slug ? '' : '<span class="tag tag--grey">not made by VAN</span>') + '<span class="lrow__pack">' + l.packKg + ' ' + l.unit + ' ' + l.word + '</span>' + notes.join('') + '</span>' +
            '<span role="cell" class="fig lrow__t">' + group(l.total) + ' ' + l.unit + '</span><span role="cell" class="fig lrow__q">' + group(fmtCreator(toBuy(l.shown))) + '</span></div>';
        }).join('') + '</div>' +
        '<p class="lnote">The total weight or volume is the amount your field needs. The number of bags or packs to buy is that amount rounded up to the next half bag or half pack.</p></section>';

      /* 2. Nutrients */
      h += '<section class="lsec"><h4 class="lsec__h"><span class="fig">B</span> Nutrients applied on ' + acresText + '</h4>';
      if (state.readings.pH > 8) h += '<p class="warn"><b>Soil pH above 8.</b> In calcareous soil with a pH above 8, free calcium binds most of the phosphate applied as fertiliser before the roots can take it up.</p>';
      h += '<dl class="nut">' + res.nutrients.map(function (n) { return '<div><dt>' + n.label + '</dt><dd class="fig">' + group(n.text) + '</dd></div>'; }).join('') + '</dl>';
      if (P.rangeSentence) h += '<p class="lnote">The bag totals come from the Nutrition creator on van.com.pk. The timeline comes from our published crop plan. For ' + P.inline + ', the bag totals and the timeline do not contain exactly the same products. ' + P.rangeSentence.replace(/ below is a range/g, ' above is a range') + '</p>';
      h += '</section>';

      /* 3. Timeline */
      h += '<section class="lsec"><h4 class="lsec__h"><span class="fig">C</span> Timeline, stage by stage</h4>';
      if (state.crop === 'wheat') h += '<p class="lnote">' + (tl[0].dates ? 'The dates are calculated for a normal season at Lahore. They are not a forecast for your district or for this year’s weather.' : 'Enter your sowing date to see the date of each stage.') + '</p>';
      else h += '<p class="lnote">We publish stage dates for wheat only. For ' + P.inline + ', the timeline lists the stages in order.</p>';
      if (P.rows.some(function (r) { return r.spray; })) h += '<p class="lnote">The spray rates in this plan are published per 200 litres of water. The figures for ' + acresText + ' assume 1 tank of 200 litres per acre.</p>';
      h += '<ol class="tl">' + tl.map(function (s) {
        return '<li class="tl__stage"><div class="tl__head"><span class="fig tl__n">' + s.n + '</span><div><p class="tl__name">' + esc(s.name) + '</p>' + (s.dates ? '<p class="fig tl__dates">' + s.dates.text + '</p>' : '') + '</div></div>' +
          (s.rows.length ? '<div class="tl__rows">' + s.rows.map(function (r) {
            return '<div class="tl__row"><span class="tl__p"><b>' + esc(r.product) + '</b>' + (r.van ? '' : '<span class="tag tag--grey">not made by VAN</span>') + '<span class="tl__m">' + esc(r.method) + '</span></span>' +
              '<span class="tl__q"><span class="tl__k">Per acre</span><span class="fig">' + esc(r.rate) + '</span></span><span class="tl__q"><span class="tl__k">For ' + acresText + '</span><span class="fig">' + r.qty + '</span>' + (r.range ? '<span class="tl__k">Where a rate is a range, the figure for ' + acresText + ' uses the lower rate.</span>' : '') + '</span></div>';
          }).join('') + '</div>' : '<p class="lnote">The published plan applies nothing new at this stage.</p>') + '</li>';
      }).join('') + '</ol></section>';

      h += '<p class="lnote ledger__limit">This crop plan is a general plan, set per acre for a typical crop on a typical soil. It is not a prescription for your field. It does not replace a soil test.</p>' +
        '<div class="actions"><button type="button" class="btn btn--tool" id="planPrint"><span>Print</span></button>' +
        '<a class="btn btn--tool btn--wa" id="planWa" target="_blank" rel="noopener" href="' + WA + '?text=' + encodeURIComponent(waText(P, res, tl)) + '" data-cursor="Open"><span>Send on WhatsApp</span></a>' +
        '<button type="button" class="btn btn--ghost btn--tool" id="planShare"><span>Copy a link to this plan</span></button>' +
        '<a class="link-arrow" href="' + SITE + 'crops/' + P.slug + '.html" data-cursor="Open">The ' + P.inline + ' crop plan on van.com.pk</a></div>' +
        '<p class="lnote">The WhatsApp button opens a message to us with this plan as its text. You send the message yourself.</p><p class="note" id="planStatus" role="status"></p>';
      out.innerHTML = h;
      if (cropChanged && VS.animate) gsap.fromTo($$('.lrow, .tl__stage', out), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.015, clearProps: 'all' });
    }
    out.addEventListener('click', function (e) {
      if (e.target.closest('#planPrint')) printOnly('print-plan');
      if (e.target.closest('#planShare')) shareLink({ crop: state.crop, acres: state.acres, sow: state.date, ph: state.readings.pH, om: state.readings.OM, p: state.readings.P2O }, 'Crop nutrition plan', $('#planStatus'));
    });

    /* Opening state */
    var c0 = PL.plans[qs.crop] ? qs.crop : PL.plans[recall('crop')] ? recall('crop') : PL.order[0];
    if (qs.acres) { state.acres = clampAcres(qs.acres); acresNum.value = state.acres; acresRange.value = state.acres; }
    if (parseIso(qs.sow)) { state.date = qs.sow; dateIn.value = qs.sow; }
    if (qs.ph) inputs.pH.value = qs.ph;
    if (qs.om) inputs.OM.value = qs.om;
    if (qs.p) inputs.P2O.value = qs.p;
    readInputs();
    setCrop(c0, false);
    root.VANCreator = { setCrop: function (s) { setCrop(s, true); }, setDistrict: setDistrict };
    if (qs.crop && !qs.nojump && !qs.district && !qs.month && !qs.sim) window.addEventListener('load', function () { $('#creator').scrollIntoView(); });
  })();

  /* ---------- Tool 3: sowing calendar ---------- */
  (function calendar() {
    var app = $('#calendarApp'); if (!app || !CAL) return;
    var now = new Date().getMonth(), state = { month: null };
    var strip = $('#calStrip'), table = $('#calMatrix');
    var counts = MONTHS.map(function (_, m) { return cropsInMonth(m).length; });
    strip.innerHTML = '<button type="button" class="mbtn mbtn--all" data-m="all" aria-pressed="true"><span class="mbtn__m">All</span><span class="fig">' + CAL.length + '</span></button>' + MONTHS.map(function (m, i) {
      return '<button type="button" class="mbtn' + (i === now ? ' is-now' : '') + '" data-m="' + i + '" aria-pressed="false" aria-label="' + MONTHS_LONG[i] + ', ' + counts[i] + ' crop plans' + (i === now ? ', this month' : '') + '"><span class="mbtn__m">' + m + '</span><span class="fig">' + counts[i] + '</span>' + (i === now ? '<span class="mbtn__now">Now</span>' : '') + '</button>';
    }).join('');
    strip.addEventListener('click', function (e) { var b = e.target.closest('.mbtn'); if (!b) return; var v = b.getAttribute('data-m'); state.month = v === 'all' || Number(v) === state.month ? null : Number(v); render(); });

    $('thead', table).innerHTML = '<tr><th scope="col" class="cal__crop">Crop plan</th>' + MONTHS.map(function (m, i) { return '<th scope="col" class="cal__m' + (i === now ? ' is-now' : '') + '"><abbr title="' + MONTHS_LONG[i] + '"><span class="m3">' + m + '</span><span class="m1">' + m.charAt(0) + '</span></abbr>' + (i === now ? '<span class="cal__nowtag">Now</span>' : '') + '</th>'; }).join('') + '</tr>';
    table.addEventListener('click', function (e) {
      var b = e.target.closest('[data-crop]'); if (!b || !root.VANCreator) return;
      root.VANCreator.setCrop(b.getAttribute('data-crop')); scrollToEl($('#creator'));
    });

    function render() {
      var m = state.month, focus = m === null ? now : m;
      $$('.mbtn', strip).forEach(function (b) { var v = b.getAttribute('data-m'); b.setAttribute('aria-pressed', v === 'all' ? m === null : Number(v) === m); });
      var groups = [], seen = {};
      CAL.forEach(function (c) { if (!seen[c.group]) { seen[c.group] = { label: c.groupLabel, crops: [] }; groups.push(seen[c.group]); } seen[c.group].crops.push(c); });
      var h = '', shown = 0;
      groups.forEach(function (g) {
        var crops = g.crops.filter(function (c) { return m === null || c.windows.some(function (w) { return inWindow(w, m); }); });
        if (!crops.length) return;
        h += '<tr class="cal__group"><th scope="rowgroup" colspan="13">' + esc(g.label) + '</th></tr>';
        crops.forEach(function (c) {
          shown++;
          h += '<tr><th scope="row" class="cal__crop"><a href="' + SITE + 'crops/' + c.slug + '.html" data-cursor="Open">' + esc(c.name) + '</a><span class="cal__win"><span class="fig">' + esc(c.label) + '</span><span class="cal__tag">' + esc(c.tag) + '</span></span>' +
            (c.here ? '<button type="button" class="link-btn" data-crop="' + c.slug + '">Open in the creator</button>' : '') + '</th>' +
            MONTHS.map(function (_, i) { var on = c.windows.some(function (w) { return inWindow(w, i); }); return '<td class="cal__cell' + (i === focus ? ' is-col' : '') + (i === now ? ' is-now' : '') + '">' + (on ? '<span class="sq sq--on"><span class="sr-only">' + MONTHS_LONG[i] + ': inside the sowing window</span></span>' : '<span class="sq" aria-hidden="true"></span>') + '</td>'; }).join('') + '</tr>';
        });
      });
      $('tbody', table).innerHTML = h;
      $$('thead th.cal__m', table).forEach(function (th, i) { th.classList.toggle('is-col', i === focus); });
      var list = cropsInMonth(focus).map(function (c) { return c.name; });
      var names = list.length > 1 ? list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1] : list.join('');
      $('#calStatus').innerHTML = (m === null ? 'The table shows all <span class="fig">28</span> crop plans. This month is ' + MONTHS_LONG[now] + '. ' : '') +
        MONTHS_LONG[focus] + ' is inside the sowing window of <span class="fig">' + list.length + '</span> crop plan' + (list.length === 1 ? '' : 's') + (list.length ? ': ' + esc(names) + '.' : '.');
    }
    if (qs.month && Number(qs.month) >= 1 && Number(qs.month) <= 12) state.month = Number(qs.month) - 1;
    render();
    var nowBtn = $('.mbtn.is-now', strip);
    if (nowBtn) strip.scrollLeft = Math.max(0, nowBtn.offsetLeft - 60);
  })();

  /* ---------- Tool 4: farm discipline simulator ---------- */
  (function simulator() {
    var app = $('#simApp'); if (!app || !SIM) return;
    var NAMES = { wheat: 'Wheat', potato: 'Potato' }, LEVELS = ['bad', 'ok', 'best'], LABEL = { bad: 'Bad', ok: 'OK', best: 'Best' };
    var state = { crop: 'wheat', levels: {}, target: 60 };
    var tNum = $('#simTarget'), tRange = $('#simTargetRange'), gauge = $('#simGauge');
    var R = 130, CX = 160, CY = 160, LEN = Math.PI * R;
    gauge.insertAdjacentHTML('beforeend', '<path class="g__track" d="M30 160A130 130 0 0 1 290 160"/><path class="g__fill" id="gFill" d="M30 160A130 130 0 0 1 290 160" stroke-dasharray="' + LEN.toFixed(1) + '" stroke-dashoffset="' + LEN.toFixed(1) + '"/><g id="gTarget" class="g__target"><line x1="0" y1="-118" x2="0" y2="-144"/><text y="-150" text-anchor="middle">Target</text></g><text class="g__end fig" x="30" y="178" text-anchor="middle">0</text><text class="g__end fig" id="gMax" x="290" y="178" text-anchor="middle"></text>');
    var fill = $('#gFill'), tick = $('#gTarget'), shownOffset = LEN;
    $('#simLevers').insertAdjacentHTML('beforebegin', '<div class="sim__mini" id="simMini" aria-hidden="true"></div>');

    $('#simCrops').innerHTML = Object.keys(SIM).map(function (k) { return '<button type="button" role="radio" class="cropbtn cropbtn--dark" data-crop="' + k + '" aria-checked="false">' + NAMES[k] + '</button>'; }).join('');
    $('#simCrops').addEventListener('click', function (e) { var b = e.target.closest('.cropbtn'); if (b) setCrop(b.getAttribute('data-crop')); });
    $('#simCrops').addEventListener('keydown', function (e) {
      if (['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].indexOf(e.key) < 0) return;
      e.preventDefault(); var next = state.crop === 'wheat' ? 'potato' : 'wheat'; setCrop(next); $('.cropbtn[data-crop="' + next + '"]', app).focus();
    });
    function clampT(v) { var max = Math.round(SIM[state.crop].base * 1.3); v = Math.round(Number(v)); return !isFinite(v) || v < 0 ? 0 : v > max ? max : v; }
    tRange.addEventListener('input', function () { state.target = clampT(tRange.value); tNum.value = state.target; render(); });
    tNum.addEventListener('input', function () { if (tNum.value === '') return; state.target = clampT(tNum.value); tRange.value = state.target; render(); });
    tNum.addEventListener('blur', function () { tNum.value = state.target; });
    $('#simLevers').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-lv]'); if (!b) return;
      state.levels[b.getAttribute('data-name')] = b.getAttribute('data-lv'); render();
    });

    function setCrop(crop) {
      state.crop = crop; state.levels = {};
      var M = SIM[crop], max = Math.round(M.base * 1.3);
      state.target = Math.round(M.base);
      tRange.max = max; tNum.max = max; tRange.value = state.target; tNum.value = state.target;
      $('#gMax').textContent = max;
      $$('.cropbtn', $('#simCrops')).forEach(function (b) { var on = b.getAttribute('data-crop') === crop; b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1; });
      $('#simTargetNote').textContent = 'The target starts at ' + Math.round(M.base) + ' maunds per acre. This is our assumed yield ' + (crop === 'potato' ? 'for the variety ' + M.baseLabel + '. If your variety yields more or less, type your own number.' : 'for a good progressive wheat farmer. If you expect a higher or lower yield, type your own number.');
      $('#simLevers').innerHTML = M.levers.map(function (l, i) {
        return '<div class="lever" data-i="' + i + '"><div class="lever__top"><p class="lever__name"><span class="fig">' + ('0' + (i + 1)).slice(-2) + '</span> ' + esc(l.name) + '</p><div class="lever__btns" role="group" aria-label="' + esc(l.name) + '">' +
          LEVELS.map(function (lv) { return '<button type="button" data-name="' + esc(l.name) + '" data-lv="' + lv + '" aria-pressed="false">' + LABEL[lv] + '</button>'; }).join('') + '</div></div><p class="lever__text"></p></div>';
      }).join('');
      render();
    }
    function render() {
      var res = simulate(state.crop, state.levels, state.target), max = res.targetMax;
      $('#simYield').textContent = f1(res.predicted);
      $('#simGap').innerHTML = res.gap > 0.5 ? '<span class="gap gap--below"><span class="fig">' + f1(res.gap) + '</span> maunds per acre below your target</span>' : '<span class="gap gap--on">On target</span>';
      $('#simMini').innerHTML = '<span>Estimated <span class="fig">' + f1(res.predicted) + '</span></span><span>Target <span class="fig">' + state.target + '</span></span><span>' + (res.gap > 0.5 ? '<span class="fig">' + f1(res.gap) + '</span> below' : 'On target') + '</span>';
      var off = LEN * (1 - Math.max(0, Math.min(1, res.predicted / max)));
      if (VS.animate) { var o = { v: shownOffset }; gsap.to(o, { v: off, duration: 0.5, ease: 'power2.out', overwrite: true, onUpdate: function () { fill.setAttribute('stroke-dashoffset', o.v.toFixed(1)); shownOffset = o.v; } }); }
      else { fill.setAttribute('stroke-dashoffset', off.toFixed(1)); shownOffset = off; }
      tick.setAttribute('transform', 'translate(' + CX + ' ' + CY + ') rotate(' + (-90 + 180 * Math.max(0, Math.min(1, state.target / max))) + ')');
      $('#simGaugeTitle').textContent = 'Estimated yield ' + f1(res.predicted) + ' maunds per acre. Target ' + state.target + ' maunds per acre.';
      res.rows.forEach(function (r, i) {
        var el = $('.lever[data-i="' + i + '"]', app);
        el.className = 'lever lever--' + r.level;
        $('.lever__text', el).textContent = r.text;
        $$('button', el).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lv') === r.level); });
      });
      var top = res.gains.length ? res.gains[0].gain : 1;
      $('#simBars').innerHTML = res.gains.length ? res.gains.map(function (g) {
        return '<li><p><b>' + esc(g.name) + '</b> is scored ' + LABEL[g.level] + '. Raising it to Best could add up to <span class="fig">' + f1(g.gain) + '</span> maunds per acre.</p><span class="bar"><i style="width:' + (100 * g.gain / top).toFixed(1) + '%"></i></span></li>';
      }).join('') : '<li><p>Every practice is scored Best.</p></li>';
    }
    setCrop(SIM[qs.sim] ? qs.sim : 'wheat');
  })();

  if (VS.hasGsap && root.ScrollTrigger) window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  var jump = qs.nojump ? null : qs.district || qs.layer ? '#atlas' : qs.month ? '#calendar' : qs.sim ? '#simulator' : null;
  if (jump) window.addEventListener('load', function () { var el = $(jump); if (el) el.scrollIntoView(); });
})(typeof window !== 'undefined' ? window : globalThis);
