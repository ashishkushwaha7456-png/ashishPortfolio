import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  container?: boolean;
  /** Adds generous vertical rhythm; turn off for tight, stacked sections. */
  spacious?: boolean;
}

export function Section({
  id,
  className,
  children,
  container = true,
  spacious = true,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("relative scroll-mt-24", spacious ? "py-24 md:py-32" : "py-16", className)}
      {...props}
    >
      {container ? <div className="container-page">{children}</div> : children}
    </section>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  action?: { label: string; href: string };
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <Reveal>
            <p className="mb-4 inline-flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
              <span className="h-px w-8 bg-gradient-to-r from-primary to-transparent" />
              {eyebrow}
            </p>
          </Reveal>
        )}

        <Reveal delay={0.05}>
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.035em]">
            {title}
          </h2>
        </Reveal>

        {description && (
          <Reveal delay={0.1}>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </p>
          </Reveal>
        )}
      </div>

      {action && (
        <Reveal delay={0.15} className="shrink-0">
          <Link
            href={action.href}
            className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-4 py-2 text-sm font-medium backdrop-blur transition-all duration-200 hover:border-primary/40 hover:text-primary"
          >
            {action.label}
            <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      )}
    </div>
  );
}

/** Page-level header used by every non-home route. */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-border pb-16 pt-36 md:pb-20 md:pt-44">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-aurora opacity-60" />
        <div className="absolute inset-0 bg-grid mask-fade-b opacity-60" />
      </div>

      <div className="container-page relative">
        {eyebrow && (
          <Reveal>
            <p className="mb-5 inline-flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
              <span className="h-px w-8 bg-gradient-to-r from-primary to-transparent" />
              {eyebrow}
            </p>
          </Reveal>
        )}

        <Reveal delay={0.05}>
          <h1 className="max-w-4xl font-display text-[clamp(2.5rem,6vw,4.25rem)] font-semibold leading-[1.05] tracking-[-0.04em]">
            {title}
          </h1>
        </Reveal>

        {description && (
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </p>
          </Reveal>
        )}

        {children && (
          <Reveal delay={0.18} className="mt-9">
            {children}
          </Reveal>
        )}
      </div>
    </header>
  );
}
