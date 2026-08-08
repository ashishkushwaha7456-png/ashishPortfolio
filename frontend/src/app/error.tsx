"use client";

import * as React from "react";
import Link from "next/link";
import { Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // In production this is where a reporter (Sentry et al.) would hook in.
    console.error("[app] unhandled error:", error);
  }, [error]);

  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-6 py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-aurora opacity-60" />

      <div className="relative w-full max-w-lg text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-destructive">
          Something went wrong
        </p>

        <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          That didn&apos;t load properly
        </h1>

        <p className="mt-4 text-muted-foreground">
          An unexpected error interrupted this page. Trying again usually clears it — if it
          doesn&apos;t, the issue is on my side.
        </p>

        {error.digest && (
          <p className="mt-5 inline-block rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-xs text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button size="lg" variant="gradient" className="rounded-full" onClick={reset}>
            <RotateCcw className="size-4" />
            Try again
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link href="/">
              <Home className="size-4" />
              Back home
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
