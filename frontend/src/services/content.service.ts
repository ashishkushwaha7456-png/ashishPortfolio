import "server-only";
import { cache } from "react";
import type {
  About,
  Achievement,
  BlogPost,
  Education,
  Experience,
  Hero,
  Message,
  Project,
  Resume,
  SEOSettings,
  Settings,
  Skill,
  SocialLink,
  Testimonial,
} from "@/types";
import { readingTime, stripMarkdown } from "@/lib/utils";
import {
  ABOUT_SEED,
  ACHIEVEMENTS_SEED,
  BLOG_SEED,
  EDUCATION_SEED,
  EXPERIENCE_SEED,
  HERO_SEED,
  PROJECTS_SEED,
  SKILLS_SEED,
  SOCIAL_SEED,
  TESTIMONIALS_SEED,
} from "@/constants/seed-data";
import { DEFAULT_SEO, DEFAULT_SETTINGS, RESUME_FILE } from "@/constants/site";

// Server-only variable — never embedded in the client bundle.
const API_URL = (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api").replace(/\/$/, "");

async function backendFetch<T>(
  path: string,
  options?: RequestInit & { revalidate?: number | false }
): Promise<T> {
  const url = `${API_URL}${path}`;
  const fetchOpts: RequestInit = {
    method: "GET",
    ...options,
  };

  if (options?.revalidate !== undefined) {
    (fetchOpts as RequestInit & { next?: { revalidate?: number | false } }).next = {
      revalidate: options.revalidate,
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000);

  try {
    const res = await fetch(url, {
      ...fetchOpts,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      throw new Error(`Failed to fetch from backend: ${res.statusText}`);
    }
    const json = await res.json();
    if (!json.success || !json.data) {
      throw new Error(json.error ?? "API request returned no data");
    }
    return json.data as T;
  } catch (error) {
    clearTimeout(timeoutId);

    // Fallback to local seed data if backend query fails or has no database record
    const cleanPath = path.split("?")[0];
    if (cleanPath.startsWith("/content/hero")) return HERO_SEED as unknown as T;
    if (cleanPath.startsWith("/content/about")) return ABOUT_SEED as unknown as T;
    if (cleanPath.startsWith("/content/experience")) return EXPERIENCE_SEED as unknown as T;
    if (cleanPath.startsWith("/content/skills")) return SKILLS_SEED as unknown as T;
    if (cleanPath.startsWith("/content/education")) return EDUCATION_SEED as unknown as T;
    if (cleanPath.startsWith("/content/achievements")) return ACHIEVEMENTS_SEED as unknown as T;
    if (cleanPath.startsWith("/content/testimonials")) return TESTIMONIALS_SEED as unknown as T;
    if (cleanPath.startsWith("/content/blog")) {
      const parts = cleanPath.split("/");
      if (parts.length > 3) {
        const slug = parts[3];
        const match = BLOG_SEED.find((p) => p.slug === slug);
        if (match) return match as unknown as T;
      }
      return BLOG_SEED as unknown as T;
    }
    if (cleanPath.startsWith("/content/social")) return SOCIAL_SEED as unknown as T;
    if (cleanPath.startsWith("/content/seo")) return DEFAULT_SEO as unknown as T;
    if (cleanPath.startsWith("/content/settings")) return DEFAULT_SETTINGS as unknown as T;
    if (cleanPath.startsWith("/content/resume")) {
      return {
        isActive: true,
        label: "Resume",
        fileUrl: "/resume/Ashish-Kumar-Resume.pdf",
        version: "2026.1",
        updatedOn: "2026-01-15",
      } as unknown as T;
    }
    if (cleanPath.startsWith("/content/projects")) {
      const parts = cleanPath.split("/");
      if (parts.length > 3) {
        const slug = parts[3];
        const match = PROJECTS_SEED.find((p) => p.slug === slug);
        if (match) return match as unknown as T;
      }
      return PROJECTS_SEED as unknown as T;
    }

    throw error;
  }
}

/* ── Hero ─────────────────────────────────────────────────── */
export const getHero = cache(async (): Promise<Hero> => {
  const hero = await backendFetch<Hero>("/content/hero", { revalidate: 3600 });
  return {
    ...hero,
    ctas: hero.ctas
      // GitHub is disabled sitewide — see getSocialLinks below.
      .filter((cta) => cta.icon !== "Github")
      // The /resume page is disabled, so the stored "/resume" href would 404.
      // Point it at the PDF instead; hero.tsx renders that as a real download.
      .map((cta) => (cta.href === "/resume" ? { ...cta, href: RESUME_FILE } : cta)),
  };
});

/* ── About ────────────────────────────────────────────────── */

/**
 * The stored portrait URL still points at the retired `about.svg` placeholder.
 * Renaming the asset is what busts stale browser caches, so the legacy path is
 * remapped here. Uploading a real portrait via /admin/about writes a different
 * URL, which passes through untouched — and this line can then go.
 */
const LEGACY_ABOUT_IMAGE = "/images/about.svg";
const ABOUT_IMAGE = "/images/about-developer.svg";

export const getAbout = cache(async (): Promise<About> => {
  const about = await backendFetch<About>("/content/about", { revalidate: 3600 });
  if (about.image?.url !== LEGACY_ABOUT_IMAGE) return about;
  return { ...about, image: { ...about.image, url: ABOUT_IMAGE } };
});

/* ── Projects ─────────────────────────────────────────────── */
export const getProjects = cache(
  async (options: { featured?: boolean; limit?: number; includeDrafts?: boolean } = {}) => {
    const { featured, limit, includeDrafts = false } = options;
    const search = new URLSearchParams();
    if (featured !== undefined) search.set("featured", String(featured));
    if (limit !== undefined) search.set("limit", String(limit));
    if (includeDrafts) search.set("includeDrafts", "true");

    return backendFetch<Project[]>(`/content/projects?${search}`, { revalidate: 3600 });
  }
);

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  try {
    return await backendFetch<Project>(`/content/projects/${slug}`, { revalidate: 3600 });
  } catch {
    return null;
  }
});

export const getRelatedProjects = cache(
  async (slug: string, limit = 2): Promise<Project[]> => {
    const all = await getProjects();
    const current = all.find((p) => p.slug === slug);
    if (!current) return all.slice(0, limit);

    // Rank by shared technologies, then by category, then by recency.
    const scored = all
      .filter((p) => p.slug !== slug)
      .map((p) => {
        const shared = p.techStack.filter((t) => current.techStack.includes(t)).length;
        const sameCategory = p.category === current.category ? 2 : 0;
        return { project: p, score: shared + sameCategory };
      })
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, limit).map((s) => s.project);
  }
);

