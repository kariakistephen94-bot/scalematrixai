"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

const BOOKING_URL =
  "https://calendly.com/kariakistephen/30min?background_color=121215&text_color=f4f4f7&primary_color=8d88ff";

export default function CalendlyBooking() {
  const container = useRef(null);
  const [active, setActive] = useState(false);
  const [prefill, setPrefill] = useState({});
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    const activate = (event) => {
      setPrefill(event.detail || {});
      setActive(true);
    };
    window.addEventListener("scalematrix:booking", activate);
    return () => window.removeEventListener("scalematrix:booking", activate);
  }, []);

  useEffect(() => {
    if (!active || !ready || !container.current || !window.Calendly) return;
    const parentElement = container.current;
    window.Calendly.initInlineWidget({
      url: BOOKING_URL,
      parentElement,
      prefill,
      resize: true,
    });

    const handleBooking = (event) => {
      const iframe = parentElement.querySelector("iframe");
      if (
        event.origin === "https://calendly.com" &&
        iframe &&
        event.source === iframe.contentWindow &&
        event.data?.event === "calendly.event_scheduled"
      ) {
        setBooked(true);
      }
    };
    window.addEventListener("message", handleBooking);
    return () => {
      window.removeEventListener("message", handleBooking);
      parentElement.replaceChildren();
    };
  }, [active, ready, prefill]);

  return (
    <div className="calendly-booking">
      <p className="booking-description">
        Pick a time for your 30-minute strategy call. Complete your booking
        right here—no need to leave the page.
      </p>
      {booked && (
        <p className="booking-confirmation" role="status">
          Your call is booked. Calendly will email your confirmation and meeting
          details.
        </p>
      )}
      {active && (
        <>
          <Script
            src="https://assets.calendly.com/assets/external/widget.js"
            strategy="afterInteractive"
            onReady={() => setReady(true)}
            onError={() => setFailed(true)}
          />
          {!ready && !failed && (
            <p className="booking-loading" role="status">
              Loading available times…
            </p>
          )}
          <div
            ref={container}
            className="calendly-inline-container"
            aria-label="Book a 30-minute ScaleMatrix AI strategy call"
          />
          {failed && (
            <p className="booking-loading" role="alert">
              The calendar couldn’t load. Please refresh, or use the booking
              link below.
            </p>
          )}
        </>
      )}
      <p className="booking-fallback">
        Calendar not showing?{" "}
        <a
          href="https://calendly.com/kariakistephen/30min"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open the booking calendar
        </a>
      </p>
    </div>
  );
}
