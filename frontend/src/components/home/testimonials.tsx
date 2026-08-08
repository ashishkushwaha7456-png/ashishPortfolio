"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Section, SectionHeading } from "@/components/shared/section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, initials } from "@/lib/utils";
import type { Testimonial } from "@/types";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(1);

  const go = React.useCallback(
    (next: number) => {
      setDirection(next > index ? 1 : -1);
      setIndex((next + testimonials.length) % testimonials.length);
    },
    [index, testimonials.length],
  );

  /* Auto-advance, paused on hover and while the tab is hidden. */
  const [paused, setPaused] = React.useState(false);
  React.useEffect(() => {
    if (paused || testimonials.length < 2) return;
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % testimonials.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [paused, testimonials.length]);

  if (!testimonials.length) return null;
  const current = testimonials[index];

  return (
    <Section id="testimonials">
      <SectionHeading
        eyebrow="What people say"
        title="Feedback from the people I ship with"
        align="center"
      />

      <div
        className="relative mx-auto max-w-3xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <Quote
          aria-hidden
          className="absolute -top-6 left-1/2 size-16 -translate-x-1/2 text-primary/10"
        />

        <div className="relative min-h-[19rem] sm:min-h-[16rem]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.figure
              key={index}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="glass absolute inset-0 flex flex-col justify-center rounded-3xl p-8 text-center sm:p-10"
            >
              <div className="mb-5 flex justify-center gap-0.5" aria-label={`${current.rating} out of 5`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "size-4",
                      i < current.rating
                        ? "fill-[var(--warning)] text-[var(--warning)]"
                        : "text-border",
                    )}
                  />
                ))}
              </div>

              <blockquote className="text-lg leading-relaxed text-foreground/90 sm:text-xl">
                &ldquo;{current.quote}&rdquo;
              </blockquote>

              <figcaption className="mt-7 flex items-center justify-center gap-3">
                <Avatar className="size-11">
                  {current.avatar?.url && (
                    <AvatarImage src={current.avatar.url} alt={current.name} />
                  )}
                  <AvatarFallback>{initials(current.name)}</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm font-semibold">{current.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {current.role} · {current.company}
                  </p>
                </div>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        {testimonials.length > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous testimonial"
              className="grid size-9 place-items-center rounded-full border border-border bg-card transition-colors hover:border-primary/40 hover:text-primary"
            >
              <ChevronLeft className="size-4" />
            </button>

            <div className="flex gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  aria-current={i === index}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === index ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground",
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next testimonial"
              className="grid size-9 place-items-center rounded-full border border-border bg-card transition-colors hover:border-primary/40 hover:text-primary"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </div>
    </Section>
  );
}
