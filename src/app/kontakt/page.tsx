import { Metadata } from "next";
import Link from "next/link";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Kontakt",
};

export default function KontaktPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-600">
          Startseite
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">Kontakt</span>
      </nav>

      <h1 className="font-display text-3xl font-bold text-gray-900 mb-4">Kontakt</h1>
      <p className="text-gray-500 mb-8">
        Du hast eine Frage zu deiner Bestellung, zu einem Produkt oder
        möchtest uns etwas mitteilen? Nutze einfach das Formular und wir
        melden uns schnellstmöglich bei dir.
      </p>

      <ContactForm />
    </div>
  );
}
