import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PageHeader, Section, SectionHeading } from "@/components/shared/section";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { Counter } from "@/components/motion/counter";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/seo/json-ld";
import { getAchievements, getEducation, getTestimonials } from "@/services/content.service";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { cn, formatDate, groupBy } from "@/lib/utils";

export const revalidate = 3600;

const TYPE_META = {
  milestone: { label: "Milestone", icon: "Rocket", tone: "text-primary bg-primary/10" },
  certification: { label: "Certification", icon: "BadgeCheck", tone: "text-[var(--success)] bg-[color-mix(in_oklch,var(--success)_14%,transparent)]" },
  award: { label: "Award", icon: "Trophy", tone: "text-[var(--warning)] bg-[color-mix(in_oklch,var(--warning)_15%,transparent)]" },
  publication: { label: "Publication", icon: "BookOpen", tone: "text-accent bg-accent/10" },
  talk: { label: "Talk", icon: "Mic", tone: "text-destructive bg-destructive/10" },
} as const;

export async function generateMetadata() {
  return buildMetadata({
    title: "Achievements",
    description:
      "Production milestones, certifications and the engineering work worth calling out — DRM streaming, multi-gateway payments, KYC verification and streaming AI chat.",
    path: "/achievements",
  });
}

export default async function AchievementsPage() {
  const [achievements, education, testimonials] = await Promise.all([
    getAchievements(),
    getEducation(),
    getTestimonials(),
  ]);

  const byType = groupBy(achievements, (a) => a.type);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Achievements", path: "/achievements" },
        ])}
      />

      <PageHeader
        eyebrow="Achievements"
        title="Milestones worth writing down."
        description="Not badges — the systems that made it to production and the problems that were genuinely hard to solve."
      />

      <div className="container-page -mt-8">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
          {[
            { label: "Total achievements", value: achievements.length },
            { label: "Production milestones", value: (byType.milestone ?? []).length },
            { label: "Qualifications", value: education.length + (byType.certification ?? []).length },
            { label: "Endorsements", value: testimonials.length },
          ].map((item) => (
            <div key={item.label} className="bg-background p-6">
              <dd className="font-display text-3xl font-semibold tracking-tight">
                <Counter value={item.value} />
              </dd>
              <dt className="mt-1.5 text-xs text-muted-foreground">{item.label}</dt>
            </div>
          ))}
        </dl>
      </div>

      <Section>
        <SectionHeading
          eyebrow="Timeline"
          title="What I've shipped and earned"
          description="Ordered by significance, newest first."
        />

        <StaggerGroup className="grid gap-5 md:grid-cols-2">
          {achievements.map((item) => {
            const meta = TYPE_META[item.type] ?? TYPE_META.milestone;
            return (
              <StaggerItem
                key={item.title}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/15"
              >
                <div className="flex items-start gap-4">
                  <div className={cn("grid size-11 shrink-0 place-items-center rounded-xl", meta.tone)}>
                    <Icon name={meta.icon} size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge variant="outline" size="sm">
                        {meta.label}
                      </Badge>
                      <span className="font-mono text-xs text-muted-foreground">
                        {formatDate(item.date)}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-semibold leading-snug tracking-tight">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.issuer}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>

                    {item.credentialUrl && (
                      <Link
                        href={item.credentialUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                      >
                        View credential
                        <ExternalLink className="size-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </Section>

      {/* Education as credentials */}
      <Section className="border-t border-border">
        <SectionHeading eyebrow="Qualifications" title="Formal education" />
        <div className="grid gap-4 md:grid-cols-2">
          {education.map((item, index) => (
            <Reveal key={item.institution} delay={index * 0.06}>
              <article className="flex gap-4 rounded-2xl border border-border bg-card p-6">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon name="GraduationCap" size={18} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight">
                    {item.degree}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.institution}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" size="sm">
                      {formatDate(item.start, { year: "numeric" })} –{" "}
                      {formatDate(item.end, { year: "numeric" })}
                    </Badge>
                    {item.grade && (
                      <Badge variant="outline" size="sm">
                        {item.grade}
                      </Badge>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
