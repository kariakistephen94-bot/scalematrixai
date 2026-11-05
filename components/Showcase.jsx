import { getProjects } from "../lib/showcase.js";
import VideoPlayer from "./VideoPlayer";

export default async function Showcase() {
  const projects = await getProjects();
  const videoLd = projects
    .filter((p) => p.video && p.thumbnail && p.created_at)
    .map((p) => ({
      "@type": "VideoObject",
      name: p.title,
      description: p.summary || p.title,
      thumbnailUrl: p.thumbnail,
      uploadDate: p.created_at,
      ...(p.video.type === "file"
        ? { contentUrl: p.video.url }
        : { embedUrl: p.video.embed }),
    }));
  return (
    <section className="work wrap" id="work" aria-labelledby="work-title">
      <div className="sectionlabel">THE WORK</div>
      <h2 id="work-title">See what we’ve built.</h2>
      <p className="sectionintro">
        Real AI systems, shown working. Short demos recorded by the founder,
        walking through what each one does.
      </p>
      {projects.length ? (
        <div className="work-grid">
          {projects.map((p) => (
            <article key={p.id} className="work-card">
              <VideoPlayer
                video={p.video}
                thumbnail={p.thumbnail}
                title={p.title}
              />
              <div className="work-copy">
                <h3>{p.title}</h3>
                {p.summary && <p>{p.summary}</p>}
                {p.tags?.length > 0 && (
                  <ul className="work-tags">
                    {p.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                )}
                {p.link && (
                  <a href={p.link} target="_blank" rel="noopener noreferrer">
                    Visit project ↗
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="work-empty">
          <strong>New demos are on the way.</strong>
          <p>
            Want to see what an AI engine could do for your business? Book a
            strategy call and we’ll walk you through it live.
          </p>
          <a className="button primary" href="#application">
            Book a strategy call <span>→</span>
          </a>
        </div>
      )}
      {videoLd.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": videoLd,
            }).replace(/</g, "\\u003c"),
          }}
        />
      )}
    </section>
  );
}
