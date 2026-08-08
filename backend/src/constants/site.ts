import type { SEOSettings, Settings } from "@/types";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export const PERSON = {
  name: "Ashish Kumar",
  firstName: "Ashish",
  title: "MERN Stack Developer",
  subtitle: "React.js · Node.js · TypeScript",
  email: "ashishkushwaha6283@gmail.com",
  phone: "+91 8954996918",
  phoneRaw: "+918954996918",
  location: "Noida, Uttar Pradesh, India",
  shortLocation: "Noida, India",
  timezone: "Asia/Kolkata",
  github: "https://github.com/ashishkushwaha",
  githubUsername: "ashishkushwaha",
  linkedin: "https://www.linkedin.com/in/ashish-kumar-dev",
  twitter: "https://x.com/ashishkushwaha",
  twitterHandle: "@ashishkushwaha",
  experienceStart: "2023-03-01",
} as const;

export const SITE_CONFIG = {
  name: `${PERSON.name} — ${PERSON.title}`,
  shortName: PERSON.name,
  url: SITE_URL,
  ogImage: `${SITE_URL}/api/og`,
  description:
    "Ashish Kumar — MERN Stack Developer with 3+ years building scalable, secure, high-performance web applications with React.js, Next.js, TypeScript, Node.js and MongoDB. Payments, real-time systems, AI chat and DRM video streaming.",
  keywords: [
    "Ashish Kumar",
    "MERN Stack Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript Engineer",
    "Node.js Developer",
    "Full Stack Developer India",
    "Frontend Engineer Noida",
    "MongoDB",
    "Redux Toolkit",
    "React Query",
    "Stripe integration",
    "Socket.IO",
    "Portfolio",
  ],
  locale: "en_US",
  themeColor: { light: "#ffffff", dark: "#0b0b0f" },
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/", shortcut: "h" },
  { label: "About", href: "/about", shortcut: "a" },
  { label: "Experience", href: "/experience", shortcut: "e" },
  { label: "Projects", href: "/projects", shortcut: "p" },
  { label: "Skills", href: "/skills", shortcut: "s" },
  { label: "Blog", href: "/blog", shortcut: "b" },
  { label: "Contact", href: "/contact", shortcut: "c" },
] as const;

export const SECONDARY_NAV_LINKS = [
  { label: "Achievements", href: "/achievements" },
  { label: "Resume", href: "/resume" },
] as const;

export const FOOTER_LINKS = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Experience", href: "/experience" },
      { label: "Projects", href: "/projects" },
    ],
  },
  {
    title: "More",
    links: [
      { label: "Skills", href: "/skills" },
      { label: "Achievements", href: "/achievements" },
      { label: "Resume", href: "/resume" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "GitHub", href: PERSON.github, external: true },
      { label: "LinkedIn", href: PERSON.linkedin, external: true },
      { label: "Email", href: `mailto:${PERSON.email}`, external: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "RSS", href: "/rss.xml", external: true },
      { label: "Sitemap", href: "/sitemap.xml", external: true },
    ],
  },
] as const;

export const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" },
  { label: "Hero", href: "/admin/hero", icon: "Sparkles" },
  { label: "About", href: "/admin/about", icon: "User" },
  { label: "Projects", href: "/admin/projects", icon: "FolderKanban" },
  { label: "Experience", href: "/admin/experience", icon: "Briefcase" },
  { label: "Skills", href: "/admin/skills", icon: "Layers" },
  { label: "Education", href: "/admin/education", icon: "GraduationCap" },
  { label: "Achievements", href: "/admin/achievements", icon: "Trophy" },
  { label: "Testimonials", href: "/admin/testimonials", icon: "Quote" },
  { label: "Blog", href: "/admin/blog", icon: "PenLine" },
  { label: "Messages", href: "/admin/messages", icon: "Mail" },
  { label: "Media", href: "/admin/media", icon: "Image" },
  { label: "Resume", href: "/admin/resume", icon: "FileText" },
  { label: "Social Links", href: "/admin/social", icon: "Link2" },
  { label: "SEO", href: "/admin/seo", icon: "Search" },
  { label: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
] as const;

export const DEFAULT_SETTINGS: Settings = {
  siteName: SITE_CONFIG.shortName,
  tagline: `${PERSON.title} · ${PERSON.subtitle}`,
  email: PERSON.email,
  phone: PERSON.phone,
  location: PERSON.location,
  timezone: PERSON.timezone,
  availableForWork: true,
  calendlyUrl: "",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.0!2d77.3910!3d28.5355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sNoida!5e0!3m2!1sen!2sin!4v1700000000000",
  coordinates: { lat: 28.5355, lng: 77.391 },
  maintenanceMode: false,
  features: {
    blog: true,
    testimonials: true,
    spotify: true,
    github: true,
    leetcode: true,
    analytics: true,
    cursor: true,
    loadingScreen: true,
  },
};

export const DEFAULT_SEO: SEOSettings = {
  siteName: SITE_CONFIG.shortName,
  titleTemplate: `%s · ${PERSON.name}`,
  title: `${PERSON.name} — ${PERSON.title}`,
  description: SITE_CONFIG.description,
  keywords: [...SITE_CONFIG.keywords],
  ogImage: SITE_CONFIG.ogImage,
  twitterHandle: PERSON.twitterHandle,
  noIndex: false,
};

/** Section ids used by the scroll-spy on the landing page. */
export const HOME_SECTIONS = [
  { id: "hero", label: "Intro" },
  { id: "marquee", label: "Stack" },
  { id: "about", label: "About" },
  { id: "projects", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "stats", label: "Stats" },
  { id: "testimonials", label: "Praise" },
  { id: "blog", label: "Writing" },
  { id: "contact", label: "Contact" },
] as const;

export const PROJECT_CATEGORIES = [
  { value: "web-app", label: "Web App" },
  { value: "marketplace", label: "Marketplace" },
  { value: "saas", label: "SaaS" },
  { value: "mobile", label: "Mobile" },
  { value: "open-source", label: "Open Source" },
  { value: "tooling", label: "Tooling" },
] as const;

export const SKILL_CATEGORIES = [
  "Languages",
  "Frontend",
  "Frameworks",
  "Backend",
  "Database",
  "State Management",
  "Animation",
  "Cloud",
  "Deployment",
  "Tools",
] as const;

export const BLOG_CATEGORIES = [
  "Engineering",
  "React",
  "Performance",
  "Architecture",
  "Career",
  "TypeScript",
] as const;

export const COOKIE_NAME = "portfolio_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
export const ANALYTICS_COOKIE = "portfolio_sid";
