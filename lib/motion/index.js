import Lenis from "lenis";
import { tick } from "./ticker.js";
import {
  pointer,
  scroll,
  listenPointer,
  reducedMotion,
  clamp,
} from "./input.js";

const all = (selector, root = document) => [...root.querySelectorAll(selector)];

/**
 * Site-wide motion: Lenis smooth scroll, reveal-on-view, counters, scroll
 * scrubbing, parallax, velocity marquee, magnetic buttons and spotlight cards.
 * Everything is torn down by the returned cleanup (React strict-mode safe).
 */
export function initMotion() {
  const html = document.documentElement;
  const reduced = reducedMotion();
  const cleanups = [listenPointer()];
  const header = document.querySelector(".site-header");

  const setHeader = (y, hidden) => {
    if (!header) return;
    header.dataset.scrolled = String(y > 24);
    header.dataset.hidden = String(hidden);
  };

  // Reduced motion: no smooth scroll, no scrubbing; only header + progress.
  if (reduced) {
    const onScroll = () => {
      scroll.y = window.scrollY;
      html.style.setProperty(
        "--page",
        String(clamp(scroll.y / Math.max(1, html.scrollHeight - innerHeight))),
      );
      setHeader(scroll.y, false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    html.classList.add("ready");
    return () => {
      window.removeEventListener("scroll", onScroll);
      cleanups.forEach((fn) => fn());
    };
  }

  // ---- smooth scroll ------------------------------------------------------
  const lenis = new Lenis({
    lerp: 0.085,
    wheelMultiplier: 0.9,
    anchors: { offset: -64 },
  });
  window.lenis = lenis;
  cleanups.push(() => {
    lenis.destroy();
    delete window.lenis;
  });

  // Dialogs own the wheel while open.
  const dialogs = all("dialog");
  const syncDialogs = () =>
    dialogs.some((d) => d.open) ? lenis.stop() : lenis.start();
  const dialogWatch = new MutationObserver(syncDialogs);
  dialogs.forEach((d) => dialogWatch.observe(d, { attributes: true }));
  cleanups.push(() => dialogWatch.disconnect());

  // ---- reveal + counters --------------------------------------------------
  all("[data-stagger]").forEach((parent) =>
    all("[data-reveal]", parent).forEach((el, i) =>
      el.style.setProperty("--d", `${i * 90}ms`),
    ),
  );
  const stops = new Set();
  const runCount = (el) => {
    const to = Number(el.dataset.count);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const start = performance.now();
    const stop = tick(() => {
      const k = clamp((performance.now() - start) / 1900);
      el.textContent = `${prefix}${Math.round(to * (1 - (1 - k) ** 4)).toLocaleString("en-US")}${suffix}`;
      if (k >= 1) {
        stop();
        stops.delete(stop);
      }
    });
    stops.add(stop);
  };
  const counters = all("[data-count]");
  counters.forEach((el) => {
    if (!el.dataset.counted)
      el.textContent = `${el.dataset.prefix || ""}0${el.dataset.suffix || ""}`;
  });
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target;
        io.unobserve(el);
        el.classList.add("in");
        if (el.dataset.count) {
          el.dataset.counted = "1";
          runCount(el);
        }
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
  );
  all("[data-reveal], [data-count]").forEach((el) => io.observe(el));
  cleanups.push(() => {
    io.disconnect();
    stops.forEach((stop) => stop());
  });

  // ---- pointer effects ----------------------------------------------------
  const ctl = new AbortController();
  const opt = { signal: ctl.signal };
  cleanups.push(() => ctl.abort());

  all("[data-spot]").forEach((el) =>
    el.addEventListener(
      "pointermove",
      (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      },
      { ...opt, passive: true },
    ),
  );

  const magnets = [];
  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  glow.setAttribute("aria-hidden", "true");
  if (pointer.fine) {
    document.body.append(glow);
    cleanups.push(() => glow.remove());
    all("[data-magnetic]").forEach((el) => {
      const m = { el, tx: 0, ty: 0, x: 0, y: 0 };
      magnets.push(m);
      el.addEventListener(
        "pointermove",
        (e) => {
          const r = el.getBoundingClientRect();
          m.tx = (e.clientX - (r.left + r.width / 2)) * 0.22;
          m.ty = (e.clientY - (r.top + r.height / 2)) * 0.3;
        },
        { ...opt, passive: true },
      );
      el.addEventListener("pointerleave", () => (m.tx = m.ty = 0), opt);
    });
  }

  // ---- per-frame scroll work ---------------------------------------------
  const scrubs = all("[data-scrub]");
  const parallax = all("[data-parallax]");
  const marquees = all("[data-marquee]").map((el) => ({
    el,
    track: el.firstElementChild,
    dir: Number(el.dataset.dir || -1),
    x: 0,
    w: 1,
  }));
  const measure = () => {
    scroll.vh = innerHeight;
    scroll.limit = Math.max(1, html.scrollHeight - innerHeight);
    marquees.forEach((m) => (m.w = m.track.scrollWidth / 2 || 1));
  };
  measure();
  const sizer = new ResizeObserver(measure);
  sizer.observe(document.body);
  cleanups.push(() => sizer.disconnect());

  let lastY = 0;
  let hideAcc = 0;
  let cx = 0;
  let cy = 0;
  const stopFrame = tick((t, dt) => {
    lenis.raf(t * 1000);
    scroll.y = lenis.scroll;
    scroll.velocity = lenis.velocity;
    scroll.direction = lenis.direction || scroll.direction;
    const vh = scroll.vh;

    // reads first
    const scrubRects = scrubs.map((el) => el.getBoundingClientRect());
    const parallaxRects = parallax.map((el) => el.getBoundingClientRect());

    html.style.setProperty("--page", String(clamp(scroll.y / scroll.limit)));
    html.style.setProperty("--hero", String(clamp(scroll.y / (vh * 0.9))));

    hideAcc = clamp(hideAcc + (scroll.y - lastY) / 140, -1, 1);
    if (scroll.y < 120) hideAcc = -1;
    lastY = scroll.y;
    setHeader(scroll.y, hideAcc > 0.6 && scroll.y > 500);

    scrubs.forEach((el, i) => {
      const r = scrubRects[i];
      const sp = clamp((vh * 0.98 - r.top) / (vh * 0.62));
      el.style.setProperty("--sp", sp.toFixed(4));
    });
    parallax.forEach((el, i) => {
      const r = parallaxRects[i];
      const speed = Number(el.dataset.parallax);
      el.style.translate = `0 ${((r.top + r.height / 2 - vh / 2) * -speed).toFixed(1)}px`;
    });

    marquees.forEach((m) => {
      m.x += m.dir * (46 + Math.abs(scroll.velocity) * 22) * dt;
      if (m.x <= -m.w) m.x += m.w;
      if (m.x > 0) m.x -= m.w;
      const skew = clamp(-scroll.velocity * 0.4, -9, 9);
      m.track.style.transform = `translate3d(${m.x.toFixed(1)}px,0,0) skewX(${skew.toFixed(2)}deg)`;
    });

    magnets.forEach((m) => {
      m.x += (m.tx - m.x) * 0.16;
      m.y += (m.ty - m.y) * 0.16;
      m.el.style.translate = `${m.x.toFixed(2)}px ${m.y.toFixed(2)}px`;
    });

    if (pointer.fine) {
      cx += (pointer.x - cx) * 0.12;
      cy += (pointer.y - cy) * 0.12;
      glow.style.transform = `translate3d(${cx - 300}px,${cy - 300}px,0)`;
      glow.style.opacity = pointer.active ? "1" : "0";
    }
  });
  cleanups.push(stopFrame);

  html.classList.add("ready");
  return () => cleanups.reverse().forEach((fn) => fn());
}
