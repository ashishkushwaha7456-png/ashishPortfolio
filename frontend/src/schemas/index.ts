import { z } from "zod";
import { SKILL_CATEGORIES } from "@/constants/site";

/* ────────────────────────────────────────────────────────────
   Shared primitives
   ──────────────────────────────────────────────────────────── */
export const publishStatusSchema = z.enum(["draft", "published", "archived"]);

export const mediaAssetSchema = z.object({
  url: z.string().min(1, "Image URL is required"),
  publicId: z.string().optional(),
  alt: z.string().optional(),
  width: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
  blurDataURL: z.string().optional(),
  type: z.enum(["image", "video", "lottie"]).optional().default("image"),
  caption: z.string().optional(),
});

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .refine((v) => !v || /^(https?:\/\/|\/|mailto:|tel:)/.test(v), {
    message: "Must be a valid URL or path",
  });

const slugSchema = z
  .string()
  .min(2, "Slug is too short")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens");

/* ────────────────────────────────────────────────────────────
   Auth
   ──────────────────────────────────────────────────────────── */
export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean().optional().default(false),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8),
    newPassword: z
      .string()
      .min(8, "Use at least 8 characters")
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/[a-z]/, "Include a lowercase letter")
      .regex(/[0-9]/, "Include a number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/* ────────────────────────────────────────────────────────────
   Contact
   ──────────────────────────────────────────────────────────── */
export const contactSchema = z.object({
  name: z.string().min(2, "Tell me your name").max(80),
  email: z.string().email("Enter a valid email address"),
  subject: z.string().min(3, "Add a short subject").max(140),
  projectType: z
    .enum(["Full-time role", "Contract", "Freelance project", "Collaboration", "Just saying hi"])
    .optional(),
  budget: z.enum(["< $5k", "$5k – $15k", "$15k – $50k", "$50k+", "Not applicable"]).optional(),
  message: z.string().min(20, "A little more detail helps (20+ characters)").max(4000),
  /**
   * Honeypot — hidden from humans, so a value here means a bot.
   *
   * Deliberately NOT validated: rejecting it would return a 422 that tells the
   * bot which field tripped it. The route checks this itself and returns a
   * normal success response instead, so the submission silently goes nowhere.
   */
  website: z.string().max(200).optional(),
});
export type ContactInput = z.infer<typeof contactSchema>;

/* ────────────────────────────────────────────────────────────
   Hero
   ──────────────────────────────────────────────────────────── */
export const heroSchema = z.object({
  eyebrow: z.string().min(2).max(120),
  name: z.string().min(2).max(80),
  headline: z.string().min(8).max(200),
  roles: z.array(z.string().min(2)).min(1, "Add at least one role"),
  subheadline: z.string().min(20).max(600),
  availability: z.object({ open: z.boolean(), label: z.string().min(2) }),
  avatar: mediaAssetSchema,
  resumeUrl: z.string().min(1),
  ctas: z
    .array(
      z.object({
        label: z.string().min(1),
        href: z.string().min(1),
        icon: z.string().optional(),
        variant: z.enum(["primary", "secondary", "ghost", "outline"]).optional(),
        external: z.boolean().optional(),
      }),
    )
    .default([]),
  highlights: z
    .array(
      z.object({
        label: z.string().min(1),
        value: z.string().min(1),
        suffix: z.string().optional(),
      }),
    )
    .default([]),
});
export type HeroInput = z.infer<typeof heroSchema>;

/* ────────────────────────────────────────────────────────────
   About
   ──────────────────────────────────────────────────────────── */
export const aboutSchema = z.object({
  title: z.string().min(4).max(160),
  bio: z.array(z.string().min(20)).min(1),
  philosophy: z
    .array(
      z.object({
        title: z.string().min(2),
        description: z.string().min(10),
        icon: z.string().optional(),
      }),
    )
    .default([]),
  mission: z.string().min(20),
  loveBuilding: z
    .array(
      z.object({
        title: z.string().min(2),
        description: z.string().min(10),
        icon: z.string().optional(),
      }),
    )
    .default([]),
  story: z
    .array(
      z.object({
        year: z.string().min(2),
        title: z.string().min(2),
        description: z.string().min(10),
        icon: z.string().optional(),
      }),
    )
    .default([]),
  stats: z
    .array(
      z.object({
        label: z.string().min(1),
        value: z.coerce.number(),
        suffix: z.string().optional(),
        icon: z.string().optional(),
      }),
    )
    .default([]),
  location: z.string().min(2),
  languages: z.array(z.string()).default([]),
  interests: z.array(z.string()).default([]),
  image: mediaAssetSchema.optional(),
});
export type AboutInput = z.infer<typeof aboutSchema>;

/* ────────────────────────────────────────────────────────────
   Projects
   ──────────────────────────────────────────────────────────── */
export const projectSchema = z.object({
  slug: slugSchema,
  title: z.string().min(2).max(120),
  tagline: z.string().min(8).max(220),
  summary: z.string().min(20).max(600),
  description: z.string().min(20),
  category: z.enum(["web-app", "marketplace", "saas", "mobile", "open-source", "tooling"]),
  status: publishStatusSchema.default("draft"),
  featured: z.boolean().default(false),
  order: z.coerce.number().int().default(0),
  year: z.string().min(4).max(9),
  timeline: z.object({
    start: z.string().min(4),
    end: z.string().nullable().optional(),
    duration: z.string().min(1),
  }),
  role: z.string().min(2),
  team: z.string().optional(),
  client: z.string().optional(),
  thumbnail: mediaAssetSchema,
  cover: mediaAssetSchema.optional(),
  gallery: z.array(mediaAssetSchema).default([]),
  video: mediaAssetSchema.optional(),
  techStack: z.array(z.string().min(1)).min(1, "Add at least one technology"),
  features: z
    .array(
      z.object({
        title: z.string().min(2),
        description: z.string().min(10),
        icon: z.string().optional(),
      }),
    )
    .default([]),
  architecture: z
    .array(
      z.object({
        layer: z.string().min(2),
        items: z.array(z.string()).default([]),
        description: z.string().optional(),
      }),
    )
    .default([]),
  challenges: z
    .array(
      z.object({
        challenge: z.string().min(10),
        solution: z.string().min(10),
        impact: z.string().optional(),
      }),
    )
    .default([]),
  metrics: z
    .array(
      z.object({
        label: z.string().min(1),
        value: z.string().min(1),
        description: z.string().optional(),
        icon: z.string().optional(),
      }),
    )
    .default([]),
  snippets: z
    .array(
      z.object({
        title: z.string().min(2),
        language: z.string().min(1),
        code: z.string().min(1),
        description: z.string().optional(),
      }),
    )
    .default([]),
  caseStudy: z.string().optional(),
  links: z
    .object({
      live: optionalUrl,
      github: optionalUrl,
      caseStudy: optionalUrl,
      playStore: optionalUrl,
      appStore: optionalUrl,
    })
    .default({}),
  accent: z
    .string()
    .regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, "Use a hex colour")
    .default("#6366f1"),
});
export type ProjectInput = z.infer<typeof projectSchema>;

