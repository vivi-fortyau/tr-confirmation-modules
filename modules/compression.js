/* ── Module 03 — Time Compression ──────────────────────────── */
(function () {
  let timeouts = [];
  function clearAll() { timeouts.forEach(t => clearTimeout(t)); timeouts = []; }
  function delay(fn, ms) { const id = setTimeout(fn, ms); timeouts.push(id); return id; }

  function build() {
    // No build needed — markup is static
  }

  function reset() {
    document.querySelectorAll('#mod-compression .comp2-event').forEach(e => e.classList.remove('is-visible'));
    const fb = document.getElementById('comp2-fill-before');
    const fa = document.getElementById('comp2-fill-after');
    [fb, fa].forEach(f => {
      if (!f) return;
      f.style.transition = 'none';
      f.style.width = '0';
      void f.offsetWidth;
      f.style.transition = '';
    });
    document.querySelectorAll('#mod-compression .comp2-stat span').forEach(s => s.classList.remove('is-visible'));
    const beforeRow = document.getElementById('comp2-before');
    beforeRow && beforeRow.classList.remove('is-muted');
  }

  function play() {
    clearAll();
    reset();

    const beforeEvents = document.querySelectorAll('#comp2-events-before .comp2-event');
    const afterEvents = document.querySelectorAll('#comp2-events-after .comp2-event');
    const fillBefore = document.getElementById('comp2-fill-before');
    const fillAfter = document.getElementById('comp2-fill-after');
    const a = document.getElementById('comp2-a');
    const arrow = document.getElementById('comp2-arrow');
    const b = document.getElementById('comp2-b');
    const beforeRow = document.getElementById('comp2-before');

    // BEFORE: fill bar over 1500ms while events pop in
    delay(() => {
      if (fillBefore) {
        fillBefore.style.transition = 'width 1500ms cubic-bezier(0.34, 0, 0.10, 1)';
        fillBefore.style.width = '100%';
      }
    }, 150);
    beforeEvents.forEach((e, i) => {
      delay(() => e.classList.add('is-visible'), 200 + i * 200);
    });

    // "3 weeks" text
    delay(() => a && a.classList.add('is-visible'), 1700);
    delay(() => arrow && arrow.classList.add('is-visible'), 1950);

    // Mute before row
    delay(() => beforeRow && beforeRow.classList.add('is-muted'), 2100);

    // AFTER: fill bar over 800ms with events
    delay(() => {
      if (fillAfter) {
        fillAfter.style.transition = 'width 900ms cubic-bezier(0.34, 0, 0.10, 1)';
        fillAfter.style.width = '100%';
      }
    }, 2200);
    afterEvents.forEach((e, i) => {
      delay(() => e.classList.add('is-visible'), 2250 + i * 160);
    });

    // "4 days" text
    delay(() => b && b.classList.add('is-visible'), 3000);
  }

  function finalState() {
    build();
    document.querySelectorAll('#mod-compression .comp2-event').forEach(e => { e.style.transition = 'none'; e.classList.add('is-visible'); });
    const fb = document.getElementById('comp2-fill-before');
    const fa = document.getElementById('comp2-fill-after');
    [fb, fa].forEach(f => { if (f) { f.style.transition = 'none'; f.style.width = '100%'; }});
    document.querySelectorAll('#mod-compression .comp2-stat span').forEach(s => { s.style.transition = 'none'; s.classList.add('is-visible'); });
    const beforeRow = document.getElementById('comp2-before');
    beforeRow && beforeRow.classList.add('is-muted');
  }

  window.CompressionModule = { build, play, reset, finalState };
})();