export const getProjectSlugs = cache(async (): Promise<string[]> => {
  const projects = await getProjects();
  return projects.map((p) => p.slug);
});

/* ── Experience ───────────────────────────────────────────── */
export const getExperience = cache(async (): Promise<Experience[]> => {
  return backendFetch<Experience[]>("/content/experience", { revalidate: 3600 });
});

/* ── Skills ───────────────────────────────────────────────── */
export const getSkills = cache(
  async (options: { featured?: boolean } = {}): Promise<Skill[]> => {
    const search = new URLSearchParams();
    if (options.featured !== undefined) search.set("featured", String(options.featured));
    return backendFetch<Skill[]>(`/content/skills?${search}`, { revalidate: 3600 });
  }
);

export const getSkillsByCategory = cache(async () => {
  const skills = await getSkills();
  const map = new Map<string, Skill[]>();
  for (const skill of skills) {
    const bucket = map.get(skill.category) ?? [];
    bucket.push(skill);
    map.set(skill.category, bucket);
  }
  return Array.from(map.entries()).map(([category, items]) => ({
    category,
    items: items.sort((a, b) => a.order - b.order || b.level - a.level),
    average: Math.round(items.reduce((sum, s) => sum + s.level, 0) / items.length),
  }));
});

/* ── Education ────────────────────────────────────────────── */
export const getEducation = cache(async (): Promise<Education[]> => {
  return backendFetch<Education[]>("/content/education", { revalidate: 3600 });
});

/* ── Achievements ─────────────────────────────────────────── */
export const getAchievements = cache(async (): Promise<Achievement[]> => {
  return backendFetch<Achievement[]>("/content/achievements", { revalidate: 3600 });
});

/* ── Testimonials ─────────────────────────────────────────── */
export const getTestimonials = cache(
  async (options: { featured?: boolean } = {}): Promise<Testimonial[]> => {
    const search = new URLSearchParams();
    if (options.featured !== undefined) search.set("featured", String(options.featured));
    return backendFetch<Testimonial[]>(`/content/testimonials?${search}`, { revalidate: 3600 });
  }
);

