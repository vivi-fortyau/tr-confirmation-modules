/* ── Carousel module ───────────────────────────────────────── */
(function () {
  const rail = document.getElementById('car-rail');
  if (!rail) return;
  const dotsHost = document.getElementById('car-dots');
  const prevBtn = document.getElementById('car-prev');
  const nextBtn = document.getElementById('car-next');

  const slides = Array.from(rail.children);
  const total = slides.length;

  // Compute how many slides are visible based on flex-basis
  function slidesPerView() {
    const w = window.innerWidth;
    if (w < 720) return 1;
    if (w < 1080) return 2;
    return 3;
  }

  function maxIndex() {
    return Math.max(0, total - slidesPerView());
  }

  let idx = 0;
  let autoplay = null;
  const AUTO_MS = 5400;

  function buildDots() {
    if (!dotsHost) return;
    dotsHost.innerHTML = '';
    const stops = maxIndex() + 1;
    for (let i = 0; i < stops; i++) {
      const b = document.createElement('button');
      b.className = 'car-dot' + (i === idx ? ' is-active' : '');
      b.type = 'button';
      b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      b.addEventListener('click', () => { go(i, true); });
      dotsHost.appendChild(b);
    }
  }

  function go(to, fromUser) {
    const cap = maxIndex();
    idx = ((to % (cap + 1)) + (cap + 1)) % (cap + 1);
    update();
    if (fromUser) restartAuto();
  }

  function next(fromUser) {
    const cap = maxIndex();
    idx = idx >= cap ? 0 : idx + 1;
    update();
    if (fromUser) restartAuto();
  }
  function prev(fromUser) {
    const cap = maxIndex();
    idx = idx <= 0 ? cap : idx - 1;
    update();
    if (fromUser) restartAuto();
  }

  function update() {
    const first = slides[0];
    if (!first) return;
    const slideW = first.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(rail).gap || '0');
    rail.style.transform = `translate3d(${-idx * (slideW + gap)}px, 0, 0)`;
    if (dotsHost) {
      dotsHost.querySelectorAll('.car-dot').forEach((d, i) => {
        d.classList.toggle('is-active', i === idx);
      });
    }
    if (prevBtn) prevBtn.disabled = false;
    if (nextBtn) nextBtn.disabled = false;
  }

  function startAuto() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    stopAuto();
    autoplay = setInterval(() => next(false), AUTO_MS);
  }
  function stopAuto() { if (autoplay) { clearInterval(autoplay); autoplay = null; } }
  function restartAuto() { startAuto(); }

  // Pause on hover
  const wrap = document.querySelector('.car-wrap');
  if (wrap) {
    wrap.addEventListener('mouseenter', stopAuto);
    wrap.addEventListener('mouseleave', startAuto);
  }

  // Pause when not in view
  const section = document.querySelector('.carousel');
  if (section && 'IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) startAuto(); else stopAuto();
      });
    }, { threshold: 0.25 }).observe(section);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => prev(true));
  if (nextBtn) nextBtn.addEventListener('click', () => next(true));

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (!section) return;
    const r = section.getBoundingClientRect();
    const inView = r.top < window.innerHeight * 0.6 && r.bottom > window.innerHeight * 0.4;
    if (!inView) return;
    if (e.key === 'ArrowLeft') prev(true);
    if (e.key === 'ArrowRight') next(true);
  });

  // Swipe (touch)
  let startX = null;
  rail.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    stopAuto();
  }, { passive: true });
  rail.addEventListener('touchend', (e) => {
    if (startX == null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)(true);
    startX = null;
    startAuto();
  });

  // Recompute on resize
  let resizeT;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => {
      buildDots();
      idx = Math.min(idx, maxIndex());
      update();
    }, 120);
  });

  buildDots();
  update();
  startAuto();
})();
