import { glowSprite } from "../motion/canvas.js";
import { pointer, scroll, clamp } from "../motion/input.js";

const TAU = Math.PI * 2;
const PURPLE = "141,136,255";
const GREEN = "96,219,176";

/**
 * "The market": a field of prospects. Signals leave the engine at the bottom,
 * qualify the nodes they reach (purple) and some become booked meetings (green).
 */
export function createHeroField(ctx, { mono }) {
  const glowP = glowSprite(PURPLE);
  const glowG = glowSprite(GREEN);
  let W = 0;
  let H = 0;
  let nodes = [];
  let links = [];
  let packets = [];
  let pings = [];
  let clock = 0;
  let spawnIn = 0.4;
  let ghost = { x: 0, y: 0 };

  function resize(w, h) {
    W = w;
    H = h;
    const cell = w < 640 ? 74 : 88;
    nodes = [];
    for (let gx = 0; gx * cell < W + cell; gx++) {
      for (let gy = 0; gy * cell < H + cell; gy++) {
        if (Math.random() < 0.1) continue;
        nodes.push({
          x: (gx + 0.5 + (Math.random() - 0.5) * 0.8) * cell,
          y: (gy + 0.5 + (Math.random() - 0.5) * 0.8) * cell,
          z: 0.4 + Math.random() * 0.6,
          ox: 0,
          oy: 0,
          vx: 0,
          vy: 0,
          phase: Math.random() * TAU,
          lit: 0,
          kind: 0,
          age: 0,
        });
      }
    }
    links = [];
    nodes.forEach((a, i) => {
      const near = nodes
        .map((b, j) => ({ j, d: (a.x - b.x) ** 2 + (a.y - b.y) ** 2 }))
        .filter((o) => o.j > i && o.d < (cell * 1.55) ** 2)
        .sort((p, q) => p.d - q.d)
        .slice(0, 2);
      near.forEach((o) => links.push([i, o.j]));
    });
    packets = [];
    pings = [];
  }

  const origin = () => ({ x: W / 2, y: H * 0.98 });
  const textZone = (x, y) => {
    const dx = Math.abs(x - W / 2) / (W * 0.34);
    const dy = Math.abs(y - H * 0.38) / (H * 0.3);
    return clamp(Math.max(dx, dy), 0.3, 1);
  };

  function spawn() {
    const o = origin();
    const idle = nodes.filter((n) => n.kind === 0 && n.y < H * 0.82);
    if (!idle.length) return;
    const target = idle[(Math.random() * idle.length) | 0];
    const side = Math.random() < 0.5 ? -1 : 1;
    packets.push({
      target,
      t: 0,
      speed: 0.32 + Math.random() * 0.22,
      cx: (o.x + target.x) / 2 + side * (60 + Math.random() * 160),
      cy: (o.y + target.y) / 2 - 20,
    });
  }

  function arrive(node) {
    node.kind = 1;
    node.age = 0;
    node.lit = 1;
    pings.push({ node, rgb: PURPLE, life: 0, max: 0.9, label: null });
  }

  function book(node) {
    node.kind = 2;
    node.age = 0;
    pings.push({
      node,
      rgb: GREEN,
      life: 0,
      max: 1.3,
      label: "+1 MEETING BOOKED",
    });
  }

  const px = (n) => n.x + n.ox;
  const py = (n) => n.y + n.oy - scroll.y * 0.09 * n.z;

  function bez(p, o, t) {
    const u = 1 - t;
    const tx = px(p.target);
    const ty = py(p.target);
    return [
      u * u * o.x + 2 * u * t * p.cx + t * t * tx,
      u * u * o.y + 2 * u * t * p.cy + t * t * ty,
    ];
  }

  function frame(t, dt, box, silent) {
    clock = t;
    if (!W) return;
    // Pointer (or an idle ghost scanner on touch devices) drives the repel + scan lines.
    const live =
      pointer.active && pointer.y > box.top - 80 && pointer.y < box.bottom;
    ghost.x = W * (0.5 + 0.38 * Math.sin(t * 0.21));
    ghost.y = H * (0.42 + 0.22 * Math.sin(t * 0.33 + 1));
    const mx = live ? pointer.x - box.left : ghost.x;
    const my = live ? pointer.y - box.top : ghost.y;

    spawnIn -= dt;
    if (spawnIn <= 0 && packets.length < (W < 640 ? 4 : 7)) {
      spawn();
      spawnIn = 0.45 + Math.random() * 0.5;
    }

    for (const n of nodes) {
      const dx = px(n) - mx;
      const dy = py(n) - my;
      const d = Math.hypot(dx, dy);
      const R = 150;
      let fx = (0 - n.ox) * 28;
      let fy = (0 - n.oy) * 28;
      if (d < R && d > 0.01) {
        const k = (1 - d / R) ** 2 * 900;
        fx += (dx / d) * k;
        fy += (dy / d) * k;
      }
      n.vx = (n.vx + fx * dt) * 0.86;
      n.vy = (n.vy + fy * dt) * 0.86;
      n.ox += n.vx * dt * 6;
      n.oy += n.vy * dt * 6;
      n.age += dt;
      if (n.kind === 1) {
        if (n.age > 0.9 && n.age - dt <= 0.9 && Math.random() < 0.55) book(n);
        else if (n.age > 4) n.kind = 0;
      } else if (n.kind === 2 && n.age > 6.5) n.kind = 0;
      const target = n.kind === 2 ? 1 : n.kind === 1 ? 0.8 : 0;
      n.lit += (target - n.lit) * Math.min(1, dt * 2.2);
    }

    for (const p of packets) {
      p.t += dt * p.speed;
      if (p.t >= 1 && !p.done) {
        p.done = true;
        arrive(p.target);
      }
    }
    packets = packets.filter((p) => !p.done);
    for (const g of pings) g.life += dt;
    pings = pings.filter((g) => g.life < g.max);

    if (silent) return;
    ctx.clearRect(0, 0, W, H);

    // Pulse radiating from the engine.
    const o = origin();
    const wave = (n) => {
      const d = Math.hypot(px(n) - o.x, py(n) - o.y);
      return Math.max(0, Math.sin(d / 120 - clock * 1.5)) ** 4;
    };

    // Links
    ctx.lineWidth = 1;
    for (const [i, j] of links) {
      const a = nodes[i];
      const b = nodes[j];
      const lit = Math.max(a.lit, b.lit);
      const zone = Math.min(textZone(a.x, a.y), textZone(b.x, b.y));
      const alpha = (0.09 + lit * 0.4) * zone;
      ctx.strokeStyle =
        lit > 0.2 ? `rgba(${PURPLE},${alpha})` : `rgba(176,170,225,${alpha})`;
      ctx.beginPath();
      ctx.moveTo(px(a), py(a));
      ctx.lineTo(px(b), py(b));
      ctx.stroke();
    }

    // Scan lines from pointer to nearby nodes
    for (const n of nodes) {
      const d = Math.hypot(px(n) - mx, py(n) - my);
      if (d < 170) {
        ctx.strokeStyle = `rgba(${PURPLE},${(1 - d / 170) * 0.5})`;
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.lineTo(px(n), py(n));
        ctx.stroke();
      }
    }

    // Nodes
    for (const n of nodes) {
      const zone = textZone(n.x, n.y);
      const x = px(n);
      const y = py(n);
      const w = wave(n);
      const base =
        (0.22 + n.z * 0.3 + w * 0.35 + Math.sin(clock * 1.3 + n.phase) * 0.06) *
        zone;
      const r = 1.3 + n.z * 1.5 + w * 0.9;
      if (n.lit > 0.02) {
        const sprite = n.kind === 2 ? glowG : glowP;
        const s = 26 + n.lit * 26;
        ctx.globalAlpha = n.lit * (n.kind === 2 ? 0.95 : 0.7);
        ctx.drawImage(sprite, x - s / 2, y - s / 2, s, s);
        ctx.globalAlpha = 1;
      }
      ctx.fillStyle =
        n.lit > 0.25
          ? `rgba(${n.kind === 2 ? GREEN : "190,184,255"},${0.5 + n.lit * 0.5})`
          : `rgba(190,186,235,${base})`;
      ctx.beginPath();
      ctx.arc(x, y, r + n.lit * 1.4, 0, TAU);
      ctx.fill();
    }

    // Packets with comet trails
    ctx.globalCompositeOperation = "lighter";
    for (const p of packets) {
      for (let k = 0; k < 9; k++) {
        const tt = Math.max(0, p.t - k * 0.012);
        const [x, y] = bez(p, o, tt);
        const a = (1 - k / 9) ** 2;
        ctx.fillStyle = `rgba(${PURPLE},${a * 0.9})`;
        ctx.beginPath();
        ctx.arc(x, y, 2.4 * (1 - k / 12), 0, TAU);
        ctx.fill();
      }
      const [hx, hy] = bez(p, o, p.t);
      ctx.drawImage(glowP, hx - 14, hy - 14, 28, 28);
    }
    ctx.globalCompositeOperation = "source-over";

    // Pings + booking labels
    ctx.font = `600 10px ${mono}`;
    ctx.textAlign = "center";
    for (const g of pings) {
      const k = g.life / g.max;
      const x = px(g.node);
      const y = py(g.node);
      ctx.strokeStyle = `rgba(${g.rgb},${(1 - k) * 0.8})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x, y, 4 + k * (g.label ? 38 : 24), 0, TAU);
      ctx.stroke();
      if (g.label) {
        const rise = k * 22;
        ctx.fillStyle = `rgba(${GREEN},${Math.sin(Math.min(1, k * 1.15) * Math.PI) * 0.95})`;
        ctx.fillText(g.label, x, y - 16 - rise);
      }
    }
    ctx.lineWidth = 1;

    // Pointer halo
    ctx.globalAlpha = live ? 0.55 : 0.3;
    ctx.drawImage(glowP, mx - 90, my - 90, 180, 180);
    ctx.globalAlpha = 1;
  }

  return { resize, frame };
}
