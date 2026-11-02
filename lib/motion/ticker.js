// One requestAnimationFrame loop shared by smooth scroll, canvases and DOM effects.
const tasks = new Set();
let raf = 0;
let last = 0;

function loop(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  for (const task of tasks) task(now / 1000, dt);
  raf = tasks.size ? requestAnimationFrame(loop) : 0;
}

export function tick(task) {
  tasks.add(task);
  if (!raf) {
    last = performance.now();
    raf = requestAnimationFrame(loop);
  }
  return () => tasks.delete(task);
}
