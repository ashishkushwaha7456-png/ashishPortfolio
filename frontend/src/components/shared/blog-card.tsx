"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types";

interface BlogCardProps {
  post: BlogPost;
  index?: number;
  variant?: "default" | "compact" | "wide";
  className?: string;
}

export function BlogCard({ post, index = 0, variant = "default", className }: BlogCardProps) {
  const wide = variant === "wide";

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className={cn("group h-full", className)}
    >
      <Link
        href={`/blog/${post.slug}`}
        data-cursor="view"
        data-cursor-label="Read"
        className={cn(
          "flex h-full overflow-hidden rounded-2xl border border-border bg-card transition-all duration-400 hover:-translate-y-1 hover:border-foreground/15 hover:shadow-[0_20px_56px_-32px_rgba(0,0,0,0.45)]",
          wide ? "flex-col sm:flex-row" : "flex-col",
        )}
      >
        {post.cover && (
          <div
            className={cn(
              "relative overflow-hidden bg-secondary",
              wide ? "aspect-[16/10] sm:aspect-auto sm:w-2/5" : "aspect-[16/9]",
            )}
          >
            <Image
              src={post.cover.url}
              alt={post.cover.alt ?? post.title}
              fill
              sizes={wide ? "(max-width: 640px) 100vw, 40vw" : "(max-width: 768px) 100vw, 33vw"}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        )}

        <div className="flex flex-1 flex-col p-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" size="sm">
              {post.category}
            </Badge>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3" />
              {post.readingTime} min
            </span>
            <span className="text-xs text-muted-foreground">
              · {formatDate(post.publishedAt, { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>

          <h3
            className={cn(
              "font-display font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary",
              wide ? "text-xl sm:text-2xl" : "text-lg",
            )}
          >
            {post.title}
          </h3>

          <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>

          <div className="mt-auto flex items-center justify-between gap-3 pt-5">
            <div className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-border bg-secondary/50 px-2 py-0.5 text-[0.6875rem] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
            <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
