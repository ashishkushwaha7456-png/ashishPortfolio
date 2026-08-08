import { Section, SectionHeading } from "@/components/shared/section";
import { ProjectCard } from "@/components/shared/project-card";
import type { Project } from "@/types";

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;

  const [lead, ...rest] = projects;

  return (
    <Section id="projects">
      <SectionHeading
        eyebrow="Selected work"
        title={
          <>
            Products I&apos;ve shipped
            <span className="text-gradient"> end to end</span>
          </>
        }
        description="Payments, identity verification, real-time systems and AI chat — built for real users, in production, with the edge cases handled."
        action={{ label: "All projects", href: "/projects" }}
      />

      <div className="grid gap-6">
        <ProjectCard project={lead} variant="featured" index={0} />

        {rest.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {rest.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index + 1} />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
