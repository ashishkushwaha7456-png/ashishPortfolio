"use client";

import * as React from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks";

interface ParallaxProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Positive drifts down as you scroll, negative drifts up. */
  offset?: number;
  scaleRange?: [number, number];
  opacityFade?: boolean;
}

export function Parallax({
  children,
  className,
  offset = 60,
  scaleRange,
  opacityFade = false,
  ...props
}: ParallaxProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });
  const y = useTransform(smooth, [0, 1], [-offset, offset]);
  const scale = useTransform(smooth, [0, 0.5, 1], scaleRange ? [scaleRange[0], scaleRange[1], scaleRange[0]] : [1, 1, 1]);
  const opacity = useTransform(smooth, [0, 0.25, 0.75, 1], [0.4, 1, 1, 0.4]);

  return (
    <div ref={ref} className={cn("relative", className)} {...props}>
      <motion.div
        style={
          reduced
            ? undefined
            : { y, scale: scaleRange ? scale : undefined, opacity: opacityFade ? opacity : undefined }
        }
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}

/** Thin progress bar that tracks page scroll — used under the navbar. */
export function ScrollProgressBar({ className }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className={cn(
        "fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-[linear-gradient(90deg,oklch(0.62_0.22_275),oklch(0.66_0.19_320),oklch(0.74_0.14_200))]",
        className,
      )}
    />
  );
}
