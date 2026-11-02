import { glowSprite } from "../motion/canvas.js";
import { clamp, lerp, smooth, ease } from "../motion/input.js";

const TAU = Math.PI * 2;
const PURPLE = "141,136,255";
const GREEN = "96,219,176";
const MUTED = "165,162,200";

const COLS = 7;
const ROWS = 4;
const BOOKED = [2, 5, 8, 10, 13, 15, 18, 20, 23, 25, 26, 11];
const MESSAGES = [
  [
    "Hi {first_name} — saw {company}",
    "is expanding in Austin. Open",
    "to a quick intro this week?",
  ],
  [
    "{first_name}, congrats on the new",
    "Denver location. We help teams",
    "like yours book more meetings.",
  ],
  [
    "Hi {first_name}, noticed {company}",
    "is hiring in Atlanta — got 15",
    "minutes to compare notes?",
  ],
];

/**
 * One particle system morphing through the three steps of the engine:
 * scattered market -> personalised outreach network -> booked calendar.
 * `state.p` (0..1) is the scroll progress of the pinned section.
 */
export function createStory(ctx, { mono, state, onMetrics }) {
  const glowP = glowSprite(PURPLE);
  const glowG = glowSprite(GREEN);
  const N = 300;
  const ICP = 84;
  let W = 0;
  let H = 0;
  let ps = [];
  let sweep = 0;
  let calClock = 0;
  let typeClock = 0;
  let live = 0;

  function resize(w, h) {
    W = w;
    H = h;
    ps = Array.from({ length: N }, (_, i) => {
      const icp = i < ICP;
      const x = (0.06 + Math.random() * 0.88) * w;
      const y = (0.06 + Math.random() * 0.88) * h;
      return {
        icp,
        i,
        sx: x,
        sy: y,
        x,
        y,
        vx: 0,
        vy: 0,
        lit: 0,
        flash: 0,
        seed: Math.random() * TAU,
      };
    });
    live = 0;
  }

  function cal() {
    const cw = Math.min(W * 0.88, 540);
    const ch = Math.min(H * 0.6, cw * 0.62);
    const x0 = (W - cw) / 2;
    const y0 = 46 + (H * 0.64 - ch) / 2;
    return { x0, y0, cw, ch, w: cw / COLS, h: ch / ROWS };
  }

  function target(p, u, v, t) {
    // A: scattered market
    let x = p.sx + Math.sin(t * 0.6 + p.seed) * 6;
    let y = p.sy + Math.cos(t * 0.5 + p.seed) * 6;
    if (!p.icp) return [x, y];
    const R = Math.min(W, H) / 2;
    const ring = p.i % 3;
    const per = ICP / 3;
    const k = (p.i / 3) | 0;
    const rad = R * [0.36, 0.6, 0.84][ring];
    const ang = (k / per) * TAU + t * [0.22, -0.16, 0.1][ring] + ring;
    const bx = W / 2 + Math.cos(ang) * rad;
    const by = H / 2 + Math.sin(ang) * rad;
    x = lerp(x, bx, u);
    y = lerp(y, by, u);
    const c = cal();
    const cell = (p.i / 3) | 0;
    const col = cell % COLS;
    const row = (cell / COLS) | 0;
    const j = p.i % 3;
    const cx = c.x0 + col * c.w + c.w * (0.26 + j * 0.24);
    const cy = c.y0 + row * c.h + c.h * (j === 1 ? 0.38 : 0.62);
    return [lerp(x, cx, v), lerp(y, cy, v)];
  }

  function frame(t, dt, _box, silent) {
    if (!W) return;
    const p = state.p;
    const u = ease((p - 0.24) / 0.18);
    const v = ease((p - 0.57) / 0.18);
    const step = p < 0.34 ? 0 : p < 0.67 ? 1 : 2;
    live = lerp(live, 1, Math.min(1, dt * 1.5));

    const prevSweep = sweep;
    sweep = (sweep + dt * 1.1) % TAU;
    typeClock += dt * (step === 1 ? 1 : 0.2);
    calClock = v > 0.6 ? calClock + dt : v < 0.3 ? 0 : calClock;

    for (const q of ps) {
      const [tx, ty] = target(q, u, v, t);
      q.vx = (q.vx + (tx - q.x) * 38 * dt) * 0.84;
      q.vy = (q.vy + (ty - q.y) * 38 * dt) * 0.84;
      q.x += q.vx * dt * 7;
      q.y += q.vy * dt * 7;
      // radar sweep marks everyone, only the ideal customers stay lit
      const ang = Math.atan2(q.sy - H / 2, q.sx - W / 2) + Math.PI;
      const crossed =
        prevSweep <= sweep
          ? ang > prevSweep && ang <= sweep
          : ang > prevSweep || ang <= sweep;
      if (crossed) {
        q.flash = 1;
        if (q.icp) q.lit = 1;
      }
      q.flash = Math.max(0, q.flash - dt * 1.4);
    }

    const metrics = {
      a: Math.round(2481 * smooth(p / 0.3)),
      b: Math.round(312 * smooth(p / 0.3)),
      c: Math.round(1204 * smooth((p - 0.34) / 0.25)),
      d: BOOKED.filter((_, k) => calClock - k * 0.42 > 0.2).length,
    };
    onMetrics?.(metrics, step);
    if (silent) return;

    ctx.clearRect(0, 0, W, H);
    const c = cal();

    // Calendar frame + booked cells
    if (v > 0.02) {
      ctx.globalAlpha = v;
      ctx.fillStyle = "rgba(150,146,175,.75)";
      ctx.font = `600 ${W < 420 ? 8 : 10}px ${mono}`;
      ctx.textAlign = "center";
      "MTWTFSS"
        .split("")
        .forEach((d, k) => ctx.fillText(d, c.x0 + c.w * (k + 0.5), c.y0 - 10));
      ctx.strokeStyle = "rgba(160,150,220,.16)";
      ctx.lineWidth = 1;
      for (let r = 0; r < ROWS; r++) {
        for (let k = 0; k < COLS; k++) {
          const idx = r * COLS + k;
          const order = BOOKED.indexOf(idx);
          const on = order >= 0 ? clamp((calClock - order * 0.42) / 0.4) : 0;
          ctx.beginPath();
          ctx.roundRect(
            c.x0 + k * c.w + 3,
            c.y0 + r * c.h + 3,
            c.w - 6,
            c.h - 6,
            7,
          );
          if (on > 0) {
            ctx.fillStyle = `rgba(${GREEN},${0.14 * on})`;
            ctx.fill();
            ctx.strokeStyle = `rgba(${GREEN},${0.2 + on * 0.6})`;
          } else {
            ctx.strokeStyle = "rgba(160,150,220,.16)";
          }
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    }

    // Outreach lines from core to the qualified ring (step 2)
    const mid = u * (1 - v);
    if (mid > 0.02) {
      ctx.lineWidth = 1;
      for (const q of ps) {
        if (!q.icp) continue;
        ctx.strokeStyle = `rgba(${PURPLE},${0.1 * mid})`;
        ctx.beginPath();
        ctx.moveTo(W / 2, H / 2);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
        // message packets travelling outward
        const k = (t * 0.45 + q.seed) % 1;
        if (q.i % 2 === 0) {
          ctx.fillStyle = `rgba(210,205,255,${mid * (1 - k) * 0.9})`;
          ctx.beginPath();
          ctx.arc(lerp(W / 2, q.x, k), lerp(H / 2, q.y, k), 1.8, 0, TAU);
          ctx.fill();
        }
      }
    }

    // Radar (step 1)
    const radar = (1 - u) * live;
    if (radar > 0.02) {
      const R = Math.hypot(W, H) / 2;
      ctx.save();
      ctx.translate(W / 2, H / 2);
      ctx.rotate(sweep - Math.PI);
      const g = ctx.createConicGradient(-0.9, 0, 0);
      g.addColorStop(0, `rgba(${PURPLE},0)`);
      g.addColorStop(0.14, `rgba(${PURPLE},${0.22 * radar})`);
      g.addColorStop(0.15, `rgba(${PURPLE},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, R, 0, TAU);
      ctx.fill();
      ctx.restore();
      ctx.strokeStyle = `rgba(${PURPLE},${0.12 * radar})`;
      for (const f of [0.25, 0.5, 0.75]) {
        ctx.beginPath();
        ctx.arc(W / 2, H / 2, Math.min(W, H) * 0.5 * f, 0, TAU);
        ctx.stroke();
      }
    }

    // Particles
    ctx.globalCompositeOperation = "lighter";
    for (const q of ps) {
      let rgb = MUTED;
      let a = 0.28 + q.flash * 0.7;
      let size = 1.6 + q.flash * 1.6;
      if (q.icp) {
        const lit = Math.max(q.lit, u);
        let green = 0;
        if (v > 0.5) {
          const cell = (q.i / 3) | 0;
          const order = BOOKED.indexOf(cell);
          green = order >= 0 ? clamp((calClock - order * 0.42) / 0.4) : 0;
        }
        rgb = green > 0.5 ? GREEN : PURPLE;
        a = lerp(a, 0.55 + lit * 0.45 + green * 0.2, lit);
        size = 1.8 + lit * 1.2 + green * 1.2;
        if (lit > 0.5) {
          ctx.globalAlpha = a * 0.55;
          const s = size * 9;
          ctx.drawImage(
            green > 0.5 ? glowG : glowP,
            q.x - s / 2,
            q.y - s / 2,
            s,
            s,
          );
        }
      } else {
        a *= lerp(1, 0.28, Math.max(u, v));
      }
      ctx.globalAlpha = clamp(a);
      ctx.fillStyle = `rgba(${rgb},1)`;
      ctx.beginPath();
      ctx.arc(q.x, q.y, size, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";

    // Message card (step 2)
    if (mid > 0.05) {
      const cw = Math.min(W * 0.5, 250);
      const chh = 92;
      const x = W / 2 - cw / 2;
      const y = H / 2 - chh / 2;
      ctx.globalAlpha = smooth(mid * 1.4);
      ctx.fillStyle = "rgba(16,14,26,.92)";
      ctx.strokeStyle = `rgba(${PURPLE},.55)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x, y, cw, chh, 12);
      ctx.fill();
      ctx.stroke();
      const which = Math.floor(typeClock / 5) % MESSAGES.length;
      const local = typeClock % 5;
      const fs = cw < 200 ? 9 : 10.5;
      ctx.font = `500 ${fs}px ${mono}`;
      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(150,146,175,.9)";
      ctx.fillText("PERSONALIZED · AUTO", x + 14, y + 20);
      let chars = Math.floor(local * 34);
      MESSAGES[which].forEach((line, k) => {
        const shown = line.slice(0, Math.max(0, chars));
        chars -= line.length;
        ctx.fillStyle = "rgba(235,232,250,.92)";
        ctx.fillText(shown, x + 14, y + 40 + k * (fs + 6));
      });
      if (local > 3.4) {
        ctx.fillStyle = `rgba(${GREEN},1)`;
        ctx.fillText("✓ sent", x + cw - 52, y + 20);
      }
      ctx.globalAlpha = 1;
    }
  }

  return { resize, frame };
}
