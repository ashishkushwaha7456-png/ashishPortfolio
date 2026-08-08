import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { Section, SectionHeading } from "@/components/shared/section";
import { Markdown, extractHeadings } from "@/components/shared/markdown";
import { BlogCard } from "@/components/shared/blog-card";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { ShareBar } from "@/components/blog/share-bar";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { getPostBySlug, getPosts, getRelatedPosts } from "@/services/content.service";
import { articleSchema, breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { absoluteUrl, formatDateLong, initials } from "@/lib/utils";
import { PERSON } from "@/constants/site";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return buildMetadata({ title: "Post not found", noIndex: true });

  return buildMetadata({
    title: post.seo?.title ?? post.title,
    description: post.seo?.description ?? post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.seo?.ogImage ?? post.cover?.url,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    tags: post.tags,
    noIndex: post.seo?.noIndex,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(slug, 3);
  const headings = extractHeadings(post.content);
  const url = absoluteUrl(`/blog/${post.slug}`);

  return (
    <>
      <JsonLd
        data={[
          articleSchema(post),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

      {/* Header */}
      <header className="relative overflow-hidden border-b border-border pb-14 pt-36 md:pt-44">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-aurora opacity-50" />
          <div className="absolute inset-0 bg-grid mask-fade-b opacity-50" />
        </div>

        <div className="container-page relative max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            All articles
          </Link>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Badge variant="gradient" size="lg">
              {post.category}
            </Badge>
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="size-3.5" />
              {formatDateLong(post.publishedAt)}
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="size-3.5" />
              {post.readingTime} min read
            </span>
          </div>

          <h1 className="mt-5 font-display text-[clamp(2rem,5.5vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.035em]">
            {post.title}
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
            <div className="flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarImage src="/images/avatar.svg" alt={PERSON.name} />
                <AvatarFallback>{initials(PERSON.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{PERSON.name}</p>
                <p className="text-xs text-muted-foreground">{PERSON.title}</p>
              </div>
            </div>

            <ShareBar title={post.title} url={url} />
          </div>
        </div>
      </header>

      {/* Cover */}
      {post.cover && (
        <div className="container-page -mt-2 pt-10">
          <Reveal className="relative mx-auto aspect-[16/9] max-w-4xl overflow-hidden rounded-2xl border border-border">
            <Image
              src={post.cover.url}
              alt={post.cover.alt ?? post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      )}

      {/* Body */}
      <Section spacious={false} className="py-14">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_15rem]">
          <article className="mx-auto w-full min-w-0 max-w-3xl lg:mx-0">
            <Markdown content={post.content} />

            {/* Tags */}
            <div className="mt-14 flex flex-wrap items-center gap-2 border-t border-border pt-8">
              <Tag className="size-4 text-muted-foreground" />
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Author card */}
            <aside className="mt-10 flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center">
              <Avatar className="size-16 shrink-0">
                <AvatarImage src="/images/avatar.svg" alt={PERSON.name} />
                <AvatarFallback>{initials(PERSON.name)}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <p className="font-display text-lg font-semibold tracking-tight">
                  {PERSON.name}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  MERN stack developer in {PERSON.shortLocation}, writing about React
                  performance, frontend architecture and the systems behind them.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href="/about">About me</Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <Link href="/contact">Get in touch</Link>
                  </Button>
                </div>
              </div>
            </aside>
          </article>

          {/* TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <TableOfContents headings={headings} />
            </div>
          </aside>
        </div>
      </Section>

      {/* Related */}
      {related.length > 0 && (
        <Section className="border-t border-border">
          <SectionHeading
            eyebrow="Keep reading"
            title="Related articles"
            action={{ label: "All articles", href: "/blog" }}
          />
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((item, index) => (
              <BlogCard key={item.slug} post={item} index={index} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
