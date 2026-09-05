import type { MetadataRoute } from "next";
import { getAllProducts } from "@/data/product-store";
import { categories } from "@/data/products";
import { getBlogPosts } from "@/lib/kv";

const BASE_URL = "https://trendware7.store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, blogPosts] = await Promise.all([
    getAllProducts(),
    getBlogPosts().catch(() => []),
  ]);
  const today = new Date().toISOString();

  /* ── Static pages ──────────────────────────────────────────── */
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: today,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: today,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  /* ── Legal pages ───────────────────────────────────────────── */
  const legalSlugs = [
    "agb",
    "datenschutz",
    "widerruf",
    "impressum",
    "versand",
    "kontakt",
  ];

  const legalPages: MetadataRoute.Sitemap = legalSlugs.map((slug) => ({
    url: `${BASE_URL}/${slug}`,
    lastModified: today,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  /* ── Category pages ────────────────────────────────────────── */
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/shop?category=${cat.slug}`,
    lastModified: today,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  /* ── Product pages (includes KV additions) ─────────────────── */
  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/product/${p.slug}`,
    lastModified: today,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  /* ── Blog pages ──────────────────────────────────────────── */
  const blogIndexPage: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/blog`,
      lastModified: today,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ];

  const blogPostPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...legalPages,
    ...categoryPages,
    ...productPages,
    ...blogIndexPage,
    ...blogPostPages,
  ];
}
