"use client";
import { useState } from "react";

// Click-to-load: no third-party embed (or tracking) is loaded until the visitor presses play.
export default function VideoPlayer({ video, thumbnail, title }) {
  const [playing, setPlaying] = useState(false);
  if (!video) {
    return thumbnail ? (
      <img className="work-thumb" src={thumbnail} alt={title} loading="lazy" />
    ) : (
      <div className="work-thumb work-thumb-empty" aria-hidden="true" />
    );
  }
  if (video.type === "file") {
    return (
      <video
        className="work-thumb"
        src={video.url}
        poster={thumbnail || undefined}
        controls
        preload="metadata"
        playsInline
        aria-label={`${title} demo video`}
      />
    );
  }
  if (playing) {
    return (
      <iframe
        className="work-thumb"
        src={`${video.embed}${video.embed.includes("?") ? "&" : "?"}autoplay=1`}
        title={`${title} demo video`}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        loading="lazy"
      />
    );
  }
  return (
    <button
      type="button"
      className="work-play"
      onClick={() => setPlaying(true)}
      aria-label={`Play demo: ${title}`}
    >
      {thumbnail ? (
        <img className="work-thumb" src={thumbnail} alt="" loading="lazy" />
      ) : (
        <span className="work-thumb work-thumb-empty" />
      )}
      <span className="work-play-icon" aria-hidden="true">
        ▶
      </span>
    </button>
  );
}
