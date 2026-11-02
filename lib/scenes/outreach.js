import { glowSprite } from "../motion/canvas.js";
import { clamp } from "../motion/input.js";

const TAU = Math.PI * 2;
const DUR = 19;
const PURPLE = "141,136,255";
const GREEN = "96,219,176";

const seg = (t, a, d) => clamp((t - a) / d);
const lerp = (a, b, t) => a + (b - a) * t;
const eo = (x) => 1 - (1 - x) ** 3;
const eio = (x) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
const eb = (x) => 1 + 2.70158 * (x - 1) ** 3 + 1.70158 * (x - 1) ** 2;

/* ---- brand-ish channel glyphs (simple vector marks) ---------------------- */
function plate(c, s, fill) {
  c.beginPath();
  c.roundRect(-s / 2, -s / 2, s, s, s * 0.28);
  c.fillStyle = fill;
  c.fill();
}
const whatsapp = (c, s) => {
  plate(c, s, "#25d366");
  c.strokeStyle = "#fff";
  c.lineWidth = s * 0.075;
  c.lineCap = "round";
  c.beginPath();
  c.arc(0, -s * 0.02, s * 0.27, Math.PI * 0.62, Math.PI * 2.55);
  c.lineTo(-s * 0.3, s * 0.32);
  c.lineTo(-s * 0.14, s * 0.24);
  c.stroke();
  c.beginPath();
  c.moveTo(-s * 0.1, -s * 0.12);
  c.quadraticCurveTo(-s * 0.08, s * 0.04, s * 0.1, s * 0.12);
  c.stroke();
};
const mail = (c, s) => {
  const g = c.createLinearGradient(-s / 2, -s / 2, s / 2, s / 2);
  g.addColorStop(0, "#7aa2ff");
  g.addColorStop(1, "#8d6bff");
  plate(c, s, g);
  c.strokeStyle = "#fff";
  c.lineWidth = s * 0.07;
  c.lineJoin = "round";
  c.lineCap = "round";
  c.beginPath();
  c.roundRect(-s * 0.28, -s * 0.2, s * 0.56, s * 0.4, s * 0.06);
  c.moveTo(-s * 0.26, -s * 0.16);
  c.lineTo(0, s * 0.06);
  c.lineTo(s * 0.26, -s * 0.16);
  c.stroke();
};
const linkedin = (c, s) => {
  plate(c, s, "#0a66c2");
  c.fillStyle = "#fff";
  c.font = `700 ${s * 0.46}px Arial, sans-serif`;
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.fillText("in", 0, s * 0.03);
  c.textBaseline = "alphabetic";
};
const instagram = (c, s) => {
  const g = c.createLinearGradient(-s / 2, s / 2, s / 2, -s / 2);
  g.addColorStop(0, "#fdb94a");
  g.addColorStop(0.5, "#e1306c");
  g.addColorStop(1, "#7b4fe0");
  plate(c, s, g);
  c.strokeStyle = "#fff";
  c.lineWidth = s * 0.07;
  c.beginPath();
  c.roundRect(-s * 0.26, -s * 0.26, s * 0.52, s * 0.52, s * 0.15);
  c.moveTo(s * 0.13, 0);
  c.arc(0, 0, s * 0.13, 0, TAU);
  c.stroke();
  c.fillStyle = "#fff";
  c.beginPath();
  c.arc(s * 0.16, -s * 0.16, s * 0.032, 0, TAU);
  c.fill();
};
const sms = (c, s) => {
  plate(c, s, "#2fbf8f");
  c.fillStyle = "#fff";
  c.beginPath();
  c.roundRect(-s * 0.3, -s * 0.24, s * 0.6, s * 0.42, s * 0.12);
  c.moveTo(-s * 0.14, s * 0.17);
  c.lineTo(-s * 0.2, s * 0.32);
  c.lineTo(0, s * 0.17);
  c.fill();
  c.fillStyle = "#2fbf8f";
  for (const k of [-1, 0, 1]) {
    c.beginPath();
    c.arc(k * s * 0.15, -s * 0.03, s * 0.04, 0, TAU);
    c.fill();
  }
};

const CHANNELS = [
  {
    name: "WhatsApp",
    msg: "Hi Dana, saw your team is expanding.",
    icon: whatsapp,
    reply: true,
  },
  {
    name: "Email",
    msg: "Subject: Quick idea for your team",
    icon: mail,
    reply: true,
  },
  {
    name: "LinkedIn",
    msg: "Hi Dana, would love to connect.",
    icon: linkedin,
    reply: true,
  },
  {
    name: "Instagram",
    msg: "Loved your latest project, Dana!",
    icon: instagram,
  },
  { name: "SMS", msg: "Hi Dana, got 15 min this week?", icon: sms },
];
const SLOTS = [
  ["WED", "11:00 AM"],
  ["THU", "2:30 PM"],
  ["FRI", "9:00 AM"],
];
const DAYS = [
  ["MON", 10],
  ["TUE", 11],
  ["WED", 12],
  ["THU", 13],
  ["FRI", 14],
];
const ROWS = ["9:00", "10:30", "12:00", "2:30", "4:00"];
const POPS = [
  [0, 0],
  [2, 1],
  [1, 2],
  [4, 0],
  [0, 3],
  [4, 3],
  [2, 4],
];
const POP_AT = POPS.map((_, k) => 14.4 + k * 0.32);
const BOOK_AT = 13.5;
const STAGES = [
  ["01", "OUTREACH", 0, 5.4],
  ["02", "REPLY", 5.4, 9.2],
  ["03", "BOOK", 9.2, 12.6],
  ["04", "CALENDAR", 12.6, 18.2],
];

