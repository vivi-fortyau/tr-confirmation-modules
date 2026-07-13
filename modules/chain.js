/* ── Module 02 — The Approval Chain ───────────────────────── */
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
    // Init signature path dash
    const sig = document.getElementById('chain-sig-path');
    if (sig) {
      const len = sig.getTotalLength();
      sig.dataset.len = len;
      sig.style.strokeDasharray = len;
      sig.style.strokeDashoffset = len;
      sig.style.transition = 'stroke-dashoffset 700ms cubic-bezier(0.34, 0, 0.10, 1)';
    }
    // Hide confirmed state initially (it's part of the last card preview)
    const finalState = document.getElementById('chain-final-state');
    if (finalState) {
      finalState.style.opacity = '0';
      finalState.style.transition = 'opacity 400ms cubic-bezier(0.34, 0, 0.10, 1)';
    }
  }

  function reset() {
    document.querySelectorAll('.chain2-card').forEach(c => {
      c.classList.remove('is-visible');
      c.classList.remove('is-active');
    });
    const fill = document.getElementById('chain2-fill');
    if (fill) {
      fill.style.transition = 'none';
      fill.style.width = '0%';
      void fill.offsetWidth;
    }
    document.querySelectorAll('.chain2-track .node').forEach(n => n.classList.remove('is-active'));
    const sig = document.getElementById('chain-sig-path');
    if (sig) sig.style.strokeDashoffset = sig.dataset.len;
    const finalState = document.getElementById('chain-final-state');
    if (finalState) finalState.style.opacity = '0';
  }

  function play() {
    clearAll();
    reset();
    const cards = document.querySelectorAll('.chain2-card');
    const nodes = document.querySelectorAll('.chain2-track .node');
    const fill = document.getElementById('chain2-fill');
    const sig = document.getElementById('chain-sig-path');
    const finalState = document.getElementById('chain-final-state');
    if (!cards.length) return;

    // Cards appear staggered
    cards.forEach((c, i) => {
      delay(() => c.classList.add('is-visible'), 80 + i * 130);
    });

    // Progress bar fills
    const fillStart = 80 + cards.length * 130 + 200;
    const fillDur = 1400;

    delay(() => {
      const t0 = performance.now();
      function step(t) {
        const p = Math.min(1, (t - t0) / fillDur);
        const eased = 1 - Math.pow(1 - p, 2);
        fill.style.width = (eased * 100) + '%';
        cards.forEach((c, i) => {
          const trigger = i / (cards.length - 1);
          if (eased >= trigger - 0.01) {
            c.classList.add('is-active');
            nodes[i] && nodes[i].classList.add('is-active');
            // When step 3 (signature card) activates, draw signature
            if (i === 2 && sig) sig.style.strokeDashoffset = '0';
            // When step 4 (confirmed) activates, show confirmed state
            if (i === 3 && finalState) finalState.style.opacity = '1';
          }
        });
        if (p < 1) rafId = requestAnimationFrame(step);
      }
      rafId = requestAnimationFrame(step);
    }, fillStart);
  }

  function finalState() {
    build();
    document.querySelectorAll('.chain2-card').forEach(c => {
      c.style.transition = 'none';
      c.classList.add('is-visible');
      c.classList.add('is-active');
    });
    document.querySelectorAll('.chain2-track .node').forEach(n => { n.style.transition = 'none'; n.classList.add('is-active'); });
    const fill = document.getElementById('chain2-fill');
    if (fill) { fill.style.transition = 'none'; fill.style.width = '100%'; }
    const sig = document.getElementById('chain-sig-path');
    if (sig) { sig.style.transition = 'none'; sig.style.strokeDashoffset = '0'; }
    const fState = document.getElementById('chain-final-state');
    if (fState) { fState.style.transition = 'none'; fState.style.opacity = '1'; }
  }

  window.ChainModule = { build, play, reset, finalState };
})();
