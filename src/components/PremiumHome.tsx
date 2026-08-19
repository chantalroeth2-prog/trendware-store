"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowCounterClockwise, ArrowRight, CreditCard, Headset, Package, ShieldCheck, Truck } from "@phosphor-icons/react";
import type { Product } from "@/data/products";
import ProductCard from "./ProductCard";
import HeroSection from "./HeroSection";

const benefits = [
  { icon: Truck, title: "Kostenloser Versand", text: "ab 50 € Bestellwert" },
  { icon: ArrowCounterClockwise, title: "30 Tage Rückgabe", text: "Kostenlos & unkompliziert" },
  { icon: CreditCard, title: "Sichere Zahlung", text: "SSL verschlüsselt" },
];
const categoryNames = ["Küche & Haushalt", "Smart Home", "Tech & Zubehör", "Unterwegs", "Haustiere", "Lifestyle"];

export default function PremiumHome({ products }: { products: Product[] }) {
  const featured = products.slice(0, 4);
  const categoryImages = products.length ? Array.from({ length: 6 }, (_, i) => products[i % products.length].images[0]) : [];
  return (
    <main className="tw-home">
      <HeroSection />
      <section className="tw-benefits"><div className="tw-shell grid md:grid-cols-3">
        {benefits.map(({ icon: Icon, title, text }) => <div className="tw-benefit" key={title}><Icon size={26} weight="light" /><div><strong>{title}</strong><span>{text}</span></div></div>)}
      </div></section>
      <section className="tw-shell tw-section">
        <div className="tw-section-heading"><h2>Beliebte Kategorien</h2><Link href="/shop">Alle anzeigen <ArrowRight size={16} /></Link></div>
        <div className="tw-categories">
          {categoryNames.map((name, i) => <Link href="/shop" className="tw-category" key={name}>
            <div className="tw-category-image">{categoryImages[i] && <Image src={categoryImages[i]} alt="" fill sizes="(max-width: 768px) 48vw, 16vw" className="object-cover" />}</div>
            <div><span>{name}</span><ArrowRight size={15} /></div>
          </Link>)}
        </div>
      </section>
      <section id="bestseller" className="tw-shell tw-section tw-favorites">
        <div className="tw-section-heading items-end"><div><h2>Unsere Favoriten</h2><p>Handverlesene Produkte, die deinen Alltag besser machen.</p></div><Link href="/shop">Alle Produkte <ArrowRight size={16} /></Link></div>
        <div className="tw-product-grid">{featured.map(product => <ProductCard key={product.id} product={product} />)}</div>
        <div className="text-center mt-10"><Link href="/shop" className="tw-button tw-button-outline">Alle Produkte ansehen</Link></div>
      </section>
      <section id="warum" className="tw-why"><div className="tw-shell tw-why-grid">
        <div><p className="tw-eyebrow">So bringen wir Trendware zu dir</p><h2>Weniger suchen.<br />Besser auswählen.</h2><p>Wir filtern kurzlebigen Hype heraus und wählen nur Produkte, die nützlich, zuverlässig und schön genug für deinen Alltag sind.</p></div>
        <div className="tw-why-card"><h3>Warum Trendware?</h3>{["Handverlesene, nützliche Produkte", "Premium Qualität zu fairen Preisen", "Schnelle Lieferung aus der EU", "Ausgezeichneter Kundenservice", "30 Tage Rückgaberecht"].map(item => <div key={item}><ShieldCheck size={20} weight="fill" /><span>{item}</span></div>)}</div>
        <div className="tw-service-card"><Package size={28} /><h3>EU-Lager</h3><p>Schnelle Lieferung ohne lange Wartezeit.</p><Headset size={28} /><h3>Persönlicher Service</h3><p>Deutsch & Französisch.</p></div>
      </div></section>
    </main>
  );
}
