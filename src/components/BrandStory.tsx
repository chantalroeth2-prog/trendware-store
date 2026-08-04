"use client";

import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

export default function BrandStory() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <ScrollReveal>
        <div>
          <p className="text-brand-600 text-sm font-semibold uppercase tracking-widest mb-3">
            Unsere Mission
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Clevere Produkte für deinen Alltag – sorgfältig ausgewählt
          </h2>
          <div className="space-y-4 text-gray-500 leading-relaxed">
            <p>
              Bei TrendWare glauben wir daran, dass gute Produkte nicht teuer sein
              müssen. Wir recherchieren den Markt nach den smartesten
              Lösungen für Zuhause, Büro, Fitness und mehr – und bringen sie
              direkt zu dir.
            </p>
            <p>
              Jedes Produkt in unserem Sortiment wird anhand von Herstellerangaben,
              unabhängigen Testberichten und Kundenerfahrungen bewertet.
              Wir setzen auf ein kuratiertes Sortiment mit Fokus auf Preis-Leistung,
              durchdachtes Design und zuverlässigen Service.
            </p>
          </div>
          <div className="flex gap-8 mt-8">
            <div>
              <div className="text-2xl font-display font-bold text-gray-900">30+</div>
              <div className="text-sm text-gray-500">Kuratierte Produkte</div>
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-gray-900">30 Tage</div>
              <div className="text-sm text-gray-500">Rückgaberecht</div>
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-gray-900">24h</div>
              <div className="text-sm text-gray-500">Support-Antwort</div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={200}>
        <div className="relative aspect-[4/3] rounded-boutique overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=600&fit=crop"
            alt="TrendWare Lifestyle"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      </ScrollReveal>
    </div>
  );
}
