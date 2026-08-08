import { withDB } from "@/config/database";
import {
  AboutModel,
  AchievementModel,
  BlogModel,
  EducationModel,
  ExperienceModel,
  HeroModel,
  MessageModel,
  ProjectModel,
  ResumeModel,
  SEOModel,
  SettingsModel,
  SkillModel,
  SocialModel,
  TestimonialModel,
} from "@/models";
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
import { DEFAULT_SEO, DEFAULT_SETTINGS, PERSON } from "@/constants/site";
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
import { serialize } from "@/utils";

const isEmpty = (value: unknown[] | null | undefined) => !value || value.length === 0;

/* ── Hero ─────────────────────────────────────────────────── */
export async function getHero(): Promise<Hero> {
  const doc = await withDB(
    () => HeroModel.findOne().lean<Hero>().exec(),
    null,
    "getHero"
  );
  return doc ? serialize(doc) : HERO_SEED;
}

/* ── About ────────────────────────────────────────────────── */
export async function getAbout(): Promise<About> {
  const doc = await withDB(
    () => AboutModel.findOne().lean<About>().exec(),
    null,
    "getAbout"
  );
  return doc ? serialize(doc) : ABOUT_SEED;
}

/* ── Projects ─────────────────────────────────────────────── */
export async function getProjects(options: {
  featured?: boolean;
  limit?: number;
  includeDrafts?: boolean;
} = {}): Promise<Project[]> {
  const { featured, limit, includeDrafts = false } = options;

  const docs = await withDB(
    async () => {
      const query: Record<string, unknown> = includeDrafts ? {} : { status: "published" };
      if (featured) query.featured = true;
      let cursor = ProjectModel.find(query).sort({ order: 1, createdAt: -1 });
      if (limit) cursor = cursor.limit(limit);
      return cursor.lean<Project[]>().exec();
    },
    null,
    "getProjects"
  );

  if (!isEmpty(docs)) return serialize(docs!);

  let seeds = PROJECTS_SEED.filter((p) => includeDrafts || p.status === "published");
  if (featured) seeds = seeds.filter((p) => p.featured);
  seeds = [...seeds].sort((a, b) => a.order - b.order);
  return limit ? seeds.slice(0, limit) : seeds;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const doc = await withDB(
    () => ProjectModel.findOne({ slug, status: "published" }).lean<Project>().exec(),
    null,
    "getProjectBySlug"
  );
  if (doc) return serialize(doc);
  return PROJECTS_SEED.find((p) => p.slug === slug && p.status === "published") ?? null;
}

/* ── Experience ───────────────────────────────────────────── */
export async function getExperience(): Promise<Experience[]> {
  const docs = await withDB(
    () =>
      ExperienceModel.find({ status: "published" })
        .sort({ order: 1, start: -1 })
        .lean<Experience[]>()
        .exec(),
    null,
    "getExperience"
  );
  return isEmpty(docs) ? EXPERIENCE_SEED : serialize(docs!);
}

/* ── Skills ───────────────────────────────────────────────── */
export async function getSkills(options: { featured?: boolean } = {}): Promise<Skill[]> {
  const docs = await withDB(
    () => {
      const query: Record<string, unknown> = { status: "published" };
      if (options.featured) query.featured = true;
      return SkillModel.find(query)
        .sort({ category: 1, order: 1 })
        .lean<Skill[]>()
        .exec();
    },
    null,
    "getSkills"
  );

  if (!isEmpty(docs)) return serialize(docs!);
  const seeds = SKILLS_SEED.filter((s) => s.status === "published");
  return options.featured ? seeds.filter((s) => s.featured) : seeds;
}

/* ── Education ────────────────────────────────────────────── */
export async function getEducation(): Promise<Education[]> {
  const docs = await withDB(
    () =>
      EducationModel.find({ status: "published" })
        .sort({ order: 1, start: -1 })
        .lean<Education[]>()
        .exec(),
    null,
    "getEducation"
  );
  return isEmpty(docs) ? EDUCATION_SEED : serialize(docs!);
}

/* ── Achievements ─────────────────────────────────────────── */
export async function getAchievements(): Promise<Achievement[]> {
  const docs = await withDB(
    () =>
      AchievementModel.find({ status: "published" })
        .sort({ order: 1, date: -1 })
        .lean<Achievement[]>()
        .exec(),
    null,
    "getAchievements"
  );
  return isEmpty(docs) ? ACHIEVEMENTS_SEED : serialize(docs!);
}

