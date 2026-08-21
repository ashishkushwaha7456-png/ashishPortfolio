"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Command, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle, ThemeToggleButton } from "@/components/layout/theme-toggle";
import { Magnetic } from "@/components/motion/magnetic";
import { ScrollProgressBar } from "@/components/motion/parallax";
import { NAV_LINKS, PERSON, SECONDARY_NAV_LINKS } from "@/constants/site";
import { cn } from "@/lib/utils";
import { useLockBodyScroll, useScrollPosition } from "@/hooks";

export function Navbar() {
  const pathname = usePathname();
  const { scrolled, direction, atTop } = useScrollPosition(24);
  const [open, setOpen] = React.useState(false);

  useLockBodyScroll(open);
  React.useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const hidden = direction === "down" && !open && !atTop;

  return (
    <>
      <ScrollProgressBar />

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? -110 : 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50 pt-3"
      >
        <nav
          aria-label="Primary"
          className={cn(
            "container-page flex items-center justify-between gap-4 rounded-2xl py-2.5 transition-all duration-300",
            scrolled
              ? "mx-auto max-w-6xl glass-strong shadow-[0_8px_32px_-16px_rgba(0,0,0,0.4)]"
              : "bg-transparent",
          )}
        >
          {/* Wordmark */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5 rounded-lg"
            aria-label={`${PERSON.name} — home`}
          >
            <span className="relative grid size-9 place-items-center overflow-hidden rounded-xl border border-border bg-card font-display text-sm font-semibold">
              <span className="text-gradient">AK</span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </span>
            <span className="hidden text-sm font-semibold tracking-tight sm:block">
              {PERSON.name}
              <span className="block text-[0.6875rem] font-normal text-muted-foreground">
                {PERSON.title}
              </span>
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-0.5 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "relative rounded-lg px-3 py-1.5 text-sm transition-colors duration-200",
                    isActive(link.href)
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-lg bg-secondary"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden md:inline-flex" />
            <ThemeToggleButton className="md:hidden" />

            {/* <Magnetic className="hidden sm:inline-flex" strength={0.25}>
              <Button asChild size="sm" variant="gradient" className="rounded-full">
                <Link href="/contact">
                  Let&apos;s talk
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
            </Magnetic> */}

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-9 place-items-center rounded-xl border border-border bg-background/60 lg:hidden"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <div className="container-page flex h-full flex-col justify-center gap-1 pb-16 pt-24">
              {[...NAV_LINKS, ...SECONDARY_NAV_LINKS].map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + index * 0.045, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Downloads must be plain anchors — next/link would try to
                      client-navigate to the file instead of saving it. */}
                  {"download" in link && link.download ? (
                    <a
                      href={link.href}
                      download
                      className="flex items-baseline justify-between border-b border-border/60 py-4 font-display text-3xl font-medium tracking-tight transition-colors hover:text-primary"
                    >
                      {link.label}
                      <span className="font-mono text-xs text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-baseline justify-between border-b border-border/60 py-4 font-display text-3xl font-medium tracking-tight transition-colors",
                        isActive(link.href) ? "text-primary" : "hover:text-primary",
                      )}
                    >
                      {link.label}
                      <span className="font-mono text-xs text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </Link>
                  )}
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 flex flex-col gap-3"
              >
                {/* <Button asChild size="lg" variant="gradient" className="w-full">
                  <Link href="/contact">Let&apos;s talk</Link>
                </Button> */}
                <div className="flex items-center justify-between gap-3">
                  <ThemeToggle />
                  <a
                    href={`mailto:${PERSON.email}`}
                    className="truncate text-xs text-muted-foreground"
                  >
                    {PERSON.email}
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Small hint shown in the footer — the palette itself lives in command-palette.tsx */
export function CommandHint() {
  return (
    <span className="hidden items-center gap-1 text-xs text-muted-foreground md:inline-flex">
      <kbd className="inline-flex items-center gap-0.5 rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px]">
        <Command className="size-2.5" />K
      </kbd>
      to search
    </span>
  );
}
