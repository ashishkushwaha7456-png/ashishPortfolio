"use client";

import * as React from "react";
import Image from "next/image";
// import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, /* Github, */ Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TiltCard } from "@/components/motion/tilt-card";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  index?: number;
  variant?: "default" | "featured" | "compact";
  className?: string;
}

export function ProjectCard({
  project,
  index = 0,
  variant = "default",
  className,
}: ProjectCardProps) {
  const featured = variant === "featured";

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={cn("group", className)}
    >
      <TiltCard max={featured ? 5 : 7} className="h-full">
        {/* Case-study pages are disabled, so the card itself no longer
            navigates — the Live Site button below is the only action.
        <Link
          href={`/projects/${project.slug}`}
          data-cursor="view"
          data-cursor-label="View case study"
        */}
        <div
          className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500 hover:border-foreground/15 hover:shadow-[0_24px_64px_-32px_rgba(0,0,0,0.5)]"
        >
          {/* Thumbnail */}
          <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
            <Image
              src={project.thumbnail.url}
              alt={project.thumbnail.alt ?? project.title}
              fill
              sizes={featured ? "(max-width: 1024px) 100vw, 60vw" : "(max-width: 768px) 100vw, 33vw"}
              className="object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.04]"
            />

            {/* Accent wash keyed to the project */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background: `linear-gradient(to top, ${project.accent}26, transparent 60%)`,
              }}
            />

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-background/90 via-background/40 to-transparent p-4">
              <div className="flex flex-wrap gap-1.5">
                {project.featured && (
                  <Badge variant="gradient" size="sm">
                    Featured
                  </Badge>
                )}
                <Badge variant="glass" size="sm">
                  {project.year}
                </Badge>
              </div>

              <span className="grid size-9 place-items-center rounded-full border border-border bg-card/80 backdrop-blur transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/50 group-hover:text-primary">
                <ArrowUpRight className="size-4" />
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col p-6">
            <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3" />
                {project.timeline.duration}
              </span>
              <span className="size-1 rounded-full bg-border" />
              <span className="truncate">{project.role}</span>
            </div>

            <h3
              className={cn(
                "font-display font-semibold tracking-tight transition-colors group-hover:text-primary",
                featured ? "text-2xl sm:text-3xl" : "text-xl",
              )}
            >
              {project.title}
            </h3>

            <p
              className={cn(
                "mt-2.5 text-sm leading-relaxed text-muted-foreground",
                featured ? "line-clamp-3" : "line-clamp-2",
              )}
            >
              {featured ? project.summary : project.tagline}
            </p>

            {/* Metrics — featured cards only */}
            {featured && project.metrics.length > 0 && (
              <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-border py-5 sm:grid-cols-4">
                {project.metrics.slice(0, 4).map((metric) => (
                  <div key={metric.label}>
                    <dd className="font-display text-lg font-semibold tracking-tight">
                      {metric.value}
                    </dd>
                    <dt className="mt-0.5 text-[0.6875rem] leading-tight text-muted-foreground">
                      {metric.label}
                    </dt>
                  </div>
                ))}
              </dl>
            )}

            {/* Tech stack */}
            <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
              {project.techStack.slice(0, featured ? 7 : 4).map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-border bg-secondary/50 px-2 py-0.5 text-[0.6875rem] text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > (featured ? 7 : 4) && (
                <span className="rounded-md px-2 py-0.5 text-[0.6875rem] text-muted-foreground">
                  +{project.techStack.length - (featured ? 7 : 4)}
                </span>
              )}
            </div>

            {/* External links */}
            {project.links.live && (
              <div className="mt-4 border-t border-border pt-4">
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cursor="hover"
                  aria-label={`Open the live site for ${project.title}`}
                  className="group/live inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
                >
                  <Globe className="size-3.5" />
                  Live Site
                  <ArrowUpRight className="size-3.5 transition-transform group-hover/live:-translate-y-0.5 group-hover/live:translate-x-0.5" />
                </a>
                {/* GitHub source link — disabled
                {project.links.github && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Github className="size-3" />
                    Source
                  </span>
                )}
                */}
              </div>
            )}
          </div>
        </div>
      </TiltCard>
    </motion.article>
  );
}
