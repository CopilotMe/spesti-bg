"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Tag,
  BookOpen,
  Clock,
  SlidersHorizontal,
  ArrowUpDown,
  X,
} from "lucide-react";
import type { BlogPost } from "@/data/blog";

/* ── category chips mapped to site sections ── */
const CATEGORIES: { label: string; tags: string[]; href: string }[] = [
  { label: "Ток", tags: ["ток"], href: "/elektrichestvo" },
  { label: "Вода", tags: ["вода", "ВиК"], href: "/voda" },
  { label: "Горива", tags: ["горива", "бензин", "дизел"], href: "/goriva" },
  { label: "Бюджет", tags: ["бюджет", "домакинство"], href: "/budget" },
  { label: "Икономика", tags: ["БВП", "икономика", "кошница", "инфлация"], href: "/bvp" },
  { label: "Спестяване", tags: ["спестяване", "съвети"], href: "#" },
];

type SortMode = "newest" | "oldest" | "readTime";

interface BlogListProps {
  posts: BlogPost[];
  allTags: string[];
}

export function BlogList({ posts, allTags }: BlogListProps) {
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortMode>("newest");
  const [showFilters, setShowFilters] = useState(false);

  /* derive filtered + sorted posts */
  const filtered = useMemo(() => {
    let result = [...posts];

    // text search
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // tag filter
    if (selectedTags.length > 0) {
      result = result.filter((p) =>
        selectedTags.every((t) => p.tags.includes(t))
      );
    }

    // category filter (matches any tag in category)
    if (selectedCategory) {
      const cat = CATEGORIES.find((c) => c.label === selectedCategory);
      if (cat) {
        result = result.filter((p) =>
          cat.tags.some((ct) => p.tags.includes(ct))
        );
      }
    }

    // sort
    if (sort === "newest") {
      result.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } else if (sort === "oldest") {
      result.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    } else {
      result.sort((a, b) => a.readingTime - b.readingTime);
    }

    return result;
  }, [posts, query, selectedTags, selectedCategory, sort]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearAll = () => {
    setQuery("");
    setSelectedTags([]);
    setSelectedCategory(null);
    setSort("newest");
  };

  const hasActiveFilters =
    query || selectedTags.length > 0 || selectedCategory || sort !== "newest";

  return (
    <div className="space-y-6">
      {/* ── Search + toggle filters ── */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Търси статии..."
            className="w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-2.5 text-sm text-text placeholder:text-muted/60 focus:border-primary focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
            showFilters || hasActiveFilters
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted hover:border-primary/30 hover:text-text"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Филтри</span>
          {(selectedTags.length > 0 || selectedCategory) && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              {selectedTags.length + (selectedCategory ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* ── Expanded filters panel ── */}
      {showFilters && (
        <div className="space-y-4 rounded-2xl border border-border bg-surface p-5 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Categories */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
              Категория
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === cat.label ? null : cat.label
                    )
                  }
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedCategory === cat.label
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-muted hover:bg-gray-200 hover:text-text"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
              Тагове
            </p>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-primary text-white"
                      : "bg-primary/10 text-primary hover:bg-primary/20"
                  }`}
                >
                  <Tag className="h-2.5 w-2.5" />
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
              Сортиране
            </p>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { key: "newest", label: "Най-нови" },
                  { key: "oldest", label: "Най-стари" },
                  { key: "readTime", label: "Бързо четене" },
                ] as { key: SortMode; label: string }[]
              ).map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSort(s.key)}
                  className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    sort === s.key
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-muted hover:bg-gray-200 hover:text-text"
                  }`}
                >
                  <ArrowUpDown className="h-3 w-3" />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear all */}
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="text-xs text-muted underline-offset-2 hover:text-primary hover:underline"
            >
              Изчисти всички филтри
            </button>
          )}
        </div>
      )}

      {/* ── Results count ── */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted">
          {filtered.length === posts.length
            ? `${posts.length} статии`
            : `${filtered.length} от ${posts.length} статии`}
        </p>
        {hasActiveFilters && !showFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-primary hover:underline"
          >
            Изчисти филтри
          </button>
        )}
      </div>

      {/* ── Posts grid ── */}
      {filtered.length > 0 ? (
        <div className="space-y-5">
          {filtered.map((post, i) => (
            <article
              key={post.slug}
              className={`group rounded-2xl border bg-surface p-6 transition-all hover:border-primary/30 hover:shadow-sm ${
                i === 0 ? "border-primary/20 ring-1 ring-primary/10" : "border-border"
              }`}
            >
              <Link href={`/blog/${post.slug}`} className="block">
                {i === 0 && (
                  <span className="mb-2 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                    Най-ново
                  </span>
                )}

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

                <h2 className="mb-2 text-lg font-bold text-text transition-colors group-hover:text-primary">
                  {post.title}
                </h2>

                <p className="mb-3 text-sm text-muted">{post.description}</p>

                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
                        selectedTags.includes(tag)
                          ? "bg-primary text-white"
                          : "bg-primary/10 text-primary"
                      }`}
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
      ) : (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <Search className="mx-auto mb-3 h-8 w-8 text-muted/40" />
          <p className="text-sm text-muted">Няма статии за тези филтри.</p>
          <button
            onClick={clearAll}
            className="mt-2 text-sm text-primary hover:underline"
          >
            Изчисти филтрите
          </button>
        </div>
      )}
    </div>
  );
}
