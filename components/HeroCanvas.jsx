"use client";

import { useEffect, useRef } from "react";
import { mountCanvas } from "../lib/motion/canvas.js";
import { createHeroField } from "../lib/scenes/heroField.js";

export default function HeroCanvas() {
  const ref = useRef(null);
  useEffect(() => mountCanvas(ref.current, createHeroField), []);
  return <canvas ref={ref} className="hero-canvas" aria-hidden="true" />;
}
