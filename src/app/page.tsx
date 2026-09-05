import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import ProductSlider from "@/components/ProductSlider";
import BrandStory from "@/components/BrandStory";
import ScrollReveal from "@/components/ScrollReveal";
import { getFeaturedProducts, getNewArrivals, getCategoryWithCount } from "@/data/product-store";

function HomeJsonLd() {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TrendWare",
    url: "https://trendware7.store",
    logo: "https://trendware7.store/logo.png",
    description: "Ausgewählte Alltagshelfer für Zuhause, Ordnung und Ambiente.",
    contactPoint: {
      "@type": "ContactPoint",
      email: "kontakt.trendware@gmail.com",
      contactType: "customer service",
      availableLanguage: "German",
    },
    sameAs: [],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TrendWare",
    url: "https://trendware7.store",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://trendware7.store/shop?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
    </>
  );
}

// Jede Minute revalidieren, damit KV-Overrides (neue Bilder, Preise) sofort sichtbar werden
export const revalidate = 60;

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();
  const newArrivals = await getNewArrivals();
  const categoriesWithCount = await getCategoryWithCount();

  return (
    <>
      <HomeJsonLd />
      {/* Hero */}
      <HeroSection />

      <section id="produkte" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ScrollReveal>
          <ProductSlider
            products={featuredProducts}
            title="Ausgewählte Produkte"
            subtitle="Bestellbarkeit und Lieferdaten werden je Produkt geprüft"
          />
        </ScrollReveal>
      </section>

      {/* Brand Story */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BrandStory />
        </div>
      </section>

      {/* Kategorien */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Unsere Kategorien
            </h2>
            <p className="text-gray-500">Finde genau das, was du suchst</p>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categoriesWithCount.map((cat, i) => (
            <ScrollReveal key={cat.slug} delay={i * 80}>
              <Link
                href={`/shop?category=${cat.slug}`}
                className="glass-card p-6 text-center group block"
              >
                <span className="text-4xl block mb-3">{cat.icon}</span>
                <h3 className="font-semibold text-gray-700 group-hover:text-brand-600 transition-colors text-sm">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{cat.productCount} Produkte</p>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* New Arrivals Slider */}
      {newArrivals.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <ProductSlider
                products={newArrivals}
                title="Neu eingetroffen"
                subtitle="Frisch im Sortiment &ndash; sei unter den Ersten"
              />
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Warum bei uns kaufen? */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-10">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Warum bei uns kaufen?
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H6.375c-.621 0-1.125-.504-1.125-1.125V14.25m17.25 0V5.625A1.125 1.125 0 0021.75 4.5H2.25A1.125 1.125 0 001.125 5.625v8.625" />
                  </svg>
                ),
                title: "Transparenter Versand",
                text: "Versandkosten und verfügbare Lieferzeit werden vor der Bestellung angezeigt.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
                title: "Sichere Zahlung",
                text: "Zahlungen werden erst angeboten, wenn der jeweilige Zahlungsdienst aktiviert ist.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                  </svg>
                ),
                title: "30 Tage R\u00fcckgabe",
                text: "Zusätzlich zum gesetzlichen Widerrufsrecht bieten wir eine freiwillige Rückgabe; die Bedingungen findest du im Widerruf.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  </svg>
                ),
                title: "Support per E-Mail",
                text: "Antwort innerhalb von 24h \u2013 schnell und freundlich.",
              },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="text-center p-6 glass-card">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-50 text-brand-600 mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
