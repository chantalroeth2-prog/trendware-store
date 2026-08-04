"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";
import AnnouncementBar from "./AnnouncementBar";

export default function Header() {
  const { itemCount, openDrawer } = useCart();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50">
      <AnnouncementBar />

      <div className="bg-white/80 backdrop-blur-xl border-b border-brand-100/80 shadow-xs shadow-brand-900/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 group">
              <span className="text-2xl font-display tracking-wide text-stone-800 transition-colors group-hover:text-stone-900">
                trend<span className="font-semibold text-brand-600 group-hover:text-accent-500 transition-colors">ware</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-stone-600 hover:text-brand-700 transition-colors text-sm font-medium">
                Startseite
              </Link>
              <Link href="/shop" className="text-stone-600 hover:text-brand-700 transition-colors text-sm font-medium">
                Shop
              </Link>
              <Link href="/shop?category=home-living" className="text-stone-600 hover:text-brand-700 transition-colors text-sm font-medium">
                Home &amp; Living
              </Link>
              <Link href="/shop?category=lifestyle-fitness" className="text-stone-600 hover:text-brand-700 transition-colors text-sm font-medium">
                Lifestyle
              </Link>
              <Link href="/blog" className="text-stone-600 hover:text-brand-700 transition-colors text-sm font-medium">
                Blog
              </Link>
              <Link href="/kontakt" className="text-stone-600 hover:text-brand-700 transition-colors text-sm font-medium">
                Kontakt
              </Link>
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-stone-600 hover:text-brand-700 hover:bg-rose-50/60 rounded-full transition-colors"
                aria-label="Suche"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Cart */}
              <button
                onClick={openDrawer}
                className="relative p-2 text-stone-600 hover:text-brand-700 hover:bg-rose-50/60 rounded-full transition-colors"
                aria-label="Warenkorb"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-scale-in shadow-xs">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 text-stone-600 hover:text-brand-700 rounded-full transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Search Overlay */}
        {searchOpen && (
          <div className="border-t border-brand-100/80 bg-white/90 backdrop-blur-md animate-scale-in">
            <form onSubmit={handleSearch} className="max-w-7xl mx-auto px-4 py-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Produkte suchen..."
                  className="w-full bg-surface-900 border border-brand-200/80 rounded-2xl px-4 py-3 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-brand-600"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <>
            <div className="fixed inset-0 bg-stone-900/30 backdrop-blur-xs z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
            <div className="md:hidden fixed right-0 top-0 h-full w-72 bg-white/95 backdrop-blur-xl border-l border-brand-100 shadow-2xl z-50 animate-slide-in-right">
              <div className="flex justify-between items-center p-4 border-b border-brand-100/60">
                <span className="font-display font-semibold text-stone-800">Menü</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-stone-500 hover:text-stone-800">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="px-4 py-3 space-y-1">
                {[
                  { href: "/", label: "Startseite" },
                  { href: "/shop", label: "Alle Produkte" },
                  { href: "/shop?category=home-living", label: "Home & Living" },
                  { href: "/shop?category=haustiere", label: "Haustiere" },
                  { href: "/shop?category=lifestyle-fitness", label: "Lifestyle & Fitness" },
                  { href: "/shop?category=buero-organisation", label: "Büro & Organisation" },
                  { href: "/shop?category=elektronik-zubehoer", label: "Elektronik-Zubehör" },
                  { href: "/blog", label: "Blog" },
                  { href: "/kontakt", label: "Kontakt" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-3 py-2.5 text-stone-700 hover:text-brand-700 hover:bg-brand-50/60 rounded-xl text-sm font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
