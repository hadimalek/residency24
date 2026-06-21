"use client";

import { useState } from "react";
import { Play } from "lucide-react";

interface YouTubeFacadeProps {
  videoId: string;
  title: string;
  /** "shorts" builds a Shorts watch URL for the fallback link; defaults to a normal watch URL. */
  watchKind?: "shorts" | "watch";
}

/**
 * Lightweight YouTube player. Shows a poster + play button (never errors on
 * load); clicking swaps in the real embed and autoplays. A guaranteed
 * "watch on YouTube" link is rendered by the caller as a final fallback.
 */
export default function YouTubeFacade({ videoId, title, watchKind = "watch" }: YouTubeFacadeProps) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1&modestbranding=1`}
        title={title}
        className="w-full h-full"
        style={{ border: 0 }}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative block w-full h-full bg-navy"
      aria-label={title}
    >
      <img
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt={title}
        loading="lazy"
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        className="w-full h-full object-cover"
      />
      <span className="absolute inset-0 bg-navy/30 group-hover:bg-navy/45 transition-colors" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex items-center justify-center w-16 h-16 rounded-full bg-gold text-navy shadow-lg transition-transform group-hover:scale-110">
          <Play className="w-7 h-7 translate-x-0.5 fill-current" />
        </span>
      </span>
    </button>
  );
}
