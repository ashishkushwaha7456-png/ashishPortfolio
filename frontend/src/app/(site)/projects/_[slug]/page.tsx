import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  // Github,
  Globe,
  Lightbulb,
  Users,
} from "lucide-react";
import { PageHeader, Section, SectionHeading } from "@/components/shared/section";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { ProjectCard } from "@/components/shared/project-card";
import { Markdown } from "@/components/shared/markdown";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/seo/json-ld";
import { getProjectBySlug, getProjects, getRelatedProjects } from "@/services/content.service";
import { breadcrumbSchema, buildMetadata, projectSchema } from "@/lib/seo";
import { formatDateRange } from "@/lib/utils";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const projects = await getProjects();
    return projects.map((project) => ({ slug: project.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return buildMetadata({ title: "Project not found", noIndex: true });

  return buildMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
    image: project.cover?.url ?? project.thumbnail.url,
    type: "article",
    publishedTime: project.timeline.start,
    tags: project.techStack,
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const related = await getRelatedProjects(slug, 2);

  const gallery = project.gallery.length
    ? project.gallery
    : [project.cover ?? project.thumbnail];

  return (
    <>
      <JsonLd
        data={[
          projectSchema(project),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
            { name: project.title, path: `/projects/${project.slug}` },
          ]),
        ]}
      />

      <PageHeader
        eyebrow={
          project.category
            .split("-")
            .map((w) => w[0].toUpperCase() + w.slice(1))
            .join(" ")
        }
        title={project.title}
        description={project.tagline}
      >
        <div className="flex flex-wrap items-center gap-3">
          {project.links.live && (
            <Button asChild size="lg" variant="gradient" className="rounded-full">
              <a href={project.links.live} target="_blank" rel="noreferrer noopener">
                <Globe className="size-4" />
                Live site
              </a>
            </Button>
          )}
          {/* GitHub source button — disabled
          {project.links.github && (
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <a href={project.links.github} target="_blank" rel="noreferrer noopener">
                <Github className="size-4" />
                Source
              </a>
            </Button>
          )}
          */}
          <Button asChild size="lg" variant="ghost" className="rounded-full">
            <Link href="/projects">
              <ArrowLeft className="size-4" />
              All projects
            </Link>
          </Button>
        </div>
      </PageHeader>

      <Section spacious={false} className="pt-12">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
          {/* ── Main column ─────────────────────────────── */}
          <div className="min-w-0 space-y-16">
            <Reveal>
              <ProjectGallery images={gallery} accent={project.accent} />
            </Reveal>

            {/* Overview */}
            <section>
              <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                Overview
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {project.description}
              </p>

              {project.metrics.length > 0 && (
                <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
                  {project.metrics.map((metric) => (
                    <div key={metric.label} className="bg-background p-5">
                      <Icon name={metric.icon} size={15} className="mb-3 text-primary" />
                      <dd className="font-display text-xl font-semibold tracking-tight">
                        {metric.value}
                      </dd>
                      <dt className="mt-1 text-xs leading-tight text-muted-foreground">
                        {metric.label}
                      </dt>
                      {metric.description && (
                        <p className="mt-1.5 text-[0.6875rem] leading-tight text-muted-foreground/70">
                          {metric.description}
                        </p>
                      )}
                    </div>
                  ))}
                </dl>
              )}
            </section>

            {/* Features */}
            {project.features.length > 0 && (
              <section>
                <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  Key features
                </h2>
                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  {project.features.map((feature, index) => (
                    <Reveal
                      key={feature.title}
                      delay={index * 0.05}
                      className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/15"
                    >
                      <div
                        className="mb-4 grid size-10 place-items-center rounded-xl"
                        style={{
                          backgroundColor: `${project.accent}1a`,
                          color: project.accent,
                        }}
                      >
                        <Icon name={feature.icon} size={17} />
                      </div>
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {feature.description}
                      </p>
                    </Reveal>
                  ))}
                </div>
              </section>
            )}

            {/* Architecture */}
            {project.architecture.length > 0 && (
              <section>
                <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  Architecture
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  How the system is layered, and what each layer is responsible for.
                </p>

                <div className="mt-7 space-y-3">
                  {project.architecture.map((layer, index) => (
                    <Reveal key={layer.layer} delay={index * 0.05}>
                      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6">
                        <span
                          aria-hidden
                          className="absolute inset-y-0 left-0 w-1"
                          style={{ backgroundColor: project.accent, opacity: 0.6 }}
                        />
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-display text-lg font-semibold tracking-tight">
                              {layer.layer}
                            </h3>
                            {layer.description && (
                              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                {layer.description}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {layer.items.map((item) => (
                              <span
                                key={item}
                                className="rounded-md border border-border bg-secondary/50 px-2 py-0.5 text-[0.6875rem] text-muted-foreground"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </section>
            )}

            {/* Challenges */}
            {project.challenges.length > 0 && (
              <section>
                <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  Challenges &amp; solutions
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  The problems that actually cost time — and what fixed them.
                </p>

                <div className="mt-7 space-y-4">
                  {project.challenges.map((item, index) => (
                    <Reveal key={item.challenge} delay={index * 0.05}>
                      <article className="overflow-hidden rounded-2xl border border-border bg-card">
                        <div className="flex gap-4 border-b border-border p-6">
                          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive">
                            <Lightbulb className="size-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Challenge
                            </p>
                            <p className="mt-1.5 text-sm leading-relaxed">{item.challenge}</p>
                          </div>
                        </div>

                        <div className="flex gap-4 p-6">
                          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[color-mix(in_oklch,var(--success)_15%,transparent)] text-[var(--success)]">
                            <CheckCircle2 className="size-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Solution
                            </p>
                            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                              {item.solution}
                            </p>
                            {item.impact && (
                              <p className="mt-3 inline-flex rounded-lg bg-secondary/60 px-3 py-1.5 text-xs font-medium">
                                Impact: {item.impact}
                              </p>
                            )}
                          </div>
                        </div>
                      </article>
                    </Reveal>
                  ))}
                </div>
              </section>
            )}

            {/* Code snippets */}
            {project.snippets && project.snippets.length > 0 && (
              <section>
                <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  Code
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  A couple of the decisions that shaped the implementation.
                </p>

                <div className="mt-7 space-y-6">
                  {project.snippets.map((snippet) => (
                    <Reveal key={snippet.title}>
                      <figure className="overflow-hidden rounded-2xl border border-border">
                        <figcaption className="flex items-center justify-between gap-4 border-b border-border bg-card px-5 py-3">
                          <div>
                            <p className="text-sm font-semibold">{snippet.title}</p>
                            {snippet.description && (
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {snippet.description}
                              </p>
                            )}
                          </div>
                          <Badge variant="secondary" size="sm" className="shrink-0 font-mono">
                            {snippet.language}
                          </Badge>
                        </figcaption>
                        <Markdown
                          content={`\`\`\`${snippet.language}\n${snippet.code}\n\`\`\``}
                          className="[&>pre]:m-0 [&>pre]:rounded-none [&>pre]:border-0"
                        />
                      </figure>
                    </Reveal>
                  ))}
                </div>
              </section>
            )}

            {/* Case study */}
            {project.caseStudy && (
              <section>
                <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  Case study
                </h2>
                <Markdown content={project.caseStudy} className="mt-6" />
              </section>
            )}
          </div>

          {/* ── Sticky sidebar ──────────────────────────── */}
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Project details
                </h2>

                <dl className="space-y-4 text-sm">
                  <div>
                    <dt className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="size-3.5" />
                      Timeline
                    </dt>
                    <dd className="mt-1 font-medium">
                      {formatDateRange(project.timeline.start, project.timeline.end)}
                    </dd>
                    <dd className="text-xs text-muted-foreground">
                      {project.timeline.duration}
                    </dd>
                  </div>

                  <div>
                    <dt className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="size-3.5" />
                      My role
                    </dt>
                    <dd className="mt-1 font-medium">{project.role}</dd>
                    {project.team && (
                      <dd className="text-xs text-muted-foreground">{project.team}</dd>
                    )}
                  </div>

                  {project.client && (
                    <div>
                      <dt className="text-xs text-muted-foreground">Client</dt>
                      <dd className="mt-1 font-medium">{project.client}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Tech stack
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-border bg-secondary/50 px-2 py-1 text-xs text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="text-sm font-semibold">Want something like this?</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  I&apos;m open to roles and contract work. Tell me what you&apos;re building.
                </p>
                <Button asChild className="mt-4 w-full" variant="gradient">
                  <Link href="/contact">
                    Get in touch
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {/* Related */}
      {related.length > 0 && (
        <Section className="border-t border-border">
          <SectionHeading
            eyebrow="Keep reading"
            title="Related projects"
            action={{ label: "All projects", href: "/projects" }}
          />
          <div className="grid gap-6 md:grid-cols-2">
            {related.map((item, index) => (
              <ProjectCard key={item.slug} project={item} index={index} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
