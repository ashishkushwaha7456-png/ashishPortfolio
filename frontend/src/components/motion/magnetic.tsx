"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useHasPointer, usePrefersReducedMotion } from "@/hooks";

interface MagneticProps extends React.HTMLAttributes<HTMLDivElement> {
  strength?: number;
  /** How far the inner content trails the wrapper — adds depth. */
  innerStrength?: number;
  radius?: number;
}

/**
 * Pulls its child toward the cursor while hovered. Disabled entirely on touch
 * devices and when the user prefers reduced motion.
 */
export function Magnetic({
  children,
  className,
  strength = 0.35,
  innerStrength = 0.15,
  radius = 120,
  ...props
}: MagneticProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const hasPointer = useHasPointer();
  const reduced = usePrefersReducedMotion();
  const enabled = hasPointer && !reduced;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 260, damping: 22, mass: 0.4 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);
  const ix = useTransform(sx, (v) => v * (innerStrength / strength) * -1);
  const iy = useTransform(sy, (v) => v * (innerStrength / strength) * -1);

  const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const distance = Math.hypot(dx, dy);
    const falloff = Math.max(0, 1 - distance / (radius + rect.width / 2));
    x.set(dx * strength * falloff);
    y.set(dy * strength * falloff);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={cn("relative inline-flex", className)}
      style={enabled ? { x: sx, y: sy } : undefined}
      onMouseMove={onMouseMove}
      onMouseLeave={reset}
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      <motion.span
        className="inline-flex w-full"
        style={enabled ? { x: ix, y: iy } : undefined}
      >
        {children}
      </motion.span>
    </motion.div>
  );
}
