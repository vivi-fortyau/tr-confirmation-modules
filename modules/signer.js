/* ── Module 05 — The Super Signer (modal + document-stack metaphor) ── */
(function () {
  let timeouts = [];
  function clearAll() { timeouts.forEach(t => clearTimeout(t)); timeouts = []; }
  function delay(fn, ms) { const id = setTimeout(fn, ms); timeouts.push(id); return id; }

  function build() {
    const path = document.getElementById('signer2-path');
    if (path) {
      const len = path.getTotalLength();
      path.dataset.len = len;
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      path.style.transition = 'stroke-dashoffset 900ms cubic-bezier(0.34, 0, 0.10, 1)';
    }
    const sp = document.getElementById('signer2-stack-path');
    if (sp) {
      const l = sp.getTotalLength();
      sp.dataset.len = l;
      sp.style.strokeDasharray = l;
      sp.style.strokeDashoffset = l;
      sp.style.transition = 'stroke-dashoffset 720ms cubic-bezier(0.34, 0, 0.10, 1)';
    }
  }

  function reset() {
    const officer = document.getElementById('signer2-officer');
    const modal = document.getElementById('signer2-modal');
    const stat = document.getElementById('signer2-stat');
    const tgl = document.getElementById('signer2-tgl');
    const row = document.getElementById('signer2-row');
    const badge = document.getElementById('signer2-badge');
    const path = document.getElementById('signer2-path');
    const sp = document.getElementById('signer2-stack-path');
    const seal = document.getElementById('signer2-stack-seal');
    const count = document.getElementById('signer2-stack-count');

    officer && officer.classList.remove('is-visible');
    modal && modal.classList.remove('is-visible');
    stat && stat.classList.remove('is-visible');
    tgl && tgl.classList.remove('is-on');
    row && row.classList.remove('is-active');
    badge && badge.classList.remove('is-visible');
    seal && seal.classList.remove('is-visible');

    document.querySelectorAll('#signer2-clients .signer2-client').forEach(c => {
      c.classList.remove('is-checked');
      c.querySelector('.cb').classList.remove('is-checked');
    });

    document.querySelectorAll('.signer2-doc').forEach(d => {
      d.classList.remove('is-visible');
      d.classList.remove('is-collapsed');
      d.classList.remove('is-signed');
      d.style.transition = '';
    });

    if (row) {
      const pill = row.querySelector('.pill');
      if (pill) {
        pill.className = 'pill pill--auth';
        pill.innerHTML = '<span class="dot"></span>Pending';
      }
    }

    if (path) path.style.strokeDashoffset = path.dataset.len;
    if (sp)   sp.style.strokeDashoffset = sp.dataset.len;
    if (count) count.textContent = '0';
  }

  function play() {
    clearAll();
    reset();

    const officer = document.getElementById('signer2-officer');
    const modal = document.getElementById('signer2-modal');
    const stat = document.getElementById('signer2-stat');
    const tgl = document.getElementById('signer2-tgl');
    const row = document.getElementById('signer2-row');
    const badge = document.getElementById('signer2-badge');
    const path = document.getElementById('signer2-path');
    const sp = document.getElementById('signer2-stack-path');
    const seal = document.getElementById('signer2-stack-seal');
    const count = document.getElementById('signer2-stack-count');
    const clients = document.querySelectorAll('#signer2-clients .signer2-client');
    const docs = Array.from(document.querySelectorAll('.signer2-doc'));

    delay(() => officer && officer.classList.add('is-visible'), 80);
    delay(() => modal && modal.classList.add('is-visible'), 250);
    delay(() => row && row.classList.add('is-active'), 800);
    delay(() => tgl && tgl.classList.add('is-on'), 1100);

    clients.forEach((c, i) => {
      delay(() => {
        c.classList.add('is-checked');
        c.querySelector('.cb').classList.add('is-checked');
        const d = docs[i];
        if (d) d.classList.add('is-visible');
        if (count) count.textContent = (i + 1);
      }, 1350 + i * 200);
    });

    const afterChecks = 1350 + clients.length * 200;

    delay(() => {
      docs.forEach(d => d.classList.add('is-collapsed'));
    }, afterChecks + 200);

    delay(() => {
      if (path) path.style.strokeDashoffset = '0';
      if (sp)   sp.style.strokeDashoffset = '0';
      docs.forEach(d => d.classList.add('is-signed'));
    }, afterChecks + 600);

    delay(() => {
      seal && seal.classList.add('is-visible');
      badge && badge.classList.add('is-visible');
      if (row) {
        const pill = row.querySelector('.pill');
        if (pill) {
          pill.className = 'pill pill--confirmed';
          pill.innerHTML = '<span class="dot"></span>Authorized';
        }
      }
    }, afterChecks + 1450);

    delay(() => stat && stat.classList.add('is-visible'), afterChecks + 1750);
  }

  function finalState() {
    build();
    const officer = document.getElementById('signer2-officer');
    const modal = document.getElementById('signer2-modal');
    const stat = document.getElementById('signer2-stat');
    const tgl = document.getElementById('signer2-tgl');
    const row = document.getElementById('signer2-row');
    const badge = document.getElementById('signer2-badge');
    const path = document.getElementById('signer2-path');
    const sp = document.getElementById('signer2-stack-path');
    const seal = document.getElementById('signer2-stack-seal');
    const count = document.getElementById('signer2-stack-count');

    if (officer) { officer.style.transition = 'none'; officer.classList.add('is-visible'); }
    if (modal)   { modal.style.transition = 'none'; modal.classList.add('is-visible'); }
    if (stat)    { stat.style.transition = 'none'; stat.classList.add('is-visible'); }
    if (tgl)     { tgl.classList.add('is-on'); }
    if (row)     {
      row.classList.add('is-active');
      const pill = row.querySelector('.pill');
      if (pill) {
        pill.className = 'pill pill--confirmed';
        pill.innerHTML = '<span class="dot"></span>Authorized';
      }
    }
    if (badge) { badge.style.transition = 'none'; badge.classList.add('is-visible'); }
    if (seal)  { seal.style.transition = 'none'; seal.classList.add('is-visible'); }

    document.querySelectorAll('#signer2-clients .signer2-client').forEach(c => {
      c.classList.add('is-checked');
      c.querySelector('.cb').classList.add('is-checked');
    });
    document.querySelectorAll('.signer2-doc').forEach(d => {
      d.style.transition = 'none';
      d.classList.add('is-visible');
      d.classList.add('is-collapsed');
      d.classList.add('is-signed');
    });
    if (path) { path.style.transition = 'none'; path.style.strokeDashoffset = '0'; }
    if (sp)   { sp.style.transition = 'none'; sp.style.strokeDashoffset = '0'; }
    if (count) count.textContent = '4';
  }

  window.SignerModule = { build, play, reset, finalState };
})();
