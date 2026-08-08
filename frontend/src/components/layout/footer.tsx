"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowUp, Circle } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";
import { NowPlaying } from "@/components/shared/now-playing";
import { FOOTER_LINKS, PERSON } from "@/constants/site";
import { cn } from "@/lib/utils";
import { useCurrentTime } from "@/hooks";
import type { SocialLink } from "@/types";

interface FooterProps {
  socials: SocialLink[];
  available?: boolean;
  showNowPlaying?: boolean;
}

export function Footer({ socials, available = true, showNowPlaying = false }: FooterProps) {
  const time = useCurrentTime(PERSON.timezone);
  const year = 2026;

  return (
    <footer className="relative mt-32 overflow-hidden border-t border-border">
      <div className="pointer-events-none absolute inset-0 bg-aurora opacity-50" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container-page relative py-16 md:py-20">
        {/* CTA */}
        <div className="flex flex-col items-start justify-between gap-8 border-b border-border pb-14 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
              <Circle
                className={cn(
                  "size-2 fill-current",
                  available ? "text-[var(--success)]" : "text-muted-foreground",
                )}
              />
              {available ? "Available for new work" : "Currently booked"}
            </p>
            <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Let&apos;s build
              <span className="text-gradient"> something great</span>.
            </h2>
            <p className="mt-4 max-w-lg text-muted-foreground">
              Open to senior frontend and full-stack roles, and to interesting contract work.
              The fastest way to reach me is email — I reply within a day.
            </p>
          </div>

          <Magnetic strength={0.3}>
            <Button asChild size="xl" variant="gradient" className="rounded-full">
              <Link href="/contact">
                Start a conversation
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </Magnetic>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-8 py-14 md:grid-cols-4 lg:grid-cols-6">
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl border border-border bg-card font-display text-sm font-semibold">
                <span className="text-gradient">AK</span>
              </span>
              <span className="text-sm font-semibold tracking-tight">{PERSON.name}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              MERN stack developer building fast, accessible, production-grade web products
              from {PERSON.shortLocation}.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {socials
                .filter((s) => s.showInFooter)
                .map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target={social.url.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer noopener"
                    aria-label={social.label}
                    className="grid size-9 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
                  >
                    <Icon name={social.icon} size={16} />
                  </a>
                ))}
            </div>

            {showNowPlaying && <NowPlaying className="mt-5 max-w-xs" />}
          </div>

          {FOOTER_LINKS.map((column) => (
            <div key={column.title}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {column.title}
              </h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={"external" in link && link.external ? "_blank" : undefined}
                      rel={"external" in link && link.external ? "noreferrer noopener" : undefined}
                      className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                      {"external" in link && link.external && (
                        <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-60" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Meta bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {year} {PERSON.name}. Built with Next.js, TypeScript &amp; Tailwind.
          </p>

          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5 font-mono tabular-nums">
              <span className="size-1.5 rounded-full bg-[var(--success)]" />
              {PERSON.shortLocation} {time ?? "--:--:--"}
            </span>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
            >
              Back to top
              <ArrowUp className="size-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Oversized wordmark */}
      <div
        aria-hidden
        className="pointer-events-none select-none overflow-hidden mask-fade-b"
      >
        <p className="-mb-4 translate-y-[18%] whitespace-nowrap text-center font-display text-[18vw] font-bold leading-none tracking-tighter text-foreground/[0.035] md:-mb-8">
          ASHISH KUMAR
        </p>
      </div>
    </footer>
  );
}
