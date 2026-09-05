import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Versand, Zahlung & Rückgabe" };
export default function VersandPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-6"><Link href="/">Startseite</Link><span className="mx-2">/</span>Versand &amp; Zahlung</nav>
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">Versand, Zahlung &amp; Rückgabe</h1>
      <div className="space-y-8 text-sm leading-relaxed text-gray-600">
        <section><h2 className="text-lg font-semibold text-gray-900 mb-3">Versandgebiete und Versandkosten</h2><div className="overflow-x-auto"><table className="min-w-full border border-gray-200"><thead className="bg-gray-100"><tr><th className="p-3 text-left">Lieferland</th><th className="p-3 text-left">Standardversand je Bestellung</th></tr></thead><tbody><tr className="border-t"><td className="p-3">Deutschland</td><td className="p-3">4,99 €</td></tr><tr className="border-t"><td className="p-3">Frankreich</td><td className="p-3">6,99 €</td></tr></tbody></table></div><p className="mt-3"><strong>Es gibt keinen kostenlosen Hinversand.</strong> Die endgültigen Versandkosten werden vor Abgabe der zahlungspflichtigen Bestellung angezeigt.</p></section>
        <section><h2 className="text-lg font-semibold text-gray-900 mb-3">Lieferzeit und Verfügbarkeit</h2><p>Es gilt ausschließlich die Lieferzeit, die beim konkret ausgewählten Produkt und unmittelbar vor der Zahlung angezeigt wird. Ein Produkt kann nur bestellt werden, wenn Lieferantenbestand, konkrete Variante und Versandoption aktuell bestätigt wurden. Teil- und Direktlieferungen durch den Lieferanten sind möglich, sofern dies für Sie zumutbar ist.</p></section>
        <section><h2 className="text-lg font-semibold text-gray-900 mb-3">Sendungsverfolgung</h2><p>Wenn der gewählte Versanddienst eine Sendungsverfolgung anbietet, erhalten Sie die Tracking-Daten nach Übergabe an den Versanddienstleister per E-Mail.</p></section>
        <section><h2 className="text-lg font-semibold text-gray-900 mb-3">Zahlungsarten</h2><p>Im Checkout werden nur tatsächlich aktivierte Zahlungsarten angezeigt. Vorgesehen sind Kartenzahlungen über Stripe und PayPal. Eine Zahlungsart ist erst verfügbar, wenn ihre Live-Anbindung erfolgreich geprüft wurde.</p></section>
        <section><h2 className="text-lg font-semibold text-gray-900 mb-3">Rückgabe</h2><p>Trendware trägt die unmittelbaren Rücksendekosten. Rücksendeadresse: Trendware – Chantal Röth, Im Sennteich 16, 68189 Mannheim, Deutschland. Bitte fordern Sie vor der Rücksendung ein kostenfreies Rücksendeetikett an. Einzelheiten finden Sie in der <Link className="text-brand-600 underline" href="/widerruf">Widerrufsbelehrung</Link>.</p></section>
        <p className="text-xs text-gray-500">Stand: September 2026</p>
      </div>
    </div>
  );
}
