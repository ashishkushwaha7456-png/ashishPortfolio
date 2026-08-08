"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Stylised location card.
 *
 * A real embedded map is a third-party iframe, a tracking cookie and ~600KB —
 * none of which a portfolio needs. This renders an animated abstraction and
 * links out to the real map for anyone who actually wants directions.
 */
export function ContactMap({
  lat,
  lng,
  label,
  className,
}: {
  lat: number;
  lng: number;
  label: string;
  className?: string;
}) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  /* Deterministic road paths — no Math.random, so SSR and client agree. */
  const roads = React.useMemo(
    () => [
      "M0 120 Q 140 60 280 140 T 560 100",
      "M0 240 Q 180 200 340 260 T 560 220",
      "M120 0 Q 160 140 100 280 T 140 400",
      "M380 0 Q 340 160 420 300 T 380 400",
      "M0 340 Q 200 320 360 380 T 560 340",
    ],
    [],
  );

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={`Open ${label} in Google Maps`}
      data-cursor="view"
      data-cursor-label="Open map"
      className={cn(
        "group relative block aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-card",
        className,
      )}
    >
      <div className="absolute inset-0 bg-aurora opacity-60" />
      <div className="absolute inset-0 bg-grid opacity-70" />

      {/* Abstract road network */}
      <svg
        aria-hidden
        viewBox="0 0 560 400"
        className="absolute inset-0 size-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {roads.map((d, index) => (
          <motion.path
            key={d}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth={index % 2 === 0 ? 2 : 1.2}
            className="text-foreground/10"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, delay: index * 0.12, ease: "easeOut" }}
          />
        ))}
      </svg>

      {/* Pin */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="absolute -inset-6 rounded-full bg-primary/20 animate-pulse-ring" />
        <span className="relative grid size-12 place-items-center rounded-full border border-primary/40 bg-card shadow-[0_8px_32px_-8px_var(--primary)]">
          <MapPin className="size-5 text-primary" />
        </span>
      </div>

      {/* Footer bar */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 border-t border-border bg-card/80 p-5 backdrop-blur">
        <div>
          <p className="text-sm font-semibold">{label}</p>
          <p className="mt-0.5 font-mono text-xs text-muted-foreground">
            {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
          Open in Maps
          <Navigation className="size-3.5" />
        </span>
      </div>
    </a>
  );
}
