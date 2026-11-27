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
  var links = {}, toc = document.querySelector('.k-toc:not(.k-secbar)');
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

/* 27 Nov 2026: the section bar of the partner pages sits just under the floating menu, whose height differs
   between a phone and a computer, and the highlighted link is kept in view inside the bar. */
(function () {
  var bar = document.querySelector('.k-secbar'), pill = document.querySelector('.nav__pill');
  if (!bar) return;
  function place() {
    var b = pill ? pill.getBoundingClientRect().bottom : 70;
    bar.style.top = Math.round(Math.max(b, 0) + 8) + 'px';
    document.documentElement.style.setProperty('--secbar-top', Math.round(b + 70) + 'px');
  }
  place(); window.addEventListener('resize', place);
  /* the current section is the last one whose top has passed under the bar */
  var items = [].map.call(bar.querySelectorAll('a[href^="#"]'), function (a) { return [a, document.getElementById(a.getAttribute('href').slice(1))]; })
    .filter(function (x) { return x[1]; });
  var ticking = false;
  function mark() {
    ticking = false;
    var line = bar.getBoundingClientRect().bottom + 40, cur = null;
    items.forEach(function (x) { if (x[1].getBoundingClientRect().top <= line) cur = x[0]; });
    items.forEach(function (x) { x[0].toggleAttribute('aria-current', x[0] === cur); });
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(mark); } }, { passive: true });
  mark();
  if ('MutationObserver' in window) new MutationObserver(function () {
    var a = bar.querySelector('a[aria-current]'), ol = bar.querySelector('ol');
    if (a && ol) ol.scrollTo({ left: a.offsetLeft - 16, behavior: 'smooth' });
  }).observe(bar, { attributes: true, subtree: true, attributeFilter: ['aria-current'] });
})();
