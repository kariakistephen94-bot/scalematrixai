"use client";

import { useEffect, useRef } from "react";
import { mountCanvas } from "../lib/motion/canvas.js";
import { createOutreach } from "../lib/scenes/outreach.js";

/**
 * The hero film: outreach on every channel -> a lead replies -> the meeting is
 * booked -> it lands in the calendar. The whole card opens the video dialog.
 */
export default function Console() {
  const canvas = useRef(null);
  useEffect(() => mountCanvas(canvas.current, createOutreach), []);

  return (
    <button
      className="console"
      id="play"
      aria-label="Open ScaleMatrix AI video preview"
      data-scrub
    >
      <canvas ref={canvas} aria-hidden="true" />
      <span className="c-top">
        <span className="c-brand">
          <span className="matrix">▦</span>
          SCALEMATRIX AI
        </span>
        <span className="c-play">
          <span className="playcircle">▶</span>
          WATCH FULL VIDEO
          <small>04:00</small>
        </span>
      </span>
    </button>
  );
}
