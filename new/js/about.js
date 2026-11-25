/* VAN flagship site, About page. Needs js/site.js before it.
   Every effect is optional. Without GSAP the page shows all of its content and every control works.
   In calm mode the scroll-driven scenes still run, and nothing loops or eases on a timer.
   Test hook: about.html?step=N shows stage N of the blind test and milestone N of the chronology, without pinning. */
(function () {
  'use strict';

  var V = window.VANSite || {};
  var $ = V.$ || function (sel, el) { return (el || document).querySelector(sel); };
  var $$ = V.$$ || function (sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); };
  var hasGsap = !!V.hasGsap && !!window.gsap && !!window.ScrollTrigger;
  var calm = !!V.calm;
  var animate = !!V.animate;

  var stepMatch = /[?&]step=(\d+)/.exec(window.location.search);
  var stepHook = stepMatch ? parseInt(stepMatch[1], 10) : 0;

  /* Safety net for the reveals of js/site.js. If its observer has not reported an element
     that is already inside the window, this check reveals it, so no block stays hidden. */
  var pending = $$('[data-reveal]');
  var sweepTick = false;
  var sweep = function () {
    sweepTick = false;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    pending = pending.filter(function (el) {
      if (el.classList.contains('is-in')) return false;
      var r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) { el.classList.add('is-in'); return false; }
      return true;
    });
  };
  var askSweep = function () {
    if (sweepTick || !pending.length) return;
    sweepTick = true;
    window.requestAnimationFrame(sweep);
  };
  if (pending.length) {
    window.addEventListener('scroll', askSweep, { passive: true });
    window.addEventListener('resize', askSweep);
    window.addEventListener('load', askSweep);
    askSweep();
  }

  /* ---------- 1. Hero ---------- */
  var plate = $('#heroPlate');
  if (plate) {
    // The ambient CSS animation runs only while the frame is on screen and the tab is visible.
    var onScreen = false;
    var setLive = function () { plate.classList.toggle('is-live', onScreen && !document.hidden); };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        onScreen = entries[0].isIntersecting; setLive();
      }, { threshold: 0.05 }).observe(plate);
      document.addEventListener('visibilitychange', setLive);
    }

    if (hasGsap) {
      // Scroll parallax between the layers of the illustration. Near layers move further than far ones.
      $$('.hl', plate).forEach(function (layer) {
        var d = parseFloat(layer.getAttribute('data-depth')) || 0;
        if (!d) return;
        gsap.fromTo(layer, { y: 36 * d }, { y: -80 * d, ease: 'none',
          scrollTrigger: { trigger: plate, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
      var sun = $('#heroSun', plate);
      if (sun) {
        gsap.fromTo(sun, { y: 44 }, { y: -70, ease: 'none',
          scrollTrigger: { trigger: plate, start: 'top bottom', end: 'bottom top', scrub: true } });
      }
    }
  }
  if (animate && V.splitWords) {
    var title = $('.ab-hero__title');
    if (title) {
      gsap.from(V.splitWords(title), { yPercent: 112, duration: 1.15, ease: 'power3.out', stagger: 0.06, delay: 0.1 });
    }
    var urdu = $('.ab-hero__urdu');
    if (urdu) gsap.from(urdu, { opacity: 0, y: 16, duration: 1, ease: 'power2.out', delay: 0.7 });
  }

  /* ---------- 2. Ledger drawings, driven by scroll ---------- */
  if (hasGsap && !stepHook) {
    var scrubIn = function (targets, trigger, from, stagger) {
      if (!$(trigger) || !$$(targets).length) return;
      from.ease = 'none';
      from.stagger = stagger || 0;
      from.scrollTrigger = { trigger: trigger, start: 'top 92%', end: 'top 48%', scrub: true };
      gsap.from(targets, from);
    };
    scrubIn('.heaps .heap', '.heaps', { scaleY: 0.15, transformOrigin: '50% 100%' }, 0.18);
    scrubIn('.tags use', '.tags', { opacity: 0.12 }, 0.04);
    scrubIn('.bags use', '.bags', { opacity: 0.12 }, 0.05);
    scrubIn('.agenda__lines path', '.bento__art--agenda', { scaleX: 0, transformOrigin: '0% 50%' }, 0.2);
  }

  /* ---------- 3. Chronology ---------- */
  var chrono = $('#chronology'), track = $('#chronoTrack'), viewport = $('#chronoViewport'), fill = $('#chronoFill');
  if (chrono && track && viewport) {
    var wide = '(min-width: 1001px) and (min-height: 680px)';
    var distance = function () { return Math.max(0, track.scrollWidth - viewport.clientWidth); };

    if (stepHook) {
      // Static state for a screenshot: the horizontal layout, moved to milestone N, with no pin.
      if (window.matchMedia(wide).matches) {
        chrono.classList.add('is-horizontal', 'is-static');
        var items = $$('.chrono__item', track);
        var item = items[Math.min(items.length, Math.max(1, stepHook)) - 1];
        var x = Math.min(distance(), Math.max(0, item.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft)));
        track.style.transform = 'translateX(' + (-x) + 'px)';
        if (fill) fill.style.transform = 'scaleX(' + (distance() ? x / distance() : 1) + ')';
      }
    } else if (hasGsap) {
      var mm = gsap.matchMedia();
      mm.add(wide, function () {
        chrono.classList.add('is-horizontal');
        var tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: chrono, pin: chrono, start: 'top top',
            end: function () { return '+=' + distance(); },
            scrub: calm ? true : 0.6,
            refreshPriority: 5, invalidateOnRefresh: true, anticipatePin: 1
          }
        });
        tl.to(track, { x: function () { return -distance(); } }, 0);
        if (fill) tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1 }, 0);
        return function () {
          chrono.classList.remove('is-horizontal');
          gsap.set(track, { clearProps: 'transform' });
          if (fill) gsap.set(fill, { clearProps: 'transform' });
        };
      });
    }
  }

  /* ---------- 4a. The blind test, in 3 stages ---------- */
  var blind = $('#blind');
  if (blind) {
    var tabs = $$('.blind__tab', blind), panels = $$('.blind__panel', blind);
    var art = $('#blindArt'), prev = $('#blindPrev'), next = $('#blindNext');
    var current = 0;
    // On a narrow screen the diagram shows only the active stage, so its labels stay readable.
    var fullBox = art ? art.getAttribute('viewBox') : '';
    var stageBox = ['20 20 320 290', '270 20 320 290', '560 20 400 290'];
    var narrow = window.matchMedia('(max-width: 700px)');
    var frame = function () {
      if (art) art.setAttribute('viewBox', narrow.matches ? stageBox[current] : fullBox);
    };
    if (narrow.addEventListener) narrow.addEventListener('change', frame);
    var show = function (n, focus) {
      current = Math.min(tabs.length - 1, Math.max(0, n));
      tabs.forEach(function (tab, i) {
        var on = i === current;
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        tab.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
      });
      if (art) art.setAttribute('data-stage', String(current + 1));
      frame();
      if (prev) prev.disabled = current === 0;
      if (next) next.disabled = current === tabs.length - 1;
      if (focus) tabs[current].focus();
    };
    if (tabs.length && tabs.length === panels.length) {
      blind.classList.add('is-stepped');
      tabs.forEach(function (tab, i) { tab.addEventListener('click', function () { show(i, false); }); });
      $('#blindTabs').addEventListener('keydown', function (e) {
        var k = e.key, n = current;
        if (k === 'ArrowRight' || k === 'ArrowDown') n = (current + 1) % tabs.length;
        else if (k === 'ArrowLeft' || k === 'ArrowUp') n = (current - 1 + tabs.length) % tabs.length;
        else if (k === 'Home') n = 0;
        else if (k === 'End') n = tabs.length - 1;
        else return;
        e.preventDefault();
        show(n, true);
      });
      if (prev) prev.addEventListener('click', function () { show(current - 1, false); if (prev.disabled && next) next.focus(); });
      if (next) next.addEventListener('click', function () { show(current + 1, false); if (next.disabled && prev) prev.focus(); });
      show(stepHook ? stepHook - 1 : 0, false);
    }
  }

  /* ---------- 5. The schematic map: Multan Road draws towards the plant ---------- */
  var road = $('#mapRoad');
  if (hasGsap && road && !stepHook) {
    gsap.set(road, { strokeDasharray: 1, strokeDashoffset: 1 });
    var mt = gsap.timeline({ defaults: { ease: 'none' },
      scrollTrigger: { trigger: '#placesMap', start: 'top 82%', end: 'top 26%', scrub: true } });
    mt.to(road, { strokeDashoffset: 0, duration: 1 }, 0);
    if ($('#mapPlant')) mt.fromTo('#mapPlant', { opacity: 0.15 }, { opacity: 1, duration: 0.3 }, 0.7);
  }
})();
