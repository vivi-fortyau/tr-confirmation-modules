/* ── Module 04 — Bulk Processing dashboard ─────────────────── */
(function () {
  const ROWS = [
    { client: 'Northfield Advisory Group', type: 'Asset',    when: '04/02' },
    { client: 'SouthBrook Advising',      type: 'AR',       when: '04/02' },
    { client: 'Havana Inc.',              type: 'Asset',    when: '04/02' },
    { client: 'Best Orlando Client',      type: 'Legal',    when: '04/02' },
    { client: 'Madison Inc.',             type: 'AP',       when: '04/02' },
    { client: 'ABC Corporation',          type: 'Asset',    when: '04/02' },
    { client: 'Sample Client Company',    type: 'AR',       when: '04/02' },
    { client: 'Nashville Brewing',        type: 'Asset',    when: '04/02' }
  ];

  let timeouts = [];
  let rafId = null;
  function clearAll() {
    cancelAnimationFrame(rafId);
    timeouts.forEach(t => clearTimeout(t));
    timeouts = [];
  }
  function delay(fn, ms) { const id = setTimeout(fn, ms); timeouts.push(id); return id; }

  function build() {
    const tbody = document.getElementById('bulk2-rows');
    if (!tbody) return;
    tbody.innerHTML = '';
    ROWS.forEach((r, i) => {
      const tr = document.createElement('tr');
      tr.dataset.idx = i;
      tr.innerHTML = `
        <td><span style="display:inline-block;width:12px;height:12px;border:1.5px solid var(--n-300);border-radius:3px"></span></td>
        <td><a class="client-name" style="text-decoration:none">${r.client}</a></td>
        <td>${r.type}</td>
        <td class="status-cell">
          <span class="pill pill--progress" data-status><span class="dot"></span>In progress</span>
        </td>
        <td style="text-align:right;color:var(--n-500);font-variant-numeric:tabular-nums">${r.when}</td>
      `;
      tbody.appendChild(tr);
    });
    delay(() => drawLines(), 32);
  }

  function drawLines() {
    const stage = document.getElementById('bulk2-stage');
    const svg = document.getElementById('bulk2-svg');
    const auditor = document.getElementById('bulk2-auditor');
    const rows = document.querySelectorAll('#bulk2-rows tr');
    if (!stage || !svg || !auditor) return;

    const stageRect = stage.getBoundingClientRect();
    const audRect = auditor.getBoundingClientRect();
    const ox = (audRect.right) - stageRect.left;
    const oy = (audRect.top + audRect.height / 2) - stageRect.top;

    svg.setAttribute('viewBox', `0 0 ${stageRect.width} ${stageRect.height}`);
    svg.innerHTML = '';

    rows.forEach((r, i) => {
      const rect = r.getBoundingClientRect();
      const tx = rect.left - stageRect.left;
      const ty = (rect.top + rect.height / 2) - stageRect.top;
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const midX = (ox + tx) / 2;
      const d = `M ${ox} ${oy} C ${midX} ${oy}, ${midX} ${ty}, ${tx} ${ty}`;
      path.setAttribute('d', d);
      path.dataset.idx = i;
      svg.appendChild(path);
      const len = path.getTotalLength();
      path.dataset.len = len;
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      path.style.transition = 'stroke-dashoffset 500ms cubic-bezier(0.34, 0, 0.10, 1)';
    });
  }

  function reset() {
    const auditor = document.getElementById('bulk2-auditor');
    const ripple = document.getElementById('bulk2-ripple');
    const rows = document.querySelectorAll('#bulk2-rows tr');
    const paths = document.querySelectorAll('#bulk2-svg path');
    const num = document.getElementById('bulk2-num');

    auditor.classList.remove('is-visible');
    auditor.classList.remove('is-clicking');
    if (ripple) {
      ripple.style.transition = 'none';
      ripple.style.opacity = '0';
      ripple.style.transform = 'translate(-50%, -50%) scale(0)';
      void ripple.offsetWidth;
    }
    rows.forEach(r => {
      r.classList.remove('is-row-active');
      const pill = r.querySelector('[data-status]');
      if (pill) {
        pill.className = 'pill pill--progress';
        pill.innerHTML = '<span class="dot"></span>In progress';
      }
    });
    paths.forEach(p => { p.style.strokeDashoffset = p.dataset.len; });
    if (num) num.textContent = '0';
  }

  function play() {
    clearAll();
    reset();
    drawLines();

    const auditor = document.getElementById('bulk2-auditor');
    const ripple = document.getElementById('bulk2-ripple');
    const rows = document.querySelectorAll('#bulk2-rows tr');
    const paths = document.querySelectorAll('#bulk2-svg path');
    const num = document.getElementById('bulk2-num');

    // Auditor in
    delay(() => auditor.classList.add('is-visible'), 60);

    // Click + ripple
    delay(() => {
      auditor.classList.add('is-clicking');
      ripple.style.transition = 'transform 700ms cubic-bezier(0.34, 0, 0.10, 1), opacity 700ms cubic-bezier(0.34, 0, 0.10, 1)';
      ripple.style.opacity = '1';
      ripple.style.transform = 'translate(-50%, -50%) scale(4)';
      delay(() => { ripple.style.opacity = '0'; }, 280);
      delay(() => auditor.classList.remove('is-clicking'), 220);
    }, 500);

    // Lines draw
    paths.forEach((p, i) => {
      delay(() => { p.style.strokeDashoffset = '0'; }, 750 + i * 50);
    });

    // Rows highlight as request reaches
    rows.forEach((r, i) => {
      delay(() => r.classList.add('is-row-active'), 850 + i * 60);
    });

    // Cascade: flip "In progress" → "Confirmed"
    const confirmStart = 850 + rows.length * 60 + 350;
    rows.forEach((r, i) => {
      delay(() => {
        const pill = r.querySelector('[data-status]');
        if (pill) {
          pill.className = 'pill pill--confirmed';
          pill.innerHTML = '<span class="dot"></span>Confirmed';
        }
      }, confirmStart + i * 110);
    });

    // Counter animates up
    delay(() => animateCount(num, 0, rows.length, rows.length * 110 + 200, v => v), confirmStart);
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
    delay(() => {
      const auditor = document.getElementById('bulk2-auditor');
      auditor.style.transition = 'none';
      auditor.classList.add('is-visible');
      document.querySelectorAll('#bulk2-rows tr').forEach(r => {
        r.style.transition = 'none';
        r.classList.add('is-row-active');
        const pill = r.querySelector('[data-status]');
        if (pill) {
          pill.className = 'pill pill--confirmed';
          pill.innerHTML = '<span class="dot"></span>Confirmed';
        }
      });
      document.querySelectorAll('#bulk2-svg path').forEach(p => {
        p.style.transition = 'none';
        p.style.strokeDashoffset = '0';
      });
      const num = document.getElementById('bulk2-num');
      if (num) num.textContent = ROWS.length;
    }, 60);
  }

  let resizeT;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => drawLines(), 120);
  });

  window.BulkModule = { build, play, reset, finalState };
})();
