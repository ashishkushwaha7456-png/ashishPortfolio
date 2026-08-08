import Link from "next/link";
import { Download, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { PageHeader, Section } from "@/components/shared/section";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { JsonLd } from "@/components/seo/json-ld";
import { ResumeActions } from "@/components/resume/resume-actions";
import {
  getAchievements,
  getEducation,
  getExperience,
  getHero,
  getProjects,
  getResume,
  getSkillsByCategory,
} from "@/services/content.service";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { PERSON } from "@/constants/site";
import { formatDate, formatDateRange } from "@/lib/utils";

export const revalidate = 3600;

export async function generateMetadata() {
  return buildMetadata({
    title: "Resume",
    description:
      "Download Ashish Kumar's resume — MERN Stack Developer with 3+ years building React, Next.js, TypeScript, Node.js and MongoDB applications in production.",
    path: "/resume",
  });
}

export default async function ResumePage() {
  const [resume, hero, experience, education, skillGroups, achievements, projects] =
    await Promise.all([
      getResume(),
      getHero(),
      getExperience(),
      getEducation(),
      getSkillsByCategory(),
      getAchievements(),
      getProjects(),
    ]);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Resume", path: "/resume" },
        ])}
      />

      <PageHeader
        eyebrow="Resume"
        title="The one-page version."
        description={`Last updated ${formatDate(resume.updatedOn, { day: "numeric", month: "long", year: "numeric" })}. Read it here, or take the PDF.`}
      >
        <ResumeActions fileUrl={resume.fileUrl} />
      </PageHeader>

      <Section spacious={false} className="py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
          {/* ── Printable resume ─────────────────────────── */}
          <article className="min-w-0 rounded-2xl border border-border bg-card p-8 sm:p-10">
            {/* Header */}
            <header className="border-b border-border pb-7">
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                {PERSON.name}
              </h2>
              <p className="mt-1.5 text-base text-muted-foreground">
                {PERSON.title} · {PERSON.subtitle}
              </p>

              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <a href={`mailto:${PERSON.email}`} className="inline-flex items-center gap-1.5 hover:text-foreground">
                  <Mail className="size-3.5" />
                  {PERSON.email}
                </a>
                <a href={`tel:${PERSON.phoneRaw}`} className="inline-flex items-center gap-1.5 hover:text-foreground">
                  <Phone className="size-3.5" />
                  {PERSON.phone}
                </a>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  {PERSON.shortLocation}
                </span>
                <a href={PERSON.linkedin} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1.5 hover:text-foreground">
                  <ExternalLink className="size-3.5" />
                  LinkedIn
                </a>
                <a href={PERSON.github} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1.5 hover:text-foreground">
                  <ExternalLink className="size-3.5" />
                  GitHub
                </a>
              </div>
            </header>

            {/* Summary */}
            <ResumeSection title="Summary">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {hero.subheadline}
              </p>
            </ResumeSection>

            {/* Skills */}
            <ResumeSection title="Technical skills">
              <dl className="space-y-2.5">
                {skillGroups.map((group) => (
                  <div key={group.category} className="flex flex-col gap-1 sm:flex-row sm:gap-3">
                    <dt className="w-44 shrink-0 text-sm font-semibold">{group.category}</dt>
                    <dd className="text-sm leading-relaxed text-muted-foreground">
                      {group.items.map((s) => s.name).join(" · ")}
                    </dd>
                  </div>
                ))}
              </dl>
            </ResumeSection>

            {/* Experience */}
            <ResumeSection title="Professional experience">
              <div className="space-y-7">
                {experience.map((job) => (
                  <div key={`${job.company}-${job.start}`}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h4 className="font-semibold">
                        {job.role}
                        <span className="font-normal text-muted-foreground"> — {job.company}</span>
                      </h4>
                      <span className="font-mono text-xs text-muted-foreground">
                        {formatDateRange(job.start, job.end)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {job.location} · {job.employmentType} · {job.locationType}
                    </p>

                    <ul className="mt-3 space-y-1.5">
                      {job.highlights.map((highlight) => (
                        <li key={highlight} className="flex gap-2.5 text-sm leading-relaxed">
                          <span aria-hidden className="mt-[0.55rem] size-1 shrink-0 rounded-full bg-primary" />
                          <span className="text-muted-foreground">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </ResumeSection>

            {/* Projects */}
            <ResumeSection title="Selected projects">
              <div className="space-y-6">
                {projects.map((project) => (
                  <div key={project.slug}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h4 className="font-semibold">
                        <Link href={`/projects/${project.slug}`} className="hover:text-primary">
                          {project.title}
                        </Link>
                        <span className="font-normal text-muted-foreground"> — {project.role}</span>
                      </h4>
                      <span className="font-mono text-xs text-muted-foreground">
                        {project.year}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {project.summary}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground/80">
                      {project.techStack.slice(0, 9).join(" · ")}
                    </p>
                  </div>
                ))}
              </div>
            </ResumeSection>

            {/* Achievements */}
            <ResumeSection title="Key achievements">
              <ul className="space-y-2">
                {achievements.slice(0, 5).map((item) => (
                  <li key={item.title} className="flex gap-2.5 text-sm leading-relaxed">
                    <span aria-hidden className="mt-[0.55rem] size-1 shrink-0 rounded-full bg-primary" />
                    <span className="text-muted-foreground">
                      <span className="font-medium text-foreground">{item.title}</span> — {item.description}
                    </span>
                  </li>
                ))}
              </ul>
            </ResumeSection>

            {/* Education */}
            <ResumeSection title="Education">
              <div className="space-y-4">
                {education.map((item) => (
                  <div key={item.institution}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h4 className="font-semibold">{item.degree}</h4>
                      <span className="font-mono text-xs text-muted-foreground">
                        {formatDate(item.start, { year: "numeric" })} –{" "}
                        {formatDate(item.end, { year: "numeric" })}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {item.institution}, {item.location}
                      {item.grade ? ` — ${item.grade}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </ResumeSection>
          </article>

          {/* ── Sidebar ──────────────────────────────────── */}
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="space-y-4">
              <Reveal className="rounded-2xl border border-border bg-card p-6">
                <h2 className="text-sm font-semibold">Download</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  PDF, {resume.version} — kept in sync with this page.
                </p>
                <Button asChild className="mt-4 w-full" variant="gradient">
                  <a href={resume.fileUrl} download>
                    <Download className="size-4" />
                    Download PDF
                  </a>
                </Button>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Updated {formatDate(resume.updatedOn)}
                </p>
              </Reveal>

              <Reveal delay={0.06} className="rounded-2xl border border-border bg-card p-6">
                <h2 className="text-sm font-semibold">At a glance</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  {[
                    ["Experience", "3+ years"],
                    ["Current role", "MERN Stack Developer"],
                    ["Company", "Ripenapps Technologies"],
                    ["Location", PERSON.shortLocation],
                    ["Notice period", "Negotiable"],
                    ["Open to", "Full-time · Contract"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-baseline justify-between gap-3">
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="text-right font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>

              <Reveal delay={0.12} className="rounded-2xl border border-border bg-card p-6">
                <h2 className="text-sm font-semibold">Core strengths</h2>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {["React.js", "Next.js", "TypeScript", "Node.js", "MongoDB", "Payments", "Real-time", "Performance"].map(
                    (item) => (
                      <Badge key={item} variant="secondary" size="sm">
                        {item}
                      </Badge>
                    ),
                  )}
                </div>
                <Separator className="my-5" />
                <Button asChild variant="outline" className="w-full">
                  <Link href="/contact">Get in touch</Link>
                </Button>
              </Reveal>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {title}
      </h3>
      {children}
    </section>
  );
}
