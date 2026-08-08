"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useScrollSpy } from "@/hooks";

interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const ids = React.useMemo(() => headings.map((h) => h.id), [headings]);
  const active = useScrollSpy(ids, 0.25);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        On this page
      </p>

      <ul className="space-y-0.5 border-l border-border">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              aria-current={active === heading.id ? "location" : undefined}
              className={cn(
                "-ml-px block border-l py-1.5 text-sm transition-colors",
                heading.level === 3 ? "pl-7" : "pl-4",
                active === heading.id
                  ? "border-primary font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:border-foreground/25 hover:text-foreground",
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
