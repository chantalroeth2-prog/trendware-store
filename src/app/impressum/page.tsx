import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Impressum",
};

export default function ImpressumPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-600">
          Startseite
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">Impressum</span>
      </nav>

      <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">Impressum</h1>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            Angaben gemäß &sect; 5 TMG
          </h2>
          <p className="text-gray-600">
            Chantal Röth
            <br />
            Im Sennteich 16
            <br />
            68199 Mannheim
            <br />
            Deutschland
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            Kontakt
          </h2>
          <p className="text-gray-600">
            <span className="text-xs text-gray-400">Tel.: +49 157 85071081</span>
            <br />
            E-Mail:{" "}
            <a href="mailto:kontakt.trendware@gmail.com" className="text-brand-600 underline">
              kontakt.trendware@gmail.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            Umsatzsteuer-ID
          </h2>
          <p className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700 text-sm">
            <strong>Hinweis:</strong> Umsatzsteuer-Identifikationsnummer gemäß
            &sect; 27a Umsatzsteuergesetz wird nach Erteilung hier ergänzt.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            Verantwortlich für den Inhalt nach &sect; 55 Abs. 2 RStV
          </h2>
          <p className="text-gray-600">
            Chantal Röth
            <br />
            Im Sennteich 16
            <br />
            68199 Mannheim
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            EU-Streitschlichtung
          </h2>
          <p className="text-gray-600">
            Die Europäische Kommission stellt eine Plattform zur
            Online-Streitbeilegung (OS) bereit:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 underline"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            .
          </p>
          <p className="text-gray-600 mt-2">
            Wir sind nicht bereit oder verpflichtet, an
            Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
            teilzunehmen.
          </p>
        </section>
      </div>
    </div>
  );
}
