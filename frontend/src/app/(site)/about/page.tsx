import Image from "next/image";
import { PageHeader, Section, SectionHeading } from "@/components/shared/section";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { Counter } from "@/components/motion/counter";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { GitHubStats } from "@/components/shared/github-stats";
import { ExperienceTimeline } from "@/components/shared/experience-timeline";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getAbout,
  getAchievements,
  getEducation,
  getExperience,
  getSettings,
} from "@/services/content.service";
import { getContributionGraph, getGitHubStats } from "@/services/github.service";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { PERSON } from "@/constants/site";

export const revalidate = 3600;

export async function generateMetadata() {
  return buildMetadata({
    title: "About",
    description:
      "The story behind the code — how Ashish Kumar went from vanilla JavaScript to shipping payment, KYC and real-time systems in production, and what he cares about building.",
    path: "/about",
  });
}

export default async function AboutPage() {
  const [about, experience, education, achievements, settings] = await Promise.all([
    getAbout(),
    getExperience(),
    getEducation(),
    getAchievements(),
    getSettings(),
  ]);

  const [githubStats, contributions] = settings.features.github
    ? await Promise.all([getGitHubStats(), getContributionGraph()])
    : [null, null];

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />

      <PageHeader
        eyebrow="About"
        title={about.title}
        description={about.bio[0]}
      >
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" size="lg">
            <Icon name="MapPin" size={12} />
            {about.location}
          </Badge>
          {about.languages.map((language) => (
            <Badge key={language} variant="outline" size="lg">
              {language}
            </Badge>
          ))}
        </div>
      </PageHeader>

      {/* Bio + portrait */}
      <Section>
        <div className="grid gap-14 lg:grid-cols-[1fr_0.8fr] lg:gap-16">
          <div className="space-y-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {about.bio.map((paragraph, index) => (
              <Reveal key={index} delay={index * 0.06}>
                <p>{paragraph}</p>
              </Reveal>
            ))}

            <Reveal delay={0.2}>
              <blockquote className="mt-10 rounded-2xl border-l-2 border-primary bg-card/60 p-6">
                <p className="text-base italic leading-relaxed text-foreground/90">
                  {about.mission}
                </p>
                <footer className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  — What I&apos;m working toward
                </footer>
              </blockquote>
            </Reveal>
          </div>

          <Reveal direction="left" className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative overflow-hidden rounded-3xl border border-border">
              <div className="relative aspect-[4/5]">
                <Image
                  src={about.image?.url ?? "/images/about.svg"}
                  alt={about.image?.alt ?? PERSON.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
              {about.stats.map((stat) => (
                <div key={stat.label} className="bg-background p-5">
                  <dd className="font-display text-2xl font-semibold tracking-tight">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </dd>
                  <dt className="mt-1 text-xs leading-tight text-muted-foreground">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Section>

      {/* Story timeline */}
      <Section className="border-t border-border">
        <SectionHeading
          eyebrow="Career journey"
          title="How I got here"
          description="Six chapters, from the first line of JavaScript to owning production systems."
        />

        <ol className="relative space-y-10 border-l border-border pl-8 sm:pl-10">
          {about.story.map((chapter, index) => (
            <li key={chapter.year} className="relative">
              <span
                aria-hidden
                className="absolute -left-[41px] grid size-8 place-items-center rounded-full border border-border bg-background text-primary sm:-left-[49px]"
              >
                <Icon name={chapter.icon} size={14} />
              </span>

              <Reveal delay={index * 0.06}>
                <div className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/15">
                  <p className="font-mono text-xs text-primary">{chapter.year}</p>
                  <h3 className="mt-2 font-display text-xl font-semibold tracking-tight">
                    {chapter.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {chapter.description}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      {/* Philosophy */}
      <Section className="border-t border-border">
        <SectionHeading
          eyebrow="Philosophy"
          title="How I think about the work"
          align="center"
        />

        <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {about.philosophy.map((item) => (
            <StaggerItem
              key={item.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
            >
              <div className="mb-4 grid size-11 place-items-center rounded-xl border border-border bg-secondary/60 text-primary transition-colors group-hover:border-primary/40">
                <Icon name={item.icon} size={18} />
              </div>
              <h3 className="font-display text-base font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>

      {/* What I love building */}
      <Section className="border-t border-border">
        <SectionHeading
          eyebrow="Interests"
          title={
            <>
              What I love
              <span className="text-gradient"> building</span>
            </>
          }
        />

        <StaggerGroup className="grid gap-5 sm:grid-cols-2">
          {about.loveBuilding.map((item) => (
            <StaggerItem
              key={item.title}
              className="flex gap-5 rounded-2xl border border-border bg-card p-6"
            >
              <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon name={item.icon} size={18} />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>

      {/* Experience */}
      <Section className="border-t border-border">
        <SectionHeading eyebrow="Experience" title="Professional experience" />
        <ExperienceTimeline experiences={experience} detailed />
      </Section>

      {/* Education + achievements */}
      <Section className="border-t border-border">
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Education" title="Where I studied" className="mb-8" />
            <div className="space-y-4">
              {education.map((item, index) => (
                <Reveal key={item.institution} delay={index * 0.06}>
                  <article className="rounded-2xl border border-border bg-card p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-lg font-semibold tracking-tight">
                          {item.degree}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">{item.institution}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground/80">{item.location}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-mono text-xs text-muted-foreground">
                          {formatDate(item.start, { year: "numeric" })} –{" "}
                          {formatDate(item.end, { year: "numeric" })}
                        </p>
                        {item.grade && (
                          <Badge variant="secondary" size="sm" className="mt-2">
                            {item.grade}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {item.description && (
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                  </article>
                </Reveal>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow="Highlights"
              title="Things I'm proud of"
              action={{ label: "All achievements", href: "/achievements" }}
              className="mb-8"
            />
            <div className="space-y-3">
              {achievements.slice(0, 4).map((item, index) => (
                <Reveal key={item.title} delay={index * 0.06}>
                  <article className="flex gap-4 rounded-2xl border border-border bg-card p-5">
                    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon name="Trophy" size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">{item.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.issuer} · {formatDate(item.date)}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* GitHub */}
      {githubStats && (
        <Section className="border-t border-border">
          <SectionHeading
            eyebrow="GitHub"
            title="Contribution activity"
            description="Public repositories and commit activity, pulled live from the GitHub API."
          />
          <GitHubStats stats={githubStats} contributions={contributions} />
        </Section>
      )}

      {/* Beyond code */}
      <Section className="border-t border-border">
        <SectionHeading eyebrow="Outside work" title="Beyond the editor" align="center" />
        <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-2.5">
          {about.interests.map((interest) => (
            <Badge key={interest} variant="outline" size="lg">
              {interest}
            </Badge>
          ))}
        </div>
      </Section>
    </>
  );
}
