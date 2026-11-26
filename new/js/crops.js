/* Landing page: the short "Find the plan for your crop" section.
   It shows the crop plans that can start this month and a sowing wheel. Choosing a month opens crops.html at that month.
   The full finder, the season dial and all 28 plans are on crops.html.
   Data: window.VAN_CALENDAR (data/crop-calendar.js). Test hook: ?month=0..11 shows that month. */
(function () {
  'use strict';
  var CAL = window.VAN_CALENDAR;
  var wheel = document.getElementById('cropWheel'), box = document.getElementById('cropMonth');
  if (!CAL || !wheel || !box) return;

  var NS = 'http://www.w3.org/2000/svg';
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var GCOL = { cereal: '#C88A2E', oil: '#D9A92A', pulse: '#2D5A3C', veg: '#9C3F2C', fruit: '#5E9A6C' };
  var BASE = 'crops/';
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; }
  function sv(tag, a) { var n = document.createElementNS(NS, tag); for (var k in a) n.setAttribute(k, a[k]); return n; }
  function inMonth(c, m) { return c.windows.some(function (w) { return w[0] <= w[1] ? m >= w[0] && m <= w[1] : m >= w[0] || m <= w[1]; }); }
  function plans(n) { return n + (n === 1 ? ' crop plan can start' : ' crop plans can start'); }

  var now = new Date(), cur = now.getMonth();
  var qm = /[?&]month=(\d+)/.exec(window.location.search); if (qm) cur = Math.min(11, +qm[1]);
  var counts = MONTHS.map(function (_, m) { return CAL.filter(function (c) { return inMonth(c, m); }).length; });
  var max = Math.max.apply(null, counts), cx = 210, cy = 210, R1 = 200, R0 = 128;
  function pt(r, a) { return [cx + r * Math.sin(a), cy - r * Math.cos(a)]; }
  function arc(m) {
    var g = 0.012, a0 = (m / 12) * 2 * Math.PI + g, a1 = ((m + 1) / 12) * 2 * Math.PI - g;
    var p = [pt(R1, a0), pt(R1, a1), pt(R0, a1), pt(R0, a0)];
    return 'M' + p[0] + 'A' + R1 + ' ' + R1 + ' 0 0 1 ' + p[1] + 'L' + p[2] + 'A' + R0 + ' ' + R0 + ' 0 0 0 ' + p[3] + 'Z';
  }

  // Each month is a link to crops.html at that month. Its dots are its crop plans, in their group's colour.
  var segs = [];
  MONTHS.forEach(function (name, m) {
    var a = sv('a', { href: 'crops.html?month=' + m, 'class': 'wheel__seg', 'aria-label': name + ': ' + plans(counts[m]) + '. Open the crop plans for ' + name + '.' });
    var p = sv('path', { d: arc(m) }); p.style.setProperty('--k', (0.22 + 0.78 * counts[m] / max).toFixed(2));
    var mid = ((m + 0.5) / 12) * 2 * Math.PI, lp = pt(R1 - 22, mid);
    var t = sv('text', { x: lp[0].toFixed(1), y: (lp[1] + 5).toFixed(1), 'text-anchor': 'middle' }); t.textContent = name.slice(0, 3);
    a.appendChild(p); a.appendChild(t);
    var list = CAL.filter(function (c) { return inMonth(c, m); });
    list.forEach(function (c, i) {
      var cols = 4, row = Math.floor(i / cols), col = i % cols, n = Math.min(cols, list.length - row * cols);
      var spread = 0.085, aa = mid + (col - (n - 1) / 2) * spread, dp = pt(R0 + 16 + row * 11, aa);
      var d = sv('circle', { cx: dp[0].toFixed(1), cy: dp[1].toFixed(1), r: 3.6, 'class': 'wheel__dot' });
      d.style.fill = GCOL[c.group]; a.appendChild(d);
    });
    a.addEventListener('mouseenter', function () { show(m, true); });
    a.addEventListener('focus', function () { show(m, true); });
    a.addEventListener('mouseleave', function () { show(cur, true); });
    a.addEventListener('blur', function () { show(cur, true); });
    wheel.appendChild(a); segs.push(a);
  });
  // Needle for today's date.
  var start = new Date(now.getFullYear(), 0, 1), end = new Date(now.getFullYear() + 1, 0, 1);
  var aNow = ((now - start) / (end - start)) * 2 * Math.PI, n0 = pt(R0 - 34, aNow), n1 = pt(R1 + 8, aNow);
  var g = sv('g', { 'class': 'wheel__needle', 'aria-hidden': 'true' });
  g.appendChild(sv('line', { x1: n0[0], y1: n0[1], x2: n1[0], y2: n1[1] }));
  g.appendChild(sv('circle', { cx: n1[0], cy: n1[1], r: 5 }));
  wheel.appendChild(g);
  var cM = sv('text', { x: cx, y: cy - 6, 'text-anchor': 'middle', 'class': 'wheel__m' });
  var cN = sv('text', { x: cx, y: cy + 24, 'text-anchor': 'middle', 'class': 'wheel__n' });
  wheel.appendChild(cM); wheel.appendChild(cN);

  function show(m, peek) {
    segs.forEach(function (s, i) { s.classList.toggle('is-on', i === m); });
    cM.textContent = MONTHS[m];
    cN.textContent = plans(counts[m]);
    if (peek) return;
    box.innerHTML = '';
    var list = CAL.filter(function (c) { return inMonth(c, m); });
    box.appendChild(el('p', 'crops__mh', (m === now.getMonth() ? 'This month, ' + MONTHS[m] : MONTHS[m]) + ': ' + plans(list.length)));
    var ul = el('ul', 'crops__chips');
    list.forEach(function (c) {
      var li = el('li'), a = el('a', 'chiplink', c.name);
      a.style.setProperty('--g', GCOL[c.group]);
      a.href = BASE + c.slug + '.html'; a.setAttribute('data-cursor', 'Open');
      li.appendChild(a); ul.appendChild(li);
    });
    box.appendChild(ul);
  }
  show(cur, false);
})();
