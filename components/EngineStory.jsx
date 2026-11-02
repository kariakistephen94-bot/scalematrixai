"use client";

import { useEffect, useRef } from "react";
import { mountCanvas } from "../lib/motion/canvas.js";
import { tick } from "../lib/motion/ticker.js";
import { clamp, reducedMotion } from "../lib/motion/input.js";
import { createStory } from "../lib/scenes/story.js";

const STEPS = [
  {
    icon: "⌕",
    kicker: "01 / SOURCE",
    title: ["Hyper-Targeted", "Sourcing"],
    body: "We find decision-makers who match your ideal customer profile, industry, and market. The right companies. The right people. Your next opportunities.",
    tag: "Your ideal customers, precisely mapped",
    metric: ["PROSPECTS MAPPED", "IDEAL MATCHES"],
  },
  {
    icon: "✧",
    kicker: "02 / CONNECT",
    title: ["AI Personalization", "Engine"],
    body: "Tailored outreach crafted dynamically for each prospect’s company size and location. Personal conversations, at scale.",
    tag: "Built around each prospect",
    metric: ["MESSAGES COMPOSED", "PERSONALIZED 1:1"],
  },
  {
    icon: "▣",
    kicker: "03 / BOOK",
    title: ["Instant Inbound", "Booking"],
    body: "AI handles replies and places booked meetings straight into your Google or Outlook calendar. Your next step: show up.",
    tag: "Straight into your calendar",
    metric: ["MEETINGS BOOKED", "THIS MONTH"],
  },
];

/**
 * Pinned scroll story. The section is tall; the inner stage sticks while the
 * scroll position drives one morphing canvas through the three steps.
 */
export default function EngineStory() {
  const section = useRef(null);
  const canvas = useRef(null);
  const hud = useRef([]);
  const state = useRef({ p: 0 });

  useEffect(() => {
    const el = section.current;
    const s = state.current;
    const still = reducedMotion();
    if (still) s.p = 1;
    let lastStep = -1;
    let last = "";
    const fmt = (n) => n.toLocaleString("en-US");

    const stopCanvas = mountCanvas(canvas.current, createStory, {
      state: s,
      onMetrics(m, step) {
        const values = [
          [m.a, m.b],
          [m.c, m.b],
          [m.d, 12],
        ][step];
        const key = `${step}:${values}`;
        if (key !== last) {
          last = key;
          hud.current[0].textContent = fmt(values[0]);
          hud.current[1].textContent = fmt(values[1]);
        }
        if (step !== lastStep) {
          lastStep = step;
          el.dataset.step = String(step);
        }
      },
    });

    const stopTick = still
      ? () => {}
      : tick(() => {
          const r = el.getBoundingClientRect();
          const range = r.height - innerHeight;
          s.p = clamp(-r.top / Math.max(1, range));
          el.style.setProperty("--story", s.p.toFixed(4));
        });
    return () => {
      stopCanvas();
      stopTick();
    };
  }, []);

  return (
    <section className="story" id="system" ref={section} data-step="0">
      <div className="story-pin">
        <div className="wrap story-grid">
          <div className="story-copy">
            <div className="sectionlabel" data-reveal>
              ONE ENGINE. THREE SIMPLE STEPS.
            </div>
            <h2 data-reveal="lines">
              <span className="ln">
                <span className="li" style={{ "--i": 0 }}>
                  The ScaleMatrix AI
                </span>
              </span>{" "}
              <span className="ln">
                <span className="li" style={{ "--i": 1 }}>
                  <em>Outbound System</em>
                </span>
              </span>
            </h2>
            <p className="sectionintro" data-reveal>
              We build the engine. You show up for the conversation.
            </p>
            <ol className="story-steps">
              {STEPS.map((step, i) => (
                <li key={step.kicker} className="story-step" data-i={i}>
                  <div className="stephead">
                    <span className="stepicon" aria-hidden="true">
                      {step.icon}
                    </span>
                    <small>{step.kicker}</small>
                  </div>
                  <h3>
                    {step.title[0]} <br />
                    {step.title[1]}
                  </h3>
                  <p>{step.body}</p>
                  <div className="steptag">
                    <i></i>
                    {step.tag}
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="story-stage" aria-hidden="true">
            <canvas ref={canvas} />
            <div className="stage-hud">
              {STEPS.map((step, i) => (
                <span key={step.kicker} className="hud-label" data-i={i}>
                  {step.metric[0]}
                </span>
              ))}
              <b ref={(n) => (hud.current[0] = n)}>0</b>
              <span className="hud-sub">
                {STEPS.map((step, i) => (
                  <span key={step.kicker} data-i={i}>
                    {step.metric[1]}
                  </span>
                ))}
                <b ref={(n) => (hud.current[1] = n)}>0</b>
              </span>
            </div>
            <div className="story-rail">
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
