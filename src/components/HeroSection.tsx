"use client";

import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/90 via-rose-100/30 to-surface-900 text-stone-800">
      {/* Soft dreamlike floating glow shapes */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-rose-200/35 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl animate-float-slow pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-accent-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text content */}
          <div className="opacity-0 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-rose-100/80 text-brand-800 mb-6 border border-rose-200/60 shadow-xs backdrop-blur-sm">
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
              <Link href="/shop" className="btn-primary text-base px-8 py-4 shadow-brand-500/25 hover:shadow-brand-500/35">
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
            <div className="mt-10 pt-8 border-t border-brand-200/50 flex flex-wrap gap-6 text-xs sm:text-sm font-medium text-stone-600 opacity-0 animate-fade-in-up-delay-2">
              <div className="flex items-center gap-1.5">
                <span className="text-accent-500 font-bold">✓</span> 30 Tage Rückgaberecht
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-accent-500 font-bold">✓</span> Kostenloser Versand ab 39&nbsp;€
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-accent-500 font-bold">✓</span> Klimaneutraler Versand
              </div>
            </div>
          </div>

          {/* Right: Featured product image */}
          <ScrollReveal delay={200}>
            <div className="relative">
              <div className="aspect-[4/3] sm:aspect-square rounded-3xl overflow-hidden border border-brand-100/80 shadow-2xl shadow-brand-900/10 relative group bg-white/50 backdrop-blur-md">
                <Image
                  src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop&q=80"
                  alt="Ambient Sunset Projektor-Lampe"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-stone-900/10 to-transparent opacity-70 group-hover:opacity-60 transition-opacity duration-300" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs font-semibold uppercase tracking-wider bg-white/25 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/40 shadow-xs">
                    Bestseller Highlight
                  </span>
                  <h3 className="text-xl font-display font-bold mt-2.5 drop-shadow-xs">Ambient Sunset Projektor</h3>
                  <p className="text-xs text-stone-100/90 mt-1">16 Mio. Farben &amp; sanfter Sonnenuntergangs-Effekt</p>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-4 glass-card px-5 py-3.5 hidden sm:block shadow-lg border-brand-100 rounded-2xl">
                <div className="flex items-center gap-2.5">
                  <span className="text-accent-500 text-lg">★ 4.9</span>
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