/* ────────────────────────────────────────────────────────────
   Experience
   ──────────────────────────────────────────────────────────── */
export const experienceSchema = z.object({
  company: z.string().min(2),
  role: z.string().min(2),
  employmentType: z.enum(["Full-time", "Contract", "Freelance", "Internship"]),
  location: z.string().min(2),
  locationType: z.enum(["On-site", "Hybrid", "Remote"]),
  start: z.string().min(4),
  end: z.string().nullable().optional(),
  current: z.boolean().default(false),
  order: z.coerce.number().int().default(0),
  summary: z.string().min(20),
  highlights: z.array(z.string().min(10)).default([]),
  techStack: z.array(z.string()).default([]),
  logo: mediaAssetSchema.optional(),
  website: optionalUrl,
  status: publishStatusSchema.default("published"),
});
export type ExperienceInput = z.infer<typeof experienceSchema>;

/* ────────────────────────────────────────────────────────────
   Skills
   ──────────────────────────────────────────────────────────── */
export const skillSchema = z.object({
  name: z.string().min(1),
  category: z.enum(SKILL_CATEGORIES),
  level: z.coerce.number().min(0).max(100),
  years: z.coerce.number().min(0).max(50),
  icon: z.string().optional(),
  color: z.string().optional(),
  featured: z.boolean().default(false),
  order: z.coerce.number().int().default(0),
  description: z.string().optional(),
  status: publishStatusSchema.default("published"),
});
export type SkillInput = z.infer<typeof skillSchema>;

/* ────────────────────────────────────────────────────────────
   Education
   ──────────────────────────────────────────────────────────── */
export const educationSchema = z.object({
  institution: z.string().min(2),
  degree: z.string().min(2),
  field: z.string().min(2),
  location: z.string().min(2),
  start: z.string().min(4),
  end: z.string().nullable().optional(),
  grade: z.string().optional(),
  description: z.string().optional(),
  logo: mediaAssetSchema.optional(),
  order: z.coerce.number().int().default(0),
  status: publishStatusSchema.default("published"),
});
export type EducationInput = z.infer<typeof educationSchema>;

/* ────────────────────────────────────────────────────────────
   Achievements
   ──────────────────────────────────────────────────────────── */
export const achievementSchema = z.object({
  title: z.string().min(2),
  issuer: z.string().min(2),
  date: z.string().min(4),
  type: z.enum(["certification", "award", "milestone", "publication", "talk"]),
  description: z.string().min(10),
  credentialUrl: optionalUrl,
  credentialId: z.string().optional(),
  image: mediaAssetSchema.optional(),
  order: z.coerce.number().int().default(0),
  status: publishStatusSchema.default("published"),
});
export type AchievementInput = z.infer<typeof achievementSchema>;

