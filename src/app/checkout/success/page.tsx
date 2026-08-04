"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { trackPurchase } from "@/lib/tracking";

function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) {
      added++;
    }
  }
  return result;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function CheckoutSuccessPage() {
  const { items, total, clearCart } = useCart();
  const tracked = useRef(false);

  useEffect(() => {
    if (items.length > 0 && !tracked.current) {
      tracked.current = true;
      trackPurchase(
        items.map((i) => ({ id: i.product.id, title: i.product.title, price: i.product.price, quantity: i.quantity })),
        total
      );
    }
    clearCart();
  }, [items, total, clearCart]);

  const deliveryRange = useMemo(() => {
    const now = new Date();
    const earliest = addBusinessDays(now, 3);
    const latest = addBusinessDays(now, 7);
    return `${formatDate(earliest)} \u2013 ${formatDate(latest)}`;
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      {/* Success Icon */}
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 text-green-600 mb-6">
        <svg
          className="w-10 h-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="font-display text-3xl font-bold text-gray-900 mb-3">
        Vielen Dank f&uuml;r deine Bestellung!
      </h1>
      <p className="text-lg text-gray-500 mb-2">
        Deine Zahlung war erfolgreich.
      </p>
      <p className="text-gray-500 mb-8">
        Du erh&auml;ltst in K&uuml;rze eine Best&auml;tigung per E-Mail mit allen Details zu
        deiner Bestellung und dem voraussichtlichen Liefertermin.
      </p>

      <div className="glass-card p-6 mb-6 text-left">
        <h2 className="font-semibold text-gray-900 mb-3">Wie geht es weiter?</h2>
        <ol className="space-y-2 text-sm text-gray-500 list-decimal list-inside">
          <li>
            Du erh&auml;ltst eine Bestellbest&auml;tigung per E-Mail
          </li>
          <li>
            Wir bereiten deine Bestellung vor und senden dir eine
            Versandbest&auml;tigung mit Tracking-Nummer
          </li>
          <li>
            Dein Paket wird voraussichtlich zwischen dem <strong className="text-gray-700">{deliveryRange}</strong> bei dir eintreffen
          </li>
        </ol>
      </div>

      {/* Discount for next order */}
      <div className="glass-card p-6 mb-8 text-center">
        <p className="text-sm text-gray-500 mb-2">
          Als Dankesch&ouml;n: <strong className="text-gray-900">15% Rabatt</strong> auf deine n&auml;chste Bestellung
        </p>
        <div className="inline-block bg-gray-100 border border-gray-300 rounded-xl px-6 py-3">
          <span className="font-mono text-xl font-bold text-brand-600 tracking-widest">DANKE15</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Einfach beim n&auml;chsten Einkauf an der Kasse eingeben.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/shop" className="btn-primary">
          Weiter einkaufen
        </Link>
        <Link href="/" className="btn-secondary">
          Zur Startseite
        </Link>
      </div>
    </div>
  );
}
