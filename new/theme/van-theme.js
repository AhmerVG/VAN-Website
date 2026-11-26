/* VAN deep pages, theme script. 23 Nov 2026.
   Small on purpose. It never removes or rewrites anything the app renders.
   1. The pill's Search / Menu button presses the app's own (hidden) menu button, so the app's own
      search panel opens and closes exactly as before.
   2. While that panel is open on a narrow screen, the 5 main links are added at its top.
   3. The pill hides while the dark footer is on screen.
   If this file does not load, the page still works: the pill shows its links and the crop plan button. */
(function () {
  'use strict';
  var nav = document.getElementById('vtNav');
  if (!nav) return;
  var btn = nav.querySelector('.vt-menu');
  var links = nav.querySelector('.vt-nav__links');
  var wasOpen = false;

  function appBtn() { return document.querySelector('.hdr .hdr-menu'); }
  function panel() { return document.getElementById('mobile-menu'); }

  if (btn) {
    btn.hidden = false;
    btn.addEventListener('click', function () {
      var b = appBtn();
      if (b) b.click();
    });
  }

  function sync() {
    var p = panel();
    var open = !!p;
    if (btn) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.classList.toggle('is-open', open);
      var d = btn.querySelector('.vt-menu__d'), m = btn.querySelector('.vt-menu__m');
      if (d) d.textContent = open ? 'Close' : 'Search';
      if (m) m.textContent = open ? 'Close' : 'Menu';
    }
    if (open) {
      nav.classList.remove('is-hidden');
      var inner = p.querySelector('.mp-in');
      if (inner && links && !inner.querySelector('.vt-mp-links')) {
        var box = document.createElement('nav');
        box.className = 'vt-mp-links';
        box.setAttribute('aria-label', 'Main menu');
        var as = links.querySelectorAll('a');
        for (var i = 0; i < as.length; i++) box.appendChild(as[i].cloneNode(true));
        inner.insertBefore(box, inner.firstChild);
      }
    } else if (wasOpen && btn && (document.activeElement === document.body || !document.activeElement)) {
      btn.focus();
    }
    wasOpen = open;
  }

  var queued = false;
  function queue() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; sync(); footerCheck(); });
  }
  var root = document.getElementById('root');
  if (root && 'MutationObserver' in window) {
    new MutationObserver(queue).observe(root, { childList: true, subtree: true });
  }

  function footerCheck() {
    if (panel()) return;
    var ft = document.querySelector('footer.ft');
    /* A page too short to scroll keeps its menu. */
    var over = ft && window.scrollY > 120 ? ft.getBoundingClientRect().top < window.innerHeight * 0.55 : false;
    /* Keyboard focus inside the pill keeps it on screen. */
    if (over && nav.querySelector(':focus-visible')) over = false;
    nav.classList.toggle('is-hidden', over);
  }
  var tick = false;
  window.addEventListener('scroll', function () {
    if (tick) return;
    tick = true;
    requestAnimationFrame(function () { tick = false; footerCheck(); });
  }, { passive: true });
  window.addEventListener('resize', footerCheck);
  nav.addEventListener('focusin', function () { nav.classList.remove('is-hidden'); });

  sync();
  footerCheck();

  /* In the preview copy under /new/, files that the app links to (plans, data sheets, downloads) stay at the site root. */
  var pre = location.pathname.match(/^\/new\//);
  if (pre) {
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      var u = new URL(a.getAttribute('href'), location.href);
      if (u.origin === location.origin && /^\/new\/(plans|sds|spec-sheets|downloads|lms|data|api|3d)\//.test(u.pathname)) {
        a.setAttribute('href', u.pathname.slice(4) + u.search + u.hash);
      }
    }, true);
  }
})();
