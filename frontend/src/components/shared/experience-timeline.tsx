"use client";

import * as React from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Building2, ExternalLink, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { cn, durationBetween, formatDateRange } from "@/lib/utils";
import type { Experience } from "@/types";

/**
 * Vertical timeline whose spine fills as you scroll past it — the progress
 * line is a scaled div, so it animates on the compositor.
 */
export function ExperienceTimeline({
  experiences,
  detailed = false,
}: {
  experiences: Experience[];
  detailed?: boolean;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 55%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} className="relative">
      {/* Spine */}
      <div
        aria-hidden
        className="absolute left-[15px] top-2 hidden h-[calc(100%-1rem)] w-px bg-border sm:block"
      >
        <motion.div
          style={{ scaleY, originY: 0 }}
          className="h-full w-full bg-gradient-to-b from-primary via-primary/60 to-accent"
        />
        <motion.div
          style={{ top: glowY }}
          className="absolute -left-[3px] size-[7px] rounded-full bg-primary shadow-[0_0_16px_var(--primary)]"
        />
      </div>

      <ol className="space-y-12">
        {experiences.map((job, index) => (
          <li key={`${job.company}-${job.start}`} className="relative sm:pl-14">
            {/* Node */}
            <span
              aria-hidden
              className={cn(
                "absolute left-0 top-1.5 hidden size-[31px] place-items-center rounded-full border border-border bg-background sm:grid",
                job.current && "border-primary/50",
              )}
            >
              <span
                className={cn(
                  "size-2 rounded-full",
                  job.current ? "bg-primary" : "bg-muted-foreground",
                )}
              />
              {job.current && (
                <span className="absolute size-2 rounded-full bg-primary animate-pulse-ring" />
              )}
            </span>

            <Reveal delay={index * 0.08}>
              <article className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/15 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      {job.current && (
                        <Badge variant="success" size="sm">
                          Current
                        </Badge>
                      )}
                      <Badge variant="outline" size="sm">
                        {job.employmentType}
                      </Badge>
                      <Badge variant="outline" size="sm">
                        {job.locationType}
                      </Badge>
                    </div>

                    <h3 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                      {job.role}
                    </h3>

                    <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5 font-medium text-foreground/85">
                        <Building2 className="size-3.5" />
                        {job.website ? (
                          <a
                            href={job.website}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex items-center gap-1 hover:text-primary"
                          >
                            {job.company}
                            <ExternalLink className="size-3" />
                          </a>
                        ) : (
                          job.company
                        )}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-3.5" />
                        {job.location}
                      </span>
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-mono text-xs text-muted-foreground">
                      {formatDateRange(job.start, job.end)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground/70">
                      {durationBetween(job.start, job.end)}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  {job.summary}
                </p>

                {(detailed || index === 0) && job.highlights.length > 0 && (
                  <ul className="mt-5 space-y-2.5">
                    {job.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-3 text-sm leading-relaxed">
                        <span
                          aria-hidden
                          className="mt-[0.55rem] size-1 shrink-0 rounded-full bg-primary"
                        />
                        <span className="text-muted-foreground">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {job.techStack.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-1.5 border-t border-border pt-5">
                    {job.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-border bg-secondary/50 px-2 py-0.5 text-[0.6875rem] text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
