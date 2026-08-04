import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
};

export default function DatenschutzPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-600">
          Startseite
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">Datenschutz</span>
      </nav>

      <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">
        Datenschutzerkl&auml;rung
      </h1>

      <div className="space-y-6 text-sm leading-relaxed text-gray-600">
        {/* 1. Datenschutz auf einen Blick */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            1. Datenschutz auf einen Blick
          </h2>
          <h3 className="text-base font-semibold text-gray-700 mt-4 mb-2">
            Allgemeine Hinweise
          </h3>
          <p>
            Die folgenden Hinweise geben einen einfachen &Uuml;berblick dar&uuml;ber,
            was mit Ihren personenbezogenen Daten passiert, wenn Sie diese
            Website besuchen. Personenbezogene Daten sind alle Daten, mit denen
            Sie pers&ouml;nlich identifiziert werden k&ouml;nnen. Ausf&uuml;hrliche Informationen
            zum Thema Datenschutz entnehmen Sie unserer nachfolgenden
            Datenschutzerkl&auml;rung.
          </p>
          <h3 className="text-base font-semibold text-gray-700 mt-4 mb-2">
            Wer ist verantwortlich f&uuml;r die Datenerfassung auf dieser Website?
          </h3>
          <p>
            Die Datenverarbeitung auf dieser Website erfolgt durch die
            Websitebetreiberin. Deren Kontaktdaten k&ouml;nnen Sie dem Abschnitt
            &bdquo;Verantwortliche Stelle&ldquo; in dieser Datenschutzerkl&auml;rung entnehmen.
          </p>
        </section>

        {/* 2. Verantwortliche Stelle */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            2. Verantwortliche Stelle
          </h2>
          <p>
            Verantwortlich f&uuml;r die Datenverarbeitung auf dieser Website ist:
          </p>
          <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-gray-600 mt-2">
            <p>
              Chantal R&ouml;th<br />
              Im Sennteich 16<br />
              68199 Mannheim<br /><br />
              E-Mail:{" "}
              <a href="mailto:kontakt.trendware@gmail.com" className="text-brand-600 underline">
                kontakt.trendware@gmail.com
              </a>
            </p>
          </div>
          <p className="mt-2">
            Die verantwortliche Stelle entscheidet allein oder gemeinsam mit
            anderen &uuml;ber die Zwecke und Mittel der Verarbeitung von
            personenbezogenen Daten (z.&thinsp;B. Namen, E-Mail-Adressen o.&thinsp;&Auml;.).
          </p>
        </section>

        {/* 3. Hosting */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            3. Hosting
          </h2>
          <p>
            Diese Website wird bei <strong className="text-gray-700">Vercel Inc.</strong>{" "}
            (340 S Lemon Ave #4133, Walnut, CA 91789, USA) gehostet. Wenn Sie
            unsere Website besuchen, erhebt Vercel automatisch Informationen in
            sogenannten Server-Log-Dateien, die Ihr Browser automatisch
            &uuml;bermittelt. Dies sind:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Browsertyp und -version</li>
            <li>Verwendetes Betriebssystem</li>
            <li>Referrer-URL</li>
            <li>Hostname des zugreifenden Rechners</li>
            <li>Uhrzeit der Serveranfrage</li>
            <li>IP-Adresse</li>
          </ul>
          <p className="mt-2">
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
            Interesse an einem sicheren und effizienten Betrieb der Website).
            Wir haben mit Vercel einen Vertrag zur Auftragsverarbeitung (DPA)
            geschlossen. Da Vercel Daten in den USA verarbeitet, erfolgt die
            &Uuml;bermittlung auf Grundlage von EU-Standardvertragsklauseln.
          </p>
          <p className="mt-2">
            Datenschutzerkl&auml;rung von Vercel:{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 underline"
            >
              vercel.com/legal/privacy-policy
            </a>
          </p>
        </section>

        {/* 4. Datenerfassung auf dieser Website */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            4. Datenerfassung auf dieser Website
          </h2>

          <h3 className="text-base font-semibold text-gray-700 mt-4 mb-2">
            Cookies und lokale Speicherung
          </h3>
          <p>
            Unsere Website verwendet <strong className="text-gray-700">keine Tracking-Cookies</strong>{" "}
            und setzt keine Analyse-Tools wie Google Analytics ein. Wir verwenden
            ausschlie&szlig;lich technisch notwendige Speicherungen:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>
              <strong className="text-gray-700">Warenkorb (localStorage):</strong>{" "}
              Ihre Warenkorb-Daten werden ausschlie&szlig;lich lokal in Ihrem
              Browser gespeichert und nicht an unsere Server &uuml;bermittelt.
              Diese Daten verbleiben auf Ihrem Ger&auml;t, bis Sie sie l&ouml;schen.
            </li>
          </ul>
          <p className="mt-2">
            F&uuml;r technisch notwendige Cookies bzw. localStorage ist keine
            Einwilligung erforderlich (Art. 6 Abs. 1 lit. f DSGVO,
            &sect; 25 Abs. 2 TDDDG).
          </p>

          <h3 className="text-base font-semibold text-gray-700 mt-4 mb-2">
            Kontaktformular
          </h3>
          <p>
            Wenn Sie uns &uuml;ber unser Kontaktformular kontaktieren, werden
            Ihre Angaben (Name, E-Mail-Adresse, Nachricht) zur Bearbeitung
            Ihrer Anfrage verarbeitet. Die Weiterleitung der Nachricht erfolgt
            &uuml;ber den E-Mail-Dienst{" "}
            <strong className="text-gray-700">Resend Inc.</strong>{" "}
            (Resend Inc., 2261 Market St #5039, San Francisco, CA 94114, USA).
          </p>
          <p className="mt-2">
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche
            Ma&szlig;nahmen) bzw. Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
            Interesse an der Beantwortung von Anfragen). Die Daten werden
            gel&ouml;scht, sobald Ihre Anfrage abschlie&szlig;end bearbeitet ist.
          </p>

          <h3 className="text-base font-semibold text-gray-700 mt-4 mb-2">
            Newsletter-Anmeldung
          </h3>
          <p>
            Wenn Sie sich f&uuml;r unseren Newsletter anmelden, speichern wir
            Ihre E-Mail-Adresse zum Zweck des Newsletter-Versands. Rechtsgrundlage
            ist Ihre Einwilligung gem. Art. 6 Abs. 1 lit. a DSGVO. Sie k&ouml;nnen
            Ihre Einwilligung jederzeit widerrufen, z.&thinsp;B. &uuml;ber den Abmeldelink
            in jeder Newsletter-E-Mail oder per E-Mail an{" "}
            <a href="mailto:kontakt.trendware@gmail.com" className="text-brand-600 underline">
              kontakt.trendware@gmail.com
            </a>.
          </p>
        </section>

        {/* 5. Bestellung und Zahlungsabwicklung */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            5. Bestellung und Zahlungsabwicklung
          </h2>
          <p>
            Bei einer Bestellung erheben wir folgende Daten: Name, Anschrift,
            E-Mail-Adresse und Zahlungsinformationen. Diese Daten sind zur
            Vertragserf&uuml;llung erforderlich (Art. 6 Abs. 1 lit. b DSGVO).
          </p>
          <p className="mt-2">
            Zur Zahlungsabwicklung werden Ihre Daten an folgende Dienstleister
            weitergegeben:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-2">
            <li>
              <strong className="text-gray-700">Stripe Inc.</strong>{" "}
              (354 Oyster Point Blvd, South San Francisco, CA 94080, USA) &ndash;
              Kreditkartenzahlung. Stripe verarbeitet Ihre Zahlungsdaten auf
              eigenen PCI-DSS-zertifizierten Servern. Wir selbst speichern
              keine Kreditkartendaten.{" "}
              <a
                href="https://stripe.com/de/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 underline"
              >
                Datenschutzerkl&auml;rung von Stripe
              </a>
            </li>
            <li>
              <strong className="text-gray-700">PayPal (Europe) S.&agrave; r.l. et Cie, S.C.A.</strong>{" "}
              (22-24 Boulevard Royal, L-2449 Luxembourg) &ndash; PayPal-Zahlung,
              Lastschrift, Kauf auf Rechnung. PayPal verarbeitet Ihre
              Zahlungsdaten gem&auml;&szlig; eigener Datenschutzrichtlinie.{" "}
              <a
                href="https://www.paypal.com/de/webapps/mpp/ua/privacy-full"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 underline"
              >
                Datenschutzerkl&auml;rung von PayPal
              </a>
            </li>
          </ul>
          <p className="mt-2">
            Daten&uuml;bermittlung in die USA erfolgt auf Grundlage von
            EU-Standardvertragsklauseln bzw. Angemessenheitsbeschluss.
          </p>
        </section>

        {/* 6. KI-generierte Inhalte */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            6. Einsatz von K&uuml;nstlicher Intelligenz (KI)
          </h2>
          <p>
            Auf dieser Website werden Texte teilweise mit Unterst&uuml;tzung
            von KI-Werkzeugen (insbesondere Claude von Anthropic) erstellt und
            anschlie&szlig;end redaktionell gepr&uuml;ft. Dies betrifft insbesondere:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Produktbeschreibungen und -texte</li>
            <li>Kundenstimmen / Erfahrungsberichte (basierend auf recherchierten Bewertungen anderer Plattformen, redaktionell aufbereitet)</li>
            <li>FAQ-Texte und Informationsseiten</li>
          </ul>
          <p className="mt-2">
            <strong className="text-gray-700">Wichtiger Hinweis:</strong>{" "}
            Die auf dieser Website dargestellten &bdquo;Kundenstimmen&ldquo; sind
            keine verifizierten K&auml;ufe &uuml;ber diesen Shop. Sie basieren auf
            Erfahrungsberichten, die auf anderen Plattformen zu vergleichbaren
            Produkten recherchiert und mit KI-Unterst&uuml;tzung redaktionell
            aufbereitet wurden. Namen wurden anonymisiert.
          </p>
          <p className="mt-2">
            Bei der KI-gest&uuml;tzten Texterstellung werden keine
            personenbezogenen Daten unserer Kunden an KI-Dienstleister
            &uuml;bermittelt.
          </p>
        </section>

        {/* 7. Ihre Rechte */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            7. Ihre Rechte
          </h2>
          <p>Sie haben jederzeit das Recht auf:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Auskunft &uuml;ber Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
            <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
            <li>L&ouml;schung Ihrer Daten (Art. 17 DSGVO)</li>
            <li>Einschr&auml;nkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Daten&uuml;bertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
          </ul>
          <p className="mt-2">
            Wenden Sie sich dazu an:{" "}
            <a
              href="mailto:kontakt.trendware@gmail.com"
              className="text-brand-600 underline"
            >
              kontakt.trendware@gmail.com
            </a>
          </p>
          <p className="mt-2">
            Sie haben zudem das Recht, sich bei einer
            Datenschutz-Aufsichtsbeh&ouml;rde &uuml;ber die Verarbeitung Ihrer
            personenbezogenen Daten zu beschweren. Die f&uuml;r uns zust&auml;ndige
            Aufsichtsbeh&ouml;rde ist:
          </p>
          <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-gray-600 mt-2">
            <p>
              Der Landesbeauftragte f&uuml;r den Datenschutz und die
              Informationsfreiheit Baden-W&uuml;rttemberg<br />
              K&ouml;nigstra&szlig;e 10a<br />
              70173 Stuttgart<br />
              <a
                href="https://www.baden-wuerttemberg.datenschutz.de"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 underline"
              >
                www.baden-wuerttemberg.datenschutz.de
              </a>
            </p>
          </div>
        </section>

        {/* 8. Widerruf der Einwilligung */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            8. Widerruf Ihrer Einwilligung zur Datenverarbeitung
          </h2>
          <p>
            Viele Datenverarbeitungsvorg&auml;nge sind nur mit Ihrer
            ausdr&uuml;cklichen Einwilligung m&ouml;glich. Sie k&ouml;nnen eine bereits
            erteilte Einwilligung jederzeit widerrufen. Die Rechtm&auml;&szlig;igkeit
            der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom
            Widerruf unber&uuml;hrt.
          </p>
        </section>

        {/* 9. Aktualität */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            9. Aktualit&auml;t und &Auml;nderungen dieser Datenschutzerkl&auml;rung
          </h2>
          <p>
            Diese Datenschutzerkl&auml;rung ist aktuell g&uuml;ltig und hat den
            Stand Februar 2025. Durch die Weiterentwicklung unserer Website
            oder aufgrund ge&auml;nderter gesetzlicher bzw. beh&ouml;rdlicher Vorgaben
            kann es notwendig werden, diese Datenschutzerkl&auml;rung zu &auml;ndern.
          </p>
        </section>
      </div>
    </div>
  );
}
