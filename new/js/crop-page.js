/* Crop plans page: search with suggestions, the season dial and the 28 plans.
   Data: window.VAN_CALENDAR (data/crop-calendar.js). Months are numbered 0 (January) to 11 (December).
   Test hooks: ?month=0..11 selects a month. ?crop=<slug> selects a crop. ?group=cereal|oil|pulse|veg|fruit shows 1 group. */
(function () {
  'use strict';
  var CAL = window.VAN_CALENDAR;
  if (!CAL) return;
  var NS = 'http://www.w3.org/2000/svg';
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var GROUPS = [['cereal', 'Cereals and field crops', '#C88A2E'], ['oil', 'Oilseeds', '#D9A92A'], ['pulse', 'Pulses', '#2D5A3C'], ['veg', 'Vegetables and spices', '#9C3F2C'], ['fruit', 'Orchards and fruit', '#5E9A6C']];
  var GCOL = {}; GROUPS.forEach(function (g) { GCOL[g[0]] = g[2]; });
  var BASE = 'https://www.van.com.pk/crops/';
  var WORD = { sowing: 'Sowing', planting: 'Planting', 'season start': 'Season starts' };
  var SHORT = { Jan: 'January', Feb: 'February', Mar: 'March', Apr: 'April', May: 'May', Jun: 'June', Jul: 'July', Aug: 'August', Sep: 'September', Oct: 'October', Nov: 'November', Dec: 'December' };
  var calm = document.documentElement.classList.contains('calm');
  var q = window.location.search;
  function param(k) { var m = new RegExp('[?&]' + k + '=([^&]+)').exec(q); return m ? decodeURIComponent(m[1]) : null; }

  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; }
  function sv(tag, a) { var n = document.createElementNS(NS, tag); for (var k in a) n.setAttribute(k, a[k]); return n; }
  function url(c) { return BASE + c.slug + '.html'; }
  function full(s) { return s.replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g, function (m) { return SHORT[m]; }); }
  function when(c) { return (WORD[c.tag] || 'Sowing') + ': ' + full(c.label); }
  function inMonth(c, m) { return c.windows.some(function (w) { return w[0] <= w[1] ? m >= w[0] && m <= w[1] : m >= w[0] || m <= w[1]; }); }
  function norm(s) { return s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim(); }
  var bySlug = {}; CAL.forEach(function (c) { bySlug[c.slug] = c; c.key = norm(c.name + ' ' + c.slug.replace(/-/g, ' ')); });

  var state = { month: -1, crop: null, group: null, query: '' };

  /* ---------- 1. The 28 plans ---------- */
  var all = document.getElementById('cropAll'), tiles = [];
  GROUPS.forEach(function (g) {
    var list = CAL.filter(function (c) { return c.group === g[0]; });
    var box = el('div', 'cgroup'); box.setAttribute('data-group', g[0]);
    var h = el('h3', 'cgroup__h'); h.appendChild(document.createTextNode(g[1] + ' ')); h.appendChild(el('span', 'fig', String(list.length)));
    box.appendChild(h);
    var ul = el('ul', 'cgroup__list');
    list.forEach(function (c) {
      var li = el('li'), a = el('a', 'ctile ctile--' + c.group);
      a.href = url(c); a.setAttribute('data-cursor', 'Open');
      a.appendChild(el('span', 'ctile__name', c.name));
      a.appendChild(el('span', 'ctile__when', when(c)));
      if (c.creator) a.appendChild(el('span', 'ctile__tag', 'Adjusts to your soil test'));
      a.addEventListener('mouseenter', function () { hoverCrop(c); });
      a.addEventListener('mouseleave', function () { hoverCrop(null); });
      li.appendChild(a); ul.appendChild(li);
      tiles.push({ c: c, li: li });
    });
    box.appendChild(ul); all.appendChild(box);
  });

  /* ---------- 2. Search with suggestions ---------- */
  var input = document.getElementById('cropQ'), status = document.getElementById('cropStatus');
  var form = document.getElementById('cropSearch'), sug = document.getElementById('cropSuggest'), active = -1;
  function matches() {
    var t = norm(input.value);
    return CAL.filter(function (c) { return !t || t.split(' ').every(function (w) { return c.key.indexOf(w) > -1; }); });
  }
  function renderSearch() {
    var m = matches(), t = norm(input.value);
    state.query = t;
    tiles.forEach(function (x) { x.li.hidden = m.indexOf(x.c) < 0; });
    all.querySelectorAll('.cgroup').forEach(function (b) { b.hidden = !b.querySelector('li:not([hidden])'); });
    sug.innerHTML = ''; active = -1;
    if (!t) { status.textContent = 'Showing all 28 crop plans.'; sug.hidden = true; paint(); return; }
    if (!m.length) status.textContent = 'No crop plan matches "' + input.value.trim() + '". Check the spelling, or ask us on WhatsApp.';
    else if (m.length === 1) status.textContent = '1 crop plan matches: ' + m[0].name + '. Press Enter or choose Open the plan to open it.';
    else status.textContent = m.length + ' crop plans match. Press Enter to open ' + m[0].name + ', or choose another crop from the list.';
    m.slice(0, 6).forEach(function (c, i) {
      var li = el('li', 'finder__opt'); li.setAttribute('role', 'option'); li.id = 'opt-' + c.slug;
      var a = el('a'); a.href = url(c);
      a.appendChild(el('i', 'finder__dot')); a.lastChild.style.background = GCOL[c.group];
      a.appendChild(el('span', 'finder__name', c.name));
      a.appendChild(el('span', 'finder__when', when(c)));
      li.appendChild(a); sug.appendChild(li);
    });
    sug.hidden = !m.length;
    paint();
  }
  function move(d) {
    var opts = sug.querySelectorAll('.finder__opt'); if (!opts.length) return;
    active = (active + d + opts.length) % opts.length;
    opts.forEach(function (o, i) { o.classList.toggle('is-on', i === active); o.setAttribute('aria-selected', i === active ? 'true' : 'false'); });
    input.setAttribute('aria-activedescendant', opts[active].id);
  }
  input.addEventListener('input', renderSearch);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    if (e.key === 'Escape') { sug.hidden = true; }
  });
  document.addEventListener('click', function (e) { if (!form.contains(e.target)) sug.hidden = true; });
  input.addEventListener('focus', function () { if (sug.children.length) sug.hidden = false; });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var opts = sug.querySelectorAll('.finder__opt a');
    if (active > -1 && opts[active]) { window.location.href = opts[active].href; return; }
    var m = matches();
    if (norm(input.value) && m.length) window.location.href = url(m[0]);
    else { input.focus(); if (!norm(input.value)) status.textContent = 'Type the name of your crop first.'; }
  });

  /* ---------- 3. The season dial ---------- */
  var svg = document.getElementById('dialSvg'), tip = document.getElementById('dialTip');
  var info = document.getElementById('dialInfo'), legend = document.getElementById('dialLegend');
  var C = 320, R_IN = 104, R_OUT = 262, RM0 = 274, RM1 = 314;
  function ang(m) { return (m / 12) * 2 * Math.PI; }
  function pt(r, a) { return [C + r * Math.sin(a), C - r * Math.cos(a)]; }
  function arcPath(r, a0, a1) {
    var p0 = pt(r, a0), p1 = pt(r, a1), large = (a1 - a0) > Math.PI ? 1 : 0;
    return 'M' + p0[0].toFixed(2) + ' ' + p0[1].toFixed(2) + 'A' + r + ' ' + r + ' 0 ' + large + ' 1 ' + p1[0].toFixed(2) + ' ' + p1[1].toFixed(2);
  }
  function sector(m) {
    var g = 0.01, a0 = ang(m) + g, a1 = ang(m + 1) - g, p = [pt(RM1, a0), pt(RM1, a1), pt(RM0, a1), pt(RM0, a0)];
    return 'M' + p[0] + 'A' + RM1 + ' ' + RM1 + ' 0 0 1 ' + p[1] + 'L' + p[2] + 'A' + RM0 + ' ' + RM0 + ' 0 0 0 ' + p[3] + 'Z';
  }
  // Lanes: 1 per crop, in group order, with a small gap between groups.
  var ordered = [], gap = 5, lanes = CAL.length, step;
  GROUPS.forEach(function (g) { CAL.forEach(function (c) { if (c.group === g[0]) ordered.push(c); }); });
  step = (R_OUT - R_IN - gap * (GROUPS.length - 1)) / lanes;
  var r = R_IN, prev = null;
  ordered.forEach(function (c) { if (prev && prev !== c.group) r += gap; c.r = r + step / 2; r += step; prev = c.group; });

  var gRings = sv('g', { 'class': 'dial__rings' }), gMonths = sv('g', { 'class': 'dial__months' }), gArcs = sv('g', { 'class': 'dial__arcs' });
  // faint rings for each lane
  ordered.forEach(function (c) { gRings.appendChild(sv('circle', { cx: C, cy: C, r: c.r.toFixed(2), 'class': 'dial__lane' })); });
  // month ticks
  for (var m = 0; m < 12; m++) {
    var p0 = pt(R_IN - 6, ang(m)), p1 = pt(RM0 - 2, ang(m));
    gRings.appendChild(sv('line', { x1: p0[0], y1: p0[1], x2: p1[0], y2: p1[1], 'class': 'dial__tick' }));
  }
  var counts = MONTHS.map(function (_, i) { return CAL.filter(function (c) { return inMonth(c, i); }).length; });
  var maxc = Math.max.apply(null, counts), segs = [];
  MONTHS.forEach(function (name, i) {
    var g = sv('g', { 'class': 'dial__seg', role: 'button', tabindex: '0', 'aria-label': name + ': ' + counts[i] + (counts[i] === 1 ? ' crop plan can start' : ' crop plans can start') });
    var p = sv('path', { d: sector(i) }); p.style.setProperty('--k', (0.25 + 0.75 * counts[i] / maxc).toFixed(2));
    var lp = pt((RM0 + RM1) / 2, ang(i + 0.5));
    var t = sv('text', { x: lp[0].toFixed(1), y: (lp[1] + 5).toFixed(1), 'text-anchor': 'middle' }); t.textContent = name.slice(0, 3);
    g.appendChild(p); g.appendChild(t);
    g.addEventListener('click', function () { selectMonth(state.month === i ? -1 : i); });
    g.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectMonth(state.month === i ? -1 : i); }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); selectMonth((i + 1) % 12); segs[(i + 1) % 12].focus(); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); selectMonth((i + 11) % 12); segs[(i + 11) % 12].focus(); }
    });
    g.addEventListener('mouseenter', function () { if (state.month < 0 && !state.crop) centre(name, counts[i] + (counts[i] === 1 ? ' crop plan can start' : ' crop plans can start')); });
    g.addEventListener('mouseleave', function () { if (state.month < 0 && !state.crop) centreDefault(); });
    gMonths.appendChild(g); segs.push(g);
  });
  // crop arcs
  var arcEls = [];
  ordered.forEach(function (c, idx) {
    var g = sv('g', { 'class': 'dial__crop', 'data-slug': c.slug });
    g.style.setProperty('--c', GCOL[c.group]);
    c.windows.forEach(function (w) {
      var a0 = ang(w[0]) + 0.03, a1 = ang(w[1] + 1) - 0.03; if (a1 <= a0) a1 += 2 * Math.PI;
      var path = sv('path', { d: arcPath(c.r, a0, a1), 'class': 'dial__arc' });
      var len = c.r * (a1 - a0); path.style.setProperty('--len', len.toFixed(1)); path.style.setProperty('--d', (idx * 0.035).toFixed(3) + 's');
      var hit = sv('path', { d: arcPath(c.r, a0, a1), 'class': 'dial__hit' });
      g.appendChild(path); g.appendChild(hit);
    });
    g.addEventListener('mouseenter', function () { hoverCrop(c); });
    g.addEventListener('mousemove', function (e) { showTip(c, e); });
    g.addEventListener('mouseleave', function () { hoverCrop(null); tip.hidden = true; });
    g.addEventListener('click', function () { selectCrop(state.crop === c ? null : c); });
    gArcs.appendChild(g); arcEls.push({ c: c, g: g });
  });
  // the needle for today's date
  var now = new Date(), start = new Date(now.getFullYear(), 0, 1), end = new Date(now.getFullYear() + 1, 0, 1);
  var frac = (now - start) / (end - start), aNow = frac * 2 * Math.PI;
  var gNeedle = sv('g', { 'class': 'dial__needle' });
  var n0 = pt(R_IN - 14, aNow), n1 = pt(RM1 + 10, aNow);
  gNeedle.appendChild(sv('line', { x1: n0[0], y1: n0[1], x2: n1[0], y2: n1[1] }));
  gNeedle.appendChild(sv('circle', { cx: n1[0], cy: n1[1], r: 6 }));
  var nl = pt(RM1 + 26, aNow), nt = sv('text', { x: nl[0].toFixed(1), y: (nl[1] + 4).toFixed(1), 'text-anchor': 'middle' }); nt.textContent = 'Today';
  gNeedle.appendChild(nt);
  // centre
  var gC = sv('g', { 'class': 'dial__centre' });
  gC.appendChild(sv('circle', { cx: C, cy: C, r: R_IN - 18 }));
  var cT = sv('text', { x: C, y: C - 6, 'text-anchor': 'middle', 'class': 'dial__ct' });
  var cS = sv('text', { x: C, y: C + 22, 'text-anchor': 'middle', 'class': 'dial__cs' });
  gC.appendChild(cT); gC.appendChild(cS);
  [gRings, gArcs, gMonths, gNeedle, gC].forEach(function (g) { svg.appendChild(g); });
  function centre(a, b) { cT.textContent = a; cS.textContent = b; }
  function centreDefault() { centre(MONTHS[now.getMonth()], counts[now.getMonth()] + ' crop plans can start'); }

  function showTip(c, e) {
    var b = svg.parentNode.getBoundingClientRect();
    tip.innerHTML = ''; tip.appendChild(el('b', '', c.name)); tip.appendChild(el('span', '', when(c)));
    tip.hidden = false;
    tip.style.transform = 'translate(' + Math.min(e.clientX - b.left + 14, b.width - 220) + 'px,' + (e.clientY - b.top + 14) + 'px)';
  }

  // Legend: 1 button for each group.
  GROUPS.forEach(function (g) {
    var b = el('button', 'dial__key'); b.type = 'button'; b.setAttribute('aria-pressed', 'false'); b.setAttribute('data-group', g[0]);
    var i = el('i'); i.style.background = g[2]; b.appendChild(i);
    b.appendChild(document.createTextNode(g[1] + ' '));
    b.appendChild(el('span', 'fig', String(CAL.filter(function (c) { return c.group === g[0]; }).length)));
    b.addEventListener('click', function () { state.group = state.group === g[0] ? null : g[0]; paint(); });
    legend.appendChild(b);
  });

  var hovered = null;
  function hoverCrop(c) { hovered = c; paint(); }
  function visible(c) {
    if (state.group && c.group !== state.group) return false;
    if (state.query && !state.query.split(' ').every(function (w) { return c.key.indexOf(w) > -1; })) return false;
    if (state.month > -1 && !inMonth(c, state.month)) return false;
    return true;
  }
  function paint() {
    arcEls.forEach(function (x) {
      var on = visible(x.c);
      x.g.classList.toggle('is-dim', !on || (hovered && hovered !== x.c) || (state.crop && state.crop !== x.c && !hovered));
      x.g.classList.toggle('is-hot', hovered === x.c || state.crop === x.c);
    });
    segs.forEach(function (s, i) { s.classList.toggle('is-on', i === state.month); s.setAttribute('aria-pressed', i === state.month ? 'true' : 'false'); });
    legend.querySelectorAll('.dial__key').forEach(function (b) { var on = b.getAttribute('data-group') === state.group; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    all.querySelectorAll('.cgroup').forEach(function (b) { b.classList.toggle('is-faded', !!state.group && b.getAttribute('data-group') !== state.group); });
    if (hovered) centre(hovered.name.length > 16 ? hovered.name.slice(0, 15) + '…' : hovered.name, when(hovered));
    else if (state.crop) centre(state.crop.name.length > 16 ? state.crop.name.slice(0, 15) + '…' : state.crop.name, when(state.crop));
    else if (state.month > -1) centre(MONTHS[state.month], counts[state.month] + (counts[state.month] === 1 ? ' crop plan can start' : ' crop plans can start'));
    else centreDefault();
  }

  function selectMonth(m) {
    state.month = m; state.crop = null;
    info.innerHTML = '';
    var mm = m > -1 ? m : now.getMonth();
    var list = CAL.filter(function (c) { return inMonth(c, mm); });
    info.appendChild(el('p', 'dial__k', m === now.getMonth() || m < 0 ? 'This month' : 'Month'));
    info.appendChild(el('p', 'dial__h', MONTHS[mm] + ': ' + list.length + (list.length === 1 ? ' crop plan can start' : ' crop plans can start')));
    var ul = el('ul', 'dial__list');
    list.forEach(function (c) {
      var li = el('li'), b = el('button', 'dial__item'); b.type = 'button';
      var i = el('i'); i.style.background = GCOL[c.group]; b.appendChild(i);
      b.appendChild(el('span', 'dial__in', c.name)); b.appendChild(el('span', 'dial__iw', when(c)));
      b.addEventListener('click', function () { selectCrop(c); });
      b.addEventListener('mouseenter', function () { hoverCrop(c); });
      b.addEventListener('mouseleave', function () { hoverCrop(null); });
      li.appendChild(b); ul.appendChild(li);
    });
    info.appendChild(ul);
    if (m > -1) { var x = el('button', 'dial__clear', 'Show all 12 months'); x.type = 'button'; x.addEventListener('click', function () { selectMonth(-1); }); info.appendChild(x); }
    paint();
  }
  function selectCrop(c) {
    if (!c) { selectMonth(state.month); return; }
    state.crop = c;
    info.innerHTML = '';
    var g = GROUPS.filter(function (x) { return x[0] === c.group; })[0];
    info.appendChild(el('p', 'dial__k', g[1]));
    info.appendChild(el('p', 'dial__h', c.name));
    info.appendChild(el('p', 'dial__w', when(c)));
    if (c.creator) info.appendChild(el('p', 'dial__t', 'The Nutrition creator adjusts this plan to your soil test.'));
    var a = el('a', 'btn magnetic'); a.href = url(c); a.setAttribute('data-cursor', 'Open'); a.appendChild(el('span', '', 'Open the plan for ' + c.name));
    info.appendChild(a);
    var back = el('button', 'dial__clear', state.month > -1 ? 'Back to ' + MONTHS[state.month] : 'Back to this month'); back.type = 'button';
    back.addEventListener('click', function () { state.crop = null; selectMonth(state.month); });
    info.appendChild(back);
    paint();
  }

  // Draw the arcs when the dial comes into view.
  var stage = svg.parentNode;
  if (calm || !('IntersectionObserver' in window)) stage.classList.add('is-drawn');
  else new IntersectionObserver(function (en, ob) { if (en[0].isIntersecting) { stage.classList.add('is-drawn'); ob.disconnect(); } }, { threshold: 0.25 }).observe(stage);

  var pm = param('month'), pc = param('crop'), pg = param('group');
  if (pg && GCOL[pg]) state.group = pg;
  if (pm !== null && /^\d+$/.test(pm)) selectMonth(Math.min(11, +pm)); else selectMonth(-1);
  if (pc && bySlug[pc]) selectCrop(bySlug[pc]);
  if (pm !== null || pc) { var d = document.getElementById('dial'); if (d) setTimeout(function () { d.scrollIntoView(); }, 50); }

  // Hero photo credit, when the photo is not our own.
  var credit = document.getElementById('heroCredit');
  if (credit && window.VAN_HERO_CREDIT) credit.textContent = window.VAN_HERO_CREDIT;
})();
