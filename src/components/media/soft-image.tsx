"use client";

import Image from "next/image";
import { useState } from "react";

/** Prefers local brand asset; falls back to remote URL if missing/broken. */
export function SoftImage({
  primary,
  fallback,
  alt,
  className,
  sizes,
  priority,
}: {
  primary: string;
  fallback: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [src, setSrc] = useState(primary);
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={className}
      onError={() => {
        if (src !== fallback) setSrc(fallback);
      }}
    />
  );
}
