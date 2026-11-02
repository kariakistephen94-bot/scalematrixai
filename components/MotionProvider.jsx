"use client";

import { useEffect } from "react";
import { initMotion } from "../lib/motion/index.js";

export default function MotionProvider() {
  useEffect(() => initMotion(), []);
  return null;
}
