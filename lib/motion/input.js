// Shared pointer + scroll state read by every scene.
export const pointer = { x: -9999, y: -9999, active: false, fine: false };
export const scroll = { y: 0, velocity: 0, direction: 1, limit: 1, vh: 800 };

export const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (t) => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};
export const ease = (t) => {
  const x = clamp(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

let listening = false;
export function listenPointer() {
  if (listening) return () => {};
  listening = true;
  const controller = new AbortController();
  const { signal } = controller;
  pointer.fine = window.matchMedia("(pointer: fine)").matches;
  window.addEventListener(
    "pointermove",
    (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = e.pointerType !== "touch";
    },
    { signal, passive: true },
  );
  document.documentElement.addEventListener(
    "pointerleave",
    () => (pointer.active = false),
    { signal },
  );
  return () => {
    controller.abort();
    listening = false;
  };
}
