import { getPosts } from "@/services/content.service";
import { PERSON, SITE_CONFIG, SITE_URL } from "@/constants/site";
import { stripMarkdown, truncate } from "@/lib/utils";

export const dynamic = "force-dynamic";

function escapeXml(value: string) {
  return value.replace(
    /[<>&'"]/g,
    (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!,
  );
}

/** GET /rss.xml — full-text-ish feed of published posts. */
export async function GET() {
  const posts = await getPosts();
  const updated = posts[0]?.publishedAt ?? new Date().toISOString();

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
      <content:encoded><![CDATA[${truncate(stripMarkdown(post.content), 1400)}]]></content:encoded>
      <category>${escapeXml(post.category)}</category>
      ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ")}
      <dc:creator>${escapeXml(PERSON.name)}</dc:creator>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${PERSON.name} — Blog`)}</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeXml(SITE_CONFIG.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(updated).toUTCString()}</lastBuildDate>
    <managingEditor>${PERSON.email} (${escapeXml(PERSON.name)})</managingEditor>
    <webMaster>${PERSON.email} (${escapeXml(PERSON.name)})</webMaster>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/images/og-fallback.svg</url>
      <title>${escapeXml(PERSON.name)}</title>
      <link>${SITE_URL}</link>
    </image>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
