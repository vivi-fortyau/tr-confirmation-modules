/* ════════════════════════════════════════════════════════════
   iso-scene.js — isometric illustration (TR brand, FLAT colors)
   Confirmation hub + Client / Auditor / Bank, labelled, connected
   by dotted lines with travelling particles. No gradients, no lilac.
   ════════════════════════════════════════════════════════════ */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const OX = 450, OY = 290, S = 26;
  const KX = S * 0.866, KY = S * 0.5;
  const INK = '#1B2433';

  // ── flat brand palette ──
  const C = {
    platTop: '#F2F4F7', platSide: '#D7DBE0',
    hubTop: '#D64000', hubSide: '#A02D00',
    amberTop: '#FFFFFF', amberL: '#F9A000', amberR: '#D98200',
    orgTop: '#FFFFFF', orgL: '#E5571A', orgR: '#C23800',
    white: '#FFFFFF', soft: '#FFF1E8',
    line: '#D0D5DD', green: '#17B26A', greenBg: '#ECFDF3'
  };

  function iso(x, y, z) { return [OX + (x - y) * KX, OY + (x + y) * KY - (z || 0) * S]; }
  function el(n, a) { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); return e; }
  function poly(pts, fill) {
    return el('polygon', { points: pts.map(p => p.join(',')).join(' '), fill, stroke: INK, 'stroke-width': 2, 'stroke-linejoin': 'round' });
  }

  function disc(g, cx, cy, r, topFill, sideFill) {
    const [px, py] = iso(cx, cy, 0);
    const rx = r * KX * 1.04, ry = r * KY * 1.04, th = 11;
    g.appendChild(el('ellipse', { cx: px, cy: py + th + 7, rx: rx * 1.16, ry: ry * 1.16, fill: 'none', stroke: INK, 'stroke-width': 1.3, 'stroke-dasharray': '2 6', 'stroke-linecap': 'round', opacity: 0.38 }));
    g.appendChild(el('path', { d: `M ${px - rx} ${py} v ${th} a ${rx} ${ry} 0 0 0 ${2 * rx} 0 v ${-th}`, fill: sideFill, stroke: INK, 'stroke-width': 2, 'stroke-linejoin': 'round' }));
    g.appendChild(el('ellipse', { cx: px, cy: py, rx, ry, fill: topFill, stroke: INK, 'stroke-width': 2 }));
    return [px, py];
  }

  function box(g, cx, cy, w, d, h, fTop, fLeft, fRight, z0) {
    z0 = z0 || 0;
    const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - d / 2, y1 = cy + d / 2, z1 = z0 + h;
    const T = [iso(x0, y0, z1), iso(x1, y0, z1), iso(x1, y1, z1), iso(x0, y1, z1)];
    const L = [iso(x0, y1, z1), iso(x0, y1, z0), iso(x1, y1, z0), iso(x1, y1, z1)];
    const R = [iso(x1, y0, z1), iso(x1, y0, z0), iso(x1, y1, z0), iso(x1, y1, z1)];
    g.appendChild(poly(L, fLeft)); g.appendChild(poly(R, fRight)); g.appendChild(poly(T, fTop));
    return { x0, x1, y0, y1 };
  }

  function check(g, cx, cy, scale, color) {
    g.appendChild(el('path', { d: `M ${cx - 7 * scale} ${cy} l ${5 * scale} ${5 * scale} l ${9 * scale} ${-11 * scale}`, fill: 'none', stroke: color, 'stroke-width': 3.2 * scale, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
  }

  function coin(g, cx, cy, delay, id) {
    const grp = el('g', { class: 'iso-float iso-badge', style: `--d:${(delay || 0) * 0.6}s` });
    if (id) grp.setAttribute('id', id);
    grp.appendChild(el('circle', { cx, cy, r: 17, fill: C.greenBg, stroke: INK, 'stroke-width': 2.2 }));
    check(grp, cx, cy + 1, 0.95, C.green);
    return grp;
  }

  // verified-person badge — communicates the human contact at the bank is verified,
  // not merely that the institution responded (the key value prop for Bank).
  function personBadge(cx, cy, delay, id) {
    const grp = el('g', { class: 'iso-float iso-badge', style: `--d:${(delay || 0) * 0.6}s` });
    if (id) grp.setAttribute('id', id);
    grp.appendChild(el('circle', { cx, cy, r: 19, fill: C.greenBg, stroke: INK, 'stroke-width': 2.2 }));
    grp.appendChild(el('circle', { cx, cy: cy - 3.6, r: 4.2, fill: C.green }));
    grp.appendChild(el('path', { d: `M ${cx - 7.5} ${cy + 9.5} a 7.5 7.5 0 0 1 15 0 z`, fill: C.green }));
    // small check sub-badge (bottom-right) — the "verified" mark on the person
    grp.appendChild(el('circle', { cx: cx + 13, cy: cy + 12, r: 7.5, fill: '#fff', stroke: INK, 'stroke-width': 1.6 }));
    check(grp, cx + 13, cy + 12.5, 0.5, C.green);
    return grp;
  }

  // text label under a platform (offset by disc radius so it clears the base)
  function label(svg, cx, cy, r, name, role) {
    const [px, py] = iso(cx, cy, 0);
    const ry = r * KY * 1.04;
    const g = el('g', { class: 'iso-label' });
    const t1 = el('text', { x: px, y: py + ry + 30, 'text-anchor': 'middle', fill: INK, 'font-family': "'Inter',sans-serif", 'font-size': 15, 'font-weight': 700, 'letter-spacing': '-0.005em', stroke: '#fff', 'stroke-width': 4.5, 'paint-order': 'stroke', 'stroke-linejoin': 'round' });
    t1.textContent = name;
    const t2 = el('text', { x: px, y: py + ry + 48, 'text-anchor': 'middle', fill: '#98A2B3', 'font-family': "'Inter',sans-serif", 'font-size': 10.5, 'font-weight': 700, 'letter-spacing': '0.08em', stroke: '#fff', 'stroke-width': 3.5, 'paint-order': 'stroke', 'stroke-linejoin': 'round' });
    t2.textContent = role;
    g.appendChild(t1); g.appendChild(t2);
    svg.appendChild(g);
  }

  let ANCH = {};

  const POS = {
    hub:     { x: -4, y: -4 },
    client:  { x: -1, y: 11 },
    auditor: { x: 5,  y: 5 },
    bank:    { x: 11, y: -1 }
  };

  function build() {
    const svg = document.getElementById('wi-iso');
    if (!svg) return;
    svg.innerHTML = '';

    // connectors (dotted routes — kept as the visual style; direction is carried
    // by the single travelling packet that moves through the sequence)
    const cg = el('g', { id: 'iso-connectors' });
    svg.appendChild(cg);
    ['client', 'auditor', 'bank'].forEach((k, i) => {
      const [hx, hy] = iso(POS.hub.x, POS.hub.y, 1.0);
      const [sx, sy] = iso(POS[k].x, POS[k].y, 1.0);
      cg.appendChild(el('line', { x1: hx, y1: hy, x2: sx, y2: sy, stroke: '#D64000', 'stroke-width': 2, 'stroke-dasharray': '2 7', 'stroke-linecap': 'round', opacity: 0.4, class: 'iso-conn', 'data-idx': i }));
    });

    // screen-space anchors for the sequential flow packet
    ANCH = {};
    ['hub', 'client', 'auditor', 'bank'].forEach(k => { ANCH[k] = iso(POS[k].x, POS[k].y, 1.0); });

    // CLIENT — amber office tower (top-left)
    (function () {
      const g = el('g', { class: 'iso-obj iso-float', style: '--d:0s', 'data-node': 'client' });
      disc(g, POS.client.x, POS.client.y, 2.5, C.platTop, C.platSide);
      box(g, POS.client.x, POS.client.y, 2.1, 2.1, 2.8, C.amberTop, C.amberL, C.amberR);
      box(g, POS.client.x, POS.client.y, 1.4, 1.4, 4.2, C.amberTop, C.amberL, C.amberR);
      // windows on front-right face
      svg.appendChild(g);
      svg.appendChild(coin(svg, ...iso(POS.client.x + 1.5, POS.client.y - 1.2, 5.0), 1, 'badge-client'));
      label(svg, POS.client.x, POS.client.y, 2.5, 'Client', 'SIGN-OFF');
    })();

    // BANK — orange columned building (bottom-left)
    (function () {
      const g = el('g', { class: 'iso-obj iso-float', style: '--d:.9s', 'data-node': 'bank' });
      disc(g, POS.bank.x, POS.bank.y, 2.7, C.platTop, C.platSide);
      box(g, POS.bank.x, POS.bank.y, 3.0, 3.0, 0.5, C.orgTop, C.orgL, C.orgR);          // base
      box(g, POS.bank.x, POS.bank.y, 2.3, 2.3, 2.4, C.white, C.orgL, C.orgR, 0.5);       // columns body
      box(g, POS.bank.x, POS.bank.y, 2.9, 2.9, 0.45, C.orgTop, C.orgL, C.orgR, 2.9);     // roof slab
      svg.appendChild(g);
      svg.appendChild(personBadge(...iso(POS.bank.x + 1.5, POS.bank.y - 1.4, 3.9), 0.9, 'badge-bank'));
      label(svg, POS.bank.x, POS.bank.y, 2.7, 'Bank', 'CONTACT VERIFIED');
    })();

    // AUDITOR — verified document (right)
    (function () {
      const g = el('g', { class: 'iso-obj iso-float', style: '--d:.45s', 'data-node': 'auditor' });
      const [dx, dy] = disc(g, POS.auditor.x, POS.auditor.y, 2.3, C.platTop, C.platSide);
      const cx = dx, top = dy - 116, w = 84, h = 104;
      g.appendChild(el('rect', { x: cx - w / 2, y: top, width: w, height: h, rx: 9, fill: C.white, stroke: INK, 'stroke-width': 2.4 }));
      g.appendChild(el('rect', { x: cx - 26, y: top + 16, width: 34, height: 8, rx: 4, fill: '#D64000' }));
      [0, 1, 2].forEach(i => g.appendChild(el('rect', { x: cx - 26, y: top + 36 + i * 15, width: i === 1 ? 52 : 38, height: 6, rx: 3, fill: C.line })));
      const abadge = el('g', { id: 'badge-auditor', class: 'iso-badge' });
      abadge.appendChild(el('circle', { cx: cx + 24, cy: top + h - 16, r: 15, fill: C.greenBg, stroke: INK, 'stroke-width': 2 }));
      check(abadge, cx + 24, top + h - 15, 0.85, C.green);
      g.appendChild(abadge);
      svg.appendChild(g);
      label(svg, POS.auditor.x, POS.auditor.y, 2.3, 'Auditor', 'INITIATES & CLOSES');
    })();

    // HUB — Confirmation (center, LARGE — the focal point)
    (function () {
      const g = el('g', { class: 'iso-obj', 'data-node': 'hub' });
      const [dx, dy] = disc(g, POS.hub.x, POS.hub.y, 3.7, C.hubTop, C.hubSide);
      const gf = el('g', { id: 'iso-shield', class: 'iso-float iso-badge', style: '--d:.2s' });
      const bx = dx, by = dy;
      const w = 98, h = 116, top = by - 150;
      gf.appendChild(el('path', { d: `M ${bx} ${top} l ${w / 2} ${h * 0.22} v ${h * 0.4} q 0 ${h * 0.34} ${-w / 2} ${h * 0.44} q ${-w / 2} ${-h * 0.10} ${-w / 2} ${-h * 0.44} v ${-h * 0.4} z`, fill: '#D64000', stroke: INK, 'stroke-width': 2.8, 'stroke-linejoin': 'round' }));
      check(gf, bx, by - 74, 2.0, '#fff');
      g.appendChild(gf);
      svg.appendChild(g);
      label(svg, POS.hub.x, POS.hub.y, 3.7, 'Confirmation', 'CERTIFIES ALL THREE');
    })();

    // travelling packet (drawn on top) + step caption
    const pk = el('g', { id: 'iso-packet', opacity: 0 });
    pk.appendChild(el('circle', { r: 12, fill: '#D64000', opacity: 0.16 }));
    pk.appendChild(el('circle', { r: 6, fill: '#D64000', stroke: '#fff', 'stroke-width': 2 }));
    pk.appendChild(el('path', { d: 'M 3.4 0 L -2.6 -3.4 L -2.6 3.4 Z', fill: '#fff' }));
    svg.appendChild(pk);

    const cap = el('text', { id: 'iso-step-cap', x: 450, y: 566, 'text-anchor': 'middle', fill: '#475467', 'font-family': "'Inter',sans-serif", 'font-size': 13.5, 'font-weight': 600, opacity: 0 });
    svg.appendChild(cap);

    // one-time styles for pulse + caption
    if (!document.getElementById('iso-flow-style')) {
      const st = document.createElement('style');
      st.id = 'iso-flow-style';
      st.textContent = `.iso-badge{transform-box:fill-box;transform-origin:center;}
@keyframes isoPulse{0%{transform:scale(1)}40%{transform:scale(1.26)}100%{transform:scale(1)}}
.iso-badge.pulse{animation:isoPulse .6s cubic-bezier(.34,0,.1,1);}
#iso-step-cap{transition:opacity .3s ease;}`;
      document.head.appendChild(st);
    }
  }

  // ── sequential, unidirectional flow ──
  // Auditor initiates → up to Confirmation → out to Client → signed, back to
  // Confirmation → out to Bank → contact verified, evidence back → closes at Auditor.
  const SEQ = [
    { from: 'auditor', to: 'hub',     cap: '1 · Auditor initiates the request' },
    { from: 'hub',     to: 'client',  cap: '2 · Confirmation routes it to the Client' },
    { from: 'client',  to: 'hub',     cap: '3 · Client signs — returned to Confirmation' },
    { from: 'hub',     to: 'bank',    cap: '4 · Confirmation sends it to the Bank' },
    { from: 'bank',    to: 'hub',     cap: '5 · Bank contact verified — evidence returns' },
    { from: 'hub',     to: 'auditor', cap: '6 · Verified evidence closes with the Auditor' }
  ];
  const SEG_MS = 1150, PAUSE_MS = 460;
  let raf = null, running = false, seqI = 0, segStart = 0, paused = false;

  function ease(p) { return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; }
  function pulse(id) {
    const e = document.getElementById(id);
    if (!e) return;
    e.classList.remove('pulse');
    try { e.getBBox(); } catch (_) {}
    e.classList.add('pulse');
    setTimeout(() => e.classList.remove('pulse'), 640);
  }

  function startFlow() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const pk = document.getElementById('iso-packet');
    const cap = document.getElementById('iso-step-cap');
    if (!pk || !ANCH.hub) return;
    running = true; seqI = 0; segStart = 0; paused = false;
    if (cap) cap.setAttribute('opacity', 1);
    function frame(t) {
      if (!running) return;
      if (!segStart) segStart = t;
      const seg = SEQ[seqI];
      const a = ANCH[seg.from], b = ANCH[seg.to];
      const raw = (t - segStart) / SEG_MS;
      const p = raw < 0 ? 0 : raw > 1 ? 1 : raw;
      const e = ease(p);
      const x = a[0] + (b[0] - a[0]) * e, y = a[1] + (b[1] - a[1]) * e;
      const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
      pk.setAttribute('transform', `translate(${x} ${y}) rotate(${ang})`);
      pk.setAttribute('opacity', (p < 0.05 || p > 0.96) ? 0.15 : 1);
      if (cap) cap.textContent = seg.cap;
      if (raw >= 1 && !paused) {
        paused = true;
        pulse(seg.to === 'hub' ? 'iso-shield' : 'badge-' + seg.to);
        setTimeout(() => { seqI = (seqI + 1) % SEQ.length; segStart = 0; paused = false; }, PAUSE_MS);
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
  }
  function stopFlow() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    const pk = document.getElementById('iso-packet');
    if (pk) pk.setAttribute('opacity', 0);
  }

  function play() {
    if (!document.getElementById('iso-connectors')) build();
    document.querySelectorAll('.iso-conn').forEach((c, i) => {
      c.style.opacity = '0';
      setTimeout(() => { c.style.transition = 'opacity 500ms ease'; c.style.opacity = '0.4'; }, 200 + i * 160);
    });
    stopFlow();
    setTimeout(startFlow, 700);
  }
  function reset() {
    stopFlow();
    const cap = document.getElementById('iso-step-cap');
    if (cap) cap.setAttribute('opacity', 0);
  }
  function finalState() { build(); startFlow(); }

  window.IsoScene = { build, play, reset, finalState };
})();
