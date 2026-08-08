"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks";

interface TextRevealProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  by?: "word" | "char" | "line";
  once?: boolean;
}

/**
 * Splits text and reveals it piece by piece. Each piece lives inside an
 * `overflow-hidden` wrapper so the type slides up from a clean mask edge
 * rather than fading in place.
 */
export function TextReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.045,
  as: Tag = "p",
  by = "word",
  once = true,
}: TextRevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-12% 0px" });
  const reduced = usePrefersReducedMotion();

  const pieces = React.useMemo(() => {
    if (by === "char") return text.split("");
    if (by === "line") return text.split("\n");
    return text.split(" ");
  }, [text, by]);

  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className}>
      <span ref={ref as React.RefObject<HTMLSpanElement>} className="inline">
        <span className="sr-only">{text}</span>
        <span aria-hidden className={by === "line" ? "block" : "inline"}>
          {pieces.map((piece, index) => (
            <span
              key={`${piece}-${index}`}
              className={cn(
                "overflow-hidden pb-[0.12em]",
                by === "line" ? "block" : "inline-block",
                wordClassName,
              )}
            >
              <motion.span
                className="inline-block will-change-transform"
                initial={{ y: "115%", opacity: 0 }}
                animate={inView ? { y: "0%", opacity: 1 } : undefined}
                transition={{
                  duration: 0.85,
                  delay: delay + index * stagger,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {piece === " " ? " " : piece}
                {by === "word" && index < pieces.length - 1 ? " " : ""}
              </motion.span>
            </span>
          ))}
        </span>
      </span>
    </Tag>
  );
}

/* ── Typing animation (hero role cycler) ──────────────────── */
interface TypingProps {
  words: string[];
  className?: string;
  cursorClassName?: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  pause?: number;
}

export function Typing({
  words,
  className,
  cursorClassName,
  typeSpeed = 65,
  deleteSpeed = 32,
  pause = 1800,
}: TypingProps) {
  const [index, setIndex] = React.useState(0);
  const [text, setText] = React.useState("");
  const [deleting, setDeleting] = React.useState(false);
  const reduced = usePrefersReducedMotion();

  React.useEffect(() => {
    if (reduced || !words.length) return;
    const current = words[index % words.length];

    if (!deleting && text === current) {
      const timer = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(timer);
    }

    if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
      return;
    }

    const timer = setTimeout(
      () =>
        setText((prev) =>
          deleting ? current.slice(0, prev.length - 1) : current.slice(0, prev.length + 1),
        ),
      deleting ? deleteSpeed : typeSpeed,
    );
    return () => clearTimeout(timer);
  }, [text, deleting, index, words, typeSpeed, deleteSpeed, pause, reduced]);

  if (reduced) {
    return <span className={className}>{words[0]}</span>;
  }

  return (
    <span className={cn("inline-flex items-baseline", className)}>
      {/* Reserve the widest word so the layout never jumps mid-type. */}
      <span className="relative">
        <span className="invisible" aria-hidden>
          {words.reduce((a, b) => (a.length > b.length ? a : b), "")}
        </span>
        <span className="absolute inset-0 whitespace-nowrap" aria-live="polite">
          {text}
          <span
            className={cn(
              "ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.12em] bg-current animate-blink",
              cursorClassName,
            )}
            aria-hidden
          />
        </span>
      </span>
    </span>
  );
}
