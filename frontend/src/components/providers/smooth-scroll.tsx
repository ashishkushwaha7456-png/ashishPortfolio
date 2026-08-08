"use client";

import * as React from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { usePrefersReducedMotion } from "@/hooks";

const LenisContext = React.createContext<Lenis | null>(null);
export const useLenis = () => React.useContext(LenisContext);

/**
 * Lenis inertial scrolling, driven from a single rAF loop.
 *
 * Two things matter here: it must not run when the user prefers reduced
 * motion, and it must reset to the top on navigation — Lenis owns the scroll
 * position, so Next's default restoration silently does nothing.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = React.useState<Lenis | null>(null);
  const reduced = usePrefersReducedMotion();
  const pathname = usePathname();

  React.useEffect(() => {
    if (reduced) return;

    const instance = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      infinite: false,
    });

    setLenis(instance);

    let frame = 0;
    const raf = (time: number) => {
      instance.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      instance.destroy();
      setLenis(null);
    };
  }, [reduced]);

  React.useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  /* Anchor links have to go through Lenis or they jump. */
  React.useEffect(() => {
    if (!lenis) return;
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement)?.closest?.('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href")?.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -96 });
      history.replaceState(null, "", `#${id}`);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
