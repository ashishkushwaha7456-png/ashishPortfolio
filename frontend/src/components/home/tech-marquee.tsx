"use client";

import { Marquee } from "@/components/motion/marquee";
import { Icon } from "@/components/ui/icon";
import type { Skill } from "@/types";

/**
 * Two counter-scrolling rows of the stack. Reads as texture rather than a list,
 * which is the point — the detailed version lives on /skills.
 */
export function TechMarquee({ skills }: { skills: Skill[] }) {
  const half = Math.ceil(skills.length / 2);
  const rows = [skills.slice(0, half), skills.slice(half)];

  return (
    <section
      id="marquee"
      aria-label="Technology stack"
      className="relative border-y border-border py-12"
    >
      <div className="pointer-events-none absolute inset-0 bg-dot opacity-60" />

      <div className="relative space-y-4">
        {rows.map((row, index) => (
          <Marquee key={index} reverse={index === 1} speed={index === 0 ? 46 : 54}>
            {row.map((skill) => (
              <div
                key={skill.name}
                className="flex items-center gap-2.5 rounded-full border border-border bg-card/60 px-5 py-2.5 backdrop-blur transition-colors hover:border-primary/40"
              >
                <Icon
                  name={skill.icon}
                  size={16}
                  className="text-muted-foreground"
                  style={skill.color ? { color: skill.color } : undefined}
                />
                <span className="whitespace-nowrap text-sm font-medium">{skill.name}</span>
                <span className="font-mono text-[0.6875rem] text-muted-foreground">
                  {skill.years}y
                </span>
              </div>
            ))}
          </Marquee>
        ))}
      </div>
    </section>
  );
}
