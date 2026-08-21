import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Hero /*, HeroHighlights */ } from "@/components/home/hero";
import { TechMarquee } from "@/components/home/tech-marquee";
import { AboutPreview } from "@/components/home/about-preview";
import { FeaturedProjects } from "@/components/home/featured-projects";
// import { Testimonials } from "@/components/home/testimonials";
import { ContactCTA } from "@/components/home/contact-cta";
import { Section, SectionHeading } from "@/components/shared/section";
import { ExperienceTimeline } from "@/components/shared/experience-timeline";
import { SkillCloud } from "@/components/shared/skill-grid";
import { BlogCard } from "@/components/shared/blog-card";
// import { GitHubStats } from "@/components/shared/github-stats";
import { Reveal } from "@/components/motion/reveal";
import { getHomePageData } from "@/services/content.service";
// import { getContributionGraph, getGitHubStats } from "@/services/github.service";
import { buildMetadata } from "@/lib/seo";

/* Static shell, revalidated hourly. Content edits from /admin surface within
   the hour, or immediately via the revalidate API. */
export const revalidate = 3600;

export async function generateMetadata() {
  return buildMetadata({ path: "/" });
}

export default async function HomePage() {
  const { hero, about, projects, experience, skills, /* testimonials, */ posts, socials, settings } =
    await getHomePageData();

  // GitHub disabled sitewide.
  // const [githubStats, contributions] = settings.features.github
  //   ? await Promise.all([getGitHubStats(), getContributionGraph()])
  //   : [null, null];

  return (
    <>
      <Hero hero={hero} socials={socials} />

      {/* Hero highlights strip — disabled
      <div className="relative -mt-8 pb-8">
        <HeroHighlights hero={hero} />
      </div>
      */}

      <TechMarquee skills={skills} />

      <AboutPreview about={about} />

      <FeaturedProjects projects={projects} />

      {/* Experience */}
      <Section id="experience" className="border-t border-border">
        <SectionHeading
          eyebrow="Experience"
          title="Where I've been building"
          description="Three years of production work — frontend architecture, third-party integrations and the performance work that keeps them fast."
          action={{ label: "Full experience", href: "/experience" }}
        />
        <ExperienceTimeline experiences={experience} />
      </Section>

      {/* Skills */}
      <Section id="skills">
        <SectionHeading
          eyebrow="Toolkit"
          title={
            <>
              The stack I reach for
              <span className="text-gradient"> every day</span>
            </>
          }
          description="Deep in the React and TypeScript ecosystem, comfortable across Node, MongoDB and the integrations that production products actually need."
          action={{ label: "All skills", href: "/skills" }}
        />
        <SkillCloud skills={skills} />
      </Section>

      {/* GitHub — disabled
      {githubStats && (
        <Section id="stats" className="border-y border-border bg-surface/50">
          <SectionHeading
            eyebrow="Open source"
            title="Code, in public"
            description="Public repositories, contribution activity and the languages I spend most of my time in."
          />
          <GitHubStats stats={githubStats} contributions={contributions} />
        </Section>
      )}
      */}

      {/* Testimonials ("Feedback from the people I ship with") — disabled
      {settings.features.testimonials && <Testimonials testimonials={testimonials} />}
      */}

      {/* Writing */}
      {settings.features.blog && posts.length > 0 && (
        <Section id="blog" className="border-t border-border">
          <SectionHeading
            eyebrow="Writing"
            title="Notes from the build"
            description="Lessons from shipping React at scale — performance, architecture and the decisions that turned out to matter."
            action={{ label: "All posts", href: "/blog" }}
          />

          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((post, index) => (
              <BlogCard key={post.slug} post={post} index={index} />
            ))}
          </div>

          <Reveal className="mt-10 flex justify-center">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Browse the archive
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </Section>
      )}

      <ContactCTA />
    </>
  );
}
