/* Knowledge articles, 26 Nov 2026: the small fixed charts of the published pages, drawn again at the width of the
   page so that their text keeps its size on a phone and on a wide screen, with the hover values of the published
   charts. The geometry, the figures and every label are those of source/src/components/Charts.tsx and
   source/src/data/site.ts (NATIONAL), copied unchanged. Only the colours follow the site palette.
   A chart is found by the label of the published drawing, so a page without it is not touched. */
(function () {
  'use strict';
  var INK = '#171A16', GOLD = '#C88A2E', GREEN = '#2D5A3C', RUST = '#A4532B', MUTED = '#4B5148', RULE = 'rgba(23,26,22,0.16)', PBLUE = '#4E7D5B';
  var fmt = function (n) { return n.toLocaleString('en-US'); };
  var fmt1 = function (n) { return n.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }); };
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  /* NATIONAL, from source/src/data/site.ts */
  var BAL = { pakistan: { N: 3808775, P: 994885, K: 45735, shareN: 78.5, shareP: 20.5, shareK: 0.94 },
              india: { N: 20456400, P: 8306600, K: 1878600, shareN: 66.8, shareP: 27.1, shareK: 6.13 } };
  var PROD = { n: { label: 'Nutrient applied per acre of arable land, 1999-2000 → 2023-24', from: 38.6, to: 64.9, unit: 'kg/acre', pct: '+68%' },
               w: { label: 'Wheat yield over the same period', from: 25.2, to: 33, unit: 'maunds/acre', pct: '+31%' } };
  /* RICE_ROWS, from source/src/components/Charts.tsx */
  var RICE = [
    { c: 'Bangladesh', n: '37.2 kg/acre', y: '52.7 maunds/acre', per: 56.8 },
    { c: 'Vietnam', n: '51.6 kg/acre', y: '61.8 maunds/acre', per: 47.9 },
    { c: 'China', n: '71.9 kg/acre', y: '72.2 maunds/acre', per: 40.2 },
    { c: 'Pakistan', n: '48.8 kg/acre', y: '41.2 maunds/acre', per: 33.7 },
    { c: 'Thailand', n: '37.4 kg/acre', y: '30.3 maunds/acre', per: 32.3 },
    { c: 'India', n: '54.8 kg/acre', y: '43.6 maunds/acre', per: 31.8 }];

  /* the hover box, shared by every chart on the page */
  function tipFor(fig) {
    var t = fig.querySelector('.k-tip');
    if (!t) { t = document.createElement('div'); t.className = 'k-tip'; t.hidden = true; fig.appendChild(t); }
    return t;
  }
  function wireTips(fig) {
    var tip = tipFor(fig);
    fig.querySelectorAll('[data-tip]').forEach(function (g) {
      var show = function (e) {
        var r = fig.getBoundingClientRect(), x = e.clientX - r.left + 14, y = e.clientY - r.top + 14;
        tip.innerHTML = g.getAttribute('data-tip'); tip.hidden = false;
        if (x + tip.offsetWidth > r.width) x = e.clientX - r.left - tip.offsetWidth - 14;
        tip.style.left = Math.max(0, x) + 'px'; tip.style.top = y + 'px';
      };
      g.addEventListener('pointermove', show);
      g.addEventListener('pointerdown', show);
      g.addEventListener('pointerleave', function () { tip.hidden = true; });
    });
  }

  /* Charts.tsx: BalanceChart */
  function balance(W) {
    var narrow = W < 700 * 0.8, nameH = narrow ? 22 : 0, labelW = narrow ? 0 : 90, barH = 44, gap = 22, tail = 70, barW = W - labelW - tail;
    var rows = [{ name: 'Pakistan', d: BAL.pakistan }, { name: 'India', d: BAL.india }], H = rows.length * (barH + gap + nameH) + 4, o = '';
    rows.forEach(function (r, ri) {
      var y = ri * (barH + gap + nameH) + 2 + nameH, x = labelW;
      o += narrow ? '<text x="0" y="' + (y - 7) + '" font-size="14" font-weight="700" fill="' + INK + '">' + r.name + '</text>'
                  : '<text x="' + (labelW - 14) + '" y="' + (y + barH / 2 + 5) + '" text-anchor="end" font-size="15" font-weight="700" fill="' + INK + '">' + r.name + '</text>';
      [['Nitrogen (N)', r.d.N, r.d.shareN, INK], ['Phosphate (P₂O₅)', r.d.P, r.d.shareP, PBLUE], ['Potash (K₂O)', r.d.K, r.d.shareK, GOLD]].forEach(function (s, si) {
        var w = Math.max((s[2] / 100) * barW, 3);
        o += '<g data-tip="' + esc('<b>' + r.name + ' · ' + s[0] + '</b><br>' + fmt(s[1]) + ' t · ' + s[2] + '%') + '"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + barH + '" fill="' + s[3] + '"/>';
        if (w > (narrow ? 42 : 60)) o += '<text x="' + (x + (w < 60 ? 5 : 12)) + '" y="' + (y + barH / 2 + 5) + '" font-size="' + (w < 60 ? 12 : 14) + '" font-weight="700" fill="' + (si === 2 ? INK : '#fff') + '">' + s[2] + '%</text>';
        if (w <= (narrow ? 42 : 60) && si === 2) o += '<text x="' + (labelW + barW + 10) + '" y="' + (y + barH / 2 + 5) + '" font-size="14" font-weight="700" fill="#855610">' + s[2] + '%</text>';
        o += '</g>'; x += w;
      });
    });
    return [W, H, o];
  }

  /* Charts.tsx: IndexLinesChart */
  function indexLines(W) {
    var narrow = W < 660 * 0.8, H = 300, padL = 54, padR = narrow ? 20 : 215, padT = 22, padB = 40, x0 = padL, x1 = W - padR, yMin = 90, yMax = 180;
    var y = function (v) { return padT + (1 - (v - yMin) / (yMax - yMin)) * (H - padT - padB); };
    var n = PROD.n, w = PROD.w, o = '';
    var series = [{ key: 'n', label: 'Nutrient per acre', s: n, idx: Math.round((n.to / n.from) * 100), c: RUST }, { key: 'w', label: 'Wheat yield', s: w, idx: Math.round((w.to / w.from) * 100), c: GREEN }];
    [100, 120, 140, 160, 180].forEach(function (g) { o += '<line x1="' + x0 + '" x2="' + x1 + '" y1="' + y(g) + '" y2="' + y(g) + '" stroke="' + (g === 100 ? INK : RULE) + '"' + (g === 100 ? '' : ' stroke-dasharray="2 3"') + '/><text x="' + (x0 - 8) + '" y="' + (y(g) + 4) + '" text-anchor="end" font-size="12" fill="' + MUTED + '">' + g + '</text>'; });
    o += '<text x="' + x0 + '" y="' + (H - 12) + '" font-size="12.5" fill="' + MUTED + '">1999-2000</text><text x="' + x1 + '" y="' + (H - 12) + '" font-size="12.5" fill="' + MUTED + '" text-anchor="end">2023-24</text>';
    series.forEach(function (d) {
      var tip = '<b>' + d.label + '</b><br>' + fmt1(d.s.from) + ' → ' + fmt1(d.s.to) + ' ' + d.s.unit + ' · ' + d.s.pct + '<br>index 100 → ' + d.idx;
      o += '<g data-tip="' + esc(tip) + '"><line x1="' + x0 + '" y1="' + y(100) + '" x2="' + x1 + '" y2="' + y(d.idx) + '" stroke="transparent" stroke-width="18"/><line x1="' + x0 + '" y1="' + y(100) + '" x2="' + x1 + '" y2="' + y(d.idx) + '" stroke="' + d.c + '" stroke-width="3" stroke-linecap="round"/>' +
        '<circle cx="' + x1 + '" cy="' + y(d.idx) + '" r="5" fill="' + d.c + '"/><circle cx="' + x0 + '" cy="' + y(100) + '" r="4" fill="' + INK + '"/>';
      if (narrow) o += '<text x="' + (x1 - 8) + '" y="' + (y(d.idx) + (d.key === 'w' ? 24 : -12)) + '" text-anchor="end" font-size="14" font-weight="700" fill="' + d.c + '">' + d.s.pct + ' · ' + (d.key === 'n' ? 'nutrient' : 'wheat') + '</text>';
      else o += '<text x="' + (x1 + 12) + '" y="' + (y(d.idx) + 5) + '" font-size="14" font-weight="700" fill="' + d.c + '">' + d.s.pct + ' · ' + d.label + '</text><text x="' + (x1 + 12) + '" y="' + (y(d.idx) + 21) + '" font-size="12" fill="' + MUTED + '">' + fmt1(d.s.from) + ' → ' + fmt1(d.s.to) + ' ' + d.s.unit + '</text>';
      o += '</g>';
    });
    return [W, H, o];
  }

  /* Charts.tsx: RiceChart */
  function rice(W) {
    var max = 60, labelW = 110, valW = 60, rowH = 34, H = RICE.length * rowH + 8, barW = W - labelW - valW, o = '';
    RICE.forEach(function (r, i) {
      var y = i * rowH + 4, w = (r.per / max) * barW, pk = r.c === 'Pakistan';
      o += '<g data-tip="' + esc('<b>' + r.c + '</b><br>N applied ' + r.n + ' · paddy ' + r.y + '<br>' + r.per + ' kg paddy per kg N') + '"><rect x="0" y="' + y + '" width="' + W + '" height="' + (rowH - 6) + '" fill="transparent"/>' +
        '<text x="' + (labelW - 12) + '" y="' + (y + (rowH - 6) / 2 + 5) + '" text-anchor="end" font-size="14" font-weight="' + (pk ? 700 : 500) + '" fill="' + (pk ? INK : MUTED) + '">' + r.c + '</text>' +
        '<rect x="' + labelW + '" y="' + (y + 4) + '" width="' + w + '" height="' + (rowH - 14) + '" rx="4" fill="' + (pk ? GOLD : GREEN) + '"/>' +
        '<text x="' + (labelW + w + 8) + '" y="' + (y + (rowH - 6) / 2 + 5) + '" font-size="14" font-weight="700" fill="' + INK + '">' + r.per + '</text></g>';
    });
    return [W, H, o];
  }

  /* Shared by the report charts (js/article-nr.js, js/article-sp.js): a whole published chart is drawn again by
     render(W, narrow, state) and replaces the lifted one. The figure is found by the label of its first drawing. */
  window.KCharts = {
    esc: esc, wireTips: wireTips,
    src: function (html, label) { return '<p class="k-src"><b>' + (label || 'Source') + ' ·</b> ' + html + '</p>'; },
    mount: function (label, designW, render, after, state) {
      var old = document.querySelector('.k-chart svg[aria-label^="' + label + '"]');
      if (!old) return null;
      var fig = old.closest('.k-chart'), st = state || {}, lastW = 0;
      var probe = document.createElement('div'); probe.className = 'k-chart__probe';
      var paint = function (force) {
        var cw = fig.clientWidth - parseFloat(getComputedStyle(fig).paddingLeft) - parseFloat(getComputedStyle(fig).paddingRight);
        var W = Math.round(Math.max(240, Math.min(designW, cw || designW)));
        if (W === lastW && !force) return; lastW = W;
        fig.innerHTML = render(W, W < designW * 0.8, st);
        wireTips(fig);
        if (after) after(fig, st, function () { paint(true); });
      };
      paint(true);
      if ('ResizeObserver' in window) { var t; new ResizeObserver(function () { clearTimeout(t); t = setTimeout(function () { paint(false); }, 120); }).observe(fig); }
      return fig;
    }
  };

  var CHARTS = [
    ['In 2023, potash was 0.94% of the fertiliser nutrient applied in Pakistan, against 6.13% in India', balance, 700],
    ['2 index lines, nutrient per acre and wheat yield', indexLines, 660],
    ['Paddy per kilogram of nitrogen', rice, 620]];

  CHARTS.forEach(function (c) {
    var old = document.querySelector('.k-chart svg[aria-label="' + c[0] + '"]');
    if (!old) return;
    var fig = old.closest('.k-chart'), holder = document.createElement('div');
    holder.className = 'k-chart__draw';
    old.parentNode.replaceChild(holder, old);
    var lastW = 0;
    var draw = function () {
      var cw = holder.getBoundingClientRect().width || c[2];
      var W = Math.round(Math.max(240, Math.min(c[2], cw)));
      if (W === lastW) return; lastW = W;
      var r = c[1](W);
      holder.innerHTML = '<svg viewBox="0 0 ' + r[0] + ' ' + r[1] + '" width="100%" role="img" aria-label="' + esc(c[0]) + '">' + r[2] + '</svg>';
      wireTips(fig);
    };
    draw();
    if ('ResizeObserver' in window) { var t; new ResizeObserver(function () { clearTimeout(t); t = setTimeout(draw, 120); }).observe(holder); }
  });
})();
