"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import type { Skill } from "@/types";

/** A single skill row with an animated proficiency bar. */
function SkillBar({ skill, delay = 0 }: { skill: Skill; delay?: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <div ref={ref} className="group">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <Icon
            name={skill.icon}
            size={15}
            className="shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
            style={skill.color ? { color: skill.color } : undefined}
          />
          <span className="truncate text-sm font-medium">{skill.name}</span>
        </div>
        <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
          {skill.level}%
        </span>
      </div>

      <div
        className="h-1.5 overflow-hidden rounded-full bg-secondary"
        role="progressbar"
        aria-valuenow={skill.level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${skill.name} proficiency`}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : undefined}
          transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full"
          style={{
            background: skill.color
              ? `linear-gradient(90deg, ${skill.color}, color-mix(in oklch, ${skill.color} 60%, transparent))`
              : "var(--gradient-brand)",
          }}
        />
      </div>

      {skill.description && (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {skill.description}
        </p>
      )}
    </div>
  );
}

interface SkillGridProps {
  groups: { category: string; items: Skill[]; average: number }[];
  className?: string;
}

export function SkillGrid({ groups, className }: SkillGridProps) {
  return (
    <div className={cn("grid gap-6 md:grid-cols-2 xl:grid-cols-3", className)}>
      {groups.map((group, index) => (
        <Reveal
          key={group.category}
          delay={index * 0.06}
          className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/15"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold tracking-tight">
              {group.category}
            </h3>
            <span className="rounded-full border border-border bg-secondary/60 px-2.5 py-0.5 font-mono text-[0.6875rem] text-muted-foreground">
              {group.items.length}
            </span>
          </div>

          <div className="space-y-5">
            {group.items.map((skill, i) => (
              <SkillBar key={skill.name} skill={skill} delay={i * 0.05} />
            ))}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/** Compact chip cloud used on the home page. */
export function SkillCloud({ skills }: { skills: Skill[] }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {skills.map((skill, index) => (
        <motion.span
          key={skill.name}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.025 }}
          className="group inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40"
        >
          <Icon
            name={skill.icon}
            size={14}
            className="text-muted-foreground transition-colors group-hover:text-primary"
            style={skill.color ? { color: skill.color } : undefined}
          />
          {skill.name}
        </motion.span>
      ))}
    </div>
  );
}
