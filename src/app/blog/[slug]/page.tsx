import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, Tag } from "lucide-react";
import { getBlogPost, getAllSlugs, blogPosts } from "@/data/blog";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  // Find related posts (same tags, exclude current)
  const related = blogPosts
    .filter(
      (p) =>
        p.slug !== slug &&
        p.tags.some((t) => post.tags.includes(t))
    )
    .slice(0, 2);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Back */}
      <Link
        href="/blog"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Всички статии
      </Link>

      {/* Header */}
      <header className="mb-8">
        <h1 className="mb-3 text-2xl font-bold text-text md:text-3xl">
          {post.title}
        </h1>

        <div className="mb-4 flex items-center gap-4 text-sm text-muted">
          <span className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {new Date(post.date).toLocaleDateString("bg-BG", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {post.readingTime} мин четене
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary"
            >
              <Tag className="h-2.5 w-2.5" />
              {tag}
            </span>
          ))}
        </div>
      </header>

      {/* Article JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.date,
            author: {
              "@type": "Organization",
              name: "Спести",
            },
            publisher: {
              "@type": "Organization",
              name: "Спести",
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `/blog/${slug}`,
            },
          }),
        }}
      />

      {/* Content */}
      <article
        className="blog-content max-w-none [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-text
          [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-text/85
          [&_a]:text-primary [&_a]:underline-offset-2 hover:[&_a]:underline
          [&_strong]:font-semibold [&_strong]:text-text
          [&_ul]:my-3 [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1
          [&_ol]:my-3 [&_ol]:ml-5 [&_ol]:list-decimal [&_ol]:space-y-1
          [&_li]:text-text/85 [&_li]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-12 border-t border-border pt-8">
          <h3 className="mb-4 text-lg font-bold text-text">Свързани статии</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/30"
              >
                <p className="text-xs text-muted">
                  {new Date(r.date).toLocaleDateString("bg-BG", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="mt-1 font-semibold text-text">{r.title}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