function layout(portrait) {
  if (!portrait) {
    const cw = 300;
    const ch = 64;
    const gap = 14;
    const y0 = 270 - (5 * ch + 4 * gap) / 2;
    return {
      portrait,
      W: 960,
      H: 540,
      hub: { x: 118, y: 270, r: 34 },
      lead: { x: 862, y: 270, r: 42 },
      cards: CHANNELS.map((_, i) => ({
        x: 330,
        y: y0 + i * (ch + gap),
        w: cw,
        h: ch,
      })),
      book: { x: 290, y: 150, w: 380, h: 250 },
      cal: { x: 150, y: 66, w: 660, h: 388 },
      f: 1,
    };
  }
  return {
    portrait,
    W: 480,
    H: 600,
    hub: { x: 240, y: 80, r: 26 },
    lead: { x: 240, y: 520, r: 32 },
    cards: CHANNELS.map((_, i) => ({ x: 44, y: 130 + i * 54, w: 392, h: 48 })),
    book: { x: 36, y: 168, w: 408, h: 292 },
    cal: { x: 20, y: 92, w: 440, h: 400 },
    f: 1.18,
  };
}

const cardMid = (c) => c.y + c.h / 2;
function hubPath(L, i) {
  const c = L.cards[i];
  const cy = cardMid(c);
  return L.portrait
    ? [
        { x: L.hub.x - L.hub.r, y: L.hub.y },
        { x: 8, y: L.hub.y },
        { x: 8, y: cy },
        { x: c.x, y: cy },
      ]
    : [
        { x: L.hub.x + L.hub.r, y: L.hub.y },
        { x: L.hub.x + L.hub.r + 90, y: L.hub.y },
        { x: c.x - 90, y: cy },
        { x: c.x, y: cy },
      ];
}
function leadPath(L, i) {
  const c = L.cards[i];
  const cy = cardMid(c);
  return L.portrait
    ? [
        { x: c.x + c.w, y: cy },
        { x: 472, y: cy },
        { x: 472, y: L.lead.y },
        { x: L.lead.x + L.lead.r, y: L.lead.y },
      ]
    : [
        { x: c.x + c.w, y: cy },
        { x: c.x + c.w + 80, y: cy },
        { x: L.lead.x - L.lead.r - 90, y: L.lead.y },
        { x: L.lead.x - L.lead.r, y: L.lead.y },
      ];
}
const at = (p, t) => {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return {
    x: a * p[0].x + b * p[1].x + c * p[2].x + d * p[3].x,
    y: a * p[0].y + b * p[1].y + c * p[2].y + d * p[3].y,
  };
};

/**
 * A looping motion-graphics film: multi-channel outreach -> lead replies ->
 * AI books a time -> the meeting lands in the calendar.
 */
