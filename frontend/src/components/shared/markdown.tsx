import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Server-rendered markdown. Runs entirely at build/request time — no parser,
 * no highlighter and no markdown AST ships to the browser.
 */
export function Markdown({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div className={cn("prose-portfolio", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, [rehypeHighlight, { detect: true, ignoreMissing: true }]]}
        components={{
          a({ href, children, ...props }) {
            const external = href?.startsWith("http");
            if (external) {
              return (
                <a href={href} target="_blank" rel="noreferrer noopener" {...props}>
                  {children}
                </a>
              );
            }
            return (
              <Link href={href ?? "#"} {...props}>
                {children}
              </Link>
            );
          },
          // Images inside markdown are content, not layout — plain <img> keeps
          // them simple and avoids next/image's required dimensions.
          img({ src, alt }) {
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={typeof src === "string" ? src : ""} alt={alt ?? ""} loading="lazy" />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

/** Builds a table of contents from `##` / `###` headings. */
export function extractHeadings(markdown: string) {
  const headings: { id: string; text: string; level: 2 | 3 }[] = [];
  const lines = markdown.split("\n");
  let inCodeFence = false;

  for (const line of lines) {
    if (line.trimStart().startsWith("```")) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;

    const match = /^(#{2,3})\s+(.*)$/.exec(line);
    if (!match) continue;

    const text = match[2].replace(/[*_`]/g, "").trim();
    // Matches rehype-slug's github-slugger output for the cases we produce.
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    headings.push({ id, text, level: match[1].length === 2 ? 2 : 3 });
  }

  return headings;
}
