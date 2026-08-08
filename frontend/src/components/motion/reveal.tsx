"use client";

import * as React from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  blur?: boolean;
  as?: "div" | "section" | "article" | "li" | "span";
}

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * The scroll-reveal primitive used across the whole site. Deliberately
 * conservative: one transform + one opacity, no layout animation, so it stays
 * on the compositor and never triggers reflow.
 */
export function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.7,
  distance = 24,
  once = true,
  blur = false,
  as = "div",
  ...props
}: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-10% 0px -10% 0px" });
  const offset = offsets[direction];

  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      ref={ref}
      className={cn(className)}
      initial={{
        opacity: 0,
        x: offset.x * distance,
        y: offset.y * distance,
        filter: blur ? "blur(8px)" : undefined,
      }}
      animate={
        inView
          ? { opacity: 1, x: 0, y: 0, filter: blur ? "blur(0px)" : undefined }
          : undefined
      }
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      {children}
    </MotionTag>
  );
}

/* ── Staggered list ───────────────────────────────────────── */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};

export function StaggerGroup({
  children,
  className,
  delay = 0,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { delay?: number }) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ delayChildren: delay }}
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <motion.div
      className={className}
      variants={staggerItem}
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      {children}
    </motion.div>
  );
}
