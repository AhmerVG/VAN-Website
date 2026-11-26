/* Landing page behaviour: preloader, hero intro, the soil scene, the dot chart,
   the 3 problem tabs, the pinned method track and the batch number form.
   Test hooks: ?problem=2 opens that problem. ?step=4 scrolls the method to that step. ?nopre=1 skips the preloader. */
(function () {
  'use strict';
  var S = window.VANSite; if (!S) return;
  var $ = S.$, $$ = S.$$, q = window.location.search;
  var param = function (k) { var m = new RegExp('[?&]' + k + '=([^&]+)').exec(q); return m ? decodeURIComponent(m[1]) : null; };

  /* Soil scene */
  var wrap = $('#soilScene'), soil = window.VANSoil, hasSoil = false;
  if (soil && wrap) hasSoil = soil.init({ wrap: wrap, canvas: $('#soilCanvas'), calm: S.calm, labels: $$('[data-label]', wrap) });
  else if (wrap) wrap.classList.add('no-webgl');
  if (hasSoil && S.hasGsap) {
    ScrollTrigger.create({ trigger: '#top', start: 'top top', end: 'bottom 30%', refreshPriority: 60,
      onUpdate: function (self) { soil.target.grow = 0.55 + self.progress * 0.45; if (soil.ready) soil.setActive(true); } });
  }

  /* Preloader and hero intro */
  var pre = $('#preloader'), count = $('#preloaderCount'), done = false;
  var words = S.animate ? S.splitWords($('#heroTitle')) : [];
  function intro() {
    if (done) return; done = true;
    document.body.classList.remove('is-loading');
    if (S.lenis) S.lenis.start();
    if (!S.animate) return;
    gsap.from(words, { yPercent: 115, duration: 1.2, ease: 'expo.out', stagger: 0.05, delay: 0.1 });
    gsap.from('.hero .eyebrow, .hero__origin, .hero__urdu, .hero__three > div', { y: 24, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.07, delay: 0.5 });
    gsap.from('.nav__pill', { y: -40, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.35 });
    gsap.from('#soilScene', { opacity: 0, scale: 0.94, duration: 1.6, ease: 'expo.out', delay: 0.15 });
  }
  if (!pre || S.calm || param('nopre')) { if (pre) pre.remove(); intro(); }
  else {
    document.body.classList.add('is-loading');
    if (S.lenis) S.lenis.stop();
    var loaded = false, began = performance.now(), ready = function () { loaded = true; };
    if (document.readyState === 'complete') ready(); else window.addEventListener('load', ready);
    setTimeout(ready, 4000);
    // The count follows the clock, so it takes the same time on a fast and a slow device.
    (function tick() {
      var k = Math.min(1, (performance.now() - began) / 1500), shown = (1 - Math.pow(1 - k, 3)) * 100;
      if (!loaded) shown = Math.min(shown, 88);
      count.textContent = Math.round(shown);
      if (shown >= 100) { pre.classList.add('is-done'); setTimeout(intro, 350); setTimeout(function () { pre.remove(); }, 1400); return; }
      requestAnimationFrame(tick);
    })();
  }

  /* 83 to 1: 83 dots for nitrogen and 1 dot for potash */
  var g = $('#dots83');
  if (g) {
    var NS = 'http://www.w3.org/2000/svg';
    for (var i = 0; i < 84; i++) {
      var c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', 7 + (i % 21) * 15.1); c.setAttribute('cy', 14 + Math.floor(i / 21) * 22); c.setAttribute('r', i === 83 ? 6.5 : 5);
      c.setAttribute('class', i === 83 ? 'dot dot--k' : 'dot');
      c.style.transitionDelay = (i * 12) + 'ms';
      g.appendChild(c);
    }
  }

  /* The 3 problems: tabs with arrow-key support */
  var tabs = $$('.pb__tab'), panels = $$('.pb__panel'), soilSvg = $('.pb__soil');
  function pick(n, focus) {
    tabs.forEach(function (t, j) {
      var on = j === n; t.classList.toggle('is-on', on); t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    panels.forEach(function (p, j) { p.hidden = j !== n; p.classList.toggle('is-on', j === n); });
    if (soilSvg) soilSvg.setAttribute('data-problem', String(n + 1));
  }
  tabs.forEach(function (t, j) {
    t.addEventListener('click', function () { pick(j); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); pick((j + 1) % tabs.length, true); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); pick((j + tabs.length - 1) % tabs.length, true); }
    });
  });
  var p0 = parseInt(param('problem') || '1', 10); if (p0 >= 1 && p0 <= 3) pick(p0 - 1);

  /* The method: a pinned sideways track on wide screens with a mouse */
  var method = $('#method'), track = $('#methodTrack'), bar = $('#methodBar');
  // Test hook: ?nopin=1 leaves the method track unpinned, for a full-page screenshot.
  if (S.hasGsap && method && !param('nopin')) {
    var mm = gsap.matchMedia();
    mm.add('(min-width: 1001px) and (hover: hover)', function () {
      method.classList.add('is-pinned');
      var distance = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
      var tween = gsap.to(track, { x: function () { return -distance(); }, ease: 'none',
        scrollTrigger: { trigger: '#methodPin', start: 'top top', end: function () { return '+=' + (distance() + window.innerHeight * 0.3); },
          pin: true, scrub: S.calm ? true : 0.6, invalidateOnRefresh: true, anticipatePin: 1, refreshPriority: 50,
          onUpdate: function (self) { bar.style.transform = 'scaleX(' + Math.max(0.02, self.progress) + ')'; } } });
      return function () { tween.kill(); gsap.set(track, { clearProps: 'transform' }); method.classList.remove('is-pinned'); };
    });
  }
  var st = parseInt(param('step') || '0', 10);
  if (st >= 1 && st <= 6) window.addEventListener('load', function () {
    var el = $$('.step')[st - 1]; if (el) el.scrollIntoView({ block: 'center', inline: 'center' });
  });

  // Test hook: ?y=3000 opens the page scrolled to that position.
  var y0 = parseInt(param('y') || '0', 10);
  if (y0 > 0) window.addEventListener('load', function () { setTimeout(function () { if (S.hasGsap) ScrollTrigger.refresh(); window.scrollTo(0, y0); }, 300); });

  /* Batch number: the form opens the live verify page. No result is shown on this page. */
  var form = $('#verifyForm');
  if (form) form.addEventListener('submit', function () {
    var input = $('#batch'); input.value = input.value.trim();
  });
})();

/* Slow parallax on the full-width photographs. */
(function () {
  var S = window.VANSite; if (!S || !S.animate) return;
  S.$$('[data-parallax]').forEach(function (img) {
    gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: img.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
})();
