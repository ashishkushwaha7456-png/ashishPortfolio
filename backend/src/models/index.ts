import {
  Schema,
  model,
  models,
  type Model,
  type SchemaDefinition,
  type SchemaOptions,
} from "mongoose";
import type {
  About,
  Achievement,
  AdminUser,
  AnalyticsEvent,
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
import { SKILL_CATEGORIES } from "@/constants/site";

/* ────────────────────────────────────────────────────────────
   Shared sub-schemas
   ──────────────────────────────────────────────────────────── */
const baseOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform(_doc: unknown, ret: Record<string, unknown>) {
      ret._id = String(ret._id);
      delete ret.__v;
      return ret;
    },
  },
  toObject: { virtuals: true },
} as const;

const MediaSchema = defineSchema(
  {
    url: { type: String, required: true },
    publicId: String,
    alt: String,
    width: Number,
    height: Number,
    blurDataURL: String,
    type: { type: String, enum: ["image", "video", "lottie"], default: "image" },
    caption: String,
  },
  { _id: false },
);

const status = {
  type: String,
  enum: ["draft", "published", "archived"],
  default: "published",
  index: true,
};

/**
 * Builds a schema without letting Mongoose infer a document type from the
 * literal.
 *
 * `new Schema({ … })` runs `InferSchemaType` over the definition object, and
 * across seventeen schemas that alone pushed `tsc` past 4GB of heap. The real
 * document types come from `compile<T>()` below, so the inferred one was never
 * used — taking the definition as a plain record widens it on the way in and
 * the inference never happens.
 */
function defineSchema(
  definition: Record<string, unknown>,
  options: SchemaOptions = baseOptions as SchemaOptions,
): Schema {
  return new Schema(definition as SchemaDefinition, options);
}

/**
 * Compiles (or reuses) a model.
 *
 * Deliberately calls the non-generic `model()` and casts, rather than
 * `model<T>()`. The generic overload instantiates Mongoose's five-parameter
 * `Model<…>` machinery at every call site; doing that seventeen times was the
 * single largest contributor to type-checking memory in this project.
 *
 * Next's dev server re-evaluates this module on hot reload, hence the
 * `models[name]` lookup — recompiling a model throws `OverwriteModelError`.
 */
function compile<T>(name: string, schema: Schema): Model<T> {
  return (models[name] ?? model(name, schema)) as unknown as Model<T>;
}

/* ────────────────────────────────────────────────────────────
   Hero (singleton)
   ──────────────────────────────────────────────────────────── */
const HeroSchema = defineSchema(
  {
    eyebrow: { type: String, required: true },
    name: { type: String, required: true },
    headline: { type: String, required: true },
    roles: { type: [String], default: [] },
    subheadline: { type: String, required: true },
    availability: {
      open: { type: Boolean, default: true },
      label: { type: String, default: "Open to work" },
    },
    avatar: { type: MediaSchema, required: true },
    resumeUrl: { type: String, default: "/resume" },
    ctas: [
      {
        _id: false,
        label: String,
        href: String,
        icon: String,
        variant: { type: String, enum: ["primary", "secondary", "ghost", "outline"] },
        external: Boolean,
      },
    ],
    highlights: [{ _id: false, label: String, value: String, suffix: String }],
  },
);
export const HeroModel = compile<Hero>("Hero", HeroSchema);

/* ────────────────────────────────────────────────────────────
   About (singleton)
   ──────────────────────────────────────────────────────────── */
const AboutSchema = defineSchema(
  {
    title: { type: String, required: true },
    bio: { type: [String], default: [] },
    philosophy: [{ _id: false, title: String, description: String, icon: String }],
    mission: String,
    loveBuilding: [{ _id: false, title: String, description: String, icon: String }],
    story: [{ _id: false, year: String, title: String, description: String, icon: String }],
    stats: [{ _id: false, label: String, value: Number, suffix: String, icon: String }],
    location: String,
    languages: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    image: MediaSchema,
  },
);
export const AboutModel = compile<About>("About", AboutSchema);

/* ────────────────────────────────────────────────────────────
   Project
   ──────────────────────────────────────────────────────────── */
