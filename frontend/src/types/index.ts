/* ────────────────────────────────────────────────────────────
   Shared domain types — the single source of truth for the
   public site, the API layer and the admin panel.
   ──────────────────────────────────────────────────────────── */

export type ID = string;

export type PublishStatus = "draft" | "published" | "archived";

export type Role = "admin" | "editor" | "viewer";

export interface Timestamped {
  createdAt?: string;
  updatedAt?: string;
}

export interface MediaAsset {
  url: string;
  publicId?: string;
  alt?: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
  type?: "image" | "video" | "lottie";
  caption?: string;
}

/* ── Hero ─────────────────────────────────────────────────── */
export interface HeroCTA {
  label: string;
  href: string;
  icon?: string;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  external?: boolean;
}

export interface Hero extends Timestamped {
  _id?: ID;
  eyebrow: string;
  name: string;
  headline: string;
  /** Strings cycled by the typing animation. */
  roles: string[];
  subheadline: string;
  availability: {
    open: boolean;
    label: string;
  };
  avatar: MediaAsset;
  resumeUrl: string;
  ctas: HeroCTA[];
  highlights: { label: string; value: string; suffix?: string }[];
}

/* ── About ────────────────────────────────────────────────── */
export interface AboutStoryChapter {
  year: string;
  title: string;
  description: string;
  icon?: string;
}

export interface About extends Timestamped {
  _id?: ID;
  title: string;
  bio: string[];
  philosophy: { title: string; description: string; icon?: string }[];
  mission: string;
  loveBuilding: { title: string; description: string; icon?: string }[];
  story: AboutStoryChapter[];
  stats: { label: string; value: number; suffix?: string; icon?: string }[];
  location: string;
  languages: string[];
  interests: string[];
  image?: MediaAsset;
}

/* ── Projects ─────────────────────────────────────────────── */
export interface ProjectMetric {
  label: string;
  value: string;
  description?: string;
  icon?: string;
}

export interface ProjectChallenge {
  challenge: string;
  solution: string;
  impact?: string;
}

export interface ProjectFeature {
  title: string;
  description: string;
  icon?: string;
}

export interface ArchitectureNode {
  layer: string;
  items: string[];
  description?: string;
}

export interface CodeSnippet {
  title: string;
  language: string;
  code: string;
  description?: string;
}

export interface Project extends Timestamped {
  _id?: ID;
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  description: string;
  category: "web-app" | "marketplace" | "saas" | "mobile" | "open-source" | "tooling";
  status: PublishStatus;
  featured: boolean;
  order: number;
  year: string;
  timeline: { start: string; end?: string | null; duration: string };
  role: string;
  team?: string;
  client?: string;
  thumbnail: MediaAsset;
  cover?: MediaAsset;
  gallery: MediaAsset[];
  video?: MediaAsset;
  techStack: string[];
  features: ProjectFeature[];
  architecture: ArchitectureNode[];
  challenges: ProjectChallenge[];
  metrics: ProjectMetric[];
  snippets?: CodeSnippet[];
  caseStudy?: string;
  links: {
    live?: string;
    github?: string;
    caseStudy?: string;
    playStore?: string;
    appStore?: string;
  };
  accent: string;
  views?: number;
}

/* ── Experience ───────────────────────────────────────────── */
export interface Experience extends Timestamped {
  _id?: ID;
  company: string;
  role: string;
  employmentType: "Full-time" | "Contract" | "Freelance" | "Internship";
  location: string;
  locationType: "On-site" | "Hybrid" | "Remote";
  start: string;
  end?: string | null;
  current: boolean;
  order: number;
  summary: string;
  highlights: string[];
  techStack: string[];
  logo?: MediaAsset;
  website?: string;
  status: PublishStatus;
}

/* ── Skills ───────────────────────────────────────────────── */
export type SkillCategory =
  | "Languages"
  | "Frontend"
  | "Frameworks"
  | "Backend"
  | "Database"
  | "State Management"
  | "Animation"
  | "Cloud"
  | "Deployment"
  | "Tools";

export interface Skill extends Timestamped {
  _id?: ID;
  name: string;
  category: SkillCategory;
  level: number;
  years: number;
  icon?: string;
  color?: string;
  featured: boolean;
  order: number;
  description?: string;
  status: PublishStatus;
}

/* ── Education ────────────────────────────────────────────── */
export interface Education extends Timestamped {
  _id?: ID;
  institution: string;
  degree: string;
  field: string;
  location: string;
  start: string;
  end?: string | null;
  grade?: string;
  description?: string;
  logo?: MediaAsset;
  order: number;
  status: PublishStatus;
}

