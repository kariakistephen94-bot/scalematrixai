import { tick } from "./ticker.js";
import { reducedMotion } from "./input.js";

/**
 * Mounts a scene on a canvas. The scene is { resize(w, h, dpr), frame(t, dt, box) }.
 * Rendering only runs while the canvas is on screen; reduced-motion users get
 * one pre-simulated still frame.
 */
export function mountCanvas(
  canvas,
  createScene,
  { dprMax = 2, ...options } = {},
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};
  const mono =
    getComputedStyle(canvas).getPropertyValue("--font-mono").trim() ||
    "ui-monospace, monospace";
  const sans =
    getComputedStyle(canvas).getPropertyValue("--font-sans").trim() ||
    "system-ui, sans-serif";
  const scene = createScene(ctx, {
    mono,
    sans,
    redraw: () => still && renderStill(),
    ...options,
  });
  const still = reducedMotion();
  let visible = false;
  let stop = null;
  let clock = 0;
  let box = canvas.getBoundingClientRect();

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, dprMax);
    box = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(box.width));
    const h = Math.max(1, Math.round(box.height));
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    scene.resize(w, h, dpr);
    if (still) renderStill();
  };

  function renderStill() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 360; i++)
      scene.frame((clock += 1 / 60), 1 / 60, box, true);
    scene.frame(clock, 0, box, false);
  }

  const run = () => {
    if (stop || still) return;
    stop = tick((t, dt) => {
      box = canvas.getBoundingClientRect();
      scene.frame(t, dt, box, false);
    });
  };
  const halt = () => {
    stop?.();
    stop = null;
  };

  const resizer = new ResizeObserver(resize);
  resizer.observe(canvas);
  const watcher = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      visible ? run() : halt();
    },
    { rootMargin: "120px" },
  );
  watcher.observe(canvas);
  resize();

  return () => {
    halt();
    resizer.disconnect();
    watcher.disconnect();
    scene.destroy?.();
  };
}

/** Pre-rendered soft glow sprite so thousands of glows cost one drawImage each. */
export function glowSprite(rgb, size = 64) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  grad.addColorStop(0, `rgba(${rgb},1)`);
  grad.addColorStop(0.25, `rgba(${rgb},.45)`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}
