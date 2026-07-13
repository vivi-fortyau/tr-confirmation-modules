/* ════════════════════════════════════════════════════════════
   newmods.js — animations for the 4 homepage modules
   ════════════════════════════════════════════════════════════ */
(function () {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Module 06 — What is it (isometric scene + numbered flow) ─── */
  const WhatIs = {
    build() { window.IsoScene && window.IsoScene.build(); },
    play() {
      window.IsoScene && window.IsoScene.play();
      document.querySelectorAll('.wi2-step').forEach(el => {
        el.style.transition = ''; el.style.opacity = ''; el.style.transform = '';
        el.classList.remove('is-visible');
      });
      requestAnimationFrame(() => {
        document.querySelectorAll('.wi2-step').forEach((el, i) => {
          setTimeout(() => el.classList.add('is-visible'), 150 + i * 160);
        });
      });
    },
    reset() {
      window.IsoScene && window.IsoScene.reset();
      document.querySelectorAll('.wi2-step').forEach(el => {
        el.style.transition = ''; el.style.opacity = ''; el.style.transform = '';
        el.classList.remove('is-visible');
      });
    },
    finalState() {
      window.IsoScene && window.IsoScene.finalState();
      document.querySelectorAll('.wi2-step').forEach(el => {
        el.style.transition = 'none';
        el.classList.add('is-visible');
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }
  };

  /* ── Generic staggered reveal (who-needs / why / trust) ────── */
  function staggerReveal(selector, stagger) {
    const els = Array.from(document.querySelectorAll(selector));
    els.forEach((el, i) => {
      setTimeout(() => el.classList.add('is-visible'), i * (stagger || 100));
    });
  }
  function resetReveal(selector) {
    document.querySelectorAll(selector).forEach(el => {
      el.style.transition = '';
      el.style.opacity = '';
      el.style.transform = '';
      el.classList.remove('is-visible');
    });
  }
  // Bypass transitions (reduced-motion / capture / fallback)
  function snapVisible(selector) {
    document.querySelectorAll(selector).forEach(el => {
      el.style.transition = 'none';
      el.classList.add('is-visible');
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  const WhoNeeds = {
    play() { resetReveal('.wn-card'); requestAnimationFrame(() => staggerReveal('.wn-card', 120)); },
    reset() { resetReveal('.wn-card'); },
    finalState() { snapVisible('.wn-card'); }
  };
  const WhyUs = {
    play() { resetReveal('.wy-item'); requestAnimationFrame(() => staggerReveal('.wy-item', 110)); },
    reset() { resetReveal('.wy-item'); },
    finalState() { snapVisible('.wy-item'); }
  };
  const Trust = {
    play() {
      resetReveal('.tr-logo');
      requestAnimationFrame(() => staggerReveal('.tr-logo', 60));
    },
    reset() { resetReveal('.tr-logo'); },
    finalState() { snapVisible('.tr-logo'); }
  };

  /* ── Orchestration ─────────────────────────────────────────── */
  const MODULES = {
    'mod-whatis': WhatIs,
    'mod-whoneeds': WhoNeeds,
    'mod-whyus': WhyUs,
    'mod-logos': Trust
  };

  // initial build for layout-dependent module
  WhatIs.build();

  if (reduced) {
    Object.values(MODULES).forEach(m => m.finalState && m.finalState());
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const mod = MODULES[entry.target.id];
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

    Object.keys(MODULES).forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  // Replay buttons
  document.querySelectorAll('[data-nm-replay]').forEach(btn => {
    btn.addEventListener('click', () => {
      const mod = MODULES[btn.dataset.nmReplay];
      if (mod && mod.play) mod.play();
    });
  });

  // Rebuild connection diagram on resize
  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => WhatIs.build(), 200);
  });

  window.NewModules = MODULES;
})();
