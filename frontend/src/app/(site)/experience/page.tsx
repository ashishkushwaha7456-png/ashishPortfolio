import Link from "next/link";
import { ArrowUpRight, Download } from "lucide-react";
import { PageHeader, Section, SectionHeading } from "@/components/shared/section";
import { ExperienceTimeline } from "@/components/shared/experience-timeline";
import { Reveal } from "@/components/motion/reveal";
import { Counter } from "@/components/motion/counter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getEducation,
  getExperience,
  getProjects,
  getSkills,
} from "@/services/content.service";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { durationBetween, formatDate, unique } from "@/lib/utils";
import { PERSON } from "@/constants/site";

export const revalidate = 3600;

export async function generateMetadata() {
  return buildMetadata({
    title: "Experience",
    description:
      "3+ years as a MERN stack developer at Ripenapps Technologies — React architecture, payment gateways, DRM streaming, KYC verification and real-time systems in production.",
    path: "/experience",
  });
}

export default async function ExperiencePage() {
  const [experience, education, projects, skills] = await Promise.all([
    getExperience(),
    getEducation(),
    getProjects(),
    getSkills(),
  ]);

  const totalTech = unique(experience.flatMap((job) => job.techStack)).length;

  const summary = [
    { label: "Years of experience", value: 3, suffix: "+" },
    { label: "Companies", value: experience.length, suffix: "" },
    { label: "Projects delivered", value: projects.length + 9, suffix: "+" },
    { label: "Technologies used", value: totalTech, suffix: "" },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Experience", path: "/experience" },
        ])}
      />

      <PageHeader
        eyebrow="Experience"
        title="Three years of shipping production software."
        description={`Currently a MERN Stack Developer at Ripenapps Technologies in ${PERSON.shortLocation}, owning frontend architecture across client products and the integrations behind them.`}
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" variant="gradient" className="rounded-full">
            <Link href="/resume">
              <Download className="size-4" />
              Download resume
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link href="/contact">
              Let&apos;s talk
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
      </PageHeader>

      {/* Summary tiles */}
      <div className="container-page -mt-8">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
          {summary.map((item) => (
            <div key={item.label} className="bg-background p-6">
              <dd className="font-display text-3xl font-semibold tracking-tight">
                <Counter value={item.value} suffix={item.suffix} />
              </dd>
              <dt className="mt-1.5 text-xs text-muted-foreground">{item.label}</dt>
            </div>
          ))}
        </dl>
      </div>

      <Section>
        <SectionHeading eyebrow="Timeline" title="Professional experience" />
        <ExperienceTimeline experiences={experience} detailed />
      </Section>

      {/* Capabilities */}
      <Section className="border-t border-border">
        <SectionHeading
          eyebrow="Capabilities"
          title="What I bring to a team"
          description="The work I'm asked for most often, and the work I'd choose anyway."
        />

        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: "Layers",
              title: "Frontend architecture",
              description:
                "Component systems, state boundaries and folder structures that stay legible as a team and a product grow.",
              points: ["Reusable UI kits", "Redux Toolkit + React Query split", "Route-level code splitting"],
            },
            {
              icon: "Plug",
              title: "Third-party integration",
              description:
                "Payments, identity, media and messaging — wrapped in adapters so swapping a provider isn't a rewrite.",
              points: ["Stripe · PayPal · Razorpay", "Persona KYC", "VdoCipher DRM · Firebase"],
            },
            {
              icon: "Gauge",
              title: "Performance & quality",
              description:
                "Bundle budgets, render profiling and accessibility built into review — not bolted on before launch.",
              points: ["Lazy loading & memoisation", "Web Vitals discipline", "WCAG-aware components"],
            },
          ].map((item, index) => (
            <Reveal
              key={item.title}
              delay={index * 0.08}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="mb-4 grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon name={item.icon} size={18} />
              </div>
              <h3 className="font-display text-lg font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
              <ul className="mt-4 space-y-2 border-t border-border pt-4">
                {item.points.map((point) => (
                  <li key={point} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="size-1 rounded-full bg-primary" />
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Education */}
      <Section className="border-t border-border">
        <SectionHeading eyebrow="Education" title="Academic background" />

        <div className="space-y-4">
          {education.map((item, index) => (
            <Reveal key={item.institution} delay={index * 0.06}>
              <article className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-start sm:p-7">
                <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon name="GraduationCap" size={20} />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-xl font-semibold tracking-tight">
                        {item.degree}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.institution} · {item.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs text-muted-foreground">
                        {formatDate(item.start, { year: "numeric" })} –{" "}
                        {formatDate(item.end, { year: "numeric" })}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground/70">
                        {durationBetween(item.start, item.end)}
                      </p>
                    </div>
                  </div>

                  {item.grade && (
                    <Badge variant="secondary" size="sm" className="mt-3">
                      {item.grade}
                    </Badge>
                  )}

                  {item.description && (
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Stack recap */}
      <Section className="border-t border-border">
        <SectionHeading
          eyebrow="Stack"
          title="Technologies used in production"
          action={{ label: "Full skills breakdown", href: "/skills" }}
        />
        <div className="flex flex-wrap gap-2">
          {unique(experience.flatMap((job) => job.techStack)).map((tech) => {
            const skill = skills.find((s) => s.name === tech);
            return (
              <span
                key={tech}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-sm"
              >
                <Icon
                  name={skill?.icon ?? "Dot"}
                  size={14}
                  className="text-muted-foreground"
                  style={skill?.color ? { color: skill.color } : undefined}
                />
                {tech}
              </span>
            );
          })}
        </div>
      </Section>
    </>
  );
}