/* ── Achievements / certificates ──────────────────────────── */
export interface Achievement extends Timestamped {
  _id?: ID;
  title: string;
  issuer: string;
  date: string;
  type: "certification" | "award" | "milestone" | "publication" | "talk";
  description: string;
  credentialUrl?: string;
  credentialId?: string;
  image?: MediaAsset;
  order: number;
  status: PublishStatus;
}

/* ── Testimonials ─────────────────────────────────────────── */
export interface Testimonial extends Timestamped {
  _id?: ID;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  avatar?: MediaAsset;
  linkedin?: string;
  featured: boolean;
  order: number;
  status: PublishStatus;
}

/* ── Blog ─────────────────────────────────────────────────── */
export interface BlogPost extends Timestamped {
  _id?: ID;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover?: MediaAsset;
  category: string;
  tags: string[];
  readingTime: number;
  publishedAt: string;
  featured: boolean;
  status: PublishStatus;
  views: number;
  seo?: Partial<SEOMeta>;
}

/* ── Social ───────────────────────────────────────────────── */
export interface SocialLink extends Timestamped {
  _id?: ID;
  platform: string;
  label: string;
  url: string;
  icon: string;
  handle?: string;
  order: number;
  showInHero: boolean;
  showInFooter: boolean;
  status: PublishStatus;
}

/* ── Resume ───────────────────────────────────────────────── */
export interface Resume extends Timestamped {
  _id?: ID;
  label: string;
  fileUrl: string;
  version: string;
  updatedOn: string;
  downloads: number;
  isActive: boolean;
}

/* ── SEO / Settings ───────────────────────────────────────── */
export interface SEOMeta {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  twitterHandle?: string;
  canonical?: string;
  noIndex?: boolean;
}

export interface SEOSettings extends Timestamped, SEOMeta {
  _id?: ID;
  siteName: string;
  titleTemplate: string;
  googleSiteVerification?: string;
  structuredData?: Record<string, unknown>;
}

export interface Settings extends Timestamped {
  _id?: ID;
  siteName: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  timezone: string;
  availableForWork: boolean;
  calendlyUrl?: string;
  mapEmbedUrl?: string;
  coordinates?: { lat: number; lng: number };
  maintenanceMode: boolean;
  features: {
    blog: boolean;
    testimonials: boolean;
    spotify: boolean;
    github: boolean;
    leetcode: boolean;
    analytics: boolean;
    cursor: boolean;
    loadingScreen: boolean;
  };
}

/* ── Messages ─────────────────────────────────────────────── */
export interface Message extends Timestamped {
  _id?: ID;
  name: string;
  email: string;
  subject: string;
  budget?: string;
  projectType?: string;
  message: string;
  read: boolean;
  starred: boolean;
  archived: boolean;
  replied: boolean;
  ip?: string;
  userAgent?: string;
  referrer?: string;
}

/* ── Analytics ────────────────────────────────────────────── */
export interface AnalyticsEvent extends Timestamped {
  _id?: ID;
  type: "pageview" | "click" | "download" | "contact" | "project_view";
  path: string;
  referrer?: string;
  country?: string;
  device: "desktop" | "tablet" | "mobile";
  browser?: string;
  sessionId: string;
  meta?: Record<string, unknown>;
}

export interface AnalyticsSummary {
  totalViews: number;
  uniqueVisitors: number;
  messages: number;
  resumeDownloads: number;
  viewsChange: number;
  topPages: { path: string; views: number }[];
  byDay: { date: string; views: number; visitors: number }[];
  byDevice: { device: string; count: number }[];
  byReferrer: { referrer: string; count: number }[];
  databaseConfigured?: boolean;
}

/* ── Auth ─────────────────────────────────────────────────── */
export interface AdminUser extends Timestamped {
  _id?: ID;
  name: string;
  email: string;
  password?: string;
  role: Role;
  avatar?: string;
  lastLogin?: string;
  active: boolean;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

/* ── Integrations ─────────────────────────────────────────── */
export interface GitHubStats {
  username: string;
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  publicRepos: number;
  totalStars: number;
  contributionsThisYear: number;
  contributions: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[];
  topRepos: {
    name: string;
    description: string;
    url: string;
    stars: number;
    forks: number;
    language: string;
    updatedAt: string;
  }[];
  languages: { name: string; percentage: number; color: string }[];
}

export interface LeetCodeStats {
  username: string;
  ranking: number;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalQuestions: number;
  acceptanceRate: number;
  streak: number;
}

export interface NowPlaying {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
  progress?: number;
  duration?: number;
}

/* ── API envelope ─────────────────────────────────────────── */
export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: { total?: number; page?: number; limit?: number; pages?: number };
}

export interface ApiFailure {
  success: false;
  error: string;
  issues?: Record<string, string[]>;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: PublishStatus | "all";
  sort?: string;
}
