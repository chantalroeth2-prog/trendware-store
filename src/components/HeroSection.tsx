"use client";

import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/80 via-rose-50/30 to-white text-stone-800">
      {/* Soft warm background gradients */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-200/25 rounded-full blur-3xl animate-float-slow" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text content */}
          <div className="opacity-0 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-100/80 text-amber-800 mb-6 border border-amber-200/50">
              ✨ Wohlfühlen &amp; Entspannen Zuhause
            </span>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.15] text-stone-900 mb-6">
              Smarte Ästhetik für
              <br />
              dein <span className="text-gradient">Zuhause.</span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 mb-8 leading-relaxed max-w-xl opacity-0 animate-fade-in-up-delay">
              Handverlesene Stimmungslichter, beruhigende Aroma-Diffuser &amp; elegante Wohn-Gadgets für deinen persönlichen Rückzugsort.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in-up-delay-2">
              <Link href="/shop" className="btn-primary text-base px-8 py-4">
                Kollektion entdecken &rarr;
              </Link>
              <Link
                href="#bestseller"
                className="btn-secondary text-base px-8 py-4"
              >
                Beliebte Bestseller
              </Link>
            </div>

            {/* Trust highlights */}
            <div className="mt-10 pt-8 border-t border-amber-200/50 flex flex-wrap gap-6 text-xs sm:text-sm font-medium text-stone-600 opacity-0 animate-fade-in-up-delay-2">
              <div className="flex items-center gap-1.5">
                <span className="text-amber-600">✓</span> 30 Tage Rückgaberecht
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-600">✓</span> Kostenloser Versand ab 39&nbsp;€
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-600">✓</span> Klimaneutraler Versand
              </div>
            </div>
          </div>

          {/* Right: Featured product image */}
          <ScrollReveal delay={200}>
            <div className="relative">
              <div className="aspect-[4/3] sm:aspect-square rounded-3xl overflow-hidden border border-amber-100 shadow-xl shadow-amber-900/5 relative group">
                <Image
                  src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop&q=80"
                  alt="Ambient Sunset Projektor-Lampe"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                    Bestseller Highlight
                  </span>
                  <h3 className="text-xl font-display font-bold mt-2">Ambient Sunset Projektor</h3>
                  <p className="text-xs text-white/80 mt-1">16 Mio. Farben &amp; sanfter Sonnenuntergangs-Effekt</p>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-4 glass-card px-5 py-3 hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 text-lg">★ 4.9</span>
                  <div>
                    <p className="text-xs font-bold text-stone-900">400+ Zufriedene Kunden</p>
                    <p className="text-[10px] text-stone-500">Geprüfte Bewertungen</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
