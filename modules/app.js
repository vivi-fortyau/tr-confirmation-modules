/* ── App orchestration ─────────────────────────────────────── */
(function () {
  const MODULES = {
    network: window.NetworkModule,
    chain: window.ChainModule,
    compression: window.CompressionModule,
    bulk: window.BulkModule,
    signer: window.SignerModule
  };

  const SECTION_IDS = {
    network: 'mod-network',
    chain: 'mod-chain',
    compression: 'mod-compression',
    bulk: 'mod-bulk',
    signer: 'mod-signer'
  };

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Build all modules statically first (so layout settles for IntersectionObserver)
  Object.values(MODULES).forEach(m => m && m.build && m.build());

  if (reduced) {
    // Render final state for all, no animations
    Object.values(MODULES).forEach(m => m && m.finalState && m.finalState());
  } else {
    // IntersectionObserver: play module when ~20% visible; reset when out
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        const key = Object.keys(SECTION_IDS).find(k => SECTION_IDS[k] === id);
        if (!key) return;
        const mod = MODULES[key];
        if (!mod) return;

        if (entry.isIntersecting && entry.intersectionRatio >= 0.18) {
          if (!entry.target.dataset.playing) {
            entry.target.dataset.playing = '1';
            mod.play && mod.play();
          }
        } else if (entry.intersectionRatio < 0.05) {
          delete entry.target.dataset.playing;
          mod.reset && mod.reset();
        }
      });
    }, { threshold: [0, 0.05, 0.18, 0.5] });

    Object.values(SECTION_IDS).forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  // Replay buttons
  document.querySelectorAll('[data-replay]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.replay;
      const mod = MODULES[key];
      if (mod && mod.play) mod.play();
    });
  });

  // Rebuild on resize for modules that depend on layout
  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      // Only rebuild static structures that depend on layout
      MODULES.bulk && MODULES.bulk.build && MODULES.bulk.build();
    }, 200);
  });
})();
