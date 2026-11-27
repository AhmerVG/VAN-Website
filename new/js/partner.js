/* Your brand page, 27 Nov 2026: the brand bag preview, the library explorer, the partnership tabs and the brief builder.
   Data: js/library-data.js (window.VAN_LIBRARY). Nothing is sent anywhere: the brief opens WhatsApp or the email
   program with the message filled in, and the visitor sends it. */
(function () {
  'use strict';
  var D = window.VAN_LIBRARY;
  if (!D) return;
  var $ = function (id) { return document.getElementById(id); };
  var el = function (tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };

  D.LIB.forEach(function (x) { x.shelf = 'lib'; });
  D.OWN.forEach(function (x) { x.shelf = 'own'; x.stage = x.traded ? D.T : D.M; });
  var ALL = D.LIB.concat(D.OWN);
  ALL.forEach(function (x, i) { x.i = i; });
  /* Published detail further down the page (section 05), for the codes that have it */
  var DETAIL = { 'N-26L': 'detail-n26l', 'P-44L': 'detail-p44l', 'PK-82': 'detail-pk82', 'NP-540': 'detail-np', 'NP-838S': 'detail-np' };
  var BADGE = {}; BADGE[D.L] = 'PSQCA licensed · first batch within 60 days'; BADGE[D.V] = 'Validated · first batch in about 3 months'; BADGE[D.M] = 'Made in our plant'; BADGE[D.T] = 'Supplied by us';
  var label = function (x) { return x.shelf === 'lib' ? x.code + ' · ' + x.name : x.name; };
  var formHas = function (x, k) { return (x.form || '').toLowerCase().indexOf(k) > -1; };

  /* ---------- 1. Your brand on the bag ---------- */
  var bag = { name: 'YOUR BRAND', kg: 25, item: null };
  var bagBox = $('bagDraw'), bagName = $('bagName');
  function drawBag() {
    if (!bagBox) return;
    var name = (bag.name || '').trim() || 'YOUR BRAND', it = bag.item, fam = it ? D.FAMILY[it.fam] : null;
    var col = fam ? fam.color : '#2D5A3C';
    var size = 46;
    var sub = it ? (it.shelf === 'lib' ? it.name : it.name) : 'Your formulation';
    var ana = it && it.analysis ? it.analysis : '';
    var svg =
      '<svg viewBox="0 0 320 420" role="img" aria-label="' + esc('A ' + bag.kg + ' kg bag with the brand name ' + name) + '">' +
      '<defs><linearGradient id="bgShade" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".16"/><stop offset=".18" stop-color="#000" stop-opacity="0"/><stop offset=".82" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>' +
      '<pattern id="bgWeave" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 3h6M3 0v6" stroke="#000" stroke-opacity=".035" stroke-width="1"/></pattern></defs>' +
      '<path d="M44 34 Q160 18 276 34 L292 380 Q160 402 28 380 Z" fill="#F4F1EA"/>' +
      '<path d="M44 34 Q160 18 276 34 L292 380 Q160 402 28 380 Z" fill="url(#bgWeave)"/>' +
      '<path d="M40 112 Q160 100 280 112 L284 196 Q160 186 36 196 Z" fill="' + col + '"/>' +
      nameLines(name).map(function (ln, k, all) {
        var y = all.length === 1 ? 156 : 138 + k * 36;
        return '<text data-fit="216" data-min="14" x="160" y="' + y + '" dominant-baseline="middle" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-size="' + (all.length === 1 ? size : 32) + '" fill="#fff" letter-spacing="0.5">' + esc(ln) + '</text>';
      }).join('') +
      splitLines(sub, 30).map(function (ln, k) {
        return '<text data-fit="222" data-min="12" x="160" y="' + (230 + k * 19) + '" text-anchor="middle" font-family="Public Sans, sans-serif" font-size="15" font-weight="700" fill="#171A16">' + esc(ln) + '</text>';
      }).join('') +
      (ana ? '<text data-fit="222" data-min="10" x="160" y="' + (splitLines(sub, 30).length > 1 ? 272 : 256) + '" text-anchor="middle" font-family="Public Sans, sans-serif" font-size="12.5" fill="#4B5148">' + esc(ana) + '</text>' : '') +
      '<rect x="112" y="300" width="96" height="44" rx="10" fill="none" stroke="' + col + '" stroke-width="2"/>' +
      '<text x="160" y="330" text-anchor="middle" font-family="Public Sans, sans-serif" font-size="22" font-weight="700" fill="' + col + '">' + bag.kg + ' kg</text>' +
      '<path d="M44 34 Q160 18 276 34 L292 380 Q160 402 28 380 Z" fill="url(#bgShade)"/>' +
      '<path d="M46 46 Q160 31 274 46 M30 368 Q160 390 290 368" fill="none" stroke="#000" stroke-opacity=".12" stroke-dasharray="3 4"/>' +
      '</svg>';
    bagBox.innerHTML = svg;
    fitBag();
  }
  /* Each text line on the bag shrinks until it fits inside the bag (Tahir, 27 Nov 2026). */
  function fitBag() {
    bagBox.querySelectorAll('text[data-fit]').forEach(function (t) {
      if (!t.getComputedTextLength) return;
      var max = +t.getAttribute('data-fit'), min = +t.getAttribute('data-min'), fs = parseFloat(t.getAttribute('font-size')), n = 0;
      while (t.getComputedTextLength() > max && fs > min && n++ < 60) { fs -= 1; t.setAttribute('font-size', fs); }
      /* still too long at the smallest size: the line is squeezed to the width of the bag */
      if (t.getComputedTextLength() > max) { t.setAttribute('textLength', max); t.setAttribute('lengthAdjust', 'spacingAndGlyphs'); }
    });
  }
  /* A long brand name goes onto 2 lines, broken at the space nearest the middle. */
  function splitLines(s, limit) {
    if (s.length <= limit || s.indexOf(' ') < 0) return [s];
    var mid = s.length / 2, best = -1;
    for (var i = 0; i < s.length; i++) if (s[i] === ' ' && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i;
    return [s.slice(0, best), s.slice(best + 1)];
  }
  function nameLines(name) { return splitLines(name, 11); }
  if (bagName) bagName.addEventListener('input', function () { bag.name = bagName.value.toUpperCase(); drawBag(); });
  document.querySelectorAll('[data-kg]').forEach(function (b) {
    b.addEventListener('click', function () {
      bag.kg = +b.getAttribute('data-kg');
      document.querySelectorAll('[data-kg]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      drawBag();
    });
  });

  /* ---------- 2. The library explorer ---------- */
  var list = $('lxList'), pills = $('lxPills'), card = $('lxCard'), count = $('lxCount'), shelves = $('lxShelves');
  var st = { shelf: 'lib', filter: 'ALL', sel: 0 };
  var FILTERS = {
    lib: [['ALL', 'All'], [D.L, 'PSQCA licensed · first batch within 60 days'], [D.V, 'Validated · first batch in about 3 months'], ['granul', 'Granular'], ['fertigation', 'Fertigation'], ['foliar', 'Foliar']],
    own: [['ALL', 'All'], [D.M, 'Made in our plant'], [D.T, 'Supplied by us'], ['granul', 'Granular'], ['fertigation', 'Fertigation'], ['foliar', 'Foliar']]
  };
  var NOUN = { lib: 'library formulations', own: 'formulations we already sell' };
  function match(x, f) { return f === 'ALL' ? true : (f === D.L || f === D.V || f === D.M || f === D.T) ? x.stage === f : formHas(x, f); }
  function inShelf() { return ALL.filter(function (x) { return x.shelf === st.shelf; }); }
  function buildPills() {
    pills.textContent = '';
    var items = inShelf();
    FILTERS[st.shelf].forEach(function (f) {
      var n = items.filter(function (x) { return match(x, f[0]); }).length;
      if (!n) return;
      var b = el('button', 'lx-pill'); b.type = 'button';
      b.setAttribute('aria-pressed', String(f[0] === st.filter));
      b.appendChild(el('span', '', f[1])); b.appendChild(el('b', '', String(n)));
      b.addEventListener('click', function () { st.filter = f[0]; buildPills(); buildList(true); });
      pills.appendChild(b);
    });
  }
  function buildList(pickFirst) {
    list.textContent = '';
    var items = inShelf().filter(function (x) { return match(x, st.filter); });
    if (pickFirst || !items.some(function (x) { return x.i === st.sel; })) st.sel = items.length ? items[0].i : -1;
    items.forEach(function (x) {
      var b = el('button', 'lx-item'); b.type = 'button';
      b.style.setProperty('--fam', D.FAMILY[x.fam].color);
      b.setAttribute('aria-pressed', String(x.i === st.sel));
      var t = el('span', 'lx-item__t');
      if (x.shelf === 'lib') t.appendChild(el('span', 'lx-item__code', x.code));
      t.appendChild(el('span', 'lx-item__name', x.name));
      b.appendChild(t);
      var m = el('span', 'lx-item__m');
      m.appendChild(el('span', 'lx-item__ana', x.analysis || D.FAMILY[x.fam].name));
      m.appendChild(el('span', 'lx-badge' + (x.stage === D.V ? ' is-v' : x.stage === D.L ? ' is-l' : ''), BADGE[x.stage]));
      b.appendChild(m);
      b.addEventListener('click', function () { st.sel = x.i; buildList(false); showCard(); if (window.matchMedia('(max-width: 899px)').matches) card.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
      list.appendChild(b);
    });
    count.textContent = items.length + ' of ' + inShelf().length + ' ' + NOUN[st.shelf];
    showCard();
  }
  function row(k, v) { return v ? '<div><dt>' + k + '</dt><dd>' + esc(v) + '</dd></div>' : ''; }
  function showCard() {
    var x = ALL[st.sel];
    if (!x) { card.innerHTML = '<p class="note">No formulation matches this filter.</p>'; return; }
    var fam = D.FAMILY[x.fam], own = x.shelf === 'own';
    var ready = own
      ? (x.traded ? 'We sell this product now. We can also supply it under your brand.' : 'We make and sell this formulation now. We can also make it for sale under your brand.')
      : x.stage === D.L
        ? 'This formulation already holds a PSQCA licence. If you choose it, we give you the exclusive right to use its licence. You then launch the product under your brand without a new registration. We make its first commercial batch within 60 days.'
        : 'We register this formulation with PSQCA under your brand, and then we make it. We make its first commercial batch in about 3 months, registration included.';
    card.style.setProperty('--fam', fam.color);
    card.innerHTML =
      '<div class="lx-card__top"><span class="lx-card__code">' + esc(own ? fam.name : x.code) + '</span><span class="lx-badge' + (x.stage === D.V ? ' is-v' : x.stage === D.L ? ' is-l' : '') + '">' + esc(BADGE[x.stage]) + '</span></div>' +
      '<h3 class="lx-card__name">' + esc(x.name) + '</h3>' +
      '<p class="lx-card__fam"><i></i>' + esc(fam.name) + '</p>' +
      '<dl class="lx-card__rows">' + row('Analysis', x.analysis) + row('Form', x.form) + row('Use', x.use) + row('Technology', x.tech) + row('Readiness', ready) + '</dl>' +
      '<div class="lx-card__acts"><button type="button" class="btn magnetic" id="lxAsk"><span>Request this formulation</span></button>' +
      (DETAIL[x.code] ? '<a class="link-arrow" href="#' + DETAIL[x.code] + '">Read the published detail on ' + esc(x.code) + '</a>' : '') + '</div>';
    $('lxAsk').addEventListener('click', function () { pickInBrief(x); var b = $('brief'); if (b) b.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    bag.item = x; drawBag();
  }
  if (shelves) shelves.querySelectorAll('[data-shelf]').forEach(function (b) {
    b.addEventListener('click', function () {
      st.shelf = b.getAttribute('data-shelf'); st.filter = 'ALL';
      shelves.querySelectorAll('[data-shelf]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      buildPills(); buildList(true);
    });
  });
  if (list) { buildPills(); buildList(true); }

  /* ---------- 3. Tabs (keyboard: left and right arrows) ---------- */
  document.querySelectorAll('[data-tabs]').forEach(function (bar) {
    var tabs = [].slice.call(bar.querySelectorAll('[role="tab"]'));
    function pick(t, focus) {
      tabs.forEach(function (x) {
        var on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; x.classList.toggle('is-on', on);
        var p = $(x.getAttribute('aria-controls')); if (p) p.hidden = !on;
      });
      if (focus) t.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { pick(t); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); pick(tabs[(i + 1) % tabs.length], true); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); pick(tabs[(i - 1 + tabs.length) % tabs.length], true); }
      });
    });
  });

  /* ---------- 4. The partner brief ---------- */
  var fTrack = $('bTrack'), fForm = $('bForm'), fTon = $('bTon'), fCo = $('bCo'), prev = $('bPreview'), wa = $('bWa'), mail = $('bMail');
  if (fForm) {
    var opt = function (v, t) { var o = el('option', '', t); o.value = v; return o; };
    fForm.appendChild(opt('', 'Not decided yet'));
    var g1 = el('optgroup'); g1.label = 'Library formulations';
    D.LIB.forEach(function (x) { g1.appendChild(opt(String(x.i), x.code + ' · ' + x.name)); });
    var g2 = el('optgroup'); g2.label = 'Formulations we already sell';
    D.OWN.forEach(function (x) { g2.appendChild(opt(String(x.i), x.name + ' (' + x.analysis + ')')); });
    fForm.appendChild(g1); fForm.appendChild(g2);
  }
  function pickInBrief(x) {
    if (!fForm) return;
    fForm.value = String(x.i);
    if (fTrack) fTrack.value = x.shelf === 'own' ? 'Formulation we already sell' : x.stage === D.L ? 'Library formulation with a PSQCA licence' : 'Library formulation marked Validated';
    brief();
  }
  function brief() {
    if (!prev) return;
    var x = fForm.value === '' ? null : ALL[+fForm.value];
    var lines = ['Hello VAN. We would like you to make a product under our brand.'];
    if (fCo.value.trim()) lines.push('Company: ' + fCo.value.trim() + '.');
    lines.push('Way of working: ' + fTrack.value + '.');
    lines.push('Formulation: ' + (x ? (x.shelf === 'lib' ? x.code + ', ' + x.name : x.name + ' (' + x.analysis + ')') : 'not decided yet') + '.');
    var t = parseFloat(fTon.value);
    if (t > 0) lines.push('Estimated quantity: ' + t.toLocaleString('en-US') + ' tonnes a year.');
    var msg = lines.join(' ');
    prev.textContent = msg;
    wa.href = 'https://wa.me/923005003041?text=' + encodeURIComponent(msg);
    mail.href = 'mailto:partner@van.com.pk?subject=' + encodeURIComponent('Partner brief: ' + fTrack.value) + '&body=' + encodeURIComponent(msg);
  }
  [fTrack, fForm, fTon, fCo].forEach(function (f) { if (f) { f.addEventListener('input', brief); f.addEventListener('change', brief); } });
  brief();
  drawBag();

  /* ---------- 5. A link to a code's published detail opens its section ---------- */
  function openFor(hash) {
    if (!hash || hash.length < 2) return;
    var t = document.getElementById(hash.slice(1)); if (!t) return;
    var d = t.tagName === 'DETAILS' ? t : t.closest('details'); if (!d) return;
    d.open = true;
    setTimeout(function () { t.scrollIntoView({ block: 'start' }); }, 30);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#detail"]');
    if (a) { e.preventDefault(); history.replaceState(null, '', a.getAttribute('href')); openFor(a.getAttribute('href')); }
  });
  openFor(location.hash);
})();
