import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Versand & Zahlung",
};

export default function VersandPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-600">
          Startseite
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">Versand &amp; Zahlung</span>
      </nav>

      <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">
        Versand &amp; Zahlung
      </h1>

      <div className="space-y-8 text-sm leading-relaxed text-gray-600">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Versandkosten
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Land
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Versandkosten
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Kostenloser Versand ab
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3">Deutschland</td>
                  <td className="px-4 py-3">4,99&nbsp;&euro;</td>
                  <td className="px-4 py-3">39,00&nbsp;&euro;</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Österreich</td>
                  <td className="px-4 py-3">6,99&nbsp;&euro;</td>
                  <td className="px-4 py-3">49,00&nbsp;&euro;</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Schweiz</td>
                  <td className="px-4 py-3">9,99&nbsp;&euro;</td>
                  <td className="px-4 py-3">59,00&nbsp;&euro;</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            Alle Preise inkl. MwSt. Die genauen Versandkosten werden dir vor
            Abschluss der Bestellung angezeigt.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Lieferzeiten
          </h2>
          <p>
            Die Lieferzeit beträgt in der Regel <strong className="text-gray-700">3–7 Werktage</strong>{" "}
            innerhalb Deutschlands. Für Österreich und die Schweiz kann die
            Lieferung 5–10 Werktage in Anspruch nehmen.
          </p>
          <p className="mt-2">
            Nach Versand erhältst du eine Bestätigung mit Tracking-Nummer per
            E-Mail.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Zahlungsarten
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Visa", "Mastercard", "PayPal"].map((method) => (
              <div
                key={method}
                className="flex items-center justify-center p-4 border border-gray-200 rounded-lg bg-gray-100"
              >
                <span className="font-medium text-gray-600">{method}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-500">
            Alle Zahlungen sind SSL-verschl&uuml;sselt und werden &uuml;ber die
            gesicherten Systeme der jeweiligen Anbieter abgewickelt.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Rückgabe &amp; Umtausch
          </h2>
          <p>
            Du hast 30 Tage Zeit, Artikel zurückzugeben. Weitere Informationen
            findest du in unserer{" "}
            <Link href="/widerruf" className="text-brand-600 underline">
              Widerrufsbelehrung
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
