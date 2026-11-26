/* Landing page: "Find the plan for your crop".
   A search box, a sowing wheel of 12 months and the 28 crop plans in 5 groups.
   Data: window.VAN_CALENDAR (data/crop-calendar.js). Each plan opens on van.com.pk.
   Test hook: ?month=0..11 selects that month on the wheel. */
(function () {
  'use strict';
  var CAL = window.VAN_CALENDAR;
  var wheel = document.getElementById('cropWheel'), all = document.getElementById('cropAll');
  if (!CAL || !wheel || !all) return;

  var NS = 'http://www.w3.org/2000/svg';
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var GROUPS = [['cereal', 'Cereals and field crops'], ['oil', 'Oilseeds'], ['pulse', 'Pulses'], ['veg', 'Vegetables and spices'], ['fruit', 'Orchards and fruit']];
  var BASE = 'https://www.van.com.pk/crops/';
  var WORD = { sowing: 'Sowing', planting: 'Planting', 'season start': 'Season starts' };

  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; }
  function sv(tag, a) { var n = document.createElementNS(NS, tag); for (var k in a) n.setAttribute(k, a[k]); return n; }
  function url(c) { return BASE + c.slug + '.html'; }
  function inMonth(c, m) {
    return c.windows.some(function (w) { return w[0] <= w[1] ? m >= w[0] && m <= w[1] : m >= w[0] || m <= w[1]; });
  }
  var SHORT = { Jan: 'January', Feb: 'February', Mar: 'March', Apr: 'April', May: 'May', Jun: 'June', Jul: 'July', Aug: 'August', Sep: 'September', Oct: 'October', Nov: 'November', Dec: 'December' };
  function full(s) { return s.replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g, function (m) { return SHORT[m]; }); }
  function norm(s) { return s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim(); }

  /* 1. The 28 plans in 5 groups */
  var tiles = [];
  GROUPS.forEach(function (g) {
    var list = CAL.filter(function (c) { return c.group === g[0]; });
    var box = el('div', 'cgroup');
    var h = el('h3', 'cgroup__h'); h.appendChild(document.createTextNode(g[1] + ' ')); h.appendChild(el('span', 'fig', String(list.length)));
    box.appendChild(h);
    var ul = el('ul', 'cgroup__list');
    list.forEach(function (c) {
      var li = el('li'), a = el('a', 'ctile');
      a.href = url(c); a.setAttribute('data-cursor', 'Open');
      a.appendChild(el('span', 'ctile__name', c.name));
      a.appendChild(el('span', 'ctile__when', (WORD[c.tag] || 'Sowing') + ': ' + full(c.label)));
      if (c.creator) a.appendChild(el('span', 'ctile__tag', 'Adjusts to your soil test'));
      a.className += ' ctile--' + c.group;
      li.appendChild(a); ul.appendChild(li);
      tiles.push({ c: c, li: li, box: box, key: norm(c.name + ' ' + c.slug.replace(/-/g, ' ')) });
    });
    box.appendChild(ul); all.appendChild(box);
  });

  /* 2. Search */
  var q = document.getElementById('cropQ'), status = document.getElementById('cropStatus'), form = document.getElementById('cropSearch');
  function matches() {
    var t = norm(q.value);
    return tiles.filter(function (x) { return !t || t.split(' ').every(function (w) { return x.key.indexOf(w) > -1; }); });
  }
  function filter() {
    var m = matches(), t = norm(q.value);
    tiles.forEach(function (x) { x.li.hidden = m.indexOf(x) < 0; });
    all.querySelectorAll('.cgroup').forEach(function (b) { b.hidden = !b.querySelector('li:not([hidden])'); });
    if (!t) status.textContent = 'Showing all 28 crop plans.';
    else if (!m.length) status.textContent = 'No crop plan matches "' + q.value.trim() + '". Check the spelling, or ask us on WhatsApp.';
    else if (m.length === 1) status.textContent = '1 crop plan matches: ' + m[0].c.name + '. Press Enter or choose Open the plan to open it.';
    else status.textContent = m.length + ' crop plans match. Press Enter to open ' + m[0].c.name + ', or choose another crop from the list.';
  }
  q.addEventListener('input', filter);
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var m = matches();
    if (norm(q.value) && m.length) window.location.href = url(m[0].c);
    else { q.focus(); if (!norm(q.value)) status.textContent = 'Type the name of your crop first.'; }
  });

  /* 3. Sowing wheel */
  var counts = MONTHS.map(function (_, m) { return CAL.filter(function (c) { return inMonth(c, m); }).length; });
  var max = Math.max.apply(null, counts), cx = 210, cy = 210, R1 = 196, R0 = 120, segs = [], sel = -1;
  function pt(r, a) { return [cx + r * Math.sin(a), cy - r * Math.cos(a)]; }
  function arc(m) {
    var g = 0.012, a0 = (m / 12) * 2 * Math.PI + g, a1 = ((m + 1) / 12) * 2 * Math.PI - g;
    var p = [pt(R1, a0), pt(R1, a1), pt(R0, a1), pt(R0, a0)];
    return 'M' + p[0] + 'A' + R1 + ' ' + R1 + ' 0 0 1 ' + p[1] + 'L' + p[2] + 'A' + R0 + ' ' + R0 + ' 0 0 0 ' + p[3] + 'Z';
  }
  var centreM = sv('text', { x: cx, y: cy - 8, 'text-anchor': 'middle', 'class': 'wheel__m' });
  var centreN = sv('text', { x: cx, y: cy + 26, 'text-anchor': 'middle', 'class': 'wheel__n' });
  MONTHS.forEach(function (name, m) {
    var g = sv('g', { 'class': 'wheel__seg', role: 'button', tabindex: '0', 'aria-label': name + ': ' + counts[m] + (counts[m] === 1 ? ' crop plan can start' : ' crop plans can start') });
    var p = sv('path', { d: arc(m) });
    p.style.setProperty('--k', (0.18 + 0.82 * counts[m] / max).toFixed(2));
    var mid = ((m + 0.5) / 12) * 2 * Math.PI, lp = pt((R0 + R1) / 2, mid);
    var t = sv('text', { x: lp[0].toFixed(1), y: (lp[1] + 5).toFixed(1), 'text-anchor': 'middle' }); t.textContent = name.slice(0, 3);
    g.appendChild(p); g.appendChild(t);
    g.addEventListener('click', function () { pick(m, true); });
    g.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(m, true); }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); pick((m + 1) % 12, true); segs[(m + 1) % 12].focus(); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); pick((m + 11) % 12, true); segs[(m + 11) % 12].focus(); }
    });
    wheel.appendChild(g); segs.push(g);
  });
  wheel.appendChild(centreM); wheel.appendChild(centreN);

  var box = document.getElementById('cropMonth'), now = new Date().getMonth();
  function pick(m) {
    sel = m;
    segs.forEach(function (s, i) { s.classList.toggle('is-on', i === m); s.setAttribute('aria-pressed', i === m ? 'true' : 'false'); });
    var list = CAL.filter(function (c) { return inMonth(c, m); });
    centreM.textContent = MONTHS[m];
    centreN.textContent = list.length + (list.length === 1 ? ' plan can start' : ' plans can start');
    box.innerHTML = '';
    var h = el('p', 'crops__mh', (m === now ? 'This month, ' + MONTHS[m] : MONTHS[m]) + ': ' + list.length + (list.length === 1 ? ' crop plan can start' : ' crop plans can start'));
    box.appendChild(h);
    var ul = el('ul', 'crops__chips');
    list.forEach(function (c) {
      var li = el('li'), a = el('a', 'chiplink ctile--' + c.group, c.name);
      a.href = url(c); a.setAttribute('data-cursor', 'Open');
      li.appendChild(a); ul.appendChild(li);
    });
    box.appendChild(ul);
  }
  var qm = /[?&]month=(\d+)/.exec(window.location.search);
  pick(qm ? Math.min(11, +qm[1]) : now);
})();
