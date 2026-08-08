"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid, List, Search, SlidersHorizontal, X } from "lucide-react";
import { ProjectCard } from "@/components/shared/project-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PROJECT_CATEGORIES } from "@/constants/site";
import { cn, unique } from "@/lib/utils";
import { useDebounce } from "@/hooks";
import type { Project } from "@/types";

/**
 * Client-side filtering — the whole project list is a handful of KB, so
 * shipping it once and filtering in memory beats a round trip per keystroke.
 */
export function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [tech, setTech] = React.useState("all");
  const [view, setView] = React.useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = React.useState(false);

  const debouncedQuery = useDebounce(query, 200);

  const allTech = React.useMemo(
    () => unique(projects.flatMap((p) => p.techStack)).sort(),
    [projects],
  );

  const categories = React.useMemo(() => {
    const present = new Set(projects.map((p) => p.category));
    return PROJECT_CATEGORIES.filter((c) => present.has(c.value));
  }, [projects]);

  const filtered = React.useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return projects.filter((project) => {
      if (category !== "all" && project.category !== category) return false;
      if (tech !== "all" && !project.techStack.includes(tech)) return false;
      if (!q) return true;
      return (
        project.title.toLowerCase().includes(q) ||
        project.tagline.toLowerCase().includes(q) ||
        project.summary.toLowerCase().includes(q) ||
        project.techStack.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [projects, debouncedQuery, category, tech]);

  const active = (category !== "all" ? 1 : 0) + (tech !== "all" ? 1 : 0) + (query ? 1 : 0);

  const reset = () => {
    setQuery("");
    setCategory("all");
    setTech("all");
  };

  return (
    <div>
      {/* Controls */}
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects, tech, outcomes…"
              aria-label="Search projects"
              className="pl-10"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <Button
            variant="outline"
            onClick={() => setShowFilters((v) => !v)}
            aria-expanded={showFilters}
            className="shrink-0"
          >
            <SlidersHorizontal className="size-4" />
            Filters
            {active > 0 && (
              <Badge variant="default" size="sm" className="ml-1">
                {active}
              </Badge>
            )}
          </Button>

          <div
            role="group"
            aria-label="Layout"
            className="hidden shrink-0 items-center gap-0.5 rounded-xl border border-border bg-secondary/50 p-0.5 sm:flex"
          >
            {(
              [
                ["grid", LayoutGrid, "Grid view"],
                ["list", List, "List view"],
              ] as const
            ).map(([value, ViewIcon, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setView(value)}
                aria-label={label}
                aria-pressed={view === value}
                className={cn(
                  "grid size-9 place-items-center rounded-lg transition-colors",
                  view === value
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <ViewIcon className="size-4" />
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence initial={false}>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
                <div>
                  <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Category
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <FilterChip active={category === "all"} onClick={() => setCategory("all")}>
                      All
                    </FilterChip>
                    {categories.map((item) => (
                      <FilterChip
                        key={item.value}
                        active={category === item.value}
                        onClick={() => setCategory(item.value)}
                      >
                        {item.label}
                      </FilterChip>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Technology
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <FilterChip active={tech === "all"} onClick={() => setTech("all")}>
                      All
                    </FilterChip>
                    {allTech.map((item) => (
                      <FilterChip key={item} active={tech === item} onClick={() => setTech(item)}>
                        {item}
                      </FilterChip>
                    ))}
                  </div>
                </div>

                {active > 0 && (
                  <Button variant="ghost" size="sm" onClick={reset}>
                    <X className="size-3.5" />
                    Clear all filters
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-sm text-muted-foreground" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "project" : "projects"}
          {active > 0 && " matching your filters"}
        </p>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-20 text-center">
          <p className="font-display text-lg font-semibold">No projects match that</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different technology or clear the filters.
          </p>
          <Button variant="outline" size="sm" onClick={reset} className="mt-5">
            Clear filters
          </Button>
        </div>
      ) : (
        <motion.div
          layout
          className={cn(
            "grid gap-6",
            view === "grid" ? "md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1",
          )}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={index}
                variant={view === "list" ? "featured" : "default"}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200",
        active
          ? "border-primary/50 bg-primary/12 text-primary"
          : "border-border text-muted-foreground hover:border-foreground/25 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