const ProjectSchema = defineSchema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    tagline: { type: String, required: true },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["web-app", "marketplace", "saas", "mobile", "open-source", "tooling"],
      default: "web-app",
      index: true,
    },
    status,
    featured: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0, index: true },
    year: String,
    timeline: {
      start: String,
      end: { type: String, default: null },
      duration: String,
    },
    role: String,
    team: String,
    client: String,
    thumbnail: { type: MediaSchema, required: true },
    cover: MediaSchema,
    gallery: { type: [MediaSchema], default: [] },
    video: MediaSchema,
    techStack: { type: [String], default: [], index: true },
    features: [{ _id: false, title: String, description: String, icon: String }],
    architecture: [{ _id: false, layer: String, items: [String], description: String }],
    challenges: [{ _id: false, challenge: String, solution: String, impact: String }],
    metrics: [{ _id: false, label: String, value: String, description: String, icon: String }],
    snippets: [{ _id: false, title: String, language: String, code: String, description: String }],
    caseStudy: String,
    links: {
      live: String,
      github: String,
      caseStudy: String,
      playStore: String,
      appStore: String,
    },
    accent: { type: String, default: "#6366f1" },
    views: { type: Number, default: 0 },
  },
);
ProjectSchema.index({ title: "text", summary: "text", techStack: "text" });
export const ProjectModel = compile<Project>("Project", ProjectSchema);

/* ────────────────────────────────────────────────────────────
   Experience
   ──────────────────────────────────────────────────────────── */
const ExperienceSchema = defineSchema(
  {
    company: { type: String, required: true },
    role: { type: String, required: true },
    employmentType: {
      type: String,
      enum: ["Full-time", "Contract", "Freelance", "Internship"],
      default: "Full-time",
    },
    location: String,
    locationType: { type: String, enum: ["On-site", "Hybrid", "Remote"], default: "On-site" },
    start: { type: String, required: true },
    end: { type: String, default: null },
    current: { type: Boolean, default: false },
    order: { type: Number, default: 0, index: true },
    summary: String,
    highlights: { type: [String], default: [] },
    techStack: { type: [String], default: [] },
    logo: MediaSchema,
    website: String,
    status,
  },
);
export const ExperienceModel = compile<Experience>("Experience", ExperienceSchema);

/* ────────────────────────────────────────────────────────────
   Skill
   ──────────────────────────────────────────────────────────── */
const SkillSchema = defineSchema(
  {
    name: { type: String, required: true },
    category: { type: String, enum: SKILL_CATEGORIES, required: true, index: true },
    level: { type: Number, min: 0, max: 100, default: 70 },
    years: { type: Number, default: 1 },
    icon: String,
    color: String,
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    description: String,
    status,
  },
);
SkillSchema.index({ category: 1, order: 1 });
export const SkillModel = compile<Skill>("Skill", SkillSchema);

/* ────────────────────────────────────────────────────────────
   Education
   ──────────────────────────────────────────────────────────── */
const EducationSchema = defineSchema(
  {
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    field: String,
    location: String,
    start: String,
    end: { type: String, default: null },
    grade: String,
    description: String,
    logo: MediaSchema,
    order: { type: Number, default: 0 },
    status,
  },
);
export const EducationModel = compile<Education>("Education", EducationSchema);

/* ────────────────────────────────────────────────────────────
   Achievement
   ──────────────────────────────────────────────────────────── */
const AchievementSchema = defineSchema(
  {
    title: { type: String, required: true },
    issuer: String,
    date: String,
    type: {
      type: String,
      enum: ["certification", "award", "milestone", "publication", "talk"],
      default: "milestone",
      index: true,
    },
    description: String,
    credentialUrl: String,
    credentialId: String,
    image: MediaSchema,
    order: { type: Number, default: 0 },
    status,
  },
);
export const AchievementModel = compile<Achievement>("Achievement", AchievementSchema);

/* ────────────────────────────────────────────────────────────
   Testimonial
   ──────────────────────────────────────────────────────────── */
const TestimonialSchema = defineSchema(
  {
    name: { type: String, required: true },
    role: String,
    company: String,
    quote: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    avatar: MediaSchema,
    linkedin: String,
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    status,
  },
);
export const TestimonialModel = compile<Testimonial>("Testimonial", TestimonialSchema);

/* ────────────────────────────────────────────────────────────
   Blog
   ──────────────────────────────────────────────────────────── */
const BlogSchema = defineSchema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    cover: MediaSchema,
    category: { type: String, index: true },
    tags: { type: [String], default: [], index: true },
    readingTime: { type: Number, default: 5 },
    publishedAt: { type: String, index: true },
    featured: { type: Boolean, default: false },
    status: { ...status, default: "draft" },
    views: { type: Number, default: 0 },
    seo: {
      title: String,
      description: String,
      keywords: [String],
      ogImage: String,
      noIndex: Boolean,
    },
  },
);
BlogSchema.index({ title: "text", excerpt: "text", content: "text" });
export const BlogModel = compile<BlogPost>("Blog", BlogSchema);

