import type { Model } from "mongoose";
import type { ZodSchema } from "zod";
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
  aboutSchema,
  achievementSchema,
  blogSchema,
  educationSchema,
  experienceSchema,
  heroSchema,
  projectSchema,
  resumeSchema,
  seoSchema,
  settingsSchema,
  skillSchema,
  socialSchema,
  testimonialSchema,
} from "@/validators";
import type { Role } from "@/types";
import { readingTime, slugify, stripMarkdown } from "@/utils";

export interface ResourceConfig {
  model: Model<any>;
  schema: ZodSchema<unknown> | null;
  singleton: boolean;
  sort: Record<string, 1 | -1>;
  searchable: string[];
  writeRole: Role;
  label: string;
  revalidate: string[];
}

export type ResourceName =
  | "hero"
  | "about"
  | "projects"
  | "experience"
  | "skills"
  | "education"
  | "achievements"
  | "testimonials"
  | "blog"
  | "social"
  | "resume"
  | "seo"
  | "settings"
  | "messages";

export const RESOURCES: Record<ResourceName, ResourceConfig> = {
  hero: {
    model: HeroModel,
    schema: heroSchema,
    singleton: true,
    sort: { updatedAt: -1 },
    searchable: [],
    writeRole: "editor",
    label: "Hero",
    revalidate: ["/"],
  },
  about: {
    model: AboutModel,
    schema: aboutSchema,
    singleton: true,
    sort: { updatedAt: -1 },
    searchable: [],
    writeRole: "editor",
    label: "About",
    revalidate: ["/", "/about"],
  },
  projects: {
    model: ProjectModel,
    schema: projectSchema,
    singleton: false,
    sort: { order: 1, createdAt: -1 },
    searchable: ["title", "slug", "summary", "techStack"],
    writeRole: "editor",
    label: "Projects",
    revalidate: ["/", "/projects"],
  },
  experience: {
    model: ExperienceModel,
    schema: experienceSchema,
    singleton: false,
    sort: { order: 1, start: -1 },
    searchable: ["company", "role"],
    writeRole: "editor",
    label: "Experience",
    revalidate: ["/", "/experience", "/about", "/resume"],
  },
  skills: {
    model: SkillModel,
    schema: skillSchema,
    singleton: false,
    sort: { category: 1, order: 1 },
    searchable: ["name", "category"],
    writeRole: "editor",
    label: "Skills",
    revalidate: ["/", "/skills", "/resume"],
  },
  education: {
    model: EducationModel,
    schema: educationSchema,
    singleton: false,
    sort: { order: 1, start: -1 },
    searchable: ["institution", "degree"],
    writeRole: "editor",
    label: "Education",
    revalidate: ["/about", "/experience", "/resume", "/achievements"],
  },
  achievements: {
    model: AchievementModel,
    schema: achievementSchema,
    singleton: false,
    sort: { order: 1, date: -1 },
    searchable: ["title", "issuer"],
    writeRole: "editor",
    label: "Achievements",
    revalidate: ["/achievements", "/about", "/resume"],
  },
  testimonials: {
    model: TestimonialModel,
    schema: testimonialSchema,
    singleton: false,
    sort: { order: 1 },
    searchable: ["name", "company", "quote"],
    writeRole: "editor",
    label: "Testimonials",
    revalidate: ["/", "/achievements"],
  },
  blog: {
    model: BlogModel,
    schema: blogSchema,
    singleton: false,
    sort: { publishedAt: -1 },
    searchable: ["title", "slug", "excerpt", "tags"],
    writeRole: "editor",
    label: "Blog",
    revalidate: ["/", "/blog"],
  },
  social: {
    model: SocialModel,
    schema: socialSchema,
    singleton: false,
    sort: { order: 1 },
    searchable: ["platform", "label"],
    writeRole: "editor",
    label: "Social links",
    revalidate: ["/", "/contact"],
  },
  resume: {
    model: ResumeModel,
    schema: resumeSchema,
    singleton: false,
    sort: { updatedAt: -1 },
    searchable: ["label", "version"],
    writeRole: "editor",
    label: "Resume",
    revalidate: ["/resume"],
  },
  seo: {
    model: SEOModel,
    schema: seoSchema,
    singleton: true,
    sort: { updatedAt: -1 },
    searchable: [],
    writeRole: "admin",
    label: "SEO",
    revalidate: ["/"],
  },
  settings: {
    model: SettingsModel,
    schema: settingsSchema,
    singleton: true,
    sort: { updatedAt: -1 },
    searchable: [],
    writeRole: "admin",
    label: "Settings",
    revalidate: ["/", "/contact"],
  },
  messages: {
    model: MessageModel,
    schema: null,
    singleton: false,
    sort: { createdAt: -1 },
    searchable: ["name", "email", "subject", "message"],
    writeRole: "editor",
    label: "Messages",
    revalidate: [],
  },
};

export const RESOURCE_NAMES = Object.keys(RESOURCES) as ResourceName[];

export function isResource(value: string): value is ResourceName {
  return RESOURCE_NAMES.includes(value as ResourceName);
}

export function getResource(name: string): ResourceConfig {
  if (!isResource(name)) {
    throw new Error(`Unknown resource: ${name}`);
  }
  return RESOURCES[name];
}

export function applyDerivedFields(resource: string, data: Record<string, unknown>) {
  if (typeof data.slug === "string") {
    data.slug = slugify(data.slug);
  }

  if (resource === "blog" && typeof data.content === "string") {
    data.readingTime = readingTime(stripMarkdown(data.content));
  }

  if (resource === "experience" && data.end === "") {
    data.end = null;
    data.current = true;
  }
}

export function searchFilter(config: ResourceConfig, term?: string) {
  if (!term?.trim() || config.searchable.length === 0) return {};
  const pattern = new RegExp(term.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  return { $or: config.searchable.map((field) => ({ [field]: pattern })) };
}
