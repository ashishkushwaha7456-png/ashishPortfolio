"use client";

import * as React from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { useHasPointer, usePrefersReducedMotion } from "@/hooks";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  glare?: boolean;
  scale?: number;
}

/**
 * 3D tilt with a light sheen that tracks the cursor. Used sparingly — project
 * cards and stat tiles — because tilt everywhere reads as a template.
 */
export function TiltCard({
  children,
  className,
  max = 8,
  glare = true,
  scale = 1.015,
  ...props
}: TiltCardProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const hasPointer = useHasPointer();
  const reduced = usePrefersReducedMotion();
  const enabled = hasPointer && !reduced;

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);

  const spring = { stiffness: 220, damping: 20, mass: 0.35 };
  const rotateX = useSpring(rx, spring);
  const rotateY = useSpring(ry, spring);
  const glareBg = useMotionTemplate`radial-gradient(500px circle at ${gx}% ${gy}%, rgba(255,255,255,0.14), transparent 45%)`;

  const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rx.set((0.5 - py) * max * 2);
    ry.set((px - 0.5) * max * 2);
    gx.set(px * 100);
    gy.set(py * 100);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
    gx.set(50);
    gy.set(50);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={reset}
      whileHover={enabled ? { scale } : undefined}
      style={
        enabled
          ? { rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }
          : undefined
      }
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className={cn("relative", className)}
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      {children}
      {enabled && glare && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glareBg }}
        />
      )}
    </motion.div>
  );
}