/* ────────────────────────────────────────────────────────────
   Social link
   ──────────────────────────────────────────────────────────── */
const SocialSchema = defineSchema(
  {
    platform: { type: String, required: true },
    label: { type: String, required: true },
    url: { type: String, required: true },
    icon: { type: String, default: "Link" },
    handle: String,
    order: { type: Number, default: 0 },
    showInHero: { type: Boolean, default: true },
    showInFooter: { type: Boolean, default: true },
    status,
  },
);
export const SocialModel = compile<SocialLink>("Social", SocialSchema);

/* ────────────────────────────────────────────────────────────
   Resume
   ──────────────────────────────────────────────────────────── */
const ResumeSchema = defineSchema(
  {
    label: { type: String, default: "Latest resume" },
    fileUrl: { type: String, required: true },
    version: { type: String, default: "1.0" },
    updatedOn: String,
    downloads: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
);
export const ResumeModel = compile<Resume>("Resume", ResumeSchema);

/* ────────────────────────────────────────────────────────────
   SEO (singleton)
   ──────────────────────────────────────────────────────────── */
const SEOSchema = defineSchema(
  {
    siteName: String,
    titleTemplate: String,
    title: { type: String, required: true },
    description: { type: String, required: true },
    keywords: { type: [String], default: [] },
    ogImage: String,
    twitterHandle: String,
    canonical: String,
    noIndex: { type: Boolean, default: false },
    googleSiteVerification: String,
    structuredData: Schema.Types.Mixed,
  },
);
export const SEOModel = compile<SEOSettings>("SEO", SEOSchema);

/* ────────────────────────────────────────────────────────────
   Settings (singleton)
   ──────────────────────────────────────────────────────────── */
const SettingsSchema = defineSchema(
  {
    siteName: String,
    tagline: String,
    email: String,
    phone: String,
    location: String,
    timezone: String,
    availableForWork: { type: Boolean, default: true },
    calendlyUrl: String,
    mapEmbedUrl: String,
    coordinates: { lat: Number, lng: Number },
    maintenanceMode: { type: Boolean, default: false },
    features: {
      blog: { type: Boolean, default: true },
      testimonials: { type: Boolean, default: true },
      spotify: { type: Boolean, default: false },
      github: { type: Boolean, default: true },
      leetcode: { type: Boolean, default: false },
      analytics: { type: Boolean, default: true },
      cursor: { type: Boolean, default: true },
      loadingScreen: { type: Boolean, default: true },
    },
  },
);
export const SettingsModel = compile<Settings>("Settings", SettingsSchema);

/* ────────────────────────────────────────────────────────────
   Message
   ──────────────────────────────────────────────────────────── */
const MessageSchema = defineSchema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    subject: String,
    budget: String,
    projectType: String,
    message: { type: String, required: true },
    read: { type: Boolean, default: false, index: true },
    starred: { type: Boolean, default: false },
    archived: { type: Boolean, default: false, index: true },
    replied: { type: Boolean, default: false },
    ip: String,
    userAgent: String,
    referrer: String,
  },
);
export const MessageModel = compile<Message>("Message", MessageSchema);

/* ────────────────────────────────────────────────────────────
   Analytics
   ──────────────────────────────────────────────────────────── */
const AnalyticsSchema = defineSchema(
  {
    type: {
      type: String,
      enum: ["pageview", "click", "download", "contact", "project_view"],
      default: "pageview",
      index: true,
    },
    path: { type: String, index: true },
    referrer: String,
    country: String,
    device: { type: String, enum: ["desktop", "tablet", "mobile"], default: "desktop" },
    browser: String,
    sessionId: { type: String, index: true },
    meta: Schema.Types.Mixed,
  },
);
AnalyticsSchema.index({ createdAt: -1 });
export const AnalyticsModel = compile<AnalyticsEvent>("Analytics", AnalyticsSchema);

/* ────────────────────────────────────────────────────────────
   Admin user
   ──────────────────────────────────────────────────────────── */
const UserSchema = defineSchema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "editor", "viewer"], default: "admin" },
    avatar: String,
    lastLogin: String,
    active: { type: Boolean, default: true },
  },
);
export const UserModel = compile<AdminUser>("User", UserSchema);
