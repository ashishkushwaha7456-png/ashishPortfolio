"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  reverse?: boolean;
  /** Seconds for one full pass. Larger = slower. */
  speed?: number;
  pauseOnHover?: boolean;
  fade?: boolean;
}

/**
 * CSS-driven infinite marquee — the track is duplicated once and translated
 * by exactly -50%, so the seam is invisible and nothing runs on the main thread.
 */
export function Marquee({
  children,
  className,
  reverse = false,
  speed = 42,
  pauseOnHover = true,
  fade = true,
  ...props
}: MarqueeProps) {
  return (
    <div
      className={cn("group relative w-full overflow-hidden", fade && "mask-fade-x", className)}
      {...props}
    >
      <div
        className={cn(
          "flex w-max shrink-0 items-center gap-4",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        style={{ animationDuration: `${speed}s` }}
      >
        <div className="flex shrink-0 items-center gap-4">{children}</div>
        <div className="flex shrink-0 items-center gap-4" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
