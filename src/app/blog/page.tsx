import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getBlogPosts } from "@/lib/kv";
import type { BlogPost } from "@/lib/kv";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "TrendWare Blog - Tipps, Trends & Gadgets",
  description:
    "Entdecke hilfreiche Ratgeber, Produktvergleiche und Tipps rund um smarte Gadgets, Home & Living, Fitness und mehr. Der TrendWare Blog.",
  openGraph: {
    title: "TrendWare Blog - Tipps, Trends & Gadgets",
    description:
      "Hilfreiche Ratgeber, Produktvergleiche und Tipps rund um smarte Gadgets und Alltagshelfer.",
    type: "website",
  },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group glass-card overflow-hidden transition-transform duration-300 hover:-translate-y-1 flex flex-col h-full"
    >
      {/* Cover Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-2 mb-2">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
          {post.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
          <span>{formatDate(post.publishedAt)}</span>
          <span>{post.readTimeMinutes} Min. Lesezeit</span>
        </div>
      </div>
    </Link>
  );
}

export default async function BlogPage() {
  let posts: BlogPost[] = [];
  try {
    posts = await getBlogPosts();
  } catch {
    // KV unavailable – show empty state
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-3">
          TrendWare Blog &ndash; Tipps, Trends &amp; Gadgets
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Ratgeber, Produktvergleiche und Tipps f&uuml;r deinen Alltag.
          Entdecke, welche Gadgets sich wirklich lohnen.
        </p>
      </div>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Bald gibt es hier spannende Artikel!
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Wir arbeiten gerade an hilfreichen Ratgebern und Produktvergleichen.
            Schau bald wieder vorbei!
          </p>
          <Link
            href="/shop"
            className="inline-block mt-6 btn-primary px-6 py-2.5 text-sm"
          >
            Zum Shop
          </Link>
        </div>
      )}
    </section>
  );
}
