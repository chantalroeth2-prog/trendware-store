import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-stone-900 border-t border-brand-200/20 text-stone-300 relative overflow-hidden">
      {/* Background warm glowing accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <span className="text-2xl font-display tracking-wide text-white">
              trend<span className="font-semibold text-brand-400">ware</span>
            </span>
            <p className="mt-3 text-sm text-stone-400 leading-relaxed">
              Smarte Produkte, die deinen Alltag schöner und gemütlicher machen. Handverlesene Qualität
              für dein Wohlfühlzuhause, Büro &amp; Lifestyle.
            </p>
            <p className="mt-3 text-sm text-stone-300">
              <a href="mailto:kontakt.trendware@gmail.com" className="hover:text-brand-300 transition-colors">
                kontakt.trendware@gmail.com
              </a>
            </p>
            {/* Social */}
            <div className="flex gap-3 mt-4">
              <a href="https://www.instagram.com/trendware.shop/" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-2xl bg-stone-800/80 border border-stone-700/60 hover:bg-stone-700 hover:border-brand-400/50 transition-all" aria-label="Instagram">
                <svg className="w-4 h-4 text-brand-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/992639497268300" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-2xl bg-stone-800/80 border border-stone-700/60 hover:bg-stone-700 hover:border-brand-400/50 transition-all" aria-label="Facebook">
                <svg className="w-4 h-4 text-brand-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
            <p className="text-[10px] text-stone-500 mt-1.5">@trendware.shop</p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-semibold text-brand-300 uppercase tracking-wider mb-4 font-display">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shop" className="hover:text-white transition-colors">Alle Produkte</Link></li>
              <li><Link href="/shop?category=home-living" className="hover:text-white transition-colors">Home &amp; Living</Link></li>
              <li><Link href="/shop?category=haustiere" className="hover:text-white transition-colors">Haustiere</Link></li>
              <li><Link href="/shop?category=lifestyle-fitness" className="hover:text-white transition-colors">Lifestyle &amp; Fitness</Link></li>
              <li><Link href="/shop?category=buero-organisation" className="hover:text-white transition-colors">Büro &amp; Organisation</Link></li>
              <li><Link href="/shop?category=elektronik-zubehoer" className="hover:text-white transition-colors">Elektronik-Zubehör</Link></li>
            </ul>
          </div>

          {/* Kundenservice */}
          <div>
            <h3 className="text-xs font-semibold text-brand-300 uppercase tracking-wider mb-4 font-display">Kundenservice</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/versand" className="hover:text-white transition-colors">Versand &amp; Lieferung</Link></li>
              <li><Link href="/widerruf" className="hover:text-white transition-colors">Widerruf &amp; Rückgabe</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog &ndash; Tipps &amp; Trends</Link></li>
              <li><Link href="/kontakt" className="hover:text-white transition-colors">Kontakt</Link></li>
              <li>
                <a href="mailto:kontakt.trendware@gmail.com" className="hover:text-white transition-colors">
                  kontakt.trendware@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Rechtliches */}
          <div>
            <h3 className="text-xs font-semibold text-brand-300 uppercase tracking-wider mb-4 font-display">Rechtliches</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/impressum" className="hover:text-white transition-colors">Impressum</Link></li>
              <li><Link href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</Link></li>
              <li><Link href="/agb" className="hover:text-white transition-colors">AGB</Link></li>
              <li><Link href="/widerruf" className="hover:text-white transition-colors">Widerrufsbelehrung</Link></li>
            </ul>
          </div>
        </div>

        {/* Payment & Copyright */}
        <div className="mt-12 pt-8 border-t border-stone-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-stone-400 space-y-1">
              <p>&copy; {new Date().getFullYear()} TrendWare. Alle Rechte vorbehalten.</p>
              <p>
                Produkttexte und Kundenstimmen wurden mit KI-Unterstützung erstellt
                und redaktionell geprüft.{" "}
                <Link href="/datenschutz" className="underline hover:text-stone-300">Mehr erfahren</Link>
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {/* Visa */}
              <span className="px-3 py-1.5 border border-stone-800 rounded-xl bg-stone-800/40">
                <svg className="h-5 w-auto" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="48" height="32" rx="4" fill="#1A1F71" fillOpacity="0.3"/>
                  <path d="M19.5 21H16.5L18.5 11H21.5L19.5 21Z" fill="#9CA3AF"/>
                  <path d="M28 11L25.2 18L24.9 16.5L24 12C24 12 23.9 11 22.5 11H18L17.9 11.3C17.9 11.3 19.5 11.7 21.3 12.8L24 21H27.2L31.5 11H28Z" fill="#9CA3AF"/>
                  <path d="M33 11L30 21H33L36 11H33Z" fill="#9CA3AF"/>
                </svg>
              </span>
              {/* Mastercard */}
              <span className="px-3 py-1.5 border border-stone-800 rounded-xl bg-stone-800/40">
                <svg className="h-5 w-auto" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="48" height="32" rx="4" fill="#1A1A2E" fillOpacity="0.3"/>
                  <circle cx="20" cy="16" r="8" fill="#EB001B" fillOpacity="0.4"/>
                  <circle cx="28" cy="16" r="8" fill="#F79E1B" fillOpacity="0.4"/>
                  <path d="M24 10.5C25.8 12 27 14.1 27 16.5C27 18.9 25.8 21 24 22.5C22.2 21 21 18.9 21 16.5C21 14.1 22.2 12 24 10.5Z" fill="#FF5F00" fillOpacity="0.5"/>
                </svg>
              </span>
              {/* PayPal */}
              <span className="px-3 py-1.5 border border-stone-800 rounded-xl bg-stone-800/40">
                <svg className="h-5 w-auto" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="48" height="32" rx="4" fill="#003087" fillOpacity="0.2"/>
                  <text x="10" y="20" fontFamily="Arial" fontSize="10" fontWeight="bold" fill="#9CA3AF">Pay</text>
                  <text x="27" y="20" fontFamily="Arial" fontSize="10" fontWeight="bold" fill="#6B7280">Pal</text>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
