import type { Metadata } from "next";
import { getAllProducts, getProductBySlug, getProductsByCategory } from "@/data/product-store";
import ProductDetailClient from "./ProductDetailClient";

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Produkt nicht gefunden" };

  return {
    title: `${product.title} kaufen | TrendWare`,
    description: `${product.title} für ${product.price.toFixed(2)} € ✓ ${product.features[0] || ""} ✓ Kostenloser Versand ab 39 € ✓ 30 Tage Rückgabe. Jetzt bei TrendWare bestellen.`,
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
      { "@type": "ListItem", position: 1, name: "Startseite", item: "https://trendware.store" },
      { "@type": "ListItem", position: 2, name: "Shop", item: "https://trendware.store/shop" },
      { "@type": "ListItem", position: 3, name: product.category, item: `https://trendware.store/shop?category=${product.categorySlug}` },
      { "@type": "ListItem", position: 4, name: product.title, item: `https://trendware.store/product/${product.slug}` },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

function FAQJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "Wie schnell wird geliefert?", acceptedAnswer: { "@type": "Answer", text: "Die Lieferzeit beträgt 3–7 Werktage. Ab einem Bestellwert von 39 € ist der Versand kostenlos." } },
      { "@type": "Question", name: "Kann ich zurückgeben?", acceptedAnswer: { "@type": "Answer", text: "Ja, du hast 30 Tage Rückgaberecht – unkompliziert und ohne Wenn und Aber." } },
      { "@type": "Question", name: "Welche Zahlungsarten gibt es?", acceptedAnswer: { "@type": "Answer", text: "Wir akzeptieren Visa, Mastercard und PayPal." } },
      { "@type": "Question", name: "Ist die Zahlung sicher?", acceptedAnswer: { "@type": "Answer", text: "Ja, alle Zahlungen sind SSL-verschlüsselt und PCI-konform. Deine Daten sind jederzeit geschützt." } },
      { "@type": "Question", name: "Wie erreiche ich den Support?", acceptedAnswer: { "@type": "Answer", text: "Per E-Mail an kontakt.trendware@gmail.com oder über unser Kontaktformular. Wir antworten in der Regel innerhalb von 24 Stunden." } },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

function ProductJsonLd({ product }: { product: { title: string; description: string; price: number; compareAtPrice?: number; images: string[]; slug: string; rating: number; reviewCount: number; inStock: boolean } }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images,
    url: `https://trendware.store/product/${product.slug}`,
    brand: { "@type": "Brand", name: "TrendWare" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating.toString(),
      reviewCount: product.reviewCount.toString(),
    },
    offers: {
      "@type": "Offer",
      url: `https://trendware.store/product/${product.slug}`,
      priceCurrency: "EUR",
      price: product.price.toFixed(2),
      ...(product.compareAtPrice ? { priceValidUntil: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0] } : {}),
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "TrendWare" },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "EUR" },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "DE" },
        deliveryTime: { "@type": "ShippingDeliveryTime", handlingTime: { "@type": "QuantitativeValue", minValue: 3, maxValue: 7, unitCode: "d" } },
      },
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
