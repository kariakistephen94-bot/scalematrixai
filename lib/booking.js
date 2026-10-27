export function createBookingUrl(host, details = {}) {
  const url = new URL("https://calendly.com/kariakistephen/30min");
  url.searchParams.set("embed_domain", host);
  url.searchParams.set("embed_type", "Inline");
  url.searchParams.set("background_color", "121215");
  url.searchParams.set("text_color", "f4f4f7");
  url.searchParams.set("primary_color", "8d88ff");
  if (typeof details?.name === "string" && details.name.trim())
    url.searchParams.set("name", details.name.trim());
  if (typeof details?.email === "string" && details.email.trim())
    url.searchParams.set("email", details.email.trim());
  return url.toString();
}
