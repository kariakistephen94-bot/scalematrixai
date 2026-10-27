import { createHash } from "node:crypto";
import { isApplicationOriginAllowed } from "../../../lib/application-origin.js";

const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

export async function POST(request) {
  if (!isApplicationOriginAllowed(request)) {
    return Response.json(
      {
        error: "Please submit the application from the ScaleMatrix AI website.",
      },
      { status: 403 },
    );
  }
  let data;
  try {
    const body = await request.text();
    if (body.length > 10000)
      return Response.json(
        { error: "Application is too large." },
        { status: 413 },
      );
    data = JSON.parse(body);
  } catch {
    return Response.json({ error: "Invalid application." }, { status: 400 });
  }
  const fields = ["name", "email", "phone", "company"];
  if (
    !data ||
    fields.some(
      (key) =>
        typeof data[key] !== "string" ||
        !data[key].trim() ||
        data[key].length > 200,
    )
  ) {
    return Response.json(
      { error: "Please complete all application fields." },
      { status: 400 },
    );
  }
  const application = Object.fromEntries(
    fields.map((key) => [key, data[key].trim()]),
  );
  if (
    !emailPattern.test(application.email) ||
    /[\r\n]/.test(application.email) ||
    !/^[+()\d\s.\-]{7,40}$/.test(application.phone)
  ) {
    return Response.json(
      { error: "Please check your email and phone number." },
      { status: 400 },
    );
  }
  const RESEND_API_KEY = process.env.RESEND_API_KEY?.trim();
  const RESEND_FROM_EMAIL =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "ScaleMatrix AI <applications@scalematrixai.com>";
  const APPLICATION_TO_EMAIL =
    process.env.APPLICATION_TO_EMAIL?.trim() || "stephen@scalematrixai.com";
  if (!RESEND_API_KEY) {
    return Response.json(
      {
        error:
          "Applications are temporarily unavailable. Please try again later.",
      },
      { status: 503 },
    );
  }
  // Identical applications within this hour share a key, including network retries.
  const digest = createHash("sha256")
    .update(JSON.stringify(application))
    .digest("hex");
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `application-${digest}-${Math.floor(Date.now() / 3600000)}`,
      },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        to: [APPLICATION_TO_EMAIL],
        reply_to: application.email,
        subject: "New ScaleMatrix AI application",
        text: [
          "New ScaleMatrix AI application",
          "",
          ...fields.map((key) => `${key}: ${application[key]}`),
        ].join("\n"),
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok)
      return Response.json(
        { error: "We couldn’t send your application. Please try again." },
        { status: 502 },
      );
    const result = await response.json();
    if (!result.id) throw new Error("Missing email identifier");
    return Response.json({ success: true });
  } catch {
    return Response.json(
      { error: "We couldn’t send your application. Please try again." },
      { status: 502 },
    );
  }
}
