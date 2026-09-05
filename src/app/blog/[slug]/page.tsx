import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getBlogPosts, getBlogPostBySlug } from "@/lib/kv";
import { getAllProducts } from "@/data/product-store";
import type { Product } from "@/data/product-store";

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return { title: "Artikel nicht gefunden | TrendWare" };

  return {
    title: `${post.title} | TrendWare Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

function BreadcrumbJsonLd({
  post,
}: {
  post: { title: string; slug: string };
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Startseite",
        item: "https://trendware7.store",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://trendware7.store/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://trendware7.store/blog/${post.slug}`,
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function ArticleJsonLd({
  post,
}: {
  post: {
    title: string;
    slug: string;
    excerpt: string;
    coverImage: string;
    author: string;
    publishedAt: string;
  };
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "TrendWare",
      url: "https://trendware7.store",
    },
    datePublished: post.publishedAt,
    mainEntityOfPage: `https://trendware7.store/blog/${post.slug}`,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function RelatedProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group glass-card overflow-hidden transition-transform duration-300 hover:-translate-y-1 flex flex-col"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute top-2 left-2 bg-accent-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {product.badge}
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-800 group-hover:text-brand-600 transition-colors line-clamp-2 mb-1">
          {product.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-gray-900">
            {product.price.toFixed(2)}&nbsp;&euro;
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-gray-400 line-through">
              {product.compareAtPrice.toFixed(2)}&nbsp;&euro;
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return (
      <section className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Artikel nicht gefunden
        </h1>
        <p className="text-gray-500 mb-6">
          Dieser Blog-Artikel existiert leider nicht oder wurde entfernt.
        </p>
        <Link href="/blog" className="btn-primary px-6 py-2.5 text-sm">
          Zum Blog
        </Link>
      </section>
    );
  }

  // Fetch related products
  let relatedProducts: Product[] = [];
  if (post.relatedProductSlugs.length > 0) {
    try {
      const allProducts = await getAllProducts();
      const slugSet = new Set(post.relatedProductSlugs);
      relatedProducts = allProducts.filter((p) => slugSet.has(p.slug));
    } catch {
      // KV unavailable
    }
  }

  return (
    <>
      <BreadcrumbJsonLd post={post} />
      <ArticleJsonLd post={post} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-400 mb-6">
          <Link
            href="/"
            className="hover:text-gray-600 transition-colors"
          >
            Startseite
          </Link>
          <svg
            className="w-3.5 h-3.5 mx-2 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
          <Link
            href="/blog"
            className="hover:text-gray-600 transition-colors"
          >
            Blog
          </Link>
          <svg
            className="w-3.5 h-3.5 mx-2 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="text-gray-600 truncate max-w-[200px]">
            {post.title}
          </span>
        </nav>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 leading-tight mb-4">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-8">
          <span>Von {post.author}</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full" />
          <span>{formatDate(post.publishedAt)}</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full" />
          <span>{post.readTimeMinutes} Min. Lesezeit</span>
        </div>

        {/* Cover Image */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 mb-10">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 896px"
            className="object-cover"
            priority
          />
        </div>

        {/* Article Content */}
        <div
          className="prose prose-gray prose-lg max-w-none
            prose-headings:font-display prose-headings:text-gray-900
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-gray-600 prose-p:leading-relaxed
            prose-a:text-brand-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-800
            prose-ul:text-gray-600 prose-ol:text-gray-600
            prose-li:marker:text-brand-400
            prose-img:rounded-xl prose-img:shadow-sm"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-10 border-t border-gray-200">
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
              &Auml;hnliche Produkte
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.slice(0, 4).map((product) => (
                <RelatedProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/shop"
                className="inline-block text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
              >
                Alle Produkte ansehen &rarr;
              </Link>
            </div>
          </section>
        )}

        {/* Back to Blog */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Zur&uuml;ck zum Blog
          </Link>
        </div>
      </article>
    </>
  );
}