/* ── Testimonials ─────────────────────────────────────────── */
export async function getTestimonials(options: { featured?: boolean } = {}): Promise<Testimonial[]> {
  const docs = await withDB(
    () => {
      const query: Record<string, unknown> = { status: "published" };
      if (options.featured) query.featured = true;
      return TestimonialModel.find(query)
        .sort({ order: 1 })
        .lean<Testimonial[]>()
        .exec();
    },
    null,
    "getTestimonials"
  );

  if (!isEmpty(docs)) return serialize(docs!);
  const seeds = TESTIMONIALS_SEED.filter((t) => t.status === "published");
  return options.featured ? seeds.filter((t) => t.featured) : seeds;
}

/* ── Blog ─────────────────────────────────────────────────── */
export async function getPosts(options: {
  featured?: boolean;
  limit?: number;
  category?: string;
  tag?: string;
} = {}): Promise<BlogPost[]> {
  const { featured, limit, category, tag } = options;

  const docs = await withDB(
    async () => {
      const query: Record<string, unknown> = { status: "published" };
      if (featured) query.featured = true;
      if (category) query.category = category;
      if (tag) query.tags = tag;
      let cursor = BlogModel.find(query).sort({ publishedAt: -1 });
      if (limit) cursor = cursor.limit(limit);
      return cursor.lean<BlogPost[]>().exec();
    },
    null,
    "getPosts"
  );

  if (!isEmpty(docs)) return serialize(docs!);

  let seeds = BLOG_SEED.filter((p) => p.status === "published");
  if (featured) seeds = seeds.filter((p) => p.featured);
  if (category) seeds = seeds.filter((p) => p.category === category);
  if (tag) seeds = seeds.filter((p) => p.tags.includes(tag));
  seeds = [...seeds].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  return limit ? seeds.slice(0, limit) : seeds;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const doc = await withDB(
    () => BlogModel.findOne({ slug, status: "published" }).lean<BlogPost>().exec(),
    null,
    "getPostBySlug"
  );
  if (doc) return serialize(doc);
  return BLOG_SEED.find((p) => p.slug === slug && p.status === "published") ?? null;
}

/* ── Social ───────────────────────────────────────────────── */
export async function getSocialLinks(): Promise<SocialLink[]> {
  const docs = await withDB(
    () =>
      SocialModel.find({ status: "published" })
        .sort({ order: 1 })
        .lean<SocialLink[]>()
        .exec(),
    null,
    "getSocialLinks"
  );
  return isEmpty(docs) ? SOCIAL_SEED : serialize(docs!);
}

/* ── Resume ───────────────────────────────────────────────── */
export async function getResume(): Promise<Resume> {
  const doc = await withDB(
    () => ResumeModel.findOne({ isActive: true }).lean<Resume>().exec(),
    null,
    "getResume"
  );
  if (doc) return serialize(doc);
  return {
    label: `${PERSON.name} — Resume`,
    fileUrl: "/resume/Ashish-Kumar-Resume.pdf",
    version: "2026.1",
    updatedOn: "2026-01-15",
    downloads: 0,
    isActive: true,
  };
}

/* ── SEO + settings ───────────────────────────────────────── */
export async function getSEO(): Promise<SEOSettings> {
  const doc = await withDB(
    () => SEOModel.findOne().lean<SEOSettings>().exec(),
    null,
    "getSEO"
  );
  return doc ? { ...DEFAULT_SEO, ...serialize(doc) } : DEFAULT_SEO;
}

export async function getSettings(): Promise<Settings> {
  const doc = await withDB(
    () => SettingsModel.findOne().lean<Settings>().exec(),
    null,
    "getSettings"
  );
  return doc ? { ...DEFAULT_SETTINGS, ...serialize(doc) } : DEFAULT_SETTINGS;
}

/* ── Messages (admin only) ────────────────────────────────── */
export async function getMessages(options: { archived?: boolean; limit?: number } = {}): Promise<Message[]> {
  const docs = await withDB(
    () =>
      MessageModel.find({ archived: options.archived ?? false })
        .sort({ createdAt: -1 })
        .limit(options.limit ?? 100)
        .lean<Message[]>()
        .exec(),
    [] as Message[],
    "getMessages"
  );
  return serialize(docs);
}
