import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AGB",
};

export default function AGBPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-600">
          Startseite
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">AGB</span>
      </nav>

      <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">
        Allgemeine Gesch&auml;ftsbedingungen
      </h1>

      <div className="space-y-6 text-sm leading-relaxed text-gray-600">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            &sect; 1 Geltungsbereich
          </h2>
          <p>
            (1) Diese Allgemeinen Gesch&auml;ftsbedingungen (AGB) gelten f&uuml;r alle
            Bestellungen, die Verbraucher und Unternehmer (&bdquo;Kunde&ldquo;) &uuml;ber den
            Online-Shop von TrendWare, betrieben von Chantal R&ouml;th, Im Sennteich 16,
            68189 Mannheim (&bdquo;Verk&auml;uferin&ldquo;), abschlie&szlig;en.
          </p>
          <p className="mt-2">
            (2) Verbraucher im Sinne dieser AGB ist jede nat&uuml;rliche Person, die
            ein Rechtsgesch&auml;ft zu Zwecken abschlie&szlig;t, die &uuml;berwiegend weder ihrer
            gewerblichen noch ihrer selbstst&auml;ndigen beruflichen T&auml;tigkeit
            zugerechnet werden k&ouml;nnen (&sect; 13 BGB).
          </p>
          <p className="mt-2">
            (3) Es gelten die AGB in der zum Zeitpunkt der Bestellung g&uuml;ltigen
            Fassung. Abweichende Bedingungen des Kunden werden nicht anerkannt,
            es sei denn, die Verk&auml;uferin stimmt deren Geltung ausdr&uuml;cklich zu.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            &sect; 2 Vertragsschluss
          </h2>
          <p>
            (1) Die Darstellung der Produkte im Online-Shop stellt kein
            rechtlich bindendes Angebot, sondern eine Aufforderung zur
            Bestellung (invitatio ad offerendum) dar.
          </p>
          <p className="mt-2">
            (2) Durch Anklicken des Bestell-Buttons gibt der Kunde ein
            verbindliches Angebot zum Kauf der im Warenkorb befindlichen
            Produkte ab. Mit dem Abschluss des Bestellvorgangs gibt der Kunde
            sein verbindliches Angebot ab.
          </p>
          <p className="mt-2">
            (3) Die Verk&auml;uferin best&auml;tigt den Eingang der Bestellung per
            automatisierter E-Mail (Bestellbest&auml;tigung). Diese
            Bestellbest&auml;tigung stellt die Annahme des Angebots dar. Der
            Kaufvertrag kommt mit Zugang der Bestellbest&auml;tigung beim Kunden
            zustande.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            &sect; 3 Preise und Zahlung
          </h2>
          <p>
            (1) Alle angegebenen Preise sind Endpreise und enthalten die
            gesetzliche Umsatzsteuer. Zus&auml;tzlich anfallende Versandkosten
            werden vor Abschluss der Bestellung gesondert ausgewiesen.
          </p>
          <p className="mt-2">
            (2) F&uuml;r jede Bestellung fallen Versandkosten an. Der Standardversand
            kostet 4,99&nbsp;&euro; nach Deutschland und 6,99&nbsp;&euro; nach Frankreich.
            Der endg&uuml;ltige Betrag wird vor Abgabe der Bestellung angezeigt.
          </p>
          <p className="mt-2">
            (3) Folgende Zahlungsarten stehen zur Verf&uuml;gung:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Kreditkarte (Visa, Mastercard, AMEX) &ndash; &uuml;ber Stripe</li>
            <li>PayPal</li>
          </ul>
          <p className="mt-2">
            (4) Die Zahlung ist sofort mit Bestellabschluss f&auml;llig.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            &sect; 4 Lieferung und Versand
          </h2>
          <p>
            (1) Die Lieferung erfolgt an die vom Kunden angegebene
            Lieferadresse. Wir liefern nach Deutschland und Frankreich.
          </p>
          <p className="mt-2">
            (2) Es gilt die beim konkreten Produkt und unmittelbar vor der
            Zahlung angezeigte Lieferzeit. Nicht als bestellbar gekennzeichnete
            Produkte k&ouml;nnen nicht bestellt werden.
          </p>
          <p className="mt-2">
            (3) Die Gefahr des zuf&auml;lligen Untergangs und der zuf&auml;lligen
            Verschlechterung der Ware geht bei Verbrauchern mit &Uuml;bergabe
            der Ware an den Kunden &uuml;ber.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            &sect; 5 Eigentumsvorbehalt
          </h2>
          <p>
            Die gelieferte Ware bleibt bis zur vollst&auml;ndigen Bezahlung
            Eigentum der Verk&auml;uferin.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            &sect; 6 Widerrufsrecht
          </h2>
          <p>
            Verbrauchern steht ein gesetzliches Widerrufsrecht zu. Die
            Einzelheiten ergeben sich aus der{" "}
            <Link href="/widerruf" className="text-brand-600 underline">
              Widerrufsbelehrung
            </Link>,
            die Bestandteil dieser AGB ist.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            &sect; 7 Gew&auml;hrleistung
          </h2>
          <p>
            (1) Es gelten die gesetzlichen Gew&auml;hrleistungsrechte.
          </p>
          <p className="mt-2">
            (2) Die Verj&auml;hrungsfrist f&uuml;r Gew&auml;hrleistungsanspr&uuml;che
            betr&auml;gt bei Verbrauchern zwei Jahre ab Ablieferung der Ware.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            &sect; 8 Haftung
          </h2>
          <p>
            (1) Die Verk&auml;uferin haftet unbeschr&auml;nkt f&uuml;r Vorsatz und grobe
            Fahrl&auml;ssigkeit sowie nach dem Produkthaftungsgesetz.
          </p>
          <p className="mt-2">
            (2) Bei leichter Fahrl&auml;ssigkeit haftet die Verk&auml;uferin nur bei
            Verletzung wesentlicher Vertragspflichten (Kardinalpflichten),
            deren Erf&uuml;llung die ordnungsgem&auml;&szlig;e Durchf&uuml;hrung des Vertrags
            &uuml;berhaupt erst erm&ouml;glicht. In diesem Fall ist die Haftung auf den
            vorhersehbaren, vertragstypischen Schaden begrenzt.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            &sect; 9 Streitbeilegung
          </h2>
          <p>
            Wir sind nicht bereit oder verpflichtet, an
            Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
            teilzunehmen.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            &sect; 10 Schlussbestimmungen
          </h2>
          <p>
            (1) Es gilt das Recht der Bundesrepublik Deutschland unter
            Ausschluss des UN-Kaufrechts. Bei Verbrauchern gilt diese
            Rechtswahl nur insoweit, als nicht der durch zwingende
            Bestimmungen des Rechts des Staates des gew&ouml;hnlichen Aufenthalts
            des Verbrauchers gew&auml;hrte Schutz entzogen wird.
          </p>
          <p className="mt-2">
            (2) Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder
            werden, so wird die Wirksamkeit der &uuml;brigen Bestimmungen hiervon
            nicht ber&uuml;hrt.
          </p>
        </section>

        <p className="text-xs text-gray-600 mt-8">Stand: September 2026</p>
      </div>
    </div>
  );
}
