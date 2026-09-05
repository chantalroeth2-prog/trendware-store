import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Impressum" };

export default function ImpressumPage() {
  const vatId = process.env.NEXT_PUBLIC_VAT_ID;
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-6"><Link href="/">Startseite</Link><span className="mx-2">/</span>Impressum</nav>
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">Impressum</h1>
      <div className="space-y-7 text-sm leading-relaxed text-gray-600">
        <section><h2 className="text-lg font-semibold text-gray-900 mb-3">Angaben gemäß § 5 DDG</h2><p><strong>Trendware</strong><br />Inhaberin: Chantal Röth<br />Im Sennteich 16<br />68189 Mannheim<br />Deutschland</p></section>
        <section><h2 className="text-lg font-semibold text-gray-900 mb-3">Kontakt</h2><p>E-Mail: <a className="text-brand-600 underline" href="mailto:kontakt.trendware@gmail.com">kontakt.trendware@gmail.com</a></p></section>
        {vatId && <section><h2 className="text-lg font-semibold text-gray-900 mb-3">Umsatzsteuer-Identifikationsnummer</h2><p>USt-IdNr. gemäß § 27a UStG: {vatId}</p></section>}
        <section><h2 className="text-lg font-semibold text-gray-900 mb-3">Verantwortlich für journalistisch-redaktionelle Inhalte</h2><p>Chantal Röth, Anschrift wie oben.</p></section>
        <section><h2 className="text-lg font-semibold text-gray-900 mb-3">Verbraucherstreitbeilegung</h2><p>Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p></section>
        <p className="text-xs text-gray-500">Stand: September 2026</p>
      </div>
    </div>
  );
}
