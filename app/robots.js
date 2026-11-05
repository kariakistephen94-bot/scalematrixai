import { SITE_URL } from "../lib/seo.js";

// Search engines and AI crawlers/answer engines are explicitly welcome; the form API is not crawlable.
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
  "Bytespider",
  "Amazonbot",
  "meta-externalagent",
  "DuckAssistBot",
  "cohere-ai",
  "YouBot",
];

export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      ...AI_BOTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: "/api/",
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