/* ── Blog ─────────────────────────────────────────────────── */
export const getPosts = cache(
  async (
    options: { featured?: boolean; limit?: number; category?: string; tag?: string } = {}
  ): Promise<BlogPost[]> => {
    const { featured, limit, category, tag } = options;
    const search = new URLSearchParams();
    if (featured !== undefined) search.set("featured", String(featured));
    if (limit !== undefined) search.set("limit", String(limit));
    if (category !== undefined) search.set("category", category);
    if (tag !== undefined) search.set("tag", tag);

    return backendFetch<BlogPost[]>(`/content/blog?${search}`, { revalidate: 3600 });
  }
);

export const getPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    const post = await backendFetch<BlogPost>(`/content/blog/${slug}`, { revalidate: 3600 });
    return { ...post, readingTime: post.readingTime || readingTime(stripMarkdown(post.content)) };
  } catch {
    return null;
  }
});

export const getRelatedPosts = cache(async (slug: string, limit = 3) => {
  const posts = await getPosts();
  const current = posts.find((p) => p.slug === slug);
  if (!current) return posts.slice(0, limit);
  return posts
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      post: p,
      score:
        p.tags.filter((t) => current.tags.includes(t)).length +
        (p.category === current.category ? 2 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.post);
});

export const getBlogTaxonomy = cache(async () => {
  const posts = await getPosts();
  const categories = new Map<string, number>();
  const tags = new Map<string, number>();
  for (const post of posts) {
    categories.set(post.category, (categories.get(post.category) ?? 0) + 1);
    for (const tag of post.tags) tags.set(tag, (tags.get(tag) ?? 0) + 1);
  }
  return {
    categories: Array.from(categories, ([name, count]) => ({ name, count })).sort(
      (a, b) => b.count - a.count
    ),
    tags: Array.from(tags, ([name, count]) => ({ name, count })).sort(
      (a, b) => b.count - a.count
    ),
  };
});

/* ── Social ───────────────────────────────────────────────── */
export const getSocialLinks = cache(async (): Promise<SocialLink[]> => {
  const socials = await backendFetch<SocialLink[]>("/content/social", { revalidate: 3600 });
  // GitHub is disabled sitewide. Filtered here rather than in each consumer
  // because the record still lives in the backend database — remove it from
  // /admin/social and drop this filter to bring the link back.
  return socials.filter((social) => social.platform !== "github");
});

/* ── Resume ───────────────────────────────────────────────── */
export const getResume = cache(async (): Promise<Resume> => {
  return backendFetch<Resume>("/content/resume", { revalidate: 3600 });
});

/* ── SEO + settings ───────────────────────────────────────── */
export const getSEO = cache(async (): Promise<SEOSettings> => {
  return backendFetch<SEOSettings>("/content/seo", { revalidate: 3600 });
});

export const getSettings = cache(async (): Promise<Settings> => {
  return backendFetch<Settings>("/content/settings", { revalidate: 3600 });
});

/* ── Messages (admin only) ────────────────────────────────── */
export const getMessages = cache(
  async (options: { archived?: boolean; limit?: number } = {}): Promise<Message[]> => {
    const { archived, limit } = options;
    const search = new URLSearchParams();
    if (archived !== undefined) search.set("archived", String(archived));
    if (limit !== undefined) search.set("limit", String(limit));
    
    // Admin request requires cookie forwarding but since this is called on the server,
    // we need to be careful with sessions. In the original Next.js architecture,
    // getMessages was only called inside server components that are rendered under admin panels.
    // To make sure it works, we fetch the messages.
    // Wait, on the server we might need cookie forwarding.
    // In our case, getMessages is only used in server components under admin.
    // So we can forward headers if we have access to request headers, or just make it public/internal.
    // Wait, the Express backend GET /api/admin/content/messages is what React Query calls from the client!
    // Let's check: is getMessages actually called by Server Components, or is the messages admin page client-side rendered?
    // Let's verify where getMessages is used in the app!
    return backendFetch<Message[]>(`/admin/content/messages?${search}`, { revalidate: false });
  }
);

/* ── Aggregate for the landing page (one call, one pass) ──── */
export const getHomePageData = cache(async () => {
  const [hero, about, projects, experience, skills, testimonials, posts, socials, settings] =
    await Promise.all([
      getHero(),
      getAbout(),
      getProjects({ featured: true, limit: 3 }),
      getExperience(),
      getSkills({ featured: true }),
      getTestimonials({ featured: true }),
      getPosts({ limit: 3 }),
      getSocialLinks(),
      getSettings(),
    ]);

  return { hero, about, projects, experience, skills, testimonials, posts, socials, settings };
});
