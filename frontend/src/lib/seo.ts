import type { Metadata } from "next";
import { PERSON, SITE_CONFIG, SITE_URL } from "@/constants/site";
import type { BlogPost, Project, SEOSettings } from "@/types";
import { absoluteUrl, stripMarkdown, truncate } from "@/lib/utils";

interface BuildMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  noIndex?: boolean;
  seo?: SEOSettings;
}

/** Single entry point for page metadata — every route funnels through this. */
export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  tags,
  noIndex,
  seo,
}: BuildMetadataOptions = {}): Metadata {
  const siteName = seo?.siteName ?? SITE_CONFIG.shortName;
  const resolvedTitle = title ? `${title} · ${siteName}` : (seo?.title ?? SITE_CONFIG.name);
  const resolvedDescription = truncate(
    description ?? seo?.description ?? SITE_CONFIG.description,
    180,
  );
  const url = absoluteUrl(path);
  const ogImage = image ?? seo?.ogImage ?? `${SITE_URL}/api/og?title=${encodeURIComponent(title ?? PERSON.name)}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: resolvedTitle,
    description: resolvedDescription,
    keywords: [...(seo?.keywords ?? SITE_CONFIG.keywords), ...(tags ?? [])],
    authors: [{ name: PERSON.name, url: SITE_URL }],
    creator: PERSON.name,
    publisher: PERSON.name,
    alternates: { canonical: url, types: { "application/rss+xml": `${SITE_URL}/rss.xml` } },
    robots:
      noIndex || seo?.noIndex
        ? { index: false, follow: false }
        : {
            index: true,
            follow: true,
            googleBot: {
              index: true,
              follow: true,
              "max-video-preview": -1,
              "max-image-preview": "large",
              "max-snippet": -1,
            },
          },
    openGraph: {
      type: type === "profile" ? "profile" : type,
      locale: SITE_CONFIG.locale,
      url,
      siteName,
      title: resolvedTitle,
      description: resolvedDescription,
      images: [{ url: ogImage, width: 1200, height: 630, alt: resolvedTitle }],
      ...(type === "article" && { publishedTime, modifiedTime, authors: [PERSON.name], tags }),
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: [ogImage],
      ...(seo?.twitterHandle ? { creator: seo.twitterHandle } : {}),
    },
    verification: seo?.googleSiteVerification
      ? { google: seo.googleSiteVerification }
      : undefined,
    category: "technology",
  };
}

/* ────────────────────────────────────────────────────────────
   Structured data (schema.org)
   ──────────────────────────────────────────────────────────── */

export function personSchema(opts: { skills?: string[]; sameAs?: string[] } = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: PERSON.name,
    jobTitle: PERSON.title,
    description: SITE_CONFIG.description,
    url: SITE_URL,
    image: `${SITE_URL}/images/avatar.svg`,
    email: `mailto:${PERSON.email}`,
    telephone: PERSON.phoneRaw,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Noida",
      addressRegion: "Uttar Pradesh",
      addressCountry: "IN",
    },
    sameAs: opts.sameAs ?? [PERSON.github, PERSON.linkedin],
    knowsAbout: opts.skills ?? [
      "React.js",
      "Next.js",
      "TypeScript",
      "Node.js",
      "MongoDB",
      "Web Performance",
    ],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Dewan VS Institute of Engineering and Technology",
    },
    worksFor: {
      "@type": "Organization",
      name: "Ripenapps Technologies",
      url: "https://ripenapps.com",
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    publisher: { "@id": `${SITE_URL}/#person` },
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/blog?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function projectSchema(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.summary,
    applicationCategory: "WebApplication",
    operatingSystem: "Any",
    url: absoluteUrl(`/projects/${project.slug}`),
    image: absoluteUrl(project.thumbnail.url),
    author: { "@id": `${SITE_URL}/#person` },
    datePublished: project.timeline.start,
    keywords: project.techStack.join(", "),
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
}

export function articleSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.cover ? absoluteUrl(post.cover.url) : `${SITE_URL}/api/og`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(`/blog/${post.slug}`) },
    keywords: post.tags.join(", "),
    wordCount: stripMarkdown(post.content).split(/\s+/).length,
    articleSection: post.category,
    inLanguage: "en-US",
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
