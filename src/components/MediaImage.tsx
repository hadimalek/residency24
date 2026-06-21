"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";

interface MediaImageProps {
  src: string;
  alt: string;
  /** Classes for the <img> (and the fallback frame), e.g. "w-full h-full object-cover". */
  className?: string;
}

/**
 * Plain <img> with a branded Navy fallback frame. Used for user-supplied
 * photos (committed to /public/images): if a file isn't present yet, the page
 * shows a clean brand placeholder instead of a broken image.
 */
export default function MediaImage({ src, alt, className = "" }: MediaImageProps) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className={`flex items-center justify-center bg-navy ${className}`} aria-label={alt}>
        <Building2 className="w-10 h-10 text-gold/50" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setErrored(true)}
      className={className}
    />
  );
}
