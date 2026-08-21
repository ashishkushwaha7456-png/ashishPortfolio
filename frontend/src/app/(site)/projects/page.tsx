import { PageHeader, Section } from "@/components/shared/section";
import { ProjectsExplorer } from "@/components/projects/projects-explorer";
import { JsonLd } from "@/components/seo/json-ld";
import { getProjects } from "@/services/content.service";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";

export const revalidate = 3600;

export async function generateMetadata() {
  return buildMetadata({
    title: "Projects",
    description:
      "Case studies from production work — a property booking platform with KYC and multi-gateway payments, a marketplace with auctions and an AI shopping assistant, and a fitness services marketplace.",
    path: "/projects",
  });
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Projects",
            url: absoluteUrl("/projects"),
            hasPart: projects.map((project) => ({
              "@type": "CreativeWork",
              name: project.title,
              description: project.summary,
              // Detail pages are disabled, so point search engines at the live
              // product; fall back to the listing when there is no live URL.
              url: project.links.live || absoluteUrl("/projects"),
            })),
          },
        ]}
      />

      <PageHeader
        eyebrow="Selected work"
        title="Case studies, not screenshots."
        description="Every project here shipped to real users. Each one includes the architecture, the problems that actually cost time, and how they were solved."
      />

      <Section>
        <ProjectsExplorer projects={projects} />
      </Section>
    </>
  );
}
