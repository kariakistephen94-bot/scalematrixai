import { test } from "node:test";
import assert from "node:assert/strict";
import { POST } from "../app/api/applications/route.js";

const data = {
  name: "Alex",
  email: "alex@example.com",
  phone: "5551234567",
  company: "Test Cleaning",
};
const request = (body, origin = "http://localhost:3000") =>
  new Request("http://localhost:3000/api/applications", {
    method: "POST",
    headers: { origin },
    body: JSON.stringify(body),
  });

test("application email validation and provider handling", async (t) => {
  const originalFetch = globalThis.fetch;
  const keys = ["RESEND_API_KEY", "RESEND_FROM_EMAIL", "APPLICATION_TO_EMAIL"];
  const previous = Object.fromEntries(
    keys.map((key) => [key, process.env[key]]),
  );
  t.after(() => {
    globalThis.fetch = originalFetch;
    for (const key of keys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  });
  globalThis.fetch = () => {
    throw new Error("Unexpected provider call");
  };
  assert.equal(
    (await POST(request(data, "https://other.example"))).status,
    403,
  );
  assert.equal(
    (await POST(request({ ...data, email: "invalid" }))).status,
    400,
  );
  assert.equal((await POST(request({ ...data, company: "" }))).status, 400);
  assert.equal((await POST(request(null))).status, 400);
  for (const key of keys) delete process.env[key];
  assert.equal((await POST(request(data))).status, 503);
  process.env.RESEND_API_KEY = "mock-key";
  process.env.RESEND_FROM_EMAIL = "ScaleMatrix AI <forms@example.com>";
  process.env.APPLICATION_TO_EMAIL = "owner@example.com";
  let idempotency;
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "https://api.resend.com/emails");
    const payload = JSON.parse(options.body);
    assert.deepEqual(payload.to, ["owner@example.com"]);
    assert.equal(payload.reply_to, data.email);
    assert.ok(payload.text.includes(data.company));
    if (idempotency)
      assert.equal(options.headers["Idempotency-Key"], idempotency);
    idempotency = options.headers["Idempotency-Key"];
    return Response.json({ id: "mock-email" });
  };
  assert.equal((await POST(request(data))).status, 200);
  assert.equal((await POST(request(data))).status, 200);
  delete process.env.RESEND_FROM_EMAIL;
  delete process.env.APPLICATION_TO_EMAIL;
  globalThis.fetch = async (url, options) => {
    const payload = JSON.parse(options.body);
    assert.equal(
      payload.from,
      "ScaleMatrix AI <applications@scalematrixai.com>",
    );
    assert.deepEqual(payload.to, ["stephen@scalematrixai.com"]);
    return Response.json({ id: "fallback-config-email" });
  };
  assert.equal((await POST(request(data))).status, 200);
  globalThis.fetch = async () =>
    Response.json({ message: "private provider diagnostic" }, { status: 403 });
  const failure = await POST(request(data));
  assert.equal(failure.status, 502);
  assert.ok(!(await failure.text()).includes("private provider diagnostic"));
  globalThis.fetch = async () => {
    throw new Error("network failure");
  };
  assert.equal((await POST(request(data))).status, 502);
});
