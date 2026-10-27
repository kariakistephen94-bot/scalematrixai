const loopbackHosts = new Set(["localhost", "127.0.0.1", "[::1]"]);

function normalizedOrigin(value) {
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) return null;
    if (loopbackHosts.has(url.hostname)) url.hostname = "localhost";
    return url.origin;
  } catch {
    return null;
  }
}

export function isApplicationOriginAllowed(request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const normalized = normalizedOrigin(origin);
  if (!normalized) return false;

  const requestUrl = new URL(request.url);
  const allowed = new Set([normalizedOrigin(requestUrl.origin)]);
  // Explicitly configured local and production origins, normalized without paths.
  for (const entry of (process.env.ALLOWED_ORIGINS || "").split(",")) {
    const configured = normalizedOrigin(entry.trim());
    if (configured) allowed.add(configured);
  }
  const host = request.headers.get("host");
  if (host) allowed.add(normalizedOrigin(`${requestUrl.protocol}//${host}`));

  // Reverse proxies may use an internal request URL while preserving the public host.
  const forwardedHost = request.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    .trim();
  const forwardedProtocol = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    .trim();
  if (forwardedHost && ["http", "https"].includes(forwardedProtocol)) {
    allowed.add(normalizedOrigin(`${forwardedProtocol}://${forwardedHost}`));
  }

  return allowed.has(normalized);
}
