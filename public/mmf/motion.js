/* Master Mutual Funds v10 — motion layer.
   Performance: one rAF-throttled scroll loop; each effect runs only while its section is on screen;
   reads happen before writes; transform/opacity only. Touch scroll stays native.
   Each entrance plays once. Content is complete without this file. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  if (!reduce) root.classList.add('mmf-anim', 'p3d');
  var lenis = null, hasIO = 'IntersectionObserver' in window;

  function startLenis() {
    if (reduce || window.__mmfLenis) return;
    if (window.matchMedia('(pointer: coarse)').matches) return; /* phones/tablets: native scroll only */
    window.__mmfLenis = true;
    var s = document.createElement('script');
    s.src = '/mmf/lenis.min.js';
    s.async = true;
    s.onload = function () {
      if (!window.Lenis) return;
      lenis = new window.Lenis({ duration: 0.9, smoothWheel: true, syncTouch: false });
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
    };
    document.head.appendChild(s);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (id.length < 2) return;
    var el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(el, { offset: -72 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: reduce ? 'auto' : 'smooth' });
  });

  /* Visibility tracking: effects only run for on-screen sections */
  var visible = new Set();
  var vio = hasIO ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target); });
    tick();
  }, { rootMargin: '100px 0px' }) : null;
  function track(el) { if (vio) vio.observe(el); else visible.add(el); }

  /* Entrances: once only */
  var fio = hasIO ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); fio.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 }) : null;

  /* Marquee: paused while off screen */
  var mio = hasIO ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { e.target.classList.toggle('mq-off', !e.isIntersecting); });
  }) : null;

  /* 2-day path */
  var paths = [];
  function initPath(el) {
    if (el.__p3d) return; el.__p3d = true;
    var p = {
      el: el, coins: [].slice.call(el.querySelectorAll('[data-coin]')), texts: [].slice.call(el.querySelectorAll('[data-ltext]')),
      dots: [].slice.call(el.querySelectorAll('[data-dot]')), day: el.querySelector('[data-day]'),
      fill: el.querySelector('[data-fill]'), ring: el.querySelector('[data-ring]'), active: -1, lastF: -1
    };
    p.dots.forEach(function (d, i) {
      d.addEventListener('click', function () {
        var y = el.getBoundingClientRect().top + window.scrollY + (el.offsetHeight - window.innerHeight) * ((i + 0.5) / p.coins.length);
        if (lenis) lenis.scrollTo(y); else window.scrollTo({ top: y, behavior: 'smooth' });
      });
    });
    paths.push(p); track(el); renderPath(p, true);
  }
  function renderPath(p, force) {
    var N = p.coins.length, step = 360 / N;
    var r = p.el.getBoundingClientRect(), total = p.el.offsetHeight - window.innerHeight;
    var prog = total > 0 ? Math.max(0, Math.min(1, -r.top / total)) : 0;
    var raw = prog * (N - 1), i0 = Math.floor(raw), t = raw - i0, s = Math.max(0, Math.min(1, (t - 0.2) / 0.6));
    var f = Math.min(N - 1, i0 + s * s * (3 - 2 * s));
    if (!force && Math.abs(f - p.lastF) < 0.001) return;
    p.lastF = f;
    var R = Math.min(320, window.innerWidth * (window.innerWidth < 760 ? 0.34 : 0.4));
    p.ring.style.transform = 'translateZ(' + (-R) + 'px)';
    for (var i = 0; i < N; i++) {
      var c = p.coins[i], a = (i - f) * step, front = Math.cos(a * Math.PI / 180);
      if (front <= 0) { c.style.opacity = '0'; continue; }
      c.style.transform = 'translate(-50%,-50%) rotateY(' + a.toFixed(2) + 'deg) translateZ(' + R + 'px) rotateY(' + (-a * 0.55).toFixed(2) + 'deg)';
      c.style.opacity = (0.12 + 0.88 * Math.pow(front, 4)).toFixed(3);
      c.style.zIndex = String(Math.round(front * 100) + 100);
    }
    if (p.fill) p.fill.style.transform = 'scaleX(' + (f / (N - 1)).toFixed(4) + ')';
    var k = Math.round(f);
    if (k === p.active) return;
    p.active = k;
    p.texts.forEach(function (tx, j) {
      var on = j === k;
      tx.style.opacity = on ? '1' : '0';
      tx.style.transform = on ? 'none' : 'translateY(' + (j < k ? -10 : 10) + 'px)';
      tx.style.pointerEvents = on ? 'auto' : 'none';
      tx.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    p.dots.forEach(function (d, j) {
      d.style.background = j <= k ? '#13432B' : '#F4EFE5';
      d.style.color = j <= k ? '#FFFFFF' : '#13432B';
      d.style.transform = j === k ? 'scale(1.14)' : 'none';
      d.setAttribute('aria-current', j === k ? 'step' : 'false');
    });
    if (p.day) p.day.textContent = k < N / 2 ? 'Day 1 · Saturday' : 'Day 2 · Sunday';
  }

  /* Sound familiar: the row nearest the middle of the screen is highlighted */
  var qsecs = [];
  function initRows(sec) { if (sec.__q) return; sec.__q = true; sec.__rows = [].slice.call(sec.querySelectorAll('[data-qrow]')); qsecs.push(sec); track(sec); }
  function renderRows(sec) {
    var mid = window.innerHeight / 2, best = null, bd = 1e9;
    var rects = sec.__rows.map(function (r) { return r.getBoundingClientRect(); });
    rects.forEach(function (b, i) { var d = Math.abs(b.top + b.height / 2 - mid); if (d < bd) { bd = d; best = sec.__rows[i]; } });
    sec.__rows.forEach(function (r) { var on = r === best; if (r.__on !== on) { r.__on = on; r.classList.toggle('on', on); } });
  }

  /* Agenda: slots fill in order as the card scrolls up. Never reverses; stops once complete. */
  var agendas = [];
  function initAgenda(c) {
    if (c.__a) return; c.__a = true;
    c.__slots = [].slice.call(c.querySelectorAll('[data-slot]')); c.__p = 0; c.__done = 0;
    agendas.push(c); track(c);
    if (reduce) c.__slots.forEach(function (s) { s.classList.add('reached'); });
  }
  function renderAgenda(c) {
    if (c.__done >= c.__slots.length) return;
    var b = c.getBoundingClientRect(), vh = window.innerHeight;
    var p = Math.max(0, Math.min(1, (vh * 0.72 - b.top) / b.height));
    if (p <= c.__p) return;
    c.__p = p;
    var h = b.height;
    while (c.__done < c.__slots.length) {
      var s = c.__slots[c.__done];
      if ((s.offsetTop + 14) / h > p + 0.02) break;
      s.classList.add('reached'); c.__done++;
    }
  }

  /* Guides carousel (below 760px) */
  function initGuides(wrap) {
    if (wrap.__g) return; wrap.__g = true;
    var track_ = wrap.querySelector('[data-gtrack]'), cards = [].slice.call(track_.children);
    var dots = [].slice.call(wrap.querySelectorAll('[data-gdot]'));
    function idx() {
      var l = track_.scrollLeft, best = 0, bd = 1e9, base = track_.offsetLeft;
      cards.forEach(function (c, i) { var d = Math.abs(c.offsetLeft - base - l); if (d < bd) { bd = d; best = i; } });
      return best;
    }
    function go(i) { i = Math.max(0, Math.min(cards.length - 1, i)); track_.scrollTo({ left: cards[i].offsetLeft - track_.offsetLeft, behavior: reduce ? 'auto' : 'smooth' }); }
    function sync() {
      var k = idx();
      dots.forEach(function (d, i) { var on = i === k; d.setAttribute('aria-current', on ? 'true' : 'false'); d.firstElementChild.style.background = on ? '#13432B' : '#D8CFBB'; d.firstElementChild.style.width = on ? '22px' : '8px'; });
    }
    dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); }); });
    var prev = wrap.querySelector('[data-gprev]'), next = wrap.querySelector('[data-gnext]');
    if (prev) prev.addEventListener('click', function () { go(idx() - 1); });
    if (next) next.addEventListener('click', function () { go(idx() + 1); });
    track_.addEventListener('scroll', function () { clearTimeout(track_.__t); track_.__t = setTimeout(sync, 80); }, { passive: true });
    sync();
  }

  /* One scroll loop */
  var nav = null, bar = null, navOn = null, barOn = null, queued = false;
  function frame() {
    queued = false;
    var y = window.scrollY;
    if (!nav) nav = document.querySelector('[data-nav]');
    if (!bar) bar = document.querySelector('[data-sticky]');
    var n = y > 10, b = y > 640;
    if (nav && n !== navOn) { navOn = n; nav.classList.toggle('scrolled', n); }
    if (bar && b !== barOn) { barOn = b; bar.classList.toggle('show', b); }
    if (root.classList.contains('p3d')) paths.forEach(function (p) { if (visible.has(p.el)) renderPath(p); });
    qsecs.forEach(function (s) { if (visible.has(s)) renderRows(s); });
    agendas.forEach(function (c) { if (visible.has(c)) renderAgenda(c); });
  }
  function tick() { if (!queued) { queued = true; requestAnimationFrame(frame); } }

  function scan() {
    document.querySelectorAll('[data-fade]:not([data-w])').forEach(function (el) {
      el.setAttribute('data-w', '1');
      if (fio && !reduce) fio.observe(el); else el.classList.add('in');
    });
    document.querySelectorAll('[data-path3d]').forEach(initPath);
    document.querySelectorAll('[data-qsec]').forEach(initRows);
    document.querySelectorAll('[data-agenda]').forEach(initAgenda);
    document.querySelectorAll('[data-guides]').forEach(initGuides);
    document.querySelectorAll('[data-mq]:not([data-mw])').forEach(function (m) { m.setAttribute('data-mw', '1'); if (mio) mio.observe(m); });
    tick();
  }
  window.addEventListener('scroll', tick, { passive: true });
  window.addEventListener('resize', function () { paths.forEach(function (p) { p.lastF = -1; }); tick(); });
  startLenis();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scan); else scan();
  /* Pick up late-rendered sections, then stop */
  var n = 0, iv = setInterval(function () { scan(); if (++n > 12) clearInterval(iv); }, 500);
  /* Safety net: if entrances never fire (e.g. hidden frame), show everything */
  setTimeout(function () { if (!document.querySelector('[data-fade].in')) document.querySelectorAll('[data-fade]').forEach(function (el) { el.classList.add('in'); }); }, 2500);
  window.__mmfScan = scan;
})();
