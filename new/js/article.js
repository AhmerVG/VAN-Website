/* Knowledge articles, 26 Nov 2026.
   1. Mounts every interactive lens with the original engine (js/lens-engine.js) and its data (data/lenses.json).
   2. Marks the section in view in the side list.
   3. Shows the values of the lifted drawings on hover or tap (js/article-charts.js adds them per chart). */
(function () {
  'use strict';
  var me = document.currentScript;
  var base = me ? me.src : location.href;

  /* 1. Lenses */
  var lenses = document.querySelectorAll('.k-lens');
  if (lenses.length && window.d3 && window.mountLens) {
    fetch(new URL('../data/lenses.json', base).href)
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (D) {
        lenses.forEach(function (el) {
          var spec = JSON.parse(el.getAttribute('data-lens'));
          try { window.mountLens(el, D, window.d3, spec.specs, { countries: spec.countries }); }
          catch (e) { fail(el); if (window.console) console.error(e); }
        });
      })
      .catch(function () { lenses.forEach(fail); });
  } else if (lenses.length) { lenses.forEach(fail); }
  function fail(el) { el.innerHTML = '<p class="lz-fail">This chart could not load. Please refresh the page.</p>'; }

  /* 2. Side list */
  var links = {}, toc = document.querySelector('.k-toc');
  if (toc && 'IntersectionObserver' in window) {
    toc.querySelectorAll('a[href^="#"]').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var seen = {};
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { seen[e.target.id] = e.isIntersecting ? e.boundingClientRect.top : null; });
      var best = null, top = Infinity;
      Object.keys(seen).forEach(function (id) { if (seen[id] !== null && seen[id] < top) { top = seen[id]; best = id; } });
      if (!best) return;
      Object.keys(links).forEach(function (id) { links[id].toggleAttribute('aria-current', id === best); });
    }, { rootMargin: '-90px 0px -55% 0px' });
    Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }
})();

/* On a phone the side list starts closed, so the article starts on screen; a tap on "In this article" opens it,
   and choosing a section closes it again. */
(function () {
  var box = document.querySelector('.k-toc__box');
  if (!box || !window.matchMedia) return;
  var mq = window.matchMedia('(max-width: 1023px)');
  if (mq.matches) box.removeAttribute('open');
  box.addEventListener('click', function (e) { if (mq.matches && e.target.closest('a')) box.removeAttribute('open'); });
})();
