"use client";

import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-teal-900 text-white">
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 dot-pattern opacity-40" />

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-accent-500/15 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-400/10 rounded-full blur-3xl animate-float-slower" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text content */}
          <div className="opacity-0 animate-fade-in-up">
            <p className="text-brand-200 text-sm font-semibold uppercase tracking-widest mb-4">
              Handverlesene Qualität für Zuhause, Büro &amp; Fitness
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
              Smarte Produkte, die deinen Alltag
              <br />
              <span className="text-gradient">verbessern.</span>
            </h1>
            <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-xl opacity-0 animate-fade-in-up-delay">
              Handverlesene Qualität für Zuhause, Büro &amp; Fitness
              – versandkostenfrei ab 39&nbsp;&euro;.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in-up-delay-2">
              <Link href="/shop" className="btn-accent text-base px-8 py-4">
                Jetzt entdecken &rarr;
              </Link>
              <Link
                href="#bestseller"
                className="inline-flex items-center justify-center rounded-lg border border-white/20 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10 hover:border-white/30"
              >
                Unsere Bestseller
              </Link>
            </div>

            {/* Stats bar */}
            <div className="mt-12 flex flex-wrap gap-8 md:gap-10 opacity-0 animate-fade-in-up-delay-2">
              {[
                { value: "30 Tage", label: "R\u00fcckgaberecht" },
                { value: "Ab 39\u00a0\u20ac", label: "Kostenloser Versand" },
                { value: "24h", label: "Support-Antwort" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-xl font-display font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Trust strip */}
            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/70 opacity-0 animate-fade-in-up-delay-2">
              <span>&#10003; 30 Tage Rückgabe</span>
              <span>&#10003; Sichere Zahlung</span>
              <span>&#10003; Schneller Versand</span>
            </div>
          </div>

          {/* Right: Featured product image */}
          <ScrollReveal delay={300}>
            <div className="relative">
              {/* Mobile: simple image without floating badges */}
              <div className="aspect-[3/2] lg:aspect-square rounded-boutique overflow-hidden border border-white/20 relative">
                <Image
                  src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=700&h=700&fit=crop"
                  alt="TrendWare Produkte"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
              {/* Floating badge - desktop only */}
              <div className="absolute -bottom-4 -left-4 glass-card px-5 py-3 animate-float-slow hidden lg:block">
                <div className="flex items-center gap-2">
                  <span className="text-green-400 text-lg">&#10003;</span>
                  <div>
                    <p className="text-sm font-bold text-gray-900">30 Tage</p>
                    <p className="text-xs text-gray-500">Rückgaberecht</p>
                  </div>
                </div>
              </div>
              {/* Floating badge 2 - desktop only */}
              <div className="absolute -top-4 -right-4 glass-card px-4 py-2 animate-float hidden lg:block">
                <p className="text-xs font-semibold text-green-600">&#10003; Kostenloser Versand</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