export function createOutreach(ctx, { mono, sans, redraw }) {
  const glowP = glowSprite(PURPLE);
  const glowG = glowSprite(GREEN);
  let w = 0;
  let h = 0;
  let L = layout(false);
  let s = 1;
  let ox = 0;
  let clock = 0;
  let g = 1;
  let avatar = null;
  let dead = false;
  import("./avatar3d.js")
    .then((m) => m.createAvatar({ size: 360 }))
    .then((a) => {
      if (dead) return a?.dispose();
      avatar = a;
      redraw?.();
    })
    .catch(() => {});

  function resize(cw, ch) {
    w = cw;
    h = ch;
    L = layout(cw / ch < 0.9);
    s = Math.min(cw / L.W, ch / L.H);
    ox = (cw - L.W * s) / 2;
  }

  const F = (n) => n * L.f;
  const font = (wt, n, fam = sans) => (ctx.font = `${wt} ${F(n)}px ${fam}`);
  const rr = (x, y, rw, rh, r) => {
    ctx.beginPath();
    ctx.roundRect(x, y, rw, rh, r);
  };
  const fit = (txt, max) => {
    if (ctx.measureText(txt).width <= max) return txt;
    let out = txt;
    while (out.length > 1 && ctx.measureText(`${out}…`).width > max)
      out = out.slice(0, -1);
    return `${out}…`;
  };
  const alpha = (a) => (ctx.globalAlpha = clamp(a) * g);

  function curve(p, from, to, rgb, a, dash = true) {
    if (to - from < 0.01) return;
    ctx.globalAlpha = clamp(a) * g;
    ctx.strokeStyle = `rgba(${rgb},1)`;
    ctx.lineWidth = 1.4;
    ctx.setLineDash(dash ? [3, 6] : []);
    ctx.lineDashOffset = -clock * 14;
    ctx.beginPath();
    for (let k = 0; k <= 28; k++) {
      const q = at(p, lerp(from, to, k / 28));
      k ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }
  function packet(p, t, rgb, a = 1) {
    if (t <= 0 || t >= 1) return;
    ctx.globalCompositeOperation = "lighter";
    for (let k = 0; k < 10; k++) {
      const q = at(p, Math.max(0, t - k * 0.016));
      ctx.globalAlpha = (1 - k / 10) ** 2 * 0.85 * a * g;
      ctx.fillStyle = `rgba(${rgb},1)`;
      ctx.beginPath();
      ctx.arc(q.x, q.y, 2.6 * (1 - k / 14), 0, TAU);
      ctx.fill();
    }
    const q = at(p, t);
    ctx.globalAlpha = a * g;
    ctx.drawImage(rgb === GREEN ? glowG : glowP, q.x - 16, q.y - 16, 32, 32);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  function drawHub() {
    const { x, y, r } = L.hub;
    const a = eb(seg(clock, 0, 0.8)) * (1 - seg(clock, 9, 0.8));
    if (a <= 0.01) return;
    for (let k = 0; k < 2; k++) {
      const ph = (clock * 0.6 + k * 0.5) % 1;
      ctx.globalAlpha = (1 - ph) * 0.45 * a * g;
      ctx.strokeStyle = `rgba(${PURPLE},1)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x, y, r + ph * 38, 0, TAU);
      ctx.stroke();
    }
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(a, a);
    ctx.globalAlpha = 0.7 * g;
    ctx.drawImage(glowP, -r * 2.2, -r * 2.2, r * 4.4, r * 4.4);
    ctx.globalAlpha = g;
    const gr = ctx.createLinearGradient(0, -r, 0, r);
    gr.addColorStop(0, "#8b84ff");
    gr.addColorStop(1, "#4d41d6");
    rr(-r, -r, r * 2, r * 2, r * 0.32);
    ctx.fillStyle = gr;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.35)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "#fff";
    const d = r * 0.3;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        ctx.globalAlpha = g * (i === 0 && j === 0 ? 1 : 0.55);
        rr(i * d - d * 0.32, j * d - d * 0.32, d * 0.64, d * 0.64, d * 0.18);
        ctx.fill();
      }
    }
    ctx.restore();
    ctx.globalAlpha = a * g * 0.75;
    font(600, 10, mono);
    ctx.fillStyle = "#cfcbe2";
    if (L.portrait) {
      ctx.textAlign = "left";
      ctx.fillText("SCALEMATRIX AI", x + r + 14, y - 3);
      ctx.fillStyle = "#8f8ba3";
      ctx.fillText("OUTBOUND ENGINE", x + r + 14, y + F(14));
    } else {
      ctx.textAlign = "center";
      ctx.fillText("SCALEMATRIX AI", x, y + r + 26);
      ctx.fillStyle = "#8f8ba3";
      ctx.fillText("OUTBOUND ENGINE", x, y + r + 26 + F(15));
    }
  }

  function drawCard(i) {
    const ch = CHANNELS[i];
    const c = L.cards[i];
    const t0 = 0.5 + i * 0.22;
    const e = eo(seg(clock, t0, 0.8));
    const replyT = 7.3 + i * 0.25;
    const replied = ch.reply && clock > replyT;
    let a = e * (1 - seg(clock, 9, 0.7));
    if (!ch.reply) a *= 1 - 0.62 * seg(clock, 6.6, 0.8);
    if (a <= 0.01) return;
    const dx = L.portrait ? 0 : (1 - e) * -110;
    const dy = L.portrait ? (1 - e) * -36 : 0;
    const x = c.x + dx;
    const y = c.y + dy;
    ctx.save();
    ctx.globalAlpha = a * g;
    ctx.shadowColor = "rgba(0,0,0,.5)";
    ctx.shadowBlur = 22;
    ctx.shadowOffsetY = 8;
    const fill = ctx.createLinearGradient(x, y, x, y + c.h);
    fill.addColorStop(0, "#1d1b2b");
    fill.addColorStop(1, "#14131e");
    rr(x, y, c.w, c.h, 14);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = replied ? `rgba(${GREEN},.7)` : "rgba(255,255,255,.1)";
    ctx.lineWidth = 1;
    ctx.stroke();
    const is = c.h * 0.6;
    ctx.save();
    ctx.translate(x + 14 + is / 2, y + c.h / 2);
    ch.icon(ctx, is);
    ctx.restore();
    const tx = x + 14 + is + 12;
    const tw = c.w - (tx - x) - 12;
    font(600, 12.5);
    ctx.textAlign = "left";
    ctx.fillStyle = "#f4f3fa";
    ctx.fillText(ch.name, tx, y + c.h / 2 - F(5));
    // status
    const sendT = 2.5 + i * 0.2;
    font(600, 8.5, mono);
    ctx.textAlign = "right";
    let status = "";
    let col = "150,146,175";
    if (replied) {
      status = "↩ REPLIED";
      col = GREEN;
    } else if (clock > sendT + 0.7) {
      status = "✓✓ DELIVERED";
      col = i === 0 ? "110,170,255" : "150,146,175";
    } else if (clock > sendT) status = "SENDING…";
    ctx.fillStyle = `rgba(${col},1)`;
    ctx.fillText(status, x + c.w - 14, y + c.h / 2 - F(5));
    // typed message
    font(400, 11.5);
    ctx.textAlign = "left";
    const full = fit(ch.msg, tw);
    const typed = Math.floor(seg(clock, 1.3 + i * 0.22, 1.1) * full.length);
    ctx.fillStyle = "#a9a6bb";
    const caret =
      typed < full.length && clock > 1.3 + i * 0.22 && Math.floor(clock * 3) % 2
        ? "▍"
        : "";
    ctx.fillText(full.slice(0, typed) + caret, tx, y + c.h / 2 + F(13));
    ctx.restore();
  }

  function drawLead() {
    const { x, y, r } = L.lead;
    const a = eb(seg(clock, 3.1, 0.7)) * (1 - seg(clock, 12.3, 0.6));
    if (a <= 0.01) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(a, a);
    for (const k of [5.7, 9.9]) {
      const ph = seg(clock, k, 1.1);
      if (ph > 0 && ph < 1) {
        ctx.globalAlpha = (1 - ph) * 0.7 * g;
        ctx.strokeStyle = `rgba(${GREEN},1)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, r + ph * 30, 0, TAU);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = g;
    // backplate
    const gr = ctx.createLinearGradient(-r, -r, r, r);
    gr.addColorStop(0, avatar ? "#8d88ff" : "#f1c9ff");
    gr.addColorStop(1, avatar ? "#3a3290" : "#7f78f5");
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, TAU);
    ctx.fillStyle = gr;
    ctx.fill();
    if (avatar) {
      // 3D character pops out of the top of the disc
      const talking = clock > 6.7 && clock < 8.7 ? 1 : 0;
      const booking = seg(clock, 9.5, 0.6) * (1 - seg(clock, 12.4, 0.4));
      avatar.update({
        t: clock,
        yaw: L.portrait ? 0 : clock < 5.6 ? -0.34 : booking ? -0.26 : 0,
        pitch: L.portrait && clock < 5.6 ? -0.22 : 0,
        talk: talking,
        smile: 0.25 + 0.5 * seg(clock, 6.6, 0.6) + 0.25 * seg(clock, 11.4, 0.5),
      });
      avatar.render();
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI);
      ctx.rect(-r * 1.7, -r * 3.2, r * 3.4, r * 3.2);
      ctx.clip();
      const S = r * 3.5;
      ctx.drawImage(avatar.canvas, -S / 2, -S / 2 - r * 0.22, S, S);
      ctx.restore();
    } else {
      ctx.fillStyle = "#2a1f4d";
      font(700, 19);
      ctx.textAlign = "center";
      ctx.fillText("D", 0, r * 0.3);
    }
    ctx.strokeStyle = "rgba(255,255,255,.4)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, TAU);
    ctx.stroke();
    ctx.fillStyle = "#1b1a26";
    ctx.strokeStyle = `rgba(${GREEN},1)`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(r * 0.72, r * 0.72, 6, 0, TAU);
    ctx.fillStyle = `rgba(${GREEN},1)`;
    ctx.fill();
    ctx.restore();
    ctx.globalAlpha = a * g;
    font(600, 12);
    ctx.fillStyle = "#f4f3fa";
    if (L.portrait) {
      ctx.textAlign = "left";
      ctx.fillText("Dana R.", x + r + 14, y - 2);
      font(500, 9.5, mono);
      ctx.fillStyle = "#8f8ba3";
      ctx.fillText("OPERATIONS DIRECTOR", x + r + 14, y + F(14));
    } else {
      ctx.textAlign = "center";
      ctx.fillText("Dana R.", x, y + r + 24);
      font(500, 9, mono);
      ctx.fillStyle = "#8f8ba3";
      ctx.fillText("OPERATIONS DIRECTOR", x, y + r + 24 + F(15));
    }
  }

  function drawReply() {
    const a = eo(seg(clock, 5.7, 0.4)) * (1 - seg(clock, 9.0, 0.5));
    if (a <= 0.01) return;
    const bw = L.portrait ? 330 : 250;
    const bh = L.portrait ? 46 : 54;
    const bx = Math.max(14, Math.min(L.lead.x - bw + 44, L.W - 14 - bw));
    const by = L.lead.y - L.lead.r * 1.8 - bh - (L.portrait ? 16 : 30);
    ctx.save();
    ctx.globalAlpha = a * g;
    const lift = (1 - eo(seg(clock, 5.7, 0.5))) * 10;
    ctx.translate(0, lift);
    ctx.shadowColor = "rgba(0,0,0,.5)";
    ctx.shadowBlur = 20;
    rr(bx, by, bw, bh, 16);
    ctx.fillStyle = "#322d52";
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = `rgba(${PURPLE},.7)`;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(L.lead.x - 10, by + bh);
    ctx.lineTo(L.lead.x - 2, by + bh + 12);
    ctx.lineTo(L.lead.x + 8, by + bh);
    ctx.fillStyle = "#322d52";
    ctx.fill();
    if (clock < 6.7) {
      for (let k = 0; k < 3; k++) {
        ctx.globalAlpha =
          a * g * (0.35 + 0.65 * Math.max(0, Math.sin(clock * 8 - k * 0.9)));
        ctx.fillStyle = "#e9e5ff";
        ctx.beginPath();
        ctx.arc(bx + bw / 2 + (k - 1) * 14, by + bh / 2, 3.4, 0, TAU);
        ctx.fill();
      }
    } else {
      ctx.globalAlpha = a * g * eo(seg(clock, 6.7, 0.25));
      font(500, 13);
      ctx.fillStyle = "#fff";
      ctx.textAlign = "left";
      ctx.fillText(
        fit("Sounds great! Can we talk Thursday?", bw - 28),
        bx + 16,
        by + bh / 2 + F(4.5),
      );
    }
    ctx.restore();
    // reply counter
    const ca = eo(seg(clock, 8.0, 0.4)) * (1 - seg(clock, 9.0, 0.4));
    if (ca > 0.01) {
      ctx.globalAlpha = ca * g;
      font(600, 9.5, mono);
      const label = L.portrait ? "3 REPLIES" : "3 REPLIES · 3 CHANNELS";
      const pw = ctx.measureText(label).width + 26;
      const px = L.portrait ? L.W - 14 - pw : bx + bw - pw;
      const py = L.portrait ? by + (bh - 24) / 2 : by - 34;
      rr(px, py, pw, 24, 12);
      ctx.fillStyle = `rgba(${GREEN},.16)`;
      ctx.fill();
      ctx.strokeStyle = `rgba(${GREEN},.6)`;
      ctx.stroke();
      ctx.fillStyle = `rgba(${GREEN},1)`;
      ctx.textAlign = "left";
      ctx.fillText(label, px + 13, py + 15.5);
    }
  }

  function chipRect(k) {
    const b = L.book;
    const cw = (b.w - 24 - 20) / 3;
    return { x: b.x + 22 + k * (cw + 10), y: b.y + b.h - 112, w: cw, h: 52 };
  }
  function drawBooking() {
    const a = eo(seg(clock, 9.5, 0.7)) * (1 - seg(clock, 12.6, 0.6));
    if (a <= 0.01) return;
    const b = L.book;
    const sc = lerp(0.94, 1, eo(seg(clock, 9.5, 0.7)));
    ctx.save();
    ctx.globalAlpha = a * g;
    ctx.translate(b.x + b.w / 2, b.y + b.h / 2);
    ctx.scale(sc, sc);
    ctx.translate(-(b.x + b.w / 2), -(b.y + b.h / 2));
    ctx.shadowColor = "rgba(0,0,0,.55)";
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 16;
    const fill = ctx.createLinearGradient(0, b.y, 0, b.y + b.h);
    fill.addColorStop(0, "#1e1c2e");
    fill.addColorStop(1, "#141320");
    rr(b.x, b.y, b.w, b.h, 20);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = "rgba(179,172,255,.3)";
    ctx.stroke();
    // header
    ctx.fillStyle = "#6a60ea";
    rr(b.x + 22, b.y + 20, 26, 26, 8);
    ctx.fill();
    ctx.fillStyle = "#fff";
    for (let i = 0; i < 4; i++)
      (rr(b.x + 29 + (i % 2) * 8, b.y + 27 + ((i / 2) | 0) * 8, 6, 6, 2),
        ctx.fill());
    font(600, 10, mono);
    ctx.textAlign = "left";
    ctx.fillStyle = "#cfcbe2";
    ctx.fillText("AI ASSISTANT · SCHEDULING", b.x + 60, b.y + 38);
    // bubble
    const msg = "Perfect, Dana. Pick a time that suits you:";
    font(500, 13.5);
    const typed = Math.floor(seg(clock, 10.0, 0.9) * msg.length);
    ctx.fillStyle = "#f4f3fa";
    ctx.fillText(fit(msg, b.w - 44).slice(0, typed), b.x + 22, b.y + 78);
    // slots
    const sel = seg(clock, 11.5, 0.35);
    for (let k = 0; k < 3; k++) {
      const r = chipRect(k);
      const ca = eo(seg(clock, 10.9 + k * 0.14, 0.45));
      const picked = k === 1;
      const flown = picked && clock > 12.5;
      if (flown) continue;
      ctx.globalAlpha = a * g * ca * (picked ? 1 : 1 - 0.55 * sel);
      rr(r.x, r.y + (1 - ca) * 10, r.w, r.h, 12);
      ctx.fillStyle =
        picked && sel > 0
          ? `rgba(${GREEN},${0.12 + 0.12 * sel})`
          : "rgba(255,255,255,.05)";
      ctx.fill();
      ctx.strokeStyle =
        picked && sel > 0
          ? `rgba(${GREEN},${0.35 + 0.65 * sel})`
          : "rgba(255,255,255,.14)";
      ctx.stroke();
      ctx.textAlign = "center";
      font(600, 8.5, mono);
      ctx.fillStyle = picked && sel > 0 ? `rgba(${GREEN},1)` : "#8f8ba3";
      ctx.fillText(SLOTS[k][0], r.x + r.w / 2, r.y + 20 + (1 - ca) * 10);
      font(600, 13);
      ctx.fillStyle = "#fff";
      ctx.fillText(SLOTS[k][1], r.x + r.w / 2, r.y + 38 + (1 - ca) * 10);
      if (picked) {
        const ph = seg(clock, 11.5, 0.8);
        if (ph > 0 && ph < 1) {
          ctx.globalAlpha = (1 - ph) * 0.6 * a * g;
          ctx.strokeStyle = `rgba(${GREEN},1)`;
          ctx.beginPath();
          ctx.arc(r.x + r.w / 2, r.y + r.h / 2, 6 + ph * 34, 0, TAU);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = a * g * eo(seg(clock, 12.0, 0.4));
    font(600, 10.5, mono);
    ctx.textAlign = "left";
    ctx.fillStyle = `rgba(${GREEN},1)`;
    ctx.fillText("✓ MEETING CONFIRMED · THU 2:30 PM", b.x + 22, b.y + b.h - 28);
    ctx.restore();
  }

  function calGeom() {
    const c = L.cal;
    const gut = 56;
    const top = 92;
    const cw = (c.w - gut - 20) / 5;
    const rh = (c.h - top - 18) / 5;
    return {
      c,
      gut,
      top,
      cw,
      rh,
      cell: (col, row) => ({
        x: c.x + gut + col * cw,
        y: c.y + top + row * rh,
      }),
    };
  }
  function eventRect(G, col, row) {
    const p = G.cell(col, row);
    return { x: p.x + 4, y: p.y + 4, w: G.cw - 8, h: G.rh - 8 };
  }
  function drawEvent(r, main, k, a) {
    ctx.save();
    ctx.globalAlpha = clamp(a) * g;
    rr(r.x, r.y, r.w, r.h, 9);
    ctx.fillStyle = main ? `rgba(${GREEN},.22)` : `rgba(${PURPLE},.2)`;
    ctx.fill();
    ctx.strokeStyle = main ? `rgba(${GREEN},.9)` : `rgba(${PURPLE},.45)`;
    ctx.lineWidth = main ? 1.4 : 1;
    ctx.stroke();
    ctx.fillStyle = main ? `rgba(${GREEN},1)` : `rgba(${PURPLE},1)`;
    rr(r.x + 5, r.y + 6, 3, r.h - 12, 2);
    ctx.fill();
    if (main) {
      ctx.textAlign = "left";
      font(700, 10.5);
      ctx.fillStyle = "#eafff7";
      ctx.fillText(
        fit(r.w > 90 ? "Strategy call" : "Call", r.w - 22),
        r.x + 14,
        r.y + r.h / 2 - F(1),
      );
      font(500, 8.5, mono);
      ctx.fillStyle = `rgba(${GREEN},1)`;
      ctx.fillText("2:30 PM", r.x + 14, r.y + r.h / 2 + F(11));
    } else {
      ctx.fillStyle = "rgba(255,255,255,.4)";
      rr(
        r.x + 14,
        r.y + r.h / 2 - 5,
        (r.w - 26) * (0.5 + ((k * 37) % 5) / 12),
        3.5,
        2,
      );
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.2)";
      rr(r.x + 14, r.y + r.h / 2 + 4, (r.w - 26) * 0.38, 3.5, 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawCalendar() {
    const pa = eo(seg(clock, 12.6, 0.8));
    if (pa <= 0.01) return;
    const G = calGeom();
    const { c } = G;
    ctx.save();
    ctx.translate(c.x + c.w / 2, c.y + c.h / 2);
    const sc = lerp(0.95, 1, pa);
    ctx.scale(sc, sc);
    ctx.translate(-(c.x + c.w / 2), -(c.y + c.h / 2));
    ctx.globalAlpha = pa * g;
    ctx.shadowColor = "rgba(0,0,0,.55)";
    ctx.shadowBlur = 44;
    ctx.shadowOffsetY = 18;
    const fill = ctx.createLinearGradient(0, c.y, 0, c.y + c.h);
    fill.addColorStop(0, "#1c1a2b");
    fill.addColorStop(1, "#12111c");
    rr(c.x, c.y, c.w, c.h, 22);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = "rgba(179,172,255,.28)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // header left: week label -> synced badges
    const syncA = eo(seg(clock, 16.6, 0.5));
    font(600, 10.5, mono);
    ctx.textAlign = "left";
    ctx.globalAlpha = pa * g * (1 - syncA);
    ctx.fillStyle = "#cfcbe2";
    ctx.fillText("THIS WEEK", c.x + 24, c.y + 36);
    ctx.globalAlpha = pa * g * syncA;
    ctx.fillStyle = "#4285f4";
    ctx.beginPath();
    ctx.arc(c.x + 28, c.y + 32, 4.5, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#38b6ff";
    ctx.beginPath();
    ctx.arc(c.x + 42, c.y + 32, 4.5, 0, TAU);
    ctx.fill();
    ctx.fillStyle = `rgba(${GREEN},1)`;
    ctx.fillText(
      L.portrait ? "SYNCED" : "SYNCED · GOOGLE + OUTLOOK",
      c.x + 54,
      c.y + 36,
    );
    ctx.globalAlpha = pa * g;
    // counter
    const n =
      6 + (clock > BOOK_AT ? 1 : 0) + POP_AT.filter((x) => clock > x).length;
    const last = Math.max(BOOK_AT, ...POP_AT.filter((x) => clock > x));
    const bump =
      clock > BOOK_AT ? 1 + 0.3 * Math.max(0, 1 - (clock - last) / 0.3) : 1;
    ctx.textAlign = "right";
    font(500, 8.5, mono);
    ctx.fillStyle = "#8f8ba3";
    ctx.fillText("MEETINGS THIS MONTH", c.x + c.w - 24 - F(34), c.y + 34);
    ctx.save();
    ctx.translate(c.x + c.w - 24, c.y + 38);
    ctx.scale(bump, bump);
    font(700, 26);
    ctx.fillStyle = clock > BOOK_AT ? `rgba(${GREEN},1)` : "#fff";
    ctx.fillText(String(n), 0, 0);
    ctx.restore();

    // day headers + grid
    font(600, 9.5, mono);
    ctx.textAlign = "center";
    DAYS.forEach(([d, n2], col) => {
      const p = G.cell(col, 0);
      const thu = col === 3;
      ctx.fillStyle = thu ? "#fff" : "#8f8ba3";
      ctx.fillText(`${d} ${n2}`, p.x + G.cw / 2, c.y + G.top - 12);
    });
    ctx.strokeStyle = "rgba(255,255,255,.07)";
    ctx.lineWidth = 1;
    ctx.textAlign = "right";
    font(500, 8.5, mono);
    ROWS.forEach((r, row) => {
      const y = c.y + G.top + row * G.rh;
      ctx.beginPath();
      ctx.moveTo(c.x + G.gut - 6, y);
      ctx.lineTo(c.x + c.w - 14, y);
      ctx.stroke();
      ctx.fillStyle = "#6f6b84";
      ctx.fillText(r, c.x + G.gut - 12, y + 14);
    });
    for (let col = 0; col <= 5; col++) {
      const x = c.x + G.gut + col * G.cw;
      ctx.beginPath();
      ctx.moveTo(x, c.y + G.top);
      ctx.lineTo(x, c.y + G.top + 5 * G.rh);
      ctx.stroke();
    }
    // Thursday column highlight
    const th = G.cell(3, 0);
    ctx.fillStyle = `rgba(${PURPLE},.06)`;
    ctx.fillRect(th.x, c.y + G.top, G.cw, 5 * G.rh);

    // pop-in meetings
    POPS.forEach(([col, row], k) => {
      const e = seg(clock, POP_AT[k], 0.45);
      if (e <= 0) return;
      const r = eventRect(G, col, row);
      const sc2 = eb(e);
      const cx = r.x + r.w / 2;
      const cy = r.y + r.h / 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(sc2, sc2);
      ctx.translate(-cx, -cy);
      drawEvent(r, false, k, e);
      ctx.restore();
    });
    // the booked meeting
    const er = eventRect(G, 3, 3);
    if (clock > BOOK_AT) {
      const e = seg(clock, BOOK_AT, 0.4);
      drawEvent(er, true, 0, e);
      const ph = seg(clock, BOOK_AT, 1.1);
      if (ph < 1) {
        ctx.globalAlpha = (1 - ph) * 0.7 * g;
        ctx.strokeStyle = `rgba(${GREEN},1)`;
        ctx.lineWidth = 1.5;
        rr(
          er.x - ph * 14,
          er.y - ph * 14,
          er.w + ph * 28,
          er.h + ph * 28,
          9 + ph * 10,
        );
        ctx.stroke();
      }
    }
    // toast
    const ta = eo(seg(clock, 13.7, 0.4)) * (1 - seg(clock, 16.2, 0.4));
    if (ta > 0.01) {
      const tw = L.portrait ? 236 : 262;
      const tx = c.x + c.w - tw - 18;
      const ty = c.y + c.h - 62 + (1 - ta) * 12;
      ctx.globalAlpha = ta * g;
      ctx.shadowColor = "rgba(0,0,0,.6)";
      ctx.shadowBlur = 26;
      rr(tx, ty, tw, 48, 13);
      ctx.fillStyle = "#1f2430";
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.strokeStyle = "rgba(96,219,176,.45)";
      ctx.stroke();
      ctx.fillStyle = "rgba(96,219,176,.18)";
      ctx.beginPath();
      ctx.arc(tx + 26, ty + 24, 13, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = `rgba(${GREEN},1)`;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(tx + 20, ty + 24);
      ctx.lineTo(tx + 25, ty + 29);
      ctx.lineTo(tx + 33, ty + 19);
      ctx.stroke();
      ctx.textAlign = "left";
      font(600, 12);
      ctx.fillStyle = "#fff";
      ctx.fillText("New meeting booked", tx + 50, ty + 21);
      font(500, 9, mono);
      ctx.fillStyle = "#8f8ba3";
      ctx.fillText("Thu 2:30 PM · Qualified lead", tx + 50, ty + 36);
    }
    ctx.restore();

    // chip flying into its calendar slot
    const fp = seg(clock, 12.45, 0.95);
    if (fp > 0 && fp < 1) {
      const from = chipRect(1);
      const to = eventRect(G, 3, 3);
      const e = eio(fp);
      const x = lerp(from.x, to.x, e);
      const y = lerp(from.y, to.y, e) - Math.sin(e * Math.PI) * 46;
      ctx.save();
      ctx.globalAlpha = g;
      ctx.shadowColor = `rgba(${GREEN},.6)`;
      ctx.shadowBlur = 24;
      rr(x, y, lerp(from.w, to.w, e), lerp(from.h, to.h, e), 12);
      ctx.fillStyle = `rgba(${GREEN},.3)`;
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.strokeStyle = `rgba(${GREEN},1)`;
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawProgress() {
    const y = L.H - 30;
    const x0 = 40;
    const gap = 10;
    const sw = (L.W - 80 - gap * 3) / 4;
    ctx.globalAlpha = g;
    STAGES.forEach(([n, name, a, b], i) => {
      const x = x0 + i * (sw + gap);
      const p = seg(clock, a, b - a);
      const active = clock >= a && clock < b;
      ctx.fillStyle = "rgba(255,255,255,.1)";
      rr(x, y, sw, 3, 2);
      ctx.fill();
      ctx.fillStyle = i === 3 ? `rgba(${GREEN},1)` : `rgba(${PURPLE},1)`;
      rr(x, y, sw * p, 3, 2);
      ctx.fill();
      font(600, 9.5, mono);
      ctx.textAlign = "left";
      ctx.fillStyle = active ? "#fff" : p >= 1 ? "#b9b5cc" : "#6a667d";
      ctx.fillText(L.portrait ? n : `${n}  ${name}`, x, y - 10);
    });
  }

  function frame(t, dt, _box, silent) {
    if (!w) return;
    if (dt === 0) clock = 15.4;
    else clock = (clock + dt) % DUR;
    if (silent) return;
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.translate(ox, (h - L.H * s) / 2);
    ctx.scale(s, s);
    g = seg(clock, 0, 0.5) * (1 - seg(clock, 18.2, 0.8));
    ctx.globalAlpha = g;
    // connectors
    CHANNELS.forEach((ch, i) => {
      const hp = hubPath(L, i);
      const t0 = 0.5 + i * 0.22;
      curve(
        hp,
        0,
        eo(seg(clock, t0, 0.8)),
        PURPLE,
        0.4 * (1 - seg(clock, 9, 0.6)),
      );
      const lp = leadPath(L, i);
      const keep = ch.reply ? 1 : 1 - 0.7 * seg(clock, 6.6, 0.8);
      curve(
        lp,
        0,
        eo(seg(clock, 3.0 + i * 0.18, 1.3)),
        PURPLE,
        0.3 * keep * (1 - seg(clock, 9, 0.6)),
      );
      packet(
        lp,
        seg(clock, 3.0 + i * 0.18, 1.3),
        PURPLE,
        1 - seg(clock, 9, 0.4),
      );
      if (ch.reply)
        packet(
          lp,
          1 - seg(clock, 6.8 + i * 0.2, 1.0),
          GREEN,
          1 - seg(clock, 9, 0.4),
        );
      packet(
        hp,
        seg(clock, 1.2 + i * 0.22, 1.0),
        PURPLE,
        1 - seg(clock, 4, 0.5),
      );
    });
    drawHub();
    CHANNELS.forEach((_, i) => drawCard(i));
    drawLead();
    drawReply();
    drawBooking();
    drawCalendar();
    drawProgress();
    ctx.restore();
  }

  return {
    resize,
    frame,
    seek: (v) => (clock = v),
    destroy() {
      dead = true;
      avatar?.dispose();
      avatar = null;
    },
  };
}
