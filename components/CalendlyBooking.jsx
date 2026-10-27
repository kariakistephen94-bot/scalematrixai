"use client";

import { useEffect, useRef, useState } from "react";
import { createBookingUrl } from "../lib/booking.js";

export default function CalendlyBooking() {
  const frame = useRef(null);
  const [url, setUrl] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [delayed, setDelayed] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    const activate = (event) => {
      setLoaded(false);
      setDelayed(false);
      setBooked(false);
      setUrl(createBookingUrl(window.location.host, event.detail));
      setAttempt((value) => value + 1);
    };
    window.addEventListener("scalematrix:booking", activate);
    return () => window.removeEventListener("scalematrix:booking", activate);
  }, []);

  useEffect(() => {
    if (!url || loaded) return;
    const timer = setTimeout(() => setDelayed(true), 15000);
    return () => clearTimeout(timer);
  }, [url, loaded, attempt]);

  useEffect(() => {
    const handleBooking = (event) => {
      if (
        event.origin !== "https://calendly.com" ||
        event.source !== frame.current?.contentWindow
      )
        return;
      if (event.data?.event === "calendly.event_scheduled") setBooked(true);
    };
    window.addEventListener("message", handleBooking);
    return () => window.removeEventListener("message", handleBooking);
  }, []);

  function reloadCalendar() {
    setLoaded(false);
    setDelayed(false);
    setAttempt((value) => value + 1);
  }

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
      {url && (
        <>
          {!loaded && (
            <p className="booking-loading" role="status">
              {delayed
                ? "The calendar is taking longer to load. You can reload it below."
                : "Loading available times…"}
            </p>
          )}
          <div className="calendly-inline-container">
            <iframe
              key={`${url}:${attempt}`}
              ref={frame}
              src={url}
              title="Book a 30-minute ScaleMatrix AI strategy call"
              loading="eager"
              referrerPolicy="strict-origin-when-cross-origin"
              onLoad={() => {
                setLoaded(true);
                setDelayed(false);
              }}
              onError={() => setDelayed(true)}
            />
          </div>
          <div className="booking-help">
            <button
              type="button"
              className="calendar-reload"
              onClick={reloadCalendar}
            >
              Reload calendar
            </button>
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
        </>
      )}
    </div>
  );
}
