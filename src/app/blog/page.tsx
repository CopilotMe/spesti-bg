import { Metadata } from "next";
import { blogPosts } from "@/data/blog";
import { BlogList } from "@/components/blog/BlogList";

export const metadata: Metadata = {
  title: "Блог – Съвети за спестяване от комунални сметки",
  description:
    "Практични съвети как да намалиш сметките за ток, вода, газ и интернет. Сравнения на доставчици, анализи на тарифи и новини.",
  alternates: { canonical: "/blog" },
};

// Sort once at build time — newest first
const sortedPosts = [...blogPosts].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

// Extract all unique tags
const allTags = Array.from(new Set(sortedPosts.flatMap((p) => p.tags)));

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

      <BlogList posts={sortedPosts} allTags={allTags} />
    </div>
  );
}
