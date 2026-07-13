/* ── Module 01 — Pre-Contracted Network hero ─────────────── */
(function () {
  let timeouts = [];
  let rafId = null;
  function clearAll() {
    cancelAnimationFrame(rafId);
    timeouts.forEach(t => clearTimeout(t));
    timeouts = [];
  }
  function delay(fn, ms) { const id = setTimeout(fn, ms); timeouts.push(id); return id; }

  function build() {
    // No build needed — markup is in HTML
    const path = document.getElementById('hero-flow-path');
    if (path) {
      const len = path.getTotalLength();
      path.dataset.len = len;
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = `${len}`;
      path.style.transition = 'stroke-dashoffset 1100ms cubic-bezier(0.34, 0, 0.10, 1)';
    }
  }

  function reset() {
    document.querySelectorAll('#mod-network [data-card]').forEach(c => c.classList.remove('is-visible'));
    const hub = document.getElementById('hero-hub');
    hub && hub.classList.remove('is-visible');
    document.querySelectorAll('#mod-network [data-step]').forEach(s => s.classList.remove('is-visible'));
    document.querySelectorAll('#mod-network [data-diamond]').forEach(d => d.classList.remove('is-visible'));
    document.querySelectorAll('#mod-network [data-role]').forEach(r => r.classList.remove('is-visible'));
    const badge = document.getElementById('hero-confirmed');
    badge && badge.classList.remove('is-visible');
    const numEl = document.getElementById('net-num');
    if (numEl) numEl.textContent = '0';
    const path = document.getElementById('hero-flow-path');
    if (path) path.style.strokeDashoffset = path.dataset.len;
  }

  function play() {
    clearAll();
    reset();

    const auditorCard = document.querySelector('#mod-network [data-card="auditor"]');
    const assetCard = document.querySelector('#mod-network [data-card="asset"]');
    const hub = document.getElementById('hero-hub');
    const steps = document.querySelectorAll('#mod-network [data-step]');
    const diamonds = document.querySelectorAll('#mod-network [data-diamond]');
    const roles = document.querySelectorAll('#mod-network [data-role]');
    const path = document.getElementById('hero-flow-path');
    const badge = document.getElementById('hero-confirmed');
    const numEl = document.getElementById('net-num');

    // Stat counter starts immediately
    delay(() => animateCount(numEl, 0, 4000, 1600, v => v.toLocaleString() + '+'), 200);

    // Auditor card in
    delay(() => auditorCard && auditorCard.classList.add('is-visible'), 80);

    // Flow line draws
    delay(() => {
      if (path) path.style.strokeDashoffset = '0';
    }, 350);

    // Hub appears
    delay(() => hub && hub.classList.add('is-visible'), 600);

    // Diamonds along the line
    diamonds.forEach((d, i) => {
      delay(() => d.classList.add('is-visible'), 800 + i * 100);
    });

    // Steps appear with stagger
    steps.forEach((s, i) => {
      delay(() => s.classList.add('is-visible'), 1100 + i * 160);
    });

    // Asset card in
    delay(() => assetCard && assetCard.classList.add('is-visible'), 1900);

    // Role badges fan in
    roles.forEach((r, i) => {
      delay(() => r.classList.add('is-visible'), 2100 + i * 90);
    });

    // Confirmed badge pop
    delay(() => badge && badge.classList.add('is-visible'), 2600);
  }

  function animateCount(el, from, to, ms, fmt) {
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { el.textContent = fmt ? fmt(to) : to; return; }
    const t0 = performance.now();
    function step(t) {
      const p = Math.min(1, (t - t0) / ms);
      const ease = 1 - Math.pow(1 - p, 3);
      const v = Math.round(from + (to - from) * ease);
      el.textContent = fmt ? fmt(v) : v;
      if (p < 1) rafId = requestAnimationFrame(step);
    }
    rafId = requestAnimationFrame(step);
  }

  function finalState() {
    build();
    const path = document.getElementById('hero-flow-path');
    if (path) { path.style.transition = 'none'; path.style.strokeDashoffset = '0'; }
    document.querySelectorAll('#mod-network [data-card]').forEach(c => { c.style.transition = 'none'; c.classList.add('is-visible'); });
    const hub = document.getElementById('hero-hub');
    if (hub) { hub.style.transition = 'none'; hub.classList.add('is-visible'); }
    document.querySelectorAll('#mod-network [data-step]').forEach(s => { s.style.transition = 'none'; s.classList.add('is-visible'); });
    document.querySelectorAll('#mod-network [data-diamond]').forEach(d => { d.style.transition = 'none'; d.classList.add('is-visible'); });
    document.querySelectorAll('#mod-network [data-role]').forEach(r => { r.style.transition = 'none'; r.classList.add('is-visible'); });
    const badge = document.getElementById('hero-confirmed');
    if (badge) { badge.style.transition = 'none'; badge.classList.add('is-visible'); }
    const numEl = document.getElementById('net-num');
    if (numEl) numEl.textContent = '4,000+';
  }

  window.NetworkModule = { build, play, reset, finalState };
})();
