/* "Soil Poverty: Punjab's Potash": the 2 charts of source/src/pages/SoilPoverty.tsx (FanChart, BalanceLines), ported on
   26 Nov 2026. Every sentence, figure and calculation is copied unchanged; the data below is
   source/src/data/soilPoverty.ts as published. */
(function () {
  'use strict';
  if (!window.KCharts) return;
  var K = window.KCharts, esc = K.esc, src = K.src;
  var SP = {"SP_BALANCE":[[1972,203,0.4,288],[1973,207,1,289],[1974,208,1.8,290],[1975,206,1.4,289],[1976,220,2,290],[1977,223,1.8,290],[1978,222,4,292],[1979,241,2.5,291],[1980,267,5.1,293],[1981,281,5.3,293],[1982,289,10.6,299],[1983,297,16.1,304],[1984,246,19.7,308],[1985,308,16.9,305],[1986,363,22.7,311],[1987,356,29.2,317],[1988,369,31.2,319],[1989,397,18.4,306],[1990,400,29,317],[1991,419,24,312],[1992,490,15.2,303],[1993,439,17.1,305],[1994,408,16.1,304],[1995,462,11.8,300],[1996,479,14.5,303],[1997,444,6.9,295],[1998,482,17.4,305],[1999,473,10.1,298],[2000,569,11.2,299],[2001,544,17.4,305],[2002,529,15.6,304],[2003,546,16.5,305],[2004,560,18.4,306],[2005,673,28.2,316],[2006,647,23.5,312],[2007,681,37.1,325],[2008,632,27.8,316],[2009,670,33.7,322],[2010,653,18.5,307],[2011,679,25.9,314],[2012,730,17,305],[2013,719,16.3,304],[2014,749,16.3,304],[2015,757,23.7,312],[2016,699,13.8,302],[2017,759,31,319],[2018,764,37,325],[2019,725,39,327],[2020,756,38,326],[2021,821,53,341],[2022,836,50,338],[2023,850,21,309],[2024,940,36,324]],"SP_EMAIL":"info@van.com.pk","SP_FAN":[[2018,129.8,129.8,129.8,129.8,129.8],[2019,126.7,127.7,128.2,128.5,128.8],[2020,123.6,125.6,126.6,127.2,127.7],[2021,120.2,123.4,124.8,125.8,126.5],[2022,116.7,121.1,123.1,124.4,125.4],[2023,113.2,118.8,121.3,122.9,124.2],[2024,109.3,116.3,119.4,121.4,122.9],[2025,105.5,113.8,117.6,119.8,121.7],[2026,101.6,111.3,115.7,118.3,120.4],[2027,97.8,108.9,113.9,116.8,119.1],[2028,94,106.5,112.1,115.3,117.9],[2029,90.1,104.1,110.4,113.8,116.6],[2030,86.3,101.7,108.6,112.3,115.4],[2031,82.6,99.4,107,110.9,114.2],[2032,78.8,97,105.3,109.5,113],[2033,75,94.6,103.7,108.1,111.7],[2034,71.3,92.3,102.1,106.7,110.5],[2035,67.6,90,100.5,105.4,109.3],[2036,64,87.7,99,104,108.2],[2037,60.3,85.5,97.5,102.7,107],[2038,56.8,83.2,96.1,101.4,105.8],[2039,53.2,81,94.6,100.2,104.7],[2040,49.7,78.8,93.2,98.9,103.6],[2041,46.1,76.5,91.9,97.7,102.5],[2042,42.7,74.3,90.6,96.5,101.4],[2043,39.5,72.2,89.3,95.3,100.3],[2044,36.1,70.1,88,94.2,99.2],[2045,33,68,86.8,93.1,98.2],[2046,29.9,65.9,85.6,92,97.1],[2047,26.8,63.9,84.5,91,96.1],[2048,23.7,61.8,83.4,89.9,95.1],[2049,20.9,59.8,82.3,88.9,94.1],[2050,18.1,57.8,81.3,87.9,93.2]],"SP_PDF":"/downloads/Soil-Poverty-Punjab-Potash-Tahir-Abbas.pdf"}, SP_FAN = SP.SP_FAN, SP_BALANCE = SP.SP_BALANCE;
  var NAVY = '#1F3A5F', RED = '#B42318', MUTED = '#4B5148', RULE = 'rgba(23,26,22,0.16)';
  function head(h4, cap) { return '<div class="k-row k-row--between"><h4>' + h4 + '</h4><span class="k-cap">' + cap + '</span></div>'; }
  function t(x, y, s, o) { o = o || {}; return '<text x="' + x + '" y="' + y + '"' + (o.a ? ' text-anchor="' + o.a + '"' : '') + ' font-size="' + (o.fs || 12) + '"' + (o.fw ? ' font-weight="' + o.fw + '"' : '') + ' fill="' + (o.fill || MUTED) + '">' + s + '</text>'; }
  function tip(html) { return ' data-tip="' + esc(html) + '"'; }

  /* the fan: Punjab average available potash, red below 100 ppm */
  K.mount('Projected average available soil potassium in Punjab', 760, function (W, narrow) {
    var H = Math.round(W * (narrow ? 0.95 : 0.56)), L = 40, R = narrow ? 62 : 70, T = 16, B = 34;
    var x = function (yr) { return L + (yr - 2018) / 32 * (W - L - R); }, y = function (v) { return T + (1 - Math.max(0, v) / 140) * (H - T - B); };
    var band = function (lo, hi) { return SP_FAN.map(function (r, i) { return (i ? 'L' : 'M') + x(r[0]) + ' ' + y(r[hi]); }).join(' ') + ' ' + SP_FAN.slice().reverse().map(function (r) { return 'L' + x(r[0]) + ' ' + y(r[lo]); }).join(' ') + ' Z'; };
    var cross = SP_FAN.filter(function (r) { return r[3] < 100; })[0], last = SP_FAN[SP_FAN.length - 1];
    var lab = function (yr) { return (yr - 1) + '-' + String(yr).slice(2); };
    var b = '<rect x="' + L + '" y="' + y(100) + '" width="' + (W - L - R) + '" height="' + (y(0) - y(100)) + '" fill="' + RED + '" opacity="0.06"/>';
    [0, 40, 80, 100, 120, 140].forEach(function (g) { b += '<g><line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(g) + '" y2="' + y(g) + '" stroke="' + RULE + '" stroke-dasharray="2 3"/>' + t(L - 8, y(g) + 4, g, { a: 'end' }) + '</g>'; });
    (narrow ? [2020, 2030, 2040, 2050] : [2020, 2025, 2030, 2035, 2040, 2045, 2050]).forEach(function (tt) { b += t(x(tt), H - 10, tt, { a: 'middle' }); });
    b += '<path d="' + band(1, 5) + '" fill="' + NAVY + '" opacity="0.13"/><path d="' + band(2, 4) + '" fill="' + NAVY + '" opacity="0.25"/>' +
      '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(100) + '" y2="' + y(100) + '" stroke="' + RED + '" stroke-width="1.5" stroke-dasharray="6 4"/>' + t(W - R + 6, y(100) + 4, '100 ppm', { fs: 13, fw: 700, fill: RED });
    SP_FAN.slice(1).forEach(function (r, i) { b += '<line x1="' + x(SP_FAN[i][0]) + '" y1="' + y(SP_FAN[i][3]) + '" x2="' + x(r[0]) + '" y2="' + y(r[3]) + '" stroke="' + (r[3] >= 100 ? NAVY : RED) + '" stroke-width="3.5" stroke-linecap="round"/>'; });
    SP_FAN.forEach(function (r) { b += '<circle cx="' + x(r[0]) + '" cy="' + y(r[3]) + '" r="7" fill="transparent"' + tip('<b>' + lab(r[0]) + '</b><br>Average case ' + r[3] + ' ppm<br>Worst case ' + r[1] + ', best case ' + r[5]) + '/>'; });
    b += '<circle cx="' + x(cross[0]) + '" cy="' + y(cross[3]) + '" r="6" fill="none" stroke="' + RED + '" stroke-width="2"/>' + t(x(cross[0]) + 10, y(cross[3]) - 10, lab(cross[0]), { fs: 13, fw: 700, fill: RED }) +
      t(x(2018) + 4, y(SP_FAN[0][3]) - 8, SP_FAN[0][3], { fill: NAVY }) + t(W - R + 6, y(last[3]) + 4, Math.round(last[3]), { fs: 13, fw: 700, fill: RED }) +
      t(L + 8, y(0) - 10, narrow ? 'Below 100 ppm' : 'Below the 100 ppm warning line', { fs: 13, fw: 700, fill: RED });
    return head('If potash fertiliser use does not rise, the model’s average case projects that Punjab’s average available soil potassium will fall below 100 ppm in ' + lab(cross[0]), 'ppm, modelled') +
      '<div class="k-chart__draw"><svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" style="margin-top:10px" role="img" aria-label="Projected average available soil potassium in Punjab if potash fertiliser use does not rise (modelled): in the average case it falls from 129.8 ppm in about 2016 to 2018 to about 81 ppm in 2049-50, passing below 100 ppm in 2035-36">' + b + '</svg></div>' +
      '<p class="k-small">The line shows the average case of the model runs, in ppm. In the average case, Punjab’s average available soil potassium falls from 129.8 ppm in about 2016 to 2018 to about 81 ppm in 2049-50. The line turns red where it is below 100 ppm. The light band runs from the worst case to the best case. The dark band holds the middle 50% of the runs. Each band edge is a percentile of all the runs in that year. A band edge therefore does not trace any single run. The figure at the right end of the line is the average case for 2049-50. The line starts at 129.8 ppm, the 2016 to 2018 average of the measured samples, weighted by cultivated area. Each crop year is plotted at the calendar year in which it ends. For example, 2036 on the axis is the crop year 2035-36.</p>' +
      src('This report’s model runs, with the yearly fall set from SFRI’s measurement in Punjab in 2003 to 2009.');
  });

  /* the balance: what 5 crops take out, what goes back */
  K.mount('Potassium (as K₂O) taken out by 5 crops and put back', 760, function (W, narrow) {
    var H = Math.round(W * (narrow ? 0.9 : 0.5)), L = 44, R = narrow ? 48 : 150, T = 16, B = 34;
    var x = function (yr) { return L + (yr - 1972) / 52 * (W - L - R); }, y = function (v) { return T + (1 - v / 1000) * (H - T - B); };
    var line = function (k) { return SP_BALANCE.map(function (r, i) { return (i ? 'L' : 'M') + x(r[0]) + ' ' + y(r[k]); }).join(' '); };
    var last = SP_BALANCE[SP_BALANCE.length - 1], yrLab = function (yr) { return (yr - 1) + '-' + String(yr).slice(2); }, b = '';
    [0, 200, 400, 600, 800, 1000].forEach(function (g) { b += '<g><line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(g) + '" y2="' + y(g) + '" stroke="' + RULE + '" stroke-dasharray="2 3"/>' + t(L - 8, y(g) + 4, g, { a: 'end' }) + '</g>'; });
    (narrow ? [1980, 2000, 2020] : [1980, 1990, 2000, 2010, 2020]).forEach(function (tt) { b += t(x(tt), H - 10, tt, { a: 'middle' }); });
    b += '<path d="' + line(3) + '" fill="none" stroke="' + MUTED + '" stroke-width="1.6" stroke-dasharray="5 4"/><path d="' + line(1) + '" fill="none" stroke="' + NAVY + '" stroke-width="3"/><path d="' + line(2) + '" fill="none" stroke="' + RED + '" stroke-width="3"/>';
    SP_BALANCE.forEach(function (r) { b += '<rect x="' + (x(r[0]) - 4) + '" y="' + T + '" width="8" height="' + (H - T - B) + '" fill="transparent"' + tip('<b>' + yrLab(r[0]) + '</b><br>Taken out ' + r[1] + '<br>Total put back ' + r[3] + '<br>Potash fertiliser ' + r[2]) + '/>'; });
    b += t(W - R + 6, y(last[1]) + 4, narrow ? last[1] : 'Taken out ' + last[1], { fs: 13, fw: 700, fill: NAVY }) + t(W - R + 6, y(last[3]) + 4, narrow ? last[3] : 'Total put back ' + last[3]) + t(W - R + 6, y(last[2]) - 2, narrow ? last[2] : 'Fertiliser ' + last[2], { fs: 13, fw: 700, fill: RED });
    return head('In 2023-24, 5 crops took an estimated ' + last[1].toLocaleString('en-US') + ',000 tonnes of K₂O out of Punjab’s soils, against ' + last[2] + ',000 tonnes put back as potash fertiliser', 'thousand tonnes of K₂O a year') +
      '<div class="k-chart__draw"><svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" style="margin-top:10px" role="img" aria-label="Potassium (as K₂O) taken out by 5 crops and put back, Punjab, 1971-72 to 2023-24">' + b + '</svg></div>' +
      '<p class="k-small">The chart shows Punjab’s potassium balance for the crop years 1971-72 to 2023-24, in thousand tonnes of K₂O a year. The navy line shows the potassium taken out by wheat, rice, sugarcane, maize and cotton, as estimated by the model. The dashed line shows all the potassium put back in potash fertiliser, manure and irrigation water, as estimated by the model. The red line shows potash fertiliser alone (Punjab Development Statistics to 2015-16, NFDC from 2016-17).</p>' +
      src('This report’s balance model, using Bureau of Statistics Punjab crop data, and fertiliser data from Punjab Development Statistics (to 2015-16) and NFDC (from 2016-17).');
  });
})();
