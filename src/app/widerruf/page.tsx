import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Widerruf & Rückgabe" };
const Address = () => <p className="bg-gray-100 border border-gray-200 rounded-lg p-4">Trendware – Chantal Röth<br />Im Sennteich 16<br />68189 Mannheim<br />Deutschland<br />E-Mail: kontakt.trendware@gmail.com</p>;

export default function WiderrufPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-6"><Link href="/">Startseite</Link><span className="mx-2">/</span>Widerruf &amp; Rückgabe</nav>
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">Widerrufsbelehrung</h1>
      <div className="space-y-7 text-sm leading-relaxed text-gray-600">
        <section><h2 className="text-lg font-semibold text-gray-900 mb-3">Widerrufsrecht</h2><p>Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Frist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht Beförderer ist, die Waren in Besitz genommen haben beziehungsweise hat. Bei mehreren Waren aus einer einheitlichen Bestellung, die getrennt geliefert werden, beginnt die Frist mit Erhalt der letzten Ware.</p></section>
        <section><h2 className="text-lg font-semibold text-gray-900 mb-3">Widerruf erklären</h2><p>Informieren Sie uns mittels einer eindeutigen Erklärung, beispielsweise per Brief oder E-Mail, über Ihren Entschluss:</p><Address /><p className="mt-3">Sie können das unten stehende Muster verwenden; vorgeschrieben ist dies nicht. Zur Fristwahrung genügt die rechtzeitige Absendung der Erklärung.</p></section>
        <section><h2 className="text-lg font-semibold text-gray-900 mb-3">Folgen des Widerrufs</h2><p>Wir erstatten alle von Ihnen erhaltenen Zahlungen einschließlich der Kosten unserer günstigsten Standardlieferung unverzüglich, spätestens binnen vierzehn Tagen ab Eingang des Widerrufs. Mehrkosten einer von Ihnen gewählten teureren Versandart werden nicht erstattet. Wir verwenden dasselbe Zahlungsmittel wie bei der ursprünglichen Zahlung, sofern nichts anderes vereinbart wurde.</p><p className="mt-3">Wir dürfen die Erstattung verweigern, bis die Ware zurückerhalten wurde oder Sie den Versand nachgewiesen haben, je nachdem, welches Ereignis früher eintritt. Die Ware ist spätestens binnen vierzehn Tagen nach Erklärung des Widerrufs zurückzusenden.</p><p className="mt-3"><strong>Trendware trägt die unmittelbaren Kosten der Rücksendung.</strong> Kontaktieren Sie uns vor dem Versand per E-Mail, damit wir ein kostenfreies Rücksendeetikett oder eine gleichwertige Erstattung bereitstellen können.</p><p className="mt-3">Für einen Wertverlust müssen Sie nur aufkommen, wenn dieser auf einen Umgang zurückzuführen ist, der zur Prüfung von Beschaffenheit, Eigenschaften und Funktionsweise nicht notwendig war.</p></section>
        <section><h2 className="text-lg font-semibold text-gray-900 mb-3">Freiwillige 30-Tage-Rückgabe</h2><p>Zusätzlich zum gesetzlichen Widerrufsrecht können Sie Waren bis 30 Tage nach Erhalt zurückgeben. Ihre gesetzlichen Rechte werden dadurch nicht eingeschränkt. Für die freiwillige Rückgabe müssen die Waren vollständig sein und dürfen nur in dem Umfang benutzt worden sein, der zur üblichen Prüfung erforderlich ist. Die gesetzlichen Ausnahmen vom Widerrufsrecht gelten entsprechend. Auch bei dieser freiwilligen Rückgabe übernimmt Trendware die unmittelbaren Rücksendekosten.</p></section>
        <section><h2 className="text-lg font-semibold text-gray-900 mb-3">Muster-Widerrufsformular</h2><div className="bg-gray-100 border border-gray-200 rounded-lg p-5 space-y-2"><p>An Trendware – Chantal Röth, Im Sennteich 16, 68189 Mannheim, Deutschland, kontakt.trendware@gmail.com</p><p>Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren:</p><p>Bestellt am (*) / erhalten am (*):</p><p>Name und Anschrift des/der Verbraucher(s):</p><p>Datum und Unterschrift (nur bei Mitteilung auf Papier):</p><p className="text-xs">(*) Unzutreffendes streichen.</p></div></section>
        <p className="text-xs text-gray-500">Stand: September 2026</p>
      </div>
    </div>
  );
}
