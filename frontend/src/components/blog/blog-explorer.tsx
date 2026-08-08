"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { BlogCard } from "@/components/shared/blog-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks";
import type { BlogPost } from "@/types";

interface BlogExplorerProps {
  posts: BlogPost[];
  categories: { name: string; count: number }[];
  tags: { name: string; count: number }[];
}

export function BlogExplorer({ posts, categories, tags }: BlogExplorerProps) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [tag, setTag] = React.useState("all");

  const debounced = useDebounce(query, 200);

  const filtered = React.useMemo(() => {
    const q = debounced.trim().toLowerCase();
    return posts.filter((post) => {
      if (category !== "all" && post.category !== category) return false;
      if (tag !== "all" && !post.tags.includes(tag)) return false;
      if (!q) return true;
      return (
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [posts, debounced, category, tag]);

  const active = (category !== "all" ? 1 : 0) + (tag !== "all" ? 1 : 0) + (query ? 1 : 0);
  const reset = () => {
    setQuery("");
    setCategory("all");
    setTag("all");
  };

  const [featured, ...rest] = filtered;

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_16rem]">
      <div className="min-w-0">
        {/* Search */}
        <div className="relative mb-8">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            aria-label="Search articles"
            className="h-12 pl-10"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <p className="mb-6 text-sm text-muted-foreground" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "article" : "articles"}
          {active > 0 && " matching your filters"}
        </p>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-20 text-center">
            <p className="font-display text-lg font-semibold">Nothing found</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a different term, or clear the filters.
            </p>
            <Button variant="outline" size="sm" onClick={reset} className="mt-5">
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {featured && (
                <motion.div key={featured.slug} layout>
                  <BlogCard post={featured} variant="wide" index={0} />
                </motion.div>
              )}

              {rest.length > 0 && (
                <motion.div layout className="grid gap-6 sm:grid-cols-2">
                  {rest.map((post, index) => (
                    <BlogCard key={post.slug} post={post} index={index + 1} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <aside className="lg:sticky lg:top-28 lg:h-fit">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Categories
            </h2>
            <ul className="space-y-1">
              <li>
                <FilterRow
                  active={category === "all"}
                  onClick={() => setCategory("all")}
                  label="All posts"
                  count={posts.length}
                />
              </li>
              {categories.map((item) => (
                <li key={item.name}>
                  <FilterRow
                    active={category === item.name}
                    onClick={() => setCategory(item.name)}
                    label={item.name}
                    count={item.count}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Tags
            </h2>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setTag("all")}
                aria-pressed={tag === "all"}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs transition-colors",
                  tag === "all"
                    ? "border-primary/50 bg-primary/12 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                All
              </button>
              {tags.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setTag(item.name)}
                  aria-pressed={tag === item.name}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs transition-colors",
                    tag === item.name
                      ? "border-primary/50 bg-primary/12 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.name}
                  <span className="ml-1 opacity-60">{item.count}</span>
                </button>
              ))}
            </div>
          </div>

          {active > 0 && (
            <Button variant="outline" size="sm" onClick={reset} className="w-full">
              <X className="size-3.5" />
              Clear all filters
            </Button>
          )}

          <div className="rounded-2xl border border-dashed border-border p-5 text-sm">
            <p className="font-semibold">Subscribe via RSS</p>
            <p className="mt-1.5 text-xs text-muted-foreground">
              New posts land in your reader the moment they publish.
            </p>
            <a
              href="/rss.xml"
              className="mt-3 inline-flex text-xs font-medium text-primary hover:underline"
            >
              /rss.xml
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}

function FilterRow({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
        active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
      )}
    >
      {label}
      <span className="font-mono text-xs opacity-70">{count}</span>
    </button>
  );
}
