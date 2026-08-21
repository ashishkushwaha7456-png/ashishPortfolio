import { PROJECT_CATEGORIES, SKILL_CATEGORIES } from "@/constants/site";

/**
 * Declarative form definitions.
 *
 * Every admin form is generated from these — one `<ResourceForm>` renders all
 * of them. Adding a field is a line here, not a new component, which is the
 * only way a CMS this wide stays maintainable.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "number"
  | "slider"
  | "select"
  | "switch"
  | "date"
  | "tags"
  | "image"
  | "list" // array of plain strings, one per row
  | "group"; // array of objects, each with its own subfields

/** Column width within the form's 12-column grid. */
export type FieldSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  help?: string;
  required?: boolean;
  options?: readonly { value: string; label: string }[];
  span?: FieldSpan;
  min?: number;
  max?: number;
  rows?: number;
  /** For `group` fields — the shape of each row. */
  fields?: FieldDef[];
  /** Dot path for nested values, e.g. `timeline.start`. Defaults to `name`. */
  path?: string;
  section?: string;
}

export interface ResourceFormDef {
  label: string;
  singular: string;
  description: string;
  singleton?: boolean;
  /** Columns shown in the list table. */
  columns: { key: string; label: string; type?: "text" | "badge" | "image" | "date" | "boolean" }[];
  /** Field used as the row title in the table. */
  titleKey: string;
  sections: { id: string; label: string; description?: string }[];
  fields: FieldDef[];
  defaults: Record<string, unknown>;
}

const statusField: FieldDef = {
  name: "status",
  label: "Status",
  type: "select",
  span: 4,
  options: [
    { value: "published", label: "Published" },
    { value: "draft", label: "Draft" },
    { value: "archived", label: "Archived" },
  ],
  section: "meta",
};

const orderField: FieldDef = {
  name: "order",
  label: "Sort order",
  type: "number",
  span: 4,
  help: "Lower numbers appear first.",
  section: "meta",
};

const mediaFields = (prefix: string, label: string, section = "media"): FieldDef[] => [
  { name: `${prefix}.url`, label: `${label} image`, type: "image", span: 12, section },
  { name: `${prefix}.alt`, label: `${label} alt text`, type: "text", span: 8, section },
];

