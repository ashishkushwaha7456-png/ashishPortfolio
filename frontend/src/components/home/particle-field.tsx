"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks";

interface ParticleFieldProps {
  className?: string;
  density?: number;
  /** Draw a line between particles closer than this many pixels. */
  linkDistance?: number;
  interactive?: boolean;
}

/**
 * Canvas 2D constellation field behind the hero.
 *
 * 2D rather than WebGL because it costs a fraction of the memory and the
 * hero already owns a WebGL context. Particle count scales with viewport area
 * so a phone doesn't render a desktop's worth of points.
 */
export function ParticleField({
  className,
  density = 0.00008,
  linkDistance = 130,
  interactive = true,
}: ParticleFieldProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let frame = 0;
    let running = true;
    let width = 0;
    let height = 0;
    let dpr = 1;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      alpha: number;
    }
    let particles: Particle[] = [];

    const mouse = { x: -9999, y: -9999 };

    const seed = () => {
      const count = Math.min(160, Math.max(28, Math.floor(width * height * density)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.4 + 0.5,
        alpha: Math.random() * 0.5 + 0.25,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const readColor = () => {
      const styles = getComputedStyle(document.documentElement);
      return styles.getPropertyValue("--particle-rgb").trim() || "139, 124, 246";
    };
    let rgb = readColor();

    const draw = () => {
      frame = requestAnimationFrame(draw);
      if (!running) return;

      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap rather than bounce — bouncing creates visible edges.
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        if (interactive) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 110 && distance > 0.01) {
            const push = (110 - distance) / 110;
            p.x += (dx / distance) * push * 1.5;
            p.y += (dy / distance) * push * 1.5;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${p.alpha})`;
        ctx.fill();
      }

      // Links — O(n²) but n is capped at 160, so ~12k cheap comparisons.
      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distanceSq = dx * dx + dy * dy;
          if (distanceSq > linkDistance * linkDistance) continue;
          const opacity = (1 - Math.sqrt(distanceSq) / linkDistance) * 0.22;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${rgb}, ${opacity})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };
    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const observer = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting;
    });
    observer.observe(canvas);

    const themeObserver = new MutationObserver(() => {
      rgb = readColor();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    resize();
    window.addEventListener("resize", resize);
    if (interactive) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      document.addEventListener("mouseleave", onMouseLeave);
    }
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [density, linkDistance, interactive, reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
    />
  );
}
