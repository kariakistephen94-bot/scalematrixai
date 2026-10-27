import { test } from "node:test";
import assert from "node:assert/strict";
import { isApplicationOriginAllowed } from "../lib/application-origin.js";

function request(url, origin, headers = {}) {
  return new Request(url, {
    headers: { ...(origin ? { origin } : {}), ...headers },
  });
}

test("local hostname aliases are accepted on the same port", () => {
  assert.ok(
    isApplicationOriginAllowed(
      request(
        "http://localhost:3000/api/applications",
        "http://127.0.0.1:3000",
      ),
    ),
  );
  assert.ok(
    isApplicationOriginAllowed(
      request(
        "http://127.0.0.1:3000/api/applications",
        "http://localhost:3000",
      ),
    ),
  );
  assert.ok(
    isApplicationOriginAllowed(
      request("http://localhost:3000/api/applications", "http://[::1]:3000"),
    ),
  );
  assert.equal(
    isApplicationOriginAllowed(
      request(
        "http://localhost:3000/api/applications",
        "http://localhost:9000",
      ),
    ),
    false,
  );
});

test("public website origins work behind a reverse proxy", () => {
  assert.ok(
    isApplicationOriginAllowed(
      request(
        "http://localhost:3000/api/applications",
        "https://scalematrixai.com",
        {
          "x-forwarded-host": "scalematrixai.com",
          "x-forwarded-proto": "https",
        },
      ),
    ),
  );
  assert.ok(
    isApplicationOriginAllowed(
      request(
        "http://localhost:3000/api/applications",
        "http://127.0.0.1:3000",
        { host: "127.0.0.1:3000" },
      ),
    ),
  );
});

test("unrelated and malformed origins remain rejected", () => {
  for (const origin of ["https://other.example", "null", "not a URL"]) {
    assert.equal(
      isApplicationOriginAllowed(
        request("https://scalematrixai.com/api/applications", origin),
      ),
      false,
    );
  }
  assert.ok(
    isApplicationOriginAllowed(
      request("https://scalematrixai.com/api/applications"),
    ),
  );
});

test("configured production and local origins are accepted without proxy headers", (t) => {
  const previous = process.env.ALLOWED_ORIGINS;
  t.after(() => {
    if (previous === undefined) delete process.env.ALLOWED_ORIGINS;
    else process.env.ALLOWED_ORIGINS = previous;
  });
  process.env.ALLOWED_ORIGINS =
    "http://localhost:3000,http://127.0.0.1:3000,http://scalematrixai.com,https://scalematrixai.com,http://www.scalematrixai.com,https://www.scalematrixai.com";
  for (const origin of process.env.ALLOWED_ORIGINS.split(",")) {
    assert.ok(
      isApplicationOriginAllowed(
        request("http://internal-server:3000/api/applications", origin),
      ),
      origin,
    );
  }
  for (const origin of [
    "https://scalematrixai.com.attacker.example",
    "https://other.example",
    "null",
  ]) {
    assert.equal(
      isApplicationOriginAllowed(
        request("http://internal-server:3000/api/applications", origin),
      ),
      false,
    );
  }
  process.env.ALLOWED_ORIGINS = "not a URL, , https://scalematrixai.com/";
  assert.ok(
    isApplicationOriginAllowed(
      request(
        "http://internal-server:3000/api/applications",
        "https://scalematrixai.com",
      ),
    ),
  );
});
