"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PERSON } from "@/constants/site";
import { usePrefersReducedMotion } from "@/hooks";

const SESSION_KEY = "portfolio-intro-played";

/**
 * First-visit intro. Shown once per browser session — a loading screen on every
 * navigation is a tax, not a delight. Skipped entirely for reduced motion.
 */
export function LoadingScreen() {
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (reduced) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    setVisible(true);
    document.body.style.overflow = "hidden";

    let value = 0;
    const timer = setInterval(() => {
      // Ease toward 100 so it never stalls at a round number.
      value = Math.min(100, value + Math.max(1.5, (100 - value) * 0.14));
      setProgress(value);
      if (value >= 99.4) {
        clearInterval(timer);
        setTimeout(() => {
          sessionStorage.setItem(SESSION_KEY, "1");
          setVisible(false);
          document.body.style.overflow = "";
        }, 380);
      }
    }, 55);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = "";
    };
  }, [reduced]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background"
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          role="status"
          aria-label="Loading"
        >
          <div className="pointer-events-none absolute inset-0 bg-aurora opacity-70" />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center gap-6"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl border border-primary/40 animate-pulse-ring" />
              <div className="grid size-16 place-items-center rounded-2xl border border-border bg-card font-display text-2xl font-semibold">
                <span className="text-gradient">AK</span>
              </div>
            </div>

            <div className="text-center">
              <p className="font-display text-lg font-medium tracking-tight">{PERSON.name}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {PERSON.title}
              </p>
            </div>

            <div className="h-px w-56 overflow-hidden bg-border">
              <motion.div
                className="h-full bg-[linear-gradient(90deg,oklch(0.62_0.22_275),oklch(0.74_0.14_200))]"
                style={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>

            <p className="font-mono text-xs tabular-nums text-muted-foreground">
              {Math.round(progress)}%
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
