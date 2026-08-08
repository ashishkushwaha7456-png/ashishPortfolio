import Link from "next/link";
import { ArrowLeft, Home, Mail, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, PERSON } from "@/constants/site";

export const metadata = {
  title: "404 — Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-6 py-24 noise">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-aurora animate-aurora" />
        <div className="absolute inset-0 bg-grid mask-fade-b opacity-60" />
      </div>

      <div className="relative w-full max-w-2xl text-center">
        <p
          aria-hidden
          className="select-none font-display text-[clamp(6rem,22vw,14rem)] font-bold leading-none tracking-tighter text-gradient"
        >
          404
        </p>

        <h1 className="-mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          This page doesn&apos;t exist
        </h1>

        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          The link may be stale, or the page may have moved. Nothing broke on your end —
          here&apos;s the way back.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" variant="gradient" className="rounded-full">
            <Link href="/">
              <Home className="size-4" />
              Back home
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link href="/projects">
              <Search className="size-4" />
              Browse projects
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="rounded-full">
            <a href={`mailto:${PERSON.email}`}>
              <Mail className="size-4" />
              Report a broken link
            </a>
          </Button>
        </div>

        <nav aria-label="Site pages" className="mt-14 border-t border-border pt-8">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Or jump to
          </p>
          <ul className="flex flex-wrap justify-center gap-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="mt-10 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <ArrowLeft className="size-3" />
          Or press the back button — that works too.
        </p>
      </div>
    </main>
  );
}
