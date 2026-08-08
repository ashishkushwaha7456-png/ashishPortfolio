"use client";

import { Check, Link2, Linkedin, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCopyToClipboard } from "@/hooks";

export function ShareBar({
  title,
  url,
  className,
}: {
  title: string;
  url: string;
  className?: string;
}) {
  const { copied, copy } = useCopyToClipboard();

  const targets = [
    {
      label: "Share on X",
      Icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      label: "Share on LinkedIn",
      Icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
  ];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="mr-1 text-xs text-muted-foreground">Share</span>

      {targets.map(({ label, Icon, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={label}
          className="grid size-9 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
        >
          <Icon className="size-4" />
        </a>
      ))}

      <button
        type="button"
        onClick={() => copy(url)}
        aria-label="Copy link"
        className="grid size-9 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
      >
        {copied ? <Check className="size-4 text-[var(--success)]" /> : <Link2 className="size-4" />}
      </button>
    </div>
  );
}
