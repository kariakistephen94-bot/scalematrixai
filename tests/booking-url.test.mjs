import { test } from "node:test";
import assert from "node:assert/strict";
import { createBookingUrl } from "../lib/booking.js";

test("direct calendar frame uses the current public or local embed domain", () => {
  for (const host of [
    "www.scalematrixai.com",
    "scalematrixai.com",
    "127.0.0.1:3000",
  ]) {
    const url = new URL(createBookingUrl(host));
    assert.equal(url.origin, "https://calendly.com");
    assert.equal(url.pathname, "/kariakistephen/30min");
    assert.equal(url.searchParams.get("embed_domain"), host);
    assert.equal(url.searchParams.get("embed_type"), "Inline");
  }
});

test("invitee fields are encoded without changing calendar parameters", () => {
  const url = new URL(
    createBookingUrl("www.scalematrixai.com", {
      name: " Alex & Sam ",
      email: "alex+booking@example.com",
      company: "Private company",
    }),
  );
  assert.equal(url.searchParams.get("name"), "Alex & Sam");
  assert.equal(url.searchParams.get("email"), "alex+booking@example.com");
  assert.equal(url.searchParams.get("embed_type"), "Inline");
  assert.equal(url.searchParams.has("company"), false);
});

test("empty or missing invitee information does not break the calendar", () => {
  for (const details of [undefined, null, {}, { name: 20, email: " " }]) {
    const url = new URL(createBookingUrl("scalematrixai.com", details));
    assert.equal(url.searchParams.has("name"), false);
    assert.equal(url.searchParams.has("email"), false);
  }
});