/* ────────────────────────────────────────────────────────────
   Testimonials
   ──────────────────────────────────────────────────────────── */
export const testimonialSchema = z.object({
  name: z.string().min(2),
  role: z.string().min(2),
  company: z.string().min(1),
  quote: z.string().min(20).max(1200),
  rating: z.coerce.number().min(1).max(5).default(5),
  avatar: mediaAssetSchema.optional(),
  linkedin: optionalUrl,
  featured: z.boolean().default(false),
  order: z.coerce.number().int().default(0),
  status: publishStatusSchema.default("published"),
});
export type TestimonialInput = z.infer<typeof testimonialSchema>;

/* ────────────────────────────────────────────────────────────
   Blog
   ──────────────────────────────────────────────────────────── */
export const blogSchema = z.object({
  slug: slugSchema,
  title: z.string().min(4).max(160),
  excerpt: z.string().min(20).max(400),
  content: z.string().min(50, "Write at least a few paragraphs"),
  cover: mediaAssetSchema.optional(),
  category: z.string().min(2),
  tags: z.array(z.string()).default([]),
  publishedAt: z.string().min(4),
  featured: z.boolean().default(false),
  status: publishStatusSchema.default("draft"),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional(),
      ogImage: z.string().optional(),
      noIndex: z.boolean().optional(),
    })
    .optional(),
});
export type BlogInput = z.infer<typeof blogSchema>;

/* ────────────────────────────────────────────────────────────
   Social links
   ──────────────────────────────────────────────────────────── */
export const socialSchema = z.object({
  platform: z.string().min(2),
  label: z.string().min(1),
  url: z.string().min(1),
  icon: z.string().min(1),
  handle: z.string().optional(),
  order: z.coerce.number().int().default(0),
  showInHero: z.boolean().default(true),
  showInFooter: z.boolean().default(true),
  status: publishStatusSchema.default("published"),
});
export type SocialInput = z.infer<typeof socialSchema>;

/* ────────────────────────────────────────────────────────────
   Resume
   ──────────────────────────────────────────────────────────── */
export const resumeSchema = z.object({
  label: z.string().min(2),
  fileUrl: z.string().min(1),
  version: z.string().min(1),
  updatedOn: z.string().min(4),
  isActive: z.boolean().default(true),
});
export type ResumeInput = z.infer<typeof resumeSchema>;

/* ────────────────────────────────────────────────────────────
   SEO + settings
   ──────────────────────────────────────────────────────────── */
export const seoSchema = z.object({
  siteName: z.string().min(2),
  titleTemplate: z.string().min(2),
  title: z.string().min(4).max(70, "Keep titles under 70 characters"),
  description: z.string().min(50).max(180, "Keep descriptions under 180 characters"),
  keywords: z.array(z.string()).default([]),
  ogImage: z.string().min(1),
  canonical: optionalUrl,
  noIndex: z.boolean().default(false),
  googleSiteVerification: z.string().optional(),
});
export type SEOInput = z.infer<typeof seoSchema>;

export const settingsSchema = z.object({
  siteName: z.string().min(2),
  tagline: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  location: z.string().min(2),
  timezone: z.string().min(2),
  availableForWork: z.boolean().default(true),
  calendlyUrl: optionalUrl,
  mapEmbedUrl: optionalUrl,
  coordinates: z.object({ lat: z.coerce.number(), lng: z.coerce.number() }).optional(),
  maintenanceMode: z.boolean().default(false),
  features: z.object({
    blog: z.boolean().default(true),
    testimonials: z.boolean().default(true),
    spotify: z.boolean().default(false),
    github: z.boolean().default(true),
    leetcode: z.boolean().default(false),
    analytics: z.boolean().default(true),
    cursor: z.boolean().default(true),
    loadingScreen: z.boolean().default(true),
  }),
});
export type SettingsInput = z.infer<typeof settingsSchema>;

/* ────────────────────────────────────────────────────────────
   Query helpers
   ──────────────────────────────────────────────────────────── */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  search: z.string().optional(),
  status: z.union([publishStatusSchema, z.literal("all")]).optional(),
  sort: z.string().optional(),
});

export const analyticsEventSchema = z.object({
  type: z.enum(["pageview", "click", "download", "contact", "project_view"]),
  path: z.string().min(1),
  referrer: z.string().optional(),
  meta: z.record(z.unknown()).optional(),
});

/** Flattens a ZodError into `{ field: [messages] }` for API responses. */
export function formatZodIssues(error: z.ZodError) {
  return error.flatten().fieldErrors as Record<string, string[]>;
}
