import { PageHeader, Section } from "@/components/shared/section";
import { BlogExplorer } from "@/components/blog/blog-explorer";
import { JsonLd } from "@/components/seo/json-ld";
import { getBlogTaxonomy, getPosts } from "@/services/content.service";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";
import { PERSON } from "@/constants/site";

export const revalidate = 3600;

export async function generateMetadata() {
  return buildMetadata({
    title: "Blog",
    description:
      "Essays on React performance, frontend architecture, payment systems and the engineering decisions that turned out to matter — by Ashish Kumar.",
    path: "/blog",
  });
}

export default async function BlogPage() {
  const [posts, taxonomy] = await Promise.all([getPosts(), getBlogTaxonomy()]);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            name: `${PERSON.name} — Blog`,
            url: absoluteUrl("/blog"),
            author: { "@type": "Person", name: PERSON.name },
            blogPost: posts.map((post) => ({
              "@type": "BlogPosting",
              headline: post.title,
              url: absoluteUrl(`/blog/${post.slug}`),
              datePublished: post.publishedAt,
            })),
          },
        ]}
      />

      <PageHeader
        eyebrow="Writing"
        title="Notes from the build."
        description="What I learned shipping React at scale — the performance work, the architecture calls, and the mistakes worth documenting so I don't repeat them."
      />

      <Section>
        <BlogExplorer
          posts={posts}
          categories={taxonomy.categories}
          tags={taxonomy.tags}
        />
      </Section>
    </>
  );
}
