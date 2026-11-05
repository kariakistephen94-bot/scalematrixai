// Projects are managed in the private dashboard (Projects page) and published as a public JSON feed.
const FEED =
  process.env.SHOWCASE_FEED_URL ||
  "https://pvotofowypbvpsyfydpv.supabase.co/storage/v1/object/public/showcase/projects.json";

export async function getProjects() {
  try {
    const response = await fetch(FEED, { next: { revalidate: 60 } });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data.projects) ? data.projects : [];
  } catch {
    return [];
  }
}
