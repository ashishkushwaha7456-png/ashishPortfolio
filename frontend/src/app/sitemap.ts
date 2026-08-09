import type { MetadataRoute } from "next";
import { getPosts, getProjects } from "@/services/content.service";
import { SITE_URL } from "@/constants/site";

export const dynamic = "force-dynamic";

const STATIC_ROUTES: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.9, changeFrequency: "monthly" },
  { path: "/projects", priority: 0.95, changeFrequency: "weekly" },
  { path: "/experience", priority: 0.85, changeFrequency: "monthly" },
  { path: "/skills", priority: 0.8, changeFrequency: "monthly" },
  { path: "/achievements", priority: 0.7, changeFrequency: "monthly" },
  { path: "/resume", priority: 0.85, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.9, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.8, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);
  const now = new Date();

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${SITE_URL}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),

    ...projects.map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      lastModified: project.updatedAt ? new Date(project.updatedAt) : now,
      changeFrequency: "monthly" as const,
      priority: project.featured ? 0.9 : 0.75,
    })),

    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt ?? post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: post.featured ? 0.8 : 0.7,
    })),
  ];
}
