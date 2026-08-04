"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import type { Product } from "@/data/products";
import { useCart } from "@/components/CartProvider";
import { trackViewContent, trackAddToCart } from "@/lib/tracking";
import ProductSlider from "@/components/ProductSlider";
import ScrollReveal from "@/components/ScrollReveal";
import { testimonials } from "@/data/testimonials";

type Tab = "beschreibung" | "eigenschaften" | "bewertungen";

interface Props {
  product: Product | null;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: Props) {
  const { addItem } = useCart();
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("beschreibung");
  const [added, setAdded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showStickyATC, setShowStickyATC] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [viewers, setViewers] = useState(0);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) {
      trackViewContent({ id: product.id, title: product.title, price: product.price, category: product.category });
    }
  }, [product]);

  useEffect(() => {
    // Simulated live viewer count
    const base = 3 + Math.floor(Math.random() * 8);
    setViewers(base);
    const interval = setInterval(() => {
      setViewers((v) => Math.max(2, v + (Math.random() > 0.5 ? 1 : -1)));
    }, 8000 + Math.random() * 7000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!ctaRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyATC(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(ctaRef.current);
    return () => observer.disconnect();
  }, []);

  const handleAdd = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    trackAddToCart({ id: product.id, title: product.title, price: product.price, category: product.category, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    window.location.href = "/checkout";
  };

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Produkt nicht gefunden</h1>
        <p className="text-gray-500 mb-6">Dieses Produkt ist leider nicht mehr verf&uuml;gbar.</p>
        <Link href="/shop" className="btn-primary">Zur&uuml;ck zum Shop</Link>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "beschreibung", label: "Beschreibung" },
    { key: "eigenschaften", label: "Eigenschaften" },
    { key: "bewertungen", label: "Kundenstimmen" },
  ];

  // Get reviews for this product, fallback to all testimonials
  const productReviews = testimonials.filter(
    (t) => t.product && product.title.toLowerCase().includes(t.product.toLowerCase())
  );
  const displayReviews = productReviews.length > 0 ? productReviews : testimonials;

  const faqs = [
    { q: "Wie schnell wird geliefert?", a: "Die Lieferzeit betr\u00e4gt 3\u20137 Werktage. Ab einem Bestellwert von 39\u00a0\u20ac ist der Versand kostenlos." },
    { q: "Kann ich zur\u00fcckgeben?", a: "Ja, du hast 30 Tage R\u00fcckgaberecht \u2013 unkompliziert und ohne Wenn und Aber." },
    { q: "Welche Zahlungsarten gibt es?", a: "Wir akzeptieren Visa, Mastercard und PayPal." },
    { q: "Ist die Zahlung sicher?", a: "Ja, alle Zahlungen sind SSL-verschl\u00fcsselt und PCI-konform. Deine Daten sind jederzeit gesch\u00fctzt." },
    { q: "Wie erreiche ich den Support?", a: "Per E-Mail an kontakt.trendware@gmail.com oder \u00fcber unser Kontaktformular. Wir antworten in der Regel innerhalb von 24 Stunden." },
  ];

  const totalPrice = product.price * quantity;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-600">Startseite</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-brand-600">Shop</Link>
          <span className="mx-2">/</span>
          <Link href={`/shop?category=${product.categorySlug}`} className="hover:text-brand-600">
            {product.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">{product.title}</span>
        </nav>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-3">
            <Swiper
              modules={[Navigation, Thumbs]}
              navigation
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              onSlideChange={(s) => setActiveIndex(s.activeIndex)}
              className="aspect-square rounded-boutique overflow-hidden bg-gray-100"
            >
              {product.images.map((img, i) => (
                <SwiperSlide key={i}>
                  <div className="relative w-full h-full">
                    <Image
                      src={img}
                      alt={`${product.title} - Bild ${i + 1}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      priority={i === 0}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {product.images.length > 1 && (
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={12}
                slidesPerView={Math.min(product.images.length, 4)}
                watchSlidesProgress
              >
                {product.images.map((img, i) => (
                  <SwiperSlide key={i} className="cursor-pointer">
                    <div
                      className={`aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 transition-colors relative ${
                        i === activeIndex ? "border-brand-500" : "border-transparent"
                      }`}
                    >
                      <Image src={img} alt="" fill sizes="100px" className="object-cover" />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          {/* Product Info */}
          <div>
            {product.badge && (
              <span className="inline-block bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                {product.badge}
              </span>
            )}

            <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {product.title}
            </h1>

            {/* Category */}
            <p className="text-sm text-gray-500 mb-4">{product.category}</p>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">
                {totalPrice.toFixed(2)}&nbsp;&euro;
              </span>
              {product.compareAtPrice && (
                <>
                  <span className="text-lg text-gray-500 line-through">
                    {(product.compareAtPrice * quantity).toFixed(2)}&nbsp;&euro;
                  </span>
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                    Du sparst {((product.compareAtPrice - product.price) * quantity).toFixed(2)}&nbsp;&euro;
                  </span>
                </>
              )}
            </div>

            {/* Stock urgency */}
            {product.stockCount <= 15 && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                </span>
                <span className="text-sm text-red-500 font-medium">
                  Nur noch {product.stockCount} auf Lager &ndash; bald ausverkauft!
                </span>
              </div>
            )}

            {/* Short description */}
            <p className="text-gray-500 mb-6 leading-relaxed">{product.shortDescription}</p>

            {/* Delivery Info */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 p-3 bg-gray-100 rounded-lg border border-gray-200">
              <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H6.375c-.621 0-1.125-.504-1.125-1.125V14.25m17.25 0V5.625A1.125 1.125 0 0021.75 4.5H2.25A1.125 1.125 0 001.125 5.625v8.625" />
              </svg>
              <span>Lieferzeit: <strong className="text-gray-700">{product.deliveryDays}</strong></span>
              <span className="text-gray-400">|</span>
              <span>Kostenloser Versand ab 39&nbsp;&euro;</span>
            </div>

            {/* Live viewers */}
            {viewers > 0 && (
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span><strong className="text-green-600">{viewers} Personen</strong> sehen sich das gerade an</span>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-gray-500">Menge:</span>
              <div className="flex items-center border border-gray-300 rounded-lg bg-gray-100">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-gray-500 hover:text-gray-900 transition-colors"
                  disabled={quantity <= 1}
                >
                  &minus;
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-700 min-w-[2.5rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                  className="px-3 py-2 text-gray-500 hover:text-gray-900 transition-colors"
                  disabled={quantity >= product.stockCount}
                >
                  +
                </button>
              </div>
              {quantity > 1 && (
                <span className="text-xs text-gray-500">
                  ({product.price.toFixed(2)}&nbsp;&euro; / St&uuml;ck)
                </span>
              )}
            </div>

            {/* CTA Buttons */}
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={handleAdd}
                disabled={added}
                className={`flex-1 py-4 text-base font-semibold rounded-lg transition-all ${
                  added
                    ? "bg-green-50 text-green-600 border border-green-200"
                    : "btn-primary"
                }`}
              >
                {added ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Hinzugef&uuml;gt!
                  </span>
                ) : (
                  "In den Warenkorb"
                )}
              </button>
              <button onClick={handleBuyNow} className="btn-accent flex-1 py-4 text-base">
                Jetzt kaufen
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs text-gray-500">
              <div className="p-2 border border-gray-200 rounded-lg bg-gray-100">
                <div className="font-semibold text-gray-600">Sichere Zahlung</div>
                SSL-verschl&uuml;sselt
              </div>
              <div className="p-2 border border-gray-200 rounded-lg bg-gray-100">
                <div className="font-semibold text-gray-600">30 Tage</div>
                R&uuml;ckgaberecht
              </div>
              <div className="p-2 border border-gray-200 rounded-lg bg-gray-100">
                <div className="font-semibold text-gray-600">Schneller Versand</div>
                {product.deliveryDays}
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Details */}
        <ScrollReveal>
          <div className="border-t border-gray-200 pt-12 mb-12">
            <div className="flex border-b border-gray-200 mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === tab.key ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500" />
                  )}
                </button>
              ))}
            </div>

            {activeTab === "beschreibung" && (
              <p className="text-gray-500 leading-relaxed">{product.description}</p>
            )}

            {activeTab === "eigenschaften" && (
              <ul className="space-y-3">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "bewertungen" && (
              <div className="space-y-6">
                <div className="bg-brand-50 border border-brand-200 rounded-lg p-3 text-xs text-gray-500">
                  Die folgenden Kundenstimmen basieren auf recherchierten Erfahrungsberichten
                  und wurden redaktionell aufbereitet. Es handelt sich nicht um verifizierte K&auml;ufe
                  &uuml;ber diesen Shop.
                </div>

                {/* Reviews from testimonials */}
                <div className="space-y-4">
                  {displayReviews.map((review) => (
                    <div key={review.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-sm font-bold text-brand-600">
                            {review.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{review.name}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <svg
                                    key={star}
                                    className={`w-3.5 h-3.5 ${star <= review.rating ? "text-accent-500" : "text-gray-300"}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">{review.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
                    </div>
                  ))}
                </div>
                {productReviews.length === 0 && (
                  <p className="text-xs text-gray-500 italic">Allgemeine Kundenstimmen zu TrendWare-Produkten</p>
                )}
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* FAQ Accordion */}
        <ScrollReveal>
          <div className="border-t border-gray-200 pt-12 mb-16">
            <h2 className="font-display text-xl md:text-2xl font-bold text-gray-900 mb-6">
              H&auml;ufige Fragen
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    {faq.q}
                    <svg
                      className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-sm text-gray-500 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <ScrollReveal>
            <div className="border-t border-gray-200 pt-12">
              <ProductSlider
                products={relatedProducts}
                title="Das k&ouml;nnte dir auch gefallen"
                subtitle="&Auml;hnliche Produkte aus dieser Kategorie"
              />
            </div>
          </ScrollReveal>
        )}
      </div>

      {/* Sticky ATC - Mobile */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200 p-3 transform transition-transform duration-300 lg:hidden ${
          showStickyATC ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center gap-3 max-w-7xl mx-auto">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{product.title}</p>
            <p className="text-lg font-bold text-gray-900">{product.price.toFixed(2)}&nbsp;&euro;</p>
          </div>
          <button onClick={handleAdd} className="btn-accent px-6 py-3 text-sm whitespace-nowrap">
            In den Warenkorb
          </button>
        </div>
      </div>
    </>
  );
}
