"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEscapeKey, useLockBodyScroll } from "@/hooks";
import type { MediaAsset } from "@/types";

/**
 * Gallery with a keyboard-navigable lightbox.
 * Arrow keys move, Escape closes, focus returns to the trigger on close.
 */
export function ProjectGallery({
  images,
  accent = "#6366f1",
}: {
  images: MediaAsset[];
  accent?: string;
}) {
  const [active, setActive] = React.useState(0);
  const [lightbox, setLightbox] = React.useState<number | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  useLockBodyScroll(lightbox !== null);
  useEscapeKey(() => setLightbox(null), lightbox !== null);

  const move = React.useCallback(
    (delta: number) => {
      setLightbox((current) =>
        current === null ? null : (current + delta + images.length) % images.length,
      );
    },
    [images.length],
  );

  React.useEffect(() => {
    if (lightbox === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, move]);

  React.useEffect(() => {
    if (lightbox === null) triggerRef.current?.focus();
  }, [lightbox]);

  if (!images.length) return null;

  return (
    <>
      <div className="space-y-4">
        {/* Main frame */}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setLightbox(active)}
          data-cursor="view"
          data-cursor-label="Expand"
          aria-label={`Expand image: ${images[active].alt ?? "project screenshot"}`}
          className="group relative block aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border bg-secondary"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={images[active].url}
                alt={images[active].alt ?? ""}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
                priority={active === 0}
              />
            </motion.div>
          </AnimatePresence>

          <span className="absolute right-4 top-4 grid size-9 place-items-center rounded-full border border-border bg-background/80 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            <Expand className="size-4" />
          </span>

          {images[active].caption && (
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 to-transparent p-4 text-left text-sm text-muted-foreground">
              {images[active].caption}
            </span>
          )}
        </button>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
            {images.map((image, index) => (
              <button
                key={image.url + index}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show image ${index + 1}`}
                aria-current={index === active}
                className={cn(
                  "relative aspect-[4/3] overflow-hidden rounded-lg border transition-all duration-200",
                  index === active
                    ? "border-primary opacity-100"
                    : "border-border opacity-55 hover:opacity-90",
                )}
                style={index === active ? { borderColor: accent } : undefined}
              >
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-background/95 backdrop-blur-xl"
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="Close viewer"
              className="absolute right-5 top-5 grid size-10 place-items-center rounded-full border border-border bg-card"
            >
              <X className="size-4" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    move(-1);
                  }}
                  aria-label="Previous image"
                  className="absolute left-4 grid size-11 place-items-center rounded-full border border-border bg-card sm:left-8"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    move(1);
                  }}
                  aria-label="Next image"
                  className="absolute right-4 grid size-11 place-items-center rounded-full border border-border bg-card sm:right-8"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}

            <motion.figure
              key={lightbox}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-h-[86vh] w-[92vw] max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border">
                <Image
                  src={images[lightbox].url}
                  alt={images[lightbox].alt ?? ""}
                  fill
                  sizes="92vw"
                  className="object-contain"
                />
              </div>
              {images[lightbox].caption && (
                <figcaption className="mt-4 text-center text-sm text-muted-foreground">
                  {images[lightbox].caption}
                  <span className="ml-2 font-mono text-xs">
                    {lightbox + 1} / {images.length}
                  </span>
                </figcaption>
              )}
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
