import { test } from "node:test";
import assert from "node:assert/strict";
import { initializeLanding } from "../lib/interactions.js";

test("contact details open Calendly even while email is pending or unavailable", async (t) => {
  const originals = {
    document: globalThis.document,
    window: globalThis.window,
    fetch: globalThis.fetch,
  };
  t.after(() => {
    for (const [key, value] of Object.entries(originals)) {
      if (value === undefined) delete globalThis[key];
      else globalThis[key] = value;
    }
  });
  const handlers = new Map();
  const element = () => ({
    hidden: false,
    disabled: false,
    textContent: "",
    innerHTML: "Continue to booking",
    addEventListener(type, handler) {
      handlers.set(this, { ...handlers.get(this), [type]: handler });
    },
    setAttribute() {},
    removeAttribute() {},
  });
  const inputs = Object.fromEntries(
    Object.entries({
      name: "Alex Example",
      email: "alex@example.com",
      phone: "5551234567",
      company: "Example Business",
    }).map(([key, value]) => [key, { value, disabled: false }]),
  );
  const form = { ...element(), elements: inputs, reportValidity: () => true };
  const steps = [0, 1].map((index) => ({
    ...element(),
    querySelectorAll: () => (index === 0 ? Object.values(inputs) : []),
  }));
  const application = { dataset: {}, scrollIntoView() {} };
  const status = element();
  const back = element();
  const selectors = {
    "#apply": form,
    "#application": application,
    "#application-status": status,
    "#greeting": element(),
    "#videomodal": element(),
    "#play": element(),
    "#videoapply": element(),
  };
  globalThis.document = {
    querySelector: (name) => selectors[name],
    querySelectorAll: (name) =>
      name === ".formstep" ? steps : name === ".back" ? [back] : [],
  };
  globalThis.window = new EventTarget();
  globalThis.window.matchMedia = () => ({ matches: true });
  let booking;
  window.addEventListener("scalematrix:booking", (event) => {
    booking = event.detail;
  });
  let finish;
  globalThis.fetch = (path, options) => {
    assert.equal(path, "/api/applications");
    assert.deepEqual(Object.keys(JSON.parse(options.body)), [
      "name",
      "email",
      "phone",
      "company",
    ]);
    return new Promise((resolve) => {
      finish = resolve;
    });
  };
  const cleanup = initializeLanding();
  assert.equal(steps[1].hidden, true);
  const submit = handlers
    .get(form)
    .submit({ preventDefault() {}, submitter: element() });
  assert.equal(
    steps[1].hidden,
    false,
    "calendar opens before email delivery completes",
  );
  assert.equal(application.dataset.booking, "true");
  assert.deepEqual(booking, {
    name: "Alex Example",
    email: "alex@example.com",
  });
  finish(
    Response.json(
      {
        error:
          "Applications are temporarily unavailable. Please try again later.",
      },
      { status: 503 },
    ),
  );
  await submit;
  assert.equal(steps[1].hidden, false, "email failures must not block booking");
  assert.ok(status.textContent.includes("still book your call"));
  assert.ok(!status.textContent.includes("temporarily unavailable"));
  handlers.get(back).click();
  assert.equal(steps[0].hidden, false);
  assert.equal(inputs.name.value, "Alex Example");
  cleanup();
});
