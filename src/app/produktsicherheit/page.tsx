import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Produktsicherheit & GPSR" };
export default function ProductSafetyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-6"><Link href="/">Startseite</Link><span className="mx-2">/</span>Produktsicherheit</nav>
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">Produktsicherheit &amp; GPSR</h1>
      <div className="space-y-6 text-sm leading-relaxed text-gray-600">
        <p>Trendware veröffentlicht produktspezifische Sicherheits- und Herstellerinformationen direkt beim jeweiligen Produkt. Ein Produkt wird technisch erst zur Bestellung freigeschaltet, wenn die erforderlichen Daten vollständig hinterlegt und geprüft wurden.</p>
        <section><h2 className="text-lg font-semibold text-gray-900 mb-3">Pflichtangaben je Produkt</h2><ul className="list-disc pl-5 space-y-2"><li>Name sowie postalische und elektronische Adresse des Herstellers</li><li>bei Herstellern außerhalb der EU: Name sowie postalische und elektronische Adresse der verantwortlichen Person in der EU</li><li>eindeutige Produkt-, Modell- oder Variantenkennung</li><li>relevante Warn- und Sicherheitsinformationen in deutscher Sprache</li><li>bei Elektronik zusätzlich die für das Produkt einschlägigen Konformitäts-, Batterie- und Entsorgungsinformationen</li></ul></section>
        <section><h2 className="text-lg font-semibold text-gray-900 mb-3">Sicherheitsanfragen</h2><p>Bitte nennen Sie bei einer Anfrage Produktname, Bestellnummer und – soweit vorhanden – die Kennzeichnung auf Produkt oder Verpackung. Kontakt: <a className="text-brand-600 underline" href="mailto:kontakt.trendware@gmail.com">kontakt.trendware@gmail.com</a>.</p></section>
        <p>Produkte ohne vollständige Pflichtangaben werden als „Derzeit nicht bestellbar“ angezeigt und vom Checkout abgewiesen.</p>
        <p className="text-xs text-gray-500">Stand: September 2026</p>
      </div>
    </div>
  );
}
