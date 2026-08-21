"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/shared/section";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { Counter } from "@/components/motion/counter";
import { Parallax } from "@/components/motion/parallax";
import { Icon } from "@/components/ui/icon";
import type { About } from "@/types";

export function AboutPreview({ about }: { about: About }) {
  return (
    <Section id="about">
      <SectionHeading
        eyebrow="About"
        title={about.title}
        action={{ label: "Read the full story", href: "/about" }}
      />

      <div className="grid gap-14 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
        <div>
          <div className="space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {about.bio.slice(0, 2).map((paragraph, index) => (
              <Reveal key={index} delay={index * 0.08}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>

          {/* Stats */}
          <StaggerGroup className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
            {about.stats.map((stat) => (
              <StaggerItem key={stat.label} className="bg-background p-5">
                <Icon name={stat.icon} size={16} className="mb-3 text-primary" />
                <p className="font-display text-3xl font-semibold tracking-tight">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-xs leading-tight text-muted-foreground">{stat.label}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>

          {/* Philosophy */}
          <StaggerGroup className="mt-12 grid gap-4 sm:grid-cols-2">
            {about.philosophy.slice(0, 4).map((item) => (
              <StaggerItem
                key={item.title}
                className="group rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30"
              >
                <div className="mb-3 grid size-9 place-items-center rounded-xl border border-border bg-secondary/60 text-primary transition-colors group-hover:border-primary/40">
                  <Icon name={item.icon} size={16} />
                </div>
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>

        {/* Portrait + mission */}
        <div className="relative">
          <Parallax offset={30} className="lg:sticky lg:top-28">
            <div className="relative overflow-hidden rounded-3xl border border-border">
              <div className="relative aspect-[4/5]">
                <Image
                  src={about.image?.url ?? "/images/about-developer.svg"}
                  alt={about.image?.alt ?? "Portrait"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
                  Mission
                </p>
                <p className="mt-3 text-sm leading-relaxed">{about.mission}</p>
              </div>
            </div>

            <a
              href="/about"
              className="group mt-4 flex items-center justify-between rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <div>
                <p className="text-sm font-semibold">Career timeline</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {about.story.length} chapters, {about.location}
                </p>
              </div>
              <ArrowUpRight className="size-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
            </a>
          </Parallax>
        </div>
      </div>
    </Section>
  );
}
