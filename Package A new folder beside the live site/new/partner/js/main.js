/* Page motion: preloader, smooth scroll, the pinned story, the sideways showcase,
   the footer reveal, the cursor and the magnetic buttons.
   Every effect is optional. If a library fails to load, the page shows all of its content.
   In calm mode (a device that asks for reduced motion) scroll still drives the page,
   but nothing loops and nothing eases on a timer. */
(function () {
  'use strict';

  var root = document.documentElement;
  var calm = root.classList.contains('calm');
  var osReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  var lenis = null;

  if (hasGsap) root.classList.add('motion');

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

  /* Motion choice notice, shown only where the device asks for reduced motion. */
  var note = $('#calmNote');
  var flip = function () {
    try { window.localStorage.setItem('van-motion', calm ? 'full' : 'calm'); } catch (e) {}
    window.location.href = window.location.pathname;
  };
  if (note && osReduce && calm) {
    note.hidden = false;
    $('#calmBtn').addEventListener('click', flip);
  } else if (osReduce) {
    // Full motion was chosen on a device that asks for less. The footer offers the way back.
    var back = document.createElement('button');
    back.type = 'button'; back.className = 'motion-link'; back.textContent = 'Reduce motion';
    back.addEventListener('click', flip);
    $('.footer__legal').appendChild(back);
  }

  /* 3D scene */
  var sceneApi = window.VANScene;
  var stage = $('#stage');
  var hasScene = sceneApi ? sceneApi.init({ stage: stage, canvas: $('#sculpture'), calm: calm }) : false;
  if (!hasScene) stage.classList.add('no-webgl');
  function setP(p) { if (hasScene) { sceneApi.target.P = p; sceneApi.poke(); } }

  /* 1. Preloader: counts to 100, then the curtain lifts. */
  var pre = $('#preloader');
  var count = $('#preloaderCount');
  var animate = hasGsap && !calm;
  var heroWords = animate ? splitWords($('#heroTitle')) : [];
  var introDone = false;

  function intro() {
    if (introDone) return;
    introDone = true;
    document.body.classList.remove('is-loading');
    if (lenis) lenis.start();
    if (!animate) return;
    gsap.from(heroWords, { yPercent: 115, duration: 1.2, ease: 'expo.out', stagger: 0.035, delay: 0.15 });
    gsap.from('.hero .eyebrow, .hero__lead p, .hero__actions > *', { y: 26, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.08, delay: 0.55 });
    gsap.from('.nav__pill', { y: -40, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.4 });
    if (hasScene) {
      gsap.from(sceneApi.intro, { k: 0.55, duration: 2.4, ease: 'expo.out', delay: 0.1 });
      gsap.fromTo(stage, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.4, delay: 0.1 });
    }
  }

  if (!pre || calm) {
    if (pre) pre.remove();
    intro();
  } else {
    document.body.classList.add('is-loading');
    var loaded = false, began = performance.now();
    var ready = function () { loaded = true; };
    if (document.readyState === 'complete') ready(); else window.addEventListener('load', ready);
    setTimeout(ready, 4000); // The curtain never waits longer than 4 seconds.
    // The count follows the clock, so it takes the same time on a fast and a slow device.
    (function tick() {
      var elapsed = performance.now() - began;
      var k = Math.min(1, elapsed / 1500);
      var shown = (1 - Math.pow(1 - k, 3)) * 100;
      if (!loaded) shown = Math.min(shown, 88);
      count.textContent = Math.round(shown);
      if (shown >= 100) {
        pre.classList.add('is-done');
        setTimeout(intro, 350);
        setTimeout(function () { pre.remove(); }, 1400);
        return;
      }
      requestAnimationFrame(tick);
    })();
  }

  /* Smooth scroll, full mode only */
  if (animate && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    if (!introDone) lenis.stop();
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = $(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: 0 });
      else target.scrollIntoView({ behavior: calm ? 'auto' : 'smooth' });
    });
  });

  /* Reveals and self-drawing hairlines */
  var revealEls = $$('[data-reveal]');
  if (hasGsap && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.1 });
    revealEls.forEach(function (el, i) {
      if (!calm) el.style.transitionDelay = ((i % 4) * 70) + 'ms';
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* Nav: hides on the way down, returns on the way up, and stays away over the dark footer. */
  var nav = $('#nav'), footer = $('.footer');
  var lastY = 0, navTick = false;
  function navUpdate() {
    var y = window.scrollY;
    var overFooter = footer.getBoundingClientRect().top < window.innerHeight * 0.55;
    nav.classList.toggle('is-hidden', overFooter || (y > 500 && y > lastY + 2));
    lastY = y;
    navTick = false;
  }
  window.addEventListener('scroll', function () {
    if (navTick) return;
    navTick = true;
    requestAnimationFrame(navUpdate);
  }, { passive: true });

  var showcase = $('#proof');
  var track = $('#showcaseTrack');

  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);

    /* 3. Story: the section pins. Each statement takes its turn while the granules regroup. */
    var lines = $$('.story__line'), steps = lines.length, step = -1;
    var caption = $('#storyCaption'), counter = $('#storyCount'), bar = $('#storyBar');
    var setStep = function (i) {
      if (i === step) return;
      step = i;
      lines.forEach(function (l, j) {
        l.classList.toggle('is-active', j === i);
        l.classList.toggle('is-past', j < i);
      });
      caption.textContent = lines[i].getAttribute('data-caption');
      counter.textContent = i + 1;
    };
    setStep(0);

    // From the top of the page to the story: the swarm becomes the first shape.
    ScrollTrigger.create({
      trigger: '#top', start: 'top top', endTrigger: '#story', end: 'top top', refreshPriority: 6,
      onUpdate: function (self) { setP(self.progress); }
    });
    // Inside the pinned story: 1 shape for each statement.
    ScrollTrigger.create({
      trigger: '#storyPin', start: 'top top',
      end: function () { return '+=' + Math.round(window.innerHeight * 0.85 * (steps - 1)); },
      pin: true, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 5,
      onUpdate: function (self) {
        var p = self.progress * (steps - 1);
        setP(1 + p);
        setStep(Math.min(steps - 1, Math.round(p)));
        bar.style.transform = 'scaleX(' + Math.max(0.02, self.progress) + ')';
      }
    });
    /* Coatings: the large granule returns, cut open, and shows 4 coatings in turn. */
    var coats = $$('.coat__step'), coatN = coats.length, coatStep = -1;
    var coatCount = $('#coatCount'), coatBar = $('#coatBar');
    var setCoat = function (i) {
      if (i === coatStep) return;
      coatStep = i;
      coats.forEach(function (l, j) {
        l.classList.toggle('is-active', j === i);
        l.classList.toggle('is-past', j < i);
      });
      coatCount.textContent = i + 1;
    };
    setCoat(0);
    ScrollTrigger.create({
      trigger: '#coatings', start: 'top bottom', end: 'top top', refreshPriority: 4.8,
      onUpdate: function (self) { setP(6 + self.progress); }
    });
    ScrollTrigger.create({
      trigger: '#coatPin', start: 'top top',
      end: function () { return '+=' + Math.round(window.innerHeight * 0.9 * (coatN - 1)); },
      pin: true, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 4.7,
      onUpdate: function (self) {
        var p = self.progress * (coatN - 1);
        setP(7 + p);
        setCoat(Math.min(coatN - 1, Math.round(p)));
        coatBar.style.transform = 'scaleX(' + Math.max(0.02, self.progress) + ')';
      }
    });

    // The scene stops drawing once the formulation library covers it.
    if (hasScene) {
      ScrollTrigger.create({
        trigger: '#library', start: 'top top', refreshPriority: 4,
        onEnter: function () { sceneApi.setActive(false); },
        onLeaveBack: function () { sceneApi.setActive(true); }
      });
    }

    /* 4. Showcase: pinned sideways scroll on wide screens with a mouse. */
    var mm = gsap.matchMedia();
    mm.add('(min-width: 1001px) and (hover: hover)', function () {
      showcase.classList.remove('is-native');
      var distance = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
      var tween = gsap.to(track, {
        x: function () { return -distance(); }, ease: 'none',
        scrollTrigger: {
          trigger: '#showcasePin', start: 'top top', end: function () { return '+=' + (distance() + window.innerHeight * 0.25); },
          pin: true, scrub: calm ? true : 0.6, invalidateOnRefresh: true, anticipatePin: 1, refreshPriority: 3
        }
      });
      return function () { tween.kill(); gsap.set(track, { clearProps: 'transform' }); };
    });
    mm.add('(max-width: 1000px), (hover: none)', function () {
      showcase.classList.add('is-native');
      return function () { showcase.classList.remove('is-native'); };
    });

    /* 6. Footer: the curved edge flattens as the dark section arrives, and the title rises word by word. */
    gsap.fromTo('.footer__curve', { scaleY: 1 }, {
      scaleY: 0.12, ease: 'none',
      scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'top 25%', scrub: true, refreshPriority: 1 }
    });
    var footWords = splitWords($('#footerTitle'));
    gsap.from(footWords, {
      yPercent: 115, ease: 'none', stagger: 0.12,
      scrollTrigger: { trigger: '.footer', start: 'top 85%', end: 'top 30%', scrub: calm ? true : 0.5, refreshPriority: 1 }
    });

    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  } else {
    showcase.classList.add('is-native');
  }

  /* Pointer effects need a mouse. Touch devices keep native behaviour. */
  if (finePointer) {
    var cursor = $('#cursor');
    var dot = $('.cursor__dot', cursor);
    var ring = $('.cursor__ring', cursor);
    var label = $('#cursorLabel');
    var cx = window.innerWidth / 2, cy = window.innerHeight / 2, rx = cx, ry = cy, moved = false;
    root.classList.add('has-cursor');
    cursor.style.opacity = 0;
    window.addEventListener('pointermove', function (e) {
      cx = e.clientX; cy = e.clientY;
      if (!moved) { moved = true; rx = cx; ry = cy; cursor.style.opacity = 1; }
      var el = e.target.closest ? e.target.closest('[data-cursor]') : null;
      if (el) { label.textContent = el.getAttribute('data-cursor'); cursor.classList.add('is-active'); }
      else cursor.classList.remove('is-active');
      cursor.classList.toggle('on-deep', !!(e.target.closest && e.target.closest('.footer, .preloader')));
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
      /* Magnetic buttons */
      $$('.magnetic').forEach(function (btn) {
        var inner = $('span', btn);
        var bx = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
        var by = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });
        var ix = gsap.quickTo(inner, 'x', { duration: 0.5, ease: 'power3.out' });
        var iy = gsap.quickTo(inner, 'y', { duration: 0.5, ease: 'power3.out' });
        btn.addEventListener('pointermove', function (e) {
          var r = btn.getBoundingClientRect();
          var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
          bx(dx * 0.28); by(dy * 0.4); ix(dx * 0.12); iy(dy * 0.16);
        });
        btn.addEventListener('pointerleave', function () { bx(0); by(0); ix(0); iy(0); });
      });

      /* Hover tilt on the showcase cards */
      $$('.tilt').forEach(function (card) {
        card.addEventListener('pointermove', function (e) {
          var r = card.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
          card.style.setProperty('--ry', (px * 8).toFixed(2) + 'deg');
          card.style.setProperty('--rx', (-py * 7).toFixed(2) + 'deg');
        });
        card.addEventListener('pointerleave', function () {
          card.style.setProperty('--ry', '0deg');
          card.style.setProperty('--rx', '0deg');
        });
      });
    }
  }
})();
