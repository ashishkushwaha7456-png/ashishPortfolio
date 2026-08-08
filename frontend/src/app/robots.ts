import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constants/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Private surfaces and anything that would waste crawl budget.
        disallow: ["/admin", "/admin/", "/api/", "/_next/"],
      },
      {
        // Give the majors an explicit, unambiguous rule.
        userAgent: ["Googlebot", "Bingbot", "DuckDuckBot"],
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
