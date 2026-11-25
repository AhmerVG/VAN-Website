/* VAN flagship site, shared behaviour. Used by every page.
   It sets up: motion mode, smooth scroll, reveals, the nav, the cursor, magnetic buttons,
   number counters and the footer reveal. It exposes helpers on window.VANSite for page scripts.
   Every effect is optional. If a library fails to load, the page shows all of its content.
   In calm mode (a device that asks for reduced motion) scroll still drives the page,
   but nothing loops and nothing eases on a timer.

   Each page needs this inline script in its <head>, before the stylesheet, to set the mode early:
     (function(){var q=location.search,c=null;try{c=localStorage.getItem('van-motion')}catch(e){}
     if(/[?&]motion=1/.test(q))c='full';if(/[?&]motion=0/.test(q))c='calm';
     var os=matchMedia('(prefers-reduced-motion: reduce)').matches;
     document.documentElement.className=(c?c==='calm':os)?'calm':'full';})(); */
(function () {
  'use strict';

  var root = document.documentElement;
  var calm = root.classList.contains('calm');
  var osReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  var animate = hasGsap && !calm;
  var lenis = null;

  if (hasGsap) { root.classList.add('motion'); gsap.registerPlugin(ScrollTrigger); }
  // The page always opens at the top, so the pinned sections measure themselves correctly.
  if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';

  var $ = function (sel, el) { return (el || document).querySelector(sel); };
  var $$ = function (sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); };

  /* Split a heading into word spans. The full sentence stays available to screen readers. */
  function splitWords(el) {
    var text = el.textContent.trim().replace(/\s+/g, ' ');
    el.setAttribute('aria-label', text);
    el.textContent = '';
    var out = [];
    text.split(' ').forEach(function (word, i, all) {
      var o = document.createElement('span'); o.className = 'w'; o.setAttribute('aria-hidden', 'true');
      var inner = document.createElement('span'); inner.className = 'wi'; inner.textContent = word;
      o.appendChild(inner); el.appendChild(o);
      if (i < all.length - 1) el.appendChild(document.createTextNode(' '));
      out.push(inner);
    });
    return out;
  }

  /* Motion choice, shown only where the device asks for reduced motion. */
  var note = $('#calmNote');
  var flip = function () {
    try { window.localStorage.setItem('van-motion', calm ? 'full' : 'calm'); } catch (e) {}
    window.location.href = window.location.pathname;
  };
  if (note && osReduce && calm) {
    note.hidden = false;
    $('button', note).addEventListener('click', flip);
  } else if (osReduce && $('.footer__legal')) {
    var back = document.createElement('button');
    back.type = 'button'; back.className = 'motion-link'; back.textContent = 'Reduce motion';
    back.addEventListener('click', flip);
    $('.footer__legal').appendChild(back);
  }

  /* Smooth scroll, full mode only */
  if (animate && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = $(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: 0 });
      else target.scrollIntoView({ behavior: calm ? 'auto' : 'smooth' });
    });
  });

  /* Reveals and self-drawing hairlines. Call VANSite.observe(el) for elements added later. */
  var io = null;
  if (hasGsap && 'IntersectionObserver' in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.1 });
  }
  function observe(el, i) {
    if (!io) { el.classList.add('is-in'); return; }
    if (!calm) el.style.transitionDelay = (((i || 0) % 4) * 70) + 'ms';
    io.observe(el);
  }
  $$('[data-reveal]').forEach(observe);

  /* Counters: <span data-count="29.1" data-decimals="1" data-prefix="" data-suffix="%">29.1%</span>.
     The final value is already in the HTML, so the figure is right even with no script. */
  function runCount(el) {
    var end = parseFloat(el.getAttribute('data-count'));
    var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var pre = el.getAttribute('data-prefix') || '', suf = el.getAttribute('data-suffix') || '';
    var fmt = function (v) { return pre + v.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suf; };
    if (!animate) { el.textContent = fmt(end); return; }
    var o = { v: 0 };
    gsap.to(o, { v: end, duration: 1.8, ease: 'power3.out', onUpdate: function () { el.textContent = fmt(o.v); }, onComplete: function () { el.textContent = fmt(end); } });
  }
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { runCount(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.6 });
    $$('[data-count]').forEach(function (el) { cio.observe(el); });
  }

  /* Nav: hides on the way down, returns on the way up, and stays away over the dark footer. */
  var nav = $('#nav'), footer = $('.footer');
  var lastY = 0, navTick = false;
  function navUpdate() {
    var y = window.scrollY;
    var overFooter = footer ? footer.getBoundingClientRect().top < window.innerHeight * 0.55 : false;
    if (nav) nav.classList.toggle('is-hidden', overFooter || (y > 500 && y > lastY + 2));
    lastY = y; navTick = false;
  }
  window.addEventListener('scroll', function () {
    if (navTick) return;
    navTick = true;
    requestAnimationFrame(navUpdate);
  }, { passive: true });

  /* Footer: the curved edge flattens as the dark section arrives, and the title rises word by word. */
  if (hasGsap && footer) {
    if ($('.footer__curve')) {
      gsap.fromTo('.footer__curve', { scaleY: 1 }, { scaleY: 0.12, ease: 'none',
        scrollTrigger: { trigger: footer, start: 'top bottom', end: 'top 25%', scrub: true, refreshPriority: -10 } });
    }
    var ft = $('.footer__title');
    if (ft) {
      gsap.from(splitWords(ft), { yPercent: 115, ease: 'none', stagger: 0.12,
        scrollTrigger: { trigger: footer, start: 'top 85%', end: 'top 30%', scrub: calm ? true : 0.5, refreshPriority: -10 } });
    }
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }

  /* Pointer effects need a mouse. Touch devices keep native behaviour. */
  if (finePointer && $('#cursor')) {
    var cursor = $('#cursor'), dot = $('.cursor__dot', cursor), ring = $('.cursor__ring', cursor), label = $('#cursorLabel');
    var cx = window.innerWidth / 2, cy = window.innerHeight / 2, rx = cx, ry = cy, moved = false;
    root.classList.add('has-cursor');
    cursor.style.opacity = 0;
    window.addEventListener('pointermove', function (e) {
      cx = e.clientX; cy = e.clientY;
      if (!moved) { moved = true; rx = cx; ry = cy; cursor.style.opacity = 1; }
      var el = e.target.closest ? e.target.closest('[data-cursor]') : null;
      if (el) { label.textContent = el.getAttribute('data-cursor'); cursor.classList.add('is-active'); }
      else cursor.classList.remove('is-active');
      cursor.classList.toggle('on-deep', !!(e.target.closest && e.target.closest('.footer, .preloader, .band--deep')));
    }, { passive: true });
    document.addEventListener('mouseleave', function () { cursor.style.opacity = 0; });
    document.addEventListener('mouseenter', function () { if (moved) cursor.style.opacity = 1; });
    var ease = calm ? 1 : 0.16;
    (function follow() {
      rx += (cx - rx) * ease; ry += (cy - ry) * ease;
      dot.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)';
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(follow);
    })();

    if (animate) {
      $$('.magnetic').forEach(function (btn) {
        var inner = $('span', btn);
        var bx = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
        var by = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });
        var ix = inner ? gsap.quickTo(inner, 'x', { duration: 0.5, ease: 'power3.out' }) : function () {};
        var iy = inner ? gsap.quickTo(inner, 'y', { duration: 0.5, ease: 'power3.out' }) : function () {};
        btn.addEventListener('pointermove', function (e) {
          var r = btn.getBoundingClientRect();
          var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
          bx(dx * 0.28); by(dy * 0.4); ix(dx * 0.12); iy(dy * 0.16);
        });
        btn.addEventListener('pointerleave', function () { bx(0); by(0); ix(0); iy(0); });
      });
    }
  }

  window.VANSite = { calm: calm, animate: animate, hasGsap: hasGsap, finePointer: finePointer, lenis: lenis, $: $, $$: $$, splitWords: splitWords, observe: observe, runCount: runCount };
})();
