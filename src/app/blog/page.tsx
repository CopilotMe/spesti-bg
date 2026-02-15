import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Clock, Tag } from "lucide-react";
import { blogPosts } from "@/data/blog";

export const metadata: Metadata = {
  title: "Блог – Съвети за спестяване от комунални сметки",
  description:
    "Практични съвети как да намалиш сметките за ток, вода, газ и интернет. Сравнения на доставчици, анализи на тарифи и новини.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          Блог за спестяване
        </h1>
        <p className="mt-2 text-muted">
          Практични съвети, сравнения и анализи за по-ниски комунални сметки.
        </p>
      </div>

      <div className="space-y-6">
        {blogPosts.map((post) => (
          <article
            key={post.slug}
            className="group rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-primary/30"
          >
            <Link href={`/blog/${post.slug}`} className="block">
              <div className="mb-2 flex items-center gap-3 text-xs text-muted">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {new Date(post.date).toLocaleDateString("bg-BG", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readingTime} мин четене
                </span>
              </div>

              <h2 className="mb-2 text-lg font-bold text-text group-hover:text-primary transition-colors">
                {post.title}
              </h2>

              <p className="mb-3 text-sm text-muted">{post.description}</p>

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                  >
                    <Tag className="h-2.5 w-2.5" />
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
