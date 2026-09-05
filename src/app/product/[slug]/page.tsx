import type { Metadata } from "next";
import { getAllProducts, getProductBySlug, getProductsByCategory } from "@/data/product-store";
import ProductDetailClient from "./ProductDetailClient";
import { hasVerifiedReviews, isProductOrderable } from "@/lib/product-compliance";
import type { Product } from "@/data/products";

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Produkt nicht gefunden" };

  return {
    title: `${product.title} kaufen | TrendWare`,
    description: `${product.title} für ${product.price.toFixed(2)} €. ${product.features[0] || ""} Informationen zu Bestellbarkeit, Versand und Produktsicherheit findest du auf der Produktseite.`,
    openGraph: {
      title: product.title,
      description: product.shortDescription,
      images: [{ url: product.images[0], width: 600, height: 600, alt: product.title }],
      type: "website",
    },
  };
}

function BreadcrumbJsonLd({ product }: { product: { title: string; slug: string; category: string; categorySlug: string } }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: "https://trendware7.store" },
      { "@type": "ListItem", position: 2, name: "Shop", item: "https://trendware7.store/shop" },
      { "@type": "ListItem", position: 3, name: product.category, item: `https://trendware7.store/shop?category=${product.categorySlug}` },
      { "@type": "ListItem", position: 4, name: product.title, item: `https://trendware7.store/product/${product.slug}` },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

function FAQJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "Wie schnell wird geliefert?", acceptedAnswer: { "@type": "Answer", text: "Die bestätigte Lieferzeit wird beim jeweiligen Produkt und vor der Zahlung angezeigt." } },
      { "@type": "Question", name: "Kann ich zurückgeben?", acceptedAnswer: { "@type": "Answer", text: "Neben dem gesetzlichen Widerrufsrecht gilt eine freiwillige Rückgabefrist von 30 Tagen. Trendware übernimmt die unmittelbaren Rücksendekosten; Einzelheiten enthält die Widerrufsbelehrung." } },
      { "@type": "Question", name: "Welche Zahlungsarten gibt es?", acceptedAnswer: { "@type": "Answer", text: "Im Checkout werden ausschließlich tatsächlich aktivierte Zahlungsarten angezeigt." } },
      { "@type": "Question", name: "Wie erreiche ich den Support?", acceptedAnswer: { "@type": "Answer", text: "Per E-Mail an kontakt.trendware@gmail.com oder über das Kontaktformular." } },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

function ProductJsonLd({ product }: { product: Product }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images,
    url: `https://trendware7.store/product/${product.slug}`,
    brand: { "@type": "Brand", name: "TrendWare" },
    ...(hasVerifiedReviews(product) ? {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating.toString(),
        reviewCount: product.reviewCount.toString(),
      },
    } : {}),
    offers: {
      "@type": "Offer",
      url: `https://trendware7.store/product/${product.slug}`,
      priceCurrency: "EUR",
      price: product.price.toFixed(2),
      ...(product.compareAtPrice ? { priceValidUntil: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0] } : {}),
      availability: isProductOrderable(product)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "TrendWare" },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProductBySlug(params.slug);

  let relatedProducts = product
    ? (await getProductsByCategory(product.categorySlug))
        .filter((p) => p.id !== product.id)
        .slice(0, 8)
    : [];

  return (
    <>
      {product && <ProductJsonLd product={product} />}
      {product && <BreadcrumbJsonLd product={product} />}
      <FAQJsonLd />
      <ProductDetailClient
        product={product || null}
        relatedProducts={relatedProducts}
      />
    </>
  );
}

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}
