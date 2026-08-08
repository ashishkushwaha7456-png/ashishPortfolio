"use client";

import * as React from "react";
import { animate, useInView } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks";

interface CounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/**
 * Counts up when it scrolls into view. Writes to the DOM node directly rather
 * than through state so a page full of counters doesn't cause 60 renders/sec.
 */
export function Counter({
  value,
  duration = 1.8,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: CounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = usePrefersReducedMotion();

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (reduced || !inView) {
      if (reduced) node.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
      return;
    }

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(latest) {
        node.textContent = `${prefix}${latest.toFixed(decimals)}${suffix}`;
      },
    });

    return () => controls.stop();
  }, [inView, value, duration, decimals, prefix, suffix, reduced]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
