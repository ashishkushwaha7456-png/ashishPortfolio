import type { MetadataRoute } from "next";
import { PERSON, RESUME_FILE, SITE_CONFIG } from "@/constants/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${PERSON.name} — ${PERSON.title}`,
    short_name: PERSON.name,
    description: SITE_CONFIG.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: SITE_CONFIG.themeColor.dark,
    theme_color: SITE_CONFIG.themeColor.dark,
    categories: ["portfolio", "technology", "developer"],
    lang: "en",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/images/avatar.svg", sizes: "512x512", type: "image/svg+xml", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Projects", url: "/projects", description: "Case studies" },
      { name: "Resume", url: RESUME_FILE, description: "Download the resume" },
      { name: "Contact", url: "/contact", description: "Get in touch" },
    ],
  };
}
