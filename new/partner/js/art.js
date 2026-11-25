/* Contour art for the showcase cards.
   Each card gets a field of iso-lines in a VAN nutrient family colour.
   The drawing is a fallback-safe 2D canvas, so no image file is needed. */
(function () {
  'use strict';

  var PALETTES = {
    green: ['#2F7D3F', '#1F5A2C', '#CFE3C4'],
    amber: ['#E7A04A', '#D2751A', '#FBE6C2'],
    teal: ['#0F7A72', '#0A5852', '#BFE3DD'],
    blue: ['#00598E', '#023F66', '#BBD9EA'],
    plum: ['#6E4A8E', '#4E3168', '#DDCDEA']
  };

  function rng(seed) {
    var s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  }

  function draw(canvas) {
    var rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.round(rect.width * dpr), h = Math.round(rect.height * dpr);
    canvas.width = w; canvas.height = h;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var pal = PALETTES[canvas.dataset.art] || PALETTES.green;
    var rand = rng(parseInt(canvas.dataset.seed || '1', 10) * 9973);

    var bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, pal[0]);
    bg.addColorStop(1, pal[1]);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // A soft patch of light, as if the sun fell across the card.
    var sun = ctx.createRadialGradient(w * 0.22, h * 0.12, 0, w * 0.22, h * 0.12, w * 0.9);
    sun.addColorStop(0, 'rgba(255, 244, 222, 0.42)');
    sun.addColorStop(1, 'rgba(255, 244, 222, 0)');
    ctx.fillStyle = sun;
    ctx.fillRect(0, 0, w, h);

    // 2 centres of contour rings, like 2 hills on a soil map.
    var centres = [
      { x: w * (0.55 + rand() * 0.3), y: h * (0.25 + rand() * 0.3) },
      { x: w * (0.1 + rand() * 0.25), y: h * (0.7 + rand() * 0.25) }
    ];
    ctx.lineCap = 'round';
    centres.forEach(function (c, ci) {
      var harmonics = [];
      for (var k = 0; k < 4; k++) {
        harmonics.push({ n: 2 + k, a: 0.05 + rand() * 0.09, p: rand() * Math.PI * 2 });
      }
      var rings = ci === 0 ? 16 : 11;
      var step = Math.max(w, h) * 0.055;
      for (var i = 1; i <= rings; i++) {
        var base = i * step;
        ctx.beginPath();
        for (var a = 0; a <= 360; a += 3) {
          var t = (a * Math.PI) / 180;
          var wob = 1;
          for (var j = 0; j < harmonics.length; j++) {
            wob += harmonics[j].a * Math.sin(harmonics[j].n * t + harmonics[j].p + i * 0.16);
          }
          var r = base * wob;
          var x = c.x + Math.cos(t) * r;
          var y = c.y + Math.sin(t) * r * 0.82;
          if (a === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = pal[2];
        ctx.globalAlpha = 0.5 - (i / rings) * 0.32;
        ctx.lineWidth = dpr * (i % 4 === 0 ? 1.6 : 0.9);
        ctx.stroke();
      }
    });
    ctx.globalAlpha = 1;
  }

  function drawAll() {
    var list = document.querySelectorAll('canvas.art');
    for (var i = 0; i < list.length; i++) draw(list[i]);
  }

  var timer;
  window.addEventListener('resize', function () {
    clearTimeout(timer);
    timer = setTimeout(drawAll, 200);
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', drawAll);
  else drawAll();
  window.addEventListener('load', drawAll);
})();
