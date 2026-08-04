import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Widerrufsbelehrung",
};

export default function WiderrufPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-600">
          Startseite
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">Widerrufsbelehrung</span>
      </nav>

      <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">
        Widerrufsbelehrung
      </h1>

      <div className="space-y-6 text-sm leading-relaxed text-gray-600">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            Widerrufsrecht
          </h2>
          <p>
            Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen
            diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn
            Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter,
            der nicht der Beförderer ist, die Waren in Besitz genommen haben
            bzw. hat.
          </p>
          <p>
            Um Ihr Widerrufsrecht auszuüben, müssen Sie uns
          </p>
          <p className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-gray-600">
            Chantal Röth
            <br />
            Im Sennteich 16
            <br />
            68199 Mannheim
            <br />
            Deutschland
            <br />
            <br />
            E-Mail:{" "}
            <a href="mailto:kontakt.trendware@gmail.com" className="text-brand-600 underline">
              kontakt.trendware@gmail.com
            </a>
          </p>
          <p>
            mittels einer eindeutigen Erklärung (z.B. ein mit der Post
            versandter Brief oder eine E-Mail) über Ihren Entschluss, diesen
            Vertrag zu widerrufen, informieren. Sie können dafür das
            beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht
            vorgeschrieben ist.
          </p>
          <p>
            Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die
            Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der
            Widerrufsfrist absenden.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            Folgen des Widerrufs
          </h2>
          <p>
            Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen,
            die wir von Ihnen erhalten haben, einschließlich der Lieferkosten
            (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben,
            dass Sie eine andere Art der Lieferung als die von uns angebotene,
            günstigste Standardlieferung gewählt haben), unverzüglich und
            spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem
            die Mitteilung über Ihren Widerruf dieses Vertrags bei uns
            eingegangen ist.
          </p>
          <p>
            Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das
            Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei
            denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in
            keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte
            berechnet.
          </p>
          <p>
            Wir können die Rückzahlung verweigern, bis wir die Waren wieder
            zurückerhalten haben oder bis Sie den Nachweis erbracht haben, dass
            Sie die Waren zurückgesandt haben, je nachdem, welches der frühere
            Zeitpunkt ist.
          </p>
          <p>
            Sie haben die Waren unverzüglich und in jedem Fall spätestens
            binnen vierzehn Tagen ab dem Tag, an dem Sie uns über den Widerruf
            dieses Vertrags unterrichten, an uns zurückzusenden oder zu
            übergeben. Die Frist ist gewahrt, wenn Sie die Waren vor Ablauf der
            Frist von vierzehn Tagen absenden.
          </p>
          <p>
            Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.
          </p>
          <p>
            Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen,
            wenn dieser Wertverlust auf einen zur Prüfung der Beschaffenheit,
            Eigenschaften und Funktionsweise der Waren nicht notwendigen Umgang
            mit ihnen zurückzuführen ist.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            Muster-Widerrufsformular
          </h2>
          <div className="bg-gray-100 border border-gray-200 rounded-lg p-6">
            <p className="mb-3">
              (Wenn Sie den Vertrag widerrufen wollen, füllen Sie bitte dieses
              Formular aus und senden Sie es zurück.)
            </p>
            <p className="mb-2">
              An:
              <br />
              Chantal Röth
              <br />
              Im Sennteich 16
              <br />
              68199 Mannheim
              <br />
              E-Mail: kontakt.trendware@gmail.com
            </p>
            <p className="mb-2">
              Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*)
              abgeschlossenen Vertrag über den Kauf der folgenden Waren
              (*)/die Erbringung der folgenden Dienstleistung (*):
            </p>
            <p className="mb-2">Bestellt am (*)/erhalten am (*):</p>
            <p className="mb-2">Name des/der Verbraucher(s):</p>
            <p className="mb-2">Anschrift des/der Verbraucher(s):</p>
            <p className="mb-2">
              Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf
              Papier):
            </p>
            <p>Datum:</p>
            <p className="mt-3 text-xs text-gray-600">
              (*) Unzutreffendes streichen.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
