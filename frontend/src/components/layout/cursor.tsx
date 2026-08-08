"use client";

import * as React from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useHasPointer, usePrefersReducedMotion } from "@/hooks";

/**
 * Two-part cursor: a small dot that tracks the pointer exactly, and a larger
 * ring that lags behind on a spring. Elements opt into states with
 * `data-cursor="view"` / `data-cursor-label="Read case study"`, so no component
 * needs to import anything to participate.
 */
export function Cursor() {
  const hasPointer = useHasPointer();
  const reduced = usePrefersReducedMotion();
  const enabled = hasPointer && !reduced;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 380, damping: 34, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 380, damping: 34, mass: 0.5 });

  const [variant, setVariant] = React.useState<"default" | "hover" | "text" | "view">("default");
  const [label, setLabel] = React.useState("");
  const [visible, setVisible] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  React.useEffect(() => {
    if (!enabled) return;

    const onMove = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      if (!visible) setVisible(true);

      const target = (event.target as HTMLElement)?.closest?.(
        "[data-cursor], a, button, input, textarea, select, [role='button']",
      ) as HTMLElement | null;

      if (!target) {
        setVariant("default");
        setLabel("");
        return;
      }

      const explicit = target.dataset.cursor as typeof variant | undefined;
      if (explicit) {
        setVariant(explicit);
        setLabel(target.dataset.cursorLabel ?? "");
        return;
      }

      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") {
        setVariant("text");
        setLabel("");
      } else {
        setVariant("hover");
        setLabel("");
      }
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    document.documentElement.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.style.cursor = "";
    };
  }, [enabled, visible, x, y]);

  if (!enabled) return null;

  const ringSize = variant === "view" ? 72 : variant === "hover" ? 44 : variant === "text" ? 4 : 30;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] hidden lg:block">
      {/* Ring */}
      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border border-primary/60 backdrop-blur-[1px]"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: ringSize,
          height: variant === "text" ? 26 : ringSize,
          opacity: visible ? 1 : 0,
          scale: pressed ? 0.85 : 1,
          borderRadius: variant === "text" ? 2 : 999,
          backgroundColor:
            variant === "view"
              ? "color-mix(in oklch, var(--primary) 88%, transparent)"
              : "transparent",
          borderColor:
            variant === "text"
              ? "var(--primary)"
              : "color-mix(in oklch, var(--primary) 60%, transparent)",
        }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
      >
        <AnimatePresence>
          {variant === "view" && label && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="px-2 text-center text-[10px] font-semibold uppercase leading-tight tracking-wider text-primary-foreground"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Dot */}
      <motion.div
        className="absolute left-0 top-0 size-1.5 rounded-full bg-primary"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible && variant !== "view" && variant !== "text" ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      />
    </div>
  );
}