export const ADMIN_FORMS: Record<string, ResourceFormDef> = {
  /* ── Hero ─────────────────────────────────────────────── */
  hero: {
    label: "Hero",
    singular: "hero section",
    description: "The first thing every visitor reads. Edits go live on the home page.",
    singleton: true,
    titleKey: "name",
    columns: [],
    sections: [
      { id: "content", label: "Content" },
      { id: "roles", label: "Typing animation", description: "Cycled beneath your name." },
      { id: "media", label: "Media" },
      { id: "cta", label: "Buttons & highlights" },
    ],
    fields: [
      { name: "eyebrow", label: "Eyebrow", type: "text", span: 12, required: true, section: "content", placeholder: "Available for senior frontend roles" },
      { name: "name", label: "Name", type: "text", span: 6, required: true, section: "content" },
      { name: "headline", label: "Headline", type: "text", span: 12, required: true, section: "content" },
      { name: "subheadline", label: "Sub-headline", type: "textarea", rows: 4, span: 12, required: true, section: "content" },
      { name: "availability.open", label: "Open to work", type: "switch", span: 4, section: "content" },
      { name: "availability.label", label: "Availability label", type: "text", span: 8, section: "content" },
      { name: "roles", label: "Rotating roles", type: "list", span: 12, section: "roles", help: "One per line — these cycle in the typing animation." },
      ...mediaFields("avatar", "Portrait"),
      { name: "resumeUrl", label: "Resume link", type: "text", span: 6, section: "media" },
      {
        name: "ctas",
        label: "Call-to-action buttons",
        type: "group",
        span: 12,
        section: "cta",
        fields: [
          { name: "label", label: "Label", type: "text", span: 6 },
          { name: "href", label: "Link", type: "text", span: 6 },
          { name: "icon", label: "Lucide icon", type: "text", span: 4, placeholder: "Download" },
          {
            name: "variant",
            label: "Style",
            type: "select",
            span: 4,
            options: [
              { value: "primary", label: "Primary" },
              { value: "secondary", label: "Secondary" },
              { value: "outline", label: "Outline" },
              { value: "ghost", label: "Ghost" },
            ],
          },
          { name: "external", label: "Opens in new tab", type: "switch", span: 4 },
        ],
      },
      {
        name: "highlights",
        label: "Stat highlights",
        type: "group",
        span: 12,
        section: "cta",
        fields: [
          { name: "value", label: "Value", type: "text", span: 3 },
          { name: "suffix", label: "Suffix", type: "text", span: 3 },
          { name: "label", label: "Label", type: "text", span: 6 },
        ],
      },
    ],
    defaults: {
      eyebrow: "",
      name: "",
      headline: "",
      subheadline: "",
      roles: [],
      availability: { open: true, label: "Open to work" },
      avatar: { url: "/images/avatar.svg", alt: "" },
      resumeUrl: "/resume",
      ctas: [],
      highlights: [],
    },
  },

  /* ── About ────────────────────────────────────────────── */
  about: {
    label: "About",
    singular: "about page",
    description: "Your story, philosophy and the stats shown across the site.",
    singleton: true,
    titleKey: "title",
    columns: [],
    sections: [
      { id: "content", label: "Story" },
      { id: "story", label: "Career timeline" },
      { id: "beliefs", label: "Philosophy & interests" },
      { id: "stats", label: "Statistics" },
      { id: "media", label: "Media" },
    ],
    fields: [
      { name: "title", label: "Headline", type: "text", span: 12, required: true, section: "content" },
      { name: "bio", label: "Bio paragraphs", type: "list", span: 12, section: "content", help: "One paragraph per row." },
      { name: "mission", label: "Mission statement", type: "textarea", rows: 3, span: 12, section: "content" },
      { name: "location", label: "Location", type: "text", span: 6, section: "content" },
      {
        name: "story",
        label: "Timeline chapters",
        type: "group",
        span: 12,
        section: "story",
        fields: [
          { name: "year", label: "Year", type: "text", span: 3 },
          { name: "title", label: "Title", type: "text", span: 6 },
          { name: "icon", label: "Icon", type: "text", span: 3 },
          { name: "description", label: "Description", type: "textarea", rows: 2, span: 12 },
        ],
      },
      {
        name: "philosophy",
        label: "Philosophy",
        type: "group",
        span: 12,
        section: "beliefs",
        fields: [
          { name: "title", label: "Title", type: "text", span: 8 },
          { name: "icon", label: "Icon", type: "text", span: 4 },
          { name: "description", label: "Description", type: "textarea", rows: 2, span: 12 },
        ],
      },
      {
        name: "loveBuilding",
        label: "What I love building",
        type: "group",
        span: 12,
        section: "beliefs",
        fields: [
          { name: "title", label: "Title", type: "text", span: 8 },
          { name: "icon", label: "Icon", type: "text", span: 4 },
          { name: "description", label: "Description", type: "textarea", rows: 2, span: 12 },
        ],
      },
      { name: "languages", label: "Languages", type: "tags", span: 6, section: "beliefs" },
      { name: "interests", label: "Interests", type: "tags", span: 6, section: "beliefs" },
      {
        name: "stats",
        label: "Statistics",
        type: "group",
        span: 12,
        section: "stats",
        fields: [
          { name: "value", label: "Value", type: "number", span: 3 },
          { name: "suffix", label: "Suffix", type: "text", span: 3 },
          { name: "label", label: "Label", type: "text", span: 3 },
          { name: "icon", label: "Icon", type: "text", span: 3 },
        ],
      },
      ...mediaFields("image", "Portrait"),
    ],
    defaults: {
      title: "",
      bio: [],
      philosophy: [],
      mission: "",
      loveBuilding: [],
      story: [],
      stats: [],
      location: "",
      languages: [],
      interests: [],
    },
  },

  /* ── Projects ─────────────────────────────────────────── */
  projects: {
    label: "Projects",
    singular: "project",
    description: "Case studies. Each one gets its own page at /projects/[slug].",
    titleKey: "title",
    columns: [
      { key: "thumbnail.url", label: "", type: "image" },
      { key: "title", label: "Title" },
      { key: "category", label: "Category", type: "badge" },
      { key: "year", label: "Year" },
      { key: "featured", label: "Featured", type: "boolean" },
      { key: "status", label: "Status", type: "badge" },
    ],
    sections: [
      { id: "content", label: "Overview" },
      { id: "media", label: "Media" },
      { id: "detail", label: "Features & architecture" },
      { id: "story", label: "Challenges & case study" },
      { id: "meta", label: "Links & metadata" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", span: 6, required: true, section: "content" },
      { name: "slug", label: "Slug", type: "text", span: 6, required: true, section: "content", help: "Used in the URL. Lowercase, hyphenated." },
      { name: "tagline", label: "Tagline", type: "text", span: 12, required: true, section: "content" },
      { name: "summary", label: "Summary", type: "textarea", rows: 3, span: 12, required: true, section: "content" },
      { name: "description", label: "Full description", type: "textarea", rows: 5, span: 12, required: true, section: "content" },
      { name: "category", label: "Category", type: "select", span: 4, section: "content", options: PROJECT_CATEGORIES },
      { name: "year", label: "Year", type: "text", span: 4, section: "content" },
      { name: "accent", label: "Accent colour", type: "text", span: 4, section: "content", placeholder: "#6366f1" },
      { name: "role", label: "Your role", type: "text", span: 6, section: "content" },
      { name: "team", label: "Team", type: "text", span: 6, section: "content" },
      { name: "timeline.start", label: "Start date", type: "date", span: 4, section: "content" },
      { name: "timeline.end", label: "End date", type: "date", span: 4, section: "content", help: "Leave empty if ongoing." },
      { name: "timeline.duration", label: "Duration label", type: "text", span: 4, section: "content" },

      ...mediaFields("thumbnail", "Thumbnail"),
      ...mediaFields("cover", "Cover"),
      {
        name: "gallery",
        label: "Gallery",
        type: "group",
        span: 12,
        section: "media",
        fields: [
          { name: "url", label: "Image", type: "image", span: 12 },
          { name: "alt", label: "Alt text", type: "text", span: 6 },
          { name: "caption", label: "Caption", type: "text", span: 6 },
        ],
      },

      { name: "techStack", label: "Tech stack", type: "tags", span: 12, required: true, section: "detail" },
      {
        name: "features",
        label: "Features",
        type: "group",
        span: 12,
        section: "detail",
        fields: [
          { name: "title", label: "Title", type: "text", span: 8 },
          { name: "icon", label: "Icon", type: "text", span: 4 },
          { name: "description", label: "Description", type: "textarea", rows: 2, span: 12 },
        ],
      },
      {
        name: "architecture",
        label: "Architecture layers",
        type: "group",
        span: 12,
        section: "detail",
        fields: [
          { name: "layer", label: "Layer", type: "text", span: 12 },
          { name: "items", label: "Technologies", type: "tags", span: 12 },
          { name: "description", label: "Description", type: "textarea", rows: 2, span: 12 },
        ],
      },
      {
        name: "metrics",
        label: "Metrics",
        type: "group",
        span: 12,
        section: "detail",
        fields: [
          { name: "value", label: "Value", type: "text", span: 3 },
          { name: "label", label: "Label", type: "text", span: 5 },
          { name: "icon", label: "Icon", type: "text", span: 4 },
          { name: "description", label: "Note", type: "text", span: 12 },
        ],
      },

      {
        name: "challenges",
        label: "Challenges & solutions",
        type: "group",
        span: 12,
        section: "story",
        fields: [
          { name: "challenge", label: "Challenge", type: "textarea", rows: 2, span: 12 },
          { name: "solution", label: "Solution", type: "textarea", rows: 2, span: 12 },
          { name: "impact", label: "Impact", type: "text", span: 12 },
        ],
      },
      {
        name: "snippets",
        label: "Code snippets",
        type: "group",
        span: 12,
        section: "story",
        fields: [
          { name: "title", label: "Title", type: "text", span: 8 },
          { name: "language", label: "Language", type: "text", span: 4 },
          { name: "description", label: "Description", type: "text", span: 12 },
          { name: "code", label: "Code", type: "textarea", rows: 10, span: 12 },
        ],
      },
      { name: "caseStudy", label: "Case study (markdown)", type: "markdown", span: 12, section: "story" },

      { name: "links.live", label: "Live URL", type: "text", span: 6, section: "meta" },
      { name: "links.github", label: "GitHub URL", type: "text", span: 6, section: "meta" },
      { name: "featured", label: "Featured", type: "switch", span: 4, section: "meta" },
      orderField,
      statusField,
    ],
    defaults: {
      title: "",
      slug: "",
      tagline: "",
      summary: "",
      description: "",
      category: "web-app",
      status: "draft",
      featured: false,
      order: 0,
      year: String(2026),
      timeline: { start: "", end: null, duration: "" },
      role: "",
      thumbnail: { url: "", alt: "" },
      gallery: [],
      techStack: [],
      features: [],
      architecture: [],
      challenges: [],
      metrics: [],
      snippets: [],
      links: {},
      accent: "#6366f1",
    },
  },

  /* ── Experience ───────────────────────────────────────── */
  experience: {
    label: "Experience",
    singular: "role",
    description: "Your professional history, shown on the home, about and experience pages.",
    titleKey: "role",
    columns: [
      { key: "role", label: "Role" },
      { key: "company", label: "Company" },
      { key: "start", label: "Started", type: "date" },
      { key: "current", label: "Current", type: "boolean" },
      { key: "status", label: "Status", type: "badge" },
    ],
    sections: [
      { id: "content", label: "Role" },
      { id: "detail", label: "Highlights & stack" },
      { id: "meta", label: "Metadata" },
    ],
    fields: [
      { name: "role", label: "Job title", type: "text", span: 6, required: true, section: "content" },
      { name: "company", label: "Company", type: "text", span: 6, required: true, section: "content" },
      {
        name: "employmentType",
        label: "Employment type",
        type: "select",
        span: 4,
        section: "content",
        options: [
          { value: "Full-time", label: "Full-time" },
          { value: "Contract", label: "Contract" },
          { value: "Freelance", label: "Freelance" },
          { value: "Internship", label: "Internship" },
        ],
      },
      {
        name: "locationType",
        label: "Work mode",
        type: "select",
        span: 4,
        section: "content",
        options: [
          { value: "On-site", label: "On-site" },
          { value: "Hybrid", label: "Hybrid" },
          { value: "Remote", label: "Remote" },
        ],
      },
      { name: "location", label: "Location", type: "text", span: 4, section: "content" },
      { name: "start", label: "Start date", type: "date", span: 4, required: true, section: "content" },
      { name: "end", label: "End date", type: "date", span: 4, section: "content", help: "Leave empty if this is your current role." },
      { name: "current", label: "Current role", type: "switch", span: 4, section: "content" },
      { name: "summary", label: "Summary", type: "textarea", rows: 3, span: 12, required: true, section: "content" },
      { name: "highlights", label: "Highlights", type: "list", span: 12, section: "detail", help: "One achievement per row." },
      { name: "techStack", label: "Tech stack", type: "tags", span: 12, section: "detail" },
      { name: "website", label: "Company website", type: "text", span: 8, section: "meta" },
      orderField,
      statusField,
    ],
    defaults: {
      role: "",
      company: "",
      employmentType: "Full-time",
      locationType: "On-site",
      location: "",
      start: "",
      end: null,
      current: false,
      summary: "",
      highlights: [],
      techStack: [],
      order: 0,
      status: "published",
    },
  },

  /* ── Skills ───────────────────────────────────────────── */
  skills: {
    label: "Skills",
    singular: "skill",
    description: "Grouped by category and shown with proficiency bars.",
    titleKey: "name",
    columns: [
      { key: "name", label: "Skill" },
      { key: "category", label: "Category", type: "badge" },
      { key: "level", label: "Level" },
      { key: "years", label: "Years" },
      { key: "featured", label: "Featured", type: "boolean" },
      { key: "status", label: "Status", type: "badge" },
    ],
    sections: [{ id: "content", label: "Skill" }, { id: "meta", label: "Metadata" }],
    fields: [
      { name: "name", label: "Name", type: "text", span: 6, required: true, section: "content" },
      {
        name: "category",
        label: "Category",
        type: "select",
        span: 6,
        required: true,
        section: "content",
        options: SKILL_CATEGORIES.map((c) => ({ value: c, label: c })),
      },
      { name: "level", label: "Proficiency", type: "slider", span: 6, min: 0, max: 100, section: "content" },
      { name: "years", label: "Years of use", type: "number", span: 6, min: 0, max: 50, section: "content" },
      { name: "description", label: "Description", type: "textarea", rows: 2, span: 12, section: "content" },
      { name: "icon", label: "Lucide icon", type: "text", span: 4, section: "meta", placeholder: "Atom" },
      { name: "color", label: "Brand colour", type: "text", span: 4, section: "meta", placeholder: "#61dafb" },
      { name: "featured", label: "Featured", type: "switch", span: 4, section: "meta" },
      orderField,
      statusField,
    ],
    defaults: {
      name: "",
      category: "Frontend",
      level: 75,
      years: 1,
      featured: false,
      order: 0,
      status: "published",
    },
  },

  /* ── Education ────────────────────────────────────────── */
  education: {
    label: "Education",
    singular: "qualification",
    description: "Degrees and formal qualifications.",
    titleKey: "degree",
    columns: [
      { key: "degree", label: "Degree" },
      { key: "institution", label: "Institution" },
      { key: "end", label: "Completed", type: "date" },
      { key: "status", label: "Status", type: "badge" },
    ],
    sections: [{ id: "content", label: "Qualification" }, { id: "meta", label: "Metadata" }],
    fields: [
      { name: "degree", label: "Degree", type: "text", span: 6, required: true, section: "content" },
      { name: "field", label: "Field of study", type: "text", span: 6, section: "content" },
      { name: "institution", label: "Institution", type: "text", span: 8, required: true, section: "content" },
      { name: "location", label: "Location", type: "text", span: 4, section: "content" },
      { name: "start", label: "Start date", type: "date", span: 4, section: "content" },
      { name: "end", label: "End date", type: "date", span: 4, section: "content" },
      { name: "grade", label: "Grade", type: "text", span: 4, section: "content" },
      { name: "description", label: "Description", type: "textarea", rows: 3, span: 12, section: "content" },
      orderField,
      statusField,
    ],
    defaults: {
      degree: "",
      field: "",
      institution: "",
      location: "",
      start: "",
      end: null,
      order: 0,
      status: "published",
    },
  },

  /* ── Achievements ─────────────────────────────────────── */
  achievements: {
    label: "Achievements",
    singular: "achievement",
    description: "Milestones, certifications and awards.",
    titleKey: "title",
    columns: [
      { key: "title", label: "Title" },
      { key: "issuer", label: "Issuer" },
      { key: "type", label: "Type", type: "badge" },
      { key: "date", label: "Date", type: "date" },
      { key: "status", label: "Status", type: "badge" },
    ],
    sections: [{ id: "content", label: "Achievement" }, { id: "meta", label: "Metadata" }],
    fields: [
      { name: "title", label: "Title", type: "text", span: 8, required: true, section: "content" },
      {
        name: "type",
        label: "Type",
        type: "select",
        span: 4,
        section: "content",
        options: [
          { value: "milestone", label: "Milestone" },
          { value: "certification", label: "Certification" },
          { value: "award", label: "Award" },
          { value: "publication", label: "Publication" },
          { value: "talk", label: "Talk" },
        ],
      },
      { name: "issuer", label: "Issuer", type: "text", span: 8, required: true, section: "content" },
      { name: "date", label: "Date", type: "date", span: 4, required: true, section: "content" },
      { name: "description", label: "Description", type: "textarea", rows: 3, span: 12, required: true, section: "content" },
      { name: "credentialUrl", label: "Credential URL", type: "text", span: 8, section: "meta" },
      { name: "credentialId", label: "Credential ID", type: "text", span: 4, section: "meta" },
      orderField,
      statusField,
    ],
    defaults: { title: "", issuer: "", date: "", type: "milestone", description: "", order: 0, status: "published" },
  },

  /* ── Testimonials ─────────────────────────────────────── */
  testimonials: {
    label: "Testimonials",
    singular: "testimonial",
    description: "Quotes from colleagues, managers and clients.",
    titleKey: "name",
    columns: [
      { key: "name", label: "Name" },
      { key: "company", label: "Company" },
      { key: "rating", label: "Rating" },
      { key: "featured", label: "Featured", type: "boolean" },
      { key: "status", label: "Status", type: "badge" },
    ],
    sections: [{ id: "content", label: "Testimonial" }, { id: "media", label: "Avatar" }, { id: "meta", label: "Metadata" }],
    fields: [
      { name: "name", label: "Name", type: "text", span: 6, required: true, section: "content" },
      { name: "role", label: "Role", type: "text", span: 6, required: true, section: "content" },
      { name: "company", label: "Company", type: "text", span: 8, required: true, section: "content" },
      { name: "rating", label: "Rating", type: "slider", span: 4, min: 1, max: 5, section: "content" },
      { name: "quote", label: "Quote", type: "textarea", rows: 5, span: 12, required: true, section: "content" },
      ...mediaFields("avatar", "Avatar"),
      { name: "linkedin", label: "LinkedIn URL", type: "text", span: 8, section: "meta" },
      { name: "featured", label: "Featured", type: "switch", span: 4, section: "meta" },
      orderField,
      statusField,
    ],
    defaults: { name: "", role: "", company: "", quote: "", rating: 5, featured: false, order: 0, status: "published" },
  },

  /* ── Blog ─────────────────────────────────────────────── */
  blog: {
    label: "Blog",
    singular: "post",
    description: "Markdown articles with syntax highlighting, published at /blog/[slug].",
    titleKey: "title",
    columns: [
      { key: "cover.url", label: "", type: "image" },
      { key: "title", label: "Title" },
      { key: "category", label: "Category", type: "badge" },
      { key: "publishedAt", label: "Published", type: "date" },
      { key: "featured", label: "Featured", type: "boolean" },
      { key: "status", label: "Status", type: "badge" },
    ],
    sections: [
      { id: "content", label: "Article" },
      { id: "media", label: "Cover image" },
      { id: "meta", label: "Metadata" },
      { id: "seo", label: "SEO overrides" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", span: 8, required: true, section: "content" },
      { name: "slug", label: "Slug", type: "text", span: 4, required: true, section: "content" },
      { name: "excerpt", label: "Excerpt", type: "textarea", rows: 3, span: 12, required: true, section: "content", help: "Shown on cards and used as the meta description." },
      { name: "content", label: "Content", type: "markdown", span: 12, required: true, section: "content" },
      ...mediaFields("cover", "Cover"),
      { name: "category", label: "Category", type: "text", span: 4, required: true, section: "meta" },
      { name: "publishedAt", label: "Publish date", type: "date", span: 4, required: true, section: "meta" },
      { name: "featured", label: "Featured", type: "switch", span: 4, section: "meta" },
      { name: "tags", label: "Tags", type: "tags", span: 12, section: "meta" },
      statusField,
      { name: "seo.title", label: "SEO title", type: "text", span: 12, section: "seo" },
      { name: "seo.description", label: "SEO description", type: "textarea", rows: 2, span: 12, section: "seo" },
      { name: "seo.noIndex", label: "Hide from search engines", type: "switch", span: 6, section: "seo" },
    ],
    defaults: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "Engineering",
      tags: [],
      publishedAt: "",
      featured: false,
      status: "draft",
    },
  },

  /* ── Social ───────────────────────────────────────────── */
  social: {
    label: "Social links",
    singular: "link",
    description: "Shown in the hero, the footer and the contact page.",
    titleKey: "label",
    columns: [
      { key: "label", label: "Label" },
      { key: "platform", label: "Platform" },
      { key: "handle", label: "Handle" },
      { key: "status", label: "Status", type: "badge" },
    ],
    sections: [{ id: "content", label: "Link" }, { id: "meta", label: "Visibility" }],
    fields: [
      { name: "label", label: "Label", type: "text", span: 6, required: true, section: "content" },
      { name: "platform", label: "Platform key", type: "text", span: 6, required: true, section: "content", placeholder: "github" },
      { name: "url", label: "URL", type: "text", span: 8, required: true, section: "content" },
      { name: "icon", label: "Lucide icon", type: "text", span: 4, required: true, section: "content", placeholder: "Github" },
      { name: "handle", label: "Handle", type: "text", span: 6, section: "content" },
      { name: "showInHero", label: "Show in hero", type: "switch", span: 3, section: "meta" },
      { name: "showInFooter", label: "Show in footer", type: "switch", span: 3, section: "meta" },
      orderField,
      statusField,
    ],
    defaults: { label: "", platform: "", url: "", icon: "Link", showInHero: true, showInFooter: true, order: 0, status: "published" },
  },

  /* ── Resume ───────────────────────────────────────────── */
  resume: {
    label: "Resume",
    singular: "resume file",
    description: "The downloadable PDF. Only the active version is offered.",
    titleKey: "label",
    columns: [
      { key: "label", label: "Label" },
      { key: "version", label: "Version" },
      { key: "updatedOn", label: "Updated", type: "date" },
      { key: "isActive", label: "Active", type: "boolean" },
    ],
    sections: [{ id: "content", label: "File" }],
    fields: [
      { name: "label", label: "Label", type: "text", span: 8, required: true, section: "content" },
      { name: "version", label: "Version", type: "text", span: 4, required: true, section: "content" },
      { name: "fileUrl", label: "File URL", type: "image", span: 12, required: true, section: "content", help: "Upload a PDF, or point at a file in /public." },
      { name: "updatedOn", label: "Updated on", type: "date", span: 6, section: "content" },
      { name: "isActive", label: "Active version", type: "switch", span: 6, section: "content" },
    ],
    defaults: { label: "", fileUrl: "", version: "1.0", updatedOn: "", isActive: true },
  },

  /* ── SEO ──────────────────────────────────────────────── */
  seo: {
    label: "SEO",
    singular: "SEO settings",
    description: "Defaults for titles, descriptions and social share cards.",
    singleton: true,
    titleKey: "title",
    columns: [],
    sections: [{ id: "content", label: "Metadata" }, { id: "meta", label: "Verification" }],
    fields: [
      { name: "siteName", label: "Site name", type: "text", span: 6, required: true, section: "content" },
      { name: "titleTemplate", label: "Title template", type: "text", span: 6, section: "content", help: "%s is replaced by the page title." },
      { name: "title", label: "Default title", type: "text", span: 12, required: true, section: "content", help: "Keep under 70 characters." },
      { name: "description", label: "Default description", type: "textarea", rows: 3, span: 12, required: true, section: "content", help: "50–180 characters." },
      { name: "keywords", label: "Keywords", type: "tags", span: 12, section: "content" },
      { name: "ogImage", label: "Default OG image", type: "image", span: 12, section: "content" },
      { name: "twitterHandle", label: "Twitter handle", type: "text", span: 6, section: "meta" },
      { name: "canonical", label: "Canonical base URL", type: "text", span: 6, section: "meta" },
      { name: "googleSiteVerification", label: "Google verification token", type: "text", span: 8, section: "meta" },
      { name: "noIndex", label: "Block all indexing", type: "switch", span: 4, section: "meta", help: "Turn on only while the site is private." },
    ],
    defaults: { siteName: "", titleTemplate: "%s", title: "", description: "", keywords: [], ogImage: "", noIndex: false },
  },

  /* ── Settings ─────────────────────────────────────────── */
  settings: {
    label: "Settings",
    singular: "site settings",
    description: "Contact details, availability and feature toggles.",
    singleton: true,
    titleKey: "siteName",
    columns: [],
    sections: [
      { id: "content", label: "Site & contact" },
      { id: "location", label: "Location" },
      { id: "features", label: "Feature flags" },
    ],
    fields: [
      { name: "siteName", label: "Site name", type: "text", span: 6, required: true, section: "content" },
      { name: "tagline", label: "Tagline", type: "text", span: 6, section: "content" },
      { name: "email", label: "Email", type: "text", span: 6, required: true, section: "content" },
      { name: "phone", label: "Phone", type: "text", span: 6, section: "content" },
      { name: "availableForWork", label: "Available for work", type: "switch", span: 6, section: "content" },
      { name: "maintenanceMode", label: "Maintenance mode", type: "switch", span: 6, section: "content" },
      { name: "calendlyUrl", label: "Calendly URL", type: "text", span: 12, section: "content" },
      { name: "location", label: "Location", type: "text", span: 6, section: "location" },
      { name: "timezone", label: "Timezone", type: "text", span: 6, section: "location" },
      { name: "coordinates.lat", label: "Latitude", type: "number", span: 6, section: "location" },
      { name: "coordinates.lng", label: "Longitude", type: "number", span: 6, section: "location" },
      { name: "features.blog", label: "Blog", type: "switch", span: 3, section: "features" },
      { name: "features.testimonials", label: "Testimonials", type: "switch", span: 3, section: "features" },
      // { name: "features.github", label: "GitHub stats", type: "switch", span: 3, section: "features" },
      { name: "features.analytics", label: "Analytics", type: "switch", span: 3, section: "features" },
      { name: "features.cursor", label: "Custom cursor", type: "switch", span: 3, section: "features" },
      { name: "features.loadingScreen", label: "Intro screen", type: "switch", span: 3, section: "features" },
      { name: "features.spotify", label: "Spotify", type: "switch", span: 3, section: "features" },
      { name: "features.leetcode", label: "LeetCode", type: "switch", span: 3, section: "features" },
    ],
    defaults: {
      siteName: "",
      tagline: "",
      email: "",
      phone: "",
      location: "",
      timezone: "Asia/Kolkata",
      availableForWork: true,
      maintenanceMode: false,
      features: {
        blog: true,
        testimonials: true,
        spotify: false,
        github: true,
        leetcode: false,
        analytics: true,
        cursor: true,
        loadingScreen: true,
      },
    },
  },
};

export function getFormDef(resource: string): ResourceFormDef | null {
  return ADMIN_FORMS[resource] ?? null;
}
