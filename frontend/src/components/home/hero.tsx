"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Magnetic } from "@/components/motion/magnetic";
import { TextReveal, Typing } from "@/components/motion/text-reveal";
import { ParticleField } from "@/components/home/particle-field";
import { PERSON } from "@/constants/site";
import { cn } from "@/lib/utils";
import type { Hero as HeroData, SocialLink } from "@/types";

/* The WebGL scene is ~90KB of three.js — it must never block first paint. */
const HeroScene = dynamic(
  () => import("@/components/home/hero-scene").then((m) => m.HeroScene),
  { ssr: false },
);

interface HeroProps {
  hero: HeroData;
  socials: SocialLink[];
}

export function Hero({ hero, socials }: HeroProps) {
  const ref = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  const heroSocials = socials.filter((s) => s.showInHero);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-20 pt-32 noise"
    >
      {/* Background layers */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-aurora animate-aurora" />
        <div className="absolute inset-0 bg-grid mask-fade-b opacity-70" />
        <ParticleField />
        <div className="absolute -left-40 top-1/4 size-[38rem] rounded-full bg-primary/12 blur-[140px] animate-float" />
        <div
          className="absolute -right-32 bottom-0 size-[32rem] rounded-full bg-accent/12 blur-[130px] animate-float"
          style={{ animationDelay: "2.5s" }}
        />
      </div>

      <motion.div style={{ y, opacity, scale }} className="container-page relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
          {/* ── Copy ─────────────────────────────────────── */}
          <div className="max-w-2xl">
            {/* Availability pill */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-border bg-card/60 py-1.5 pl-2 pr-4 text-sm backdrop-blur"
            >
              <span className="relative grid size-5 place-items-center">
                <span
                  className={cn(
                    "absolute size-2 rounded-full",
                    hero.availability.open ? "bg-[var(--success)]" : "bg-muted-foreground",
                  )}
                />
                {hero.availability.open && (
                  <span className="absolute size-2 rounded-full bg-[var(--success)] animate-pulse-ring" />
                )}
              </span>
              <span className="text-muted-foreground">{hero.eyebrow}</span>
            </motion.div>

            {/* Headline */}
            <h1 className="font-display text-[clamp(2.5rem,7.5vw,4.75rem)] font-semibold leading-[1.03] tracking-[-0.04em]">
              <TextReveal
                as="span"
                text={hero.name}
                className="block"
                delay={0.1}
                stagger={0.06}
              />
              <span className="mt-2 block text-[clamp(1.375rem,3.4vw,2.25rem)] font-medium leading-tight text-muted-foreground">
                <Typing words={hero.roles} className="text-gradient-animated" />
              </span>
            </h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              {hero.subheadline}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              {hero.ctas
                .filter((cta) => cta.variant !== "ghost")
                .map((cta, index) => (
                  <Magnetic key={cta.label} strength={index === 0 ? 0.32 : 0.22}>
                    <Button
                      asChild
                      size="lg"
                      variant={
                        cta.variant === "primary"
                          ? "gradient"
                          : cta.variant === "secondary"
                            ? "secondary"
                            : "outline"
                      }
                      className="rounded-full"
                    >
                      {/* A file href is a download, not a route — next/link
                          would try to client-navigate to the PDF. */}
                      {cta.href.endsWith(".pdf") ? (
                        <a href={cta.href} download>
                          <Icon name={cta.icon} size={16} />
                          {cta.label}
                        </a>
                      ) : (
                        <Link
                          href={cta.href}
                          target={cta.external ? "_blank" : undefined}
                          rel={cta.external ? "noreferrer noopener" : undefined}
                        >
                          <Icon name={cta.icon} size={16} />
                          {cta.label}
                        </Link>
                      )}
                    </Button>
                  </Magnetic>
                ))}
            </motion.div>

            {/* Socials + location */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4"
            >
              <div className="flex items-center gap-2">
                {heroSocials.map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target={social.url.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer noopener"
                    aria-label={social.label}
                    data-cursor="hover"
                    className="grid size-10 place-items-center rounded-xl border border-border bg-card/60 text-muted-foreground backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
                  >
                    <Icon name={social.icon} size={17} />
                  </a>
                ))}
              </div>

              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-3.5" />
                {PERSON.shortLocation}
              </span>
            </motion.div>
          </div>

          {/* ── Visual ───────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <div className="relative aspect-square">
              <HeroScene className="absolute inset-0 -m-16 size-[calc(100%+8rem)]" />

              {/* Portrait */}
              <div className="absolute inset-[14%] overflow-hidden rounded-[2rem] border border-border/70 bg-card/40 backdrop-blur-sm">
                <Image
                  src={hero.avatar.url}
                  alt={hero.avatar.alt ?? PERSON.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 60vw, 30vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
              </div>

              {/* Floating stat cards */}
              {hero.highlights.slice(0, 2).map((highlight, index) => (
                <motion.div
                  key={highlight.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "absolute glass rounded-2xl px-4 py-3 animate-float",
                    index === 0 ? "-left-2 top-[18%] sm:left-0" : "-right-2 bottom-[16%] sm:right-0",
                  )}
                  style={{ animationDelay: `${index * 1.8}s` }}
                >
                  <p className="font-display text-2xl font-semibold leading-none">
                    {highlight.value}
                    <span className="text-gradient">{highlight.suffix}</span>
                  </p>
                  <p className="mt-1 max-w-[8rem] text-[0.6875rem] leading-tight text-muted-foreground">
                    {highlight.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        style={{ opacity }}
        aria-label="Scroll to content"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground md:flex"
      >
        <span className="text-[0.625rem] uppercase tracking-[0.3em]">Scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="size-4" />
        </motion.span>
      </motion.a>
    </section>
  );
}

/** Stat strip rendered directly beneath the hero. */
export function HeroHighlights({ hero }: { hero: HeroData }) {
  return (
    <div className="container-page">
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
        {hero.highlights.map((highlight) => (
          <div key={highlight.label} className="bg-background p-6 text-center">
            <dt className="sr-only">{highlight.label}</dt>
            <dd>
              <span className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                {highlight.value}
                <span className="text-gradient">{highlight.suffix}</span>
              </span>
              <span className="mt-1.5 block text-xs text-muted-foreground">
                {highlight.label}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
