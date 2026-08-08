import { PageHeader, Section, SectionHeading } from "@/components/shared/section";
import { SkillGrid } from "@/components/shared/skill-grid";
import { Reveal } from "@/components/motion/reveal";
import { Counter } from "@/components/motion/counter";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/seo/json-ld";
import { getSkills, getSkillsByCategory } from "@/services/content.service";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { SKILL_CATEGORIES } from "@/constants/site";

export const revalidate = 3600;

export async function generateMetadata() {
  return buildMetadata({
    title: "Skills",
    description:
      "The full technical toolkit: React, Next.js, TypeScript, Node, Express, MongoDB, Redux Toolkit, React Query, Socket.IO, Stripe, Framer Motion and the rest of the production stack.",
    path: "/skills",
  });
}

export default async function SkillsPage() {
  const [skills, groups] = await Promise.all([getSkills(), getSkillsByCategory()]);

  const featured = skills.filter((s) => s.featured);
  const expert = skills.filter((s) => s.level >= 85);
  const averageLevel = Math.round(skills.reduce((sum, s) => sum + s.level, 0) / skills.length);

  /* Keep the canonical category order rather than whatever Mongo returns. */
  const ordered = [...groups].sort(
    (a, b) =>
      SKILL_CATEGORIES.indexOf(a.category as (typeof SKILL_CATEGORIES)[number]) -
      SKILL_CATEGORIES.indexOf(b.category as (typeof SKILL_CATEGORIES)[number]),
  );

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Skills", path: "/skills" },
        ])}
      />

      <PageHeader
        eyebrow="Toolkit"
        title="Everything I build with, and how well."
        description="Honest levels — 90+ means I've shipped it repeatedly under production constraints and debugged it when it broke. Nothing here is from a tutorial."
      />

      {/* Summary */}
      <div className="container-page -mt-8">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
          {[
            { label: "Technologies", value: skills.length, suffix: "" },
            { label: "Categories", value: groups.length, suffix: "" },
            { label: "At expert level", value: expert.length, suffix: "" },
            { label: "Average proficiency", value: averageLevel, suffix: "%" },
          ].map((item) => (
            <div key={item.label} className="bg-background p-6">
              <dd className="font-display text-3xl font-semibold tracking-tight">
                <Counter value={item.value} suffix={item.suffix} />
              </dd>
              <dt className="mt-1.5 text-xs text-muted-foreground">{item.label}</dt>
            </div>
          ))}
        </dl>
      </div>

      {/* Core stack */}
      <Section>
        <SectionHeading
          eyebrow="Core stack"
          title={
            <>
              What I reach for
              <span className="text-gradient"> first</span>
            </>
          }
          description="The tools I use daily and know deeply enough to make architectural calls with."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((skill, index) => (
            <Reveal
              key={skill.name}
              delay={index * 0.04}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/15"
            >
              <span
                aria-hidden
                className="absolute -right-6 -top-6 size-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30"
                style={{ backgroundColor: skill.color ?? "var(--primary)" }}
              />

              <div className="relative flex items-start justify-between gap-4">
                <div
                  className="grid size-11 place-items-center rounded-xl border border-border bg-secondary/60"
                  style={skill.color ? { color: skill.color } : undefined}
                >
                  <Icon name={skill.icon} size={19} />
                </div>
                <Badge variant="outline" size="sm">
                  {skill.years}+ yrs
                </Badge>
              </div>

              <h3 className="relative mt-4 font-display text-lg font-semibold tracking-tight">
                {skill.name}
              </h3>

              {skill.description && (
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                  {skill.description}
                </p>
              )}

              <div className="relative mt-5">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Proficiency</span>
                  <span className="font-mono tabular-nums">{skill.level}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${skill.level}%`,
                      background: skill.color
                        ? `linear-gradient(90deg, ${skill.color}, color-mix(in oklch, ${skill.color} 55%, transparent))`
                        : "var(--gradient-brand)",
                    }}
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Full breakdown */}
      <Section className="border-t border-border">
        <SectionHeading
          eyebrow="Full breakdown"
          title="Every category"
          description="Grouped by what the tool is for, not by how impressive it sounds."
        />
        <SkillGrid groups={ordered} />
      </Section>

      {/* Learning */}
      <Section className="border-t border-border">
        <SectionHeading eyebrow="Next" title="What I'm learning now" align="center" />

        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
          {[
            {
              icon: "Server",
              title: "Edge & streaming SSR",
              description: "Partial prerendering, streaming boundaries and edge runtime trade-offs.",
            },
            {
              icon: "TestTube2",
              title: "Testing discipline",
              description: "Playwright end-to-end coverage and React Testing Library at component level.",
            },
            {
              icon: "Boxes",
              title: "System design",
              description: "Queues, caching layers and designing for the failure case first.",
            },
          ].map((item, index) => (
            <Reveal
              key={item.title}
              delay={index * 0.06}
              className="rounded-2xl border border-dashed border-border bg-card/50 p-6 text-center"
            >
              <div className="mx-auto mb-4 grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon name={item.icon} size={18} />
              </div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
