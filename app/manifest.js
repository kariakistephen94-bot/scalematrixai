import { SITE_NAME, DESCRIPTION } from "../lib/seo.js";

export default function manifest() {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#07070b",
    theme_color: "#07070b",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
