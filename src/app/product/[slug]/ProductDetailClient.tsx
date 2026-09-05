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
import { isProductOrderable } from "@/lib/product-compliance";

type Tab = "beschreibung" | "eigenschaften" | "produktsicherheit";

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
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) {
      trackViewContent({ id: product.id, title: product.title, price: product.price, category: product.category });
    }
  }, [product]);

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
    if (!product || !isProductOrderable(product)) return;
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    trackAddToCart({ id: product.id, title: product.title, price: product.price, category: product.category, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    if (!product || !isProductOrderable(product)) return;
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
    { key: "produktsicherheit", label: "Produktsicherheit" },
  ];

  const orderable = isProductOrderable(product);

  const faqs = [
    { q: "Wie schnell wird geliefert?", a: `Die bestätigte Lieferzeit wird beim Produkt und vor der Zahlung angezeigt. Der aktuelle Status lautet: ${product.deliveryDays}.` },
    { q: "Kann ich zurückgeben?", a: "Ja. Neben dem gesetzlichen Widerrufsrecht bieten wir eine freiwillige Rückgabe innerhalb von 30 Tagen. Wir übernehmen die unmittelbaren Rücksendekosten. Einzelheiten stehen in der Widerrufsbelehrung." },
    { q: "Welche Zahlungsarten gibt es?", a: "Im Checkout werden ausschließlich die tatsächlich aktivierten Zahlungsarten angezeigt." },
    { q: "Wie erreiche ich den Support?", a: "Per E-Mail an kontakt.trendware@gmail.com oder über unser Kontaktformular." },
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
            {product.badge === "Neu" && (
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

            <div className={`mb-4 p-3 rounded-lg border text-sm font-medium ${orderable ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-amber-50 border-amber-200 text-amber-800"}`}>
              {orderable ? "Dieses Produkt ist aktuell bestellbar." : "Dieses Produkt ist derzeit nicht bestellbar. Lieferantenverfügbarkeit und Pflichtangaben werden noch geprüft."}
            </div>

            {/* Short description */}
            <p className="text-gray-500 mb-6 leading-relaxed">{product.shortDescription}</p>

            {/* Delivery Info */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 p-3 bg-gray-100 rounded-lg border border-gray-200">
              <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H6.375c-.621 0-1.125-.504-1.125-1.125V14.25m17.25 0V5.625A1.125 1.125 0 0021.75 4.5H2.25A1.125 1.125 0 001.125 5.625v8.625" />
              </svg>
              <span>Lieferzeit: <strong className="text-gray-700">{product.deliveryDays}</strong></span>
            </div>

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
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="px-3 py-2 text-gray-500 hover:text-gray-900 transition-colors"
                  disabled={quantity >= 10 || !orderable}
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
                disabled={added || !orderable}
                className={`flex-1 py-4 text-base font-semibold rounded-lg transition-all ${
                  !orderable
                    ? "bg-stone-100 text-stone-500 border border-stone-200 cursor-not-allowed"
                    : added
                    ? "bg-green-50 text-green-600 border border-green-200"
                    : "btn-primary"
                }`}
              >
                {!orderable ? (
                  "Derzeit nicht bestellbar"
                ) : added ? (
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
              <button onClick={handleBuyNow} disabled={!orderable} className="btn-accent flex-1 py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed">
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

            {activeTab === "produktsicherheit" && (
              <div className="space-y-4 text-sm text-gray-600">
                {product.gpsr ? (
                  <>
                    <p><strong>Hersteller:</strong> {product.gpsr.manufacturerName}</p>
                    <p>{product.gpsr.manufacturerPostalAddress}<br />{product.gpsr.manufacturerElectronicAddress}</p>
                    {product.gpsr.euResponsiblePersonName && (
                      <p><strong>EU-Verantwortliche Person:</strong> {product.gpsr.euResponsiblePersonName}<br />{product.gpsr.euResponsiblePersonPostalAddress}<br />{product.gpsr.euResponsiblePersonElectronicAddress}</p>
                    )}
                    <p><strong>Produktkennung:</strong> {product.gpsr.productIdentifier}</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {product.gpsr.safetyInformationDe.map((notice) => <li key={notice}>{notice}</li>)}
                    </ul>
                  </>
                ) : (
                  <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
                    Hersteller-, Verantwortlichen- und Sicherheitsangaben werden noch geprüft. Bis zur vollständigen Hinterlegung bleibt dieses Produkt nicht bestellbar.
                  </p>
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
