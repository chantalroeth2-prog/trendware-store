"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useCart } from "@/components/CartProvider";
import { trackInitiateCheckout } from "@/lib/tracking";

const SHIPPING_THRESHOLD = 39;
const SHIPPING_COST = 4.99;

type PaymentMethod = "stripe" | "paypal";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");

  const shippingCost = total >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const grandTotal = total + shippingCost;

  const tracked = useRef(false);
  useEffect(() => {
    if (items.length > 0 && !tracked.current) {
      tracked.current = true;
      trackInitiateCheckout(
        items.map((i) => ({ id: i.product.id, title: i.product.title, price: i.product.price, quantity: i.quantity })),
        grandTotal
      );
    }
  }, [items, grandTotal]);

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

  const handleStripeCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.product.id,
            title: item.product.title,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.images[0],
          })),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        setError(errData.error || "Checkout konnte nicht gestartet werden.");
        return;
      }

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Checkout konnte nicht gestartet werden.");
      }
    } catch {
      setError("Verbindungsfehler. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  };

  const createPayPalOrder = async (): Promise<string> => {
    const response = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((item) => ({
          id: item.product.id,
          title: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
        })),
      }),
    });

    const data = await response.json();

    if (data.id) {
      return data.id;
    }
    throw new Error(data.error || "PayPal-Bestellung konnte nicht erstellt werden.");
  };

  const onPayPalApprove = async (data: { orderID: string }) => {
    try {
      const response = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID: data.orderID }),
      });

      const result = await response.json();

      if (result.success) {
        clearCart();
        router.push("/checkout/success");
      } else {
        setError(result.error || "Zahlung konnte nicht abgeschlossen werden.");
      }
    } catch {
      setError("Fehler bei der Zahlungsbest\u00e4tigung.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Dein Warenkorb ist leer</h1>
        <Link href="/shop" className="btn-primary">Jetzt einkaufen</Link>
      </div>
    );
  }

  const stripeButton = (
    <button
      onClick={handleStripeCheckout}
      disabled={loading}
      className="btn-accent w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Wird verarbeitet...
        </span>
      ) : (
        `Jetzt sicher bezahlen \u2013 ${grandTotal.toFixed(2)}\u00a0\u20ac`
      )}
    </button>
  );

  const paypalNotConfigured = (
    <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg p-4">
      PayPal-Zahlung ist derzeit nicht verfügbar. Bitte wähle eine andere Zahlungsart.
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-10">
        {["Warenkorb", "Kasse", "Best\u00e4tigung"].map((step, i) => (
          <div key={step} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  i <= 1
                    ? "bg-brand-600 text-white"
                    : "bg-gray-100 text-gray-500 border border-gray-200"
                }`}
              >
                {i < 1 ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${i <= 1 ? "text-gray-900" : "text-gray-500"}`}>
                {step}
              </span>
            </div>
            {i < 2 && (
              <div className={`w-12 sm:w-20 h-px mx-3 ${i < 1 ? "bg-brand-600" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-8">
        Kasse
      </h1>

      {/* Order Summary */}
      <div className="glass-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Deine Bestellung</h2>

        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={item.product.id} className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
                <Image src={item.product.images[0]} alt={item.product.title} fill sizes="64px" className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">{item.product.title}</p>
                <p className="text-xs text-gray-500">Menge: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {(item.product.price * item.quantity).toFixed(2)}&nbsp;&euro;
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Zwischensumme</span>
            <span>{total.toFixed(2)}&nbsp;&euro;</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Versand</span>
            <span>
              {shippingCost === 0 ? (
                <span className="text-green-600 font-medium">Kostenlos</span>
              ) : (
                `${shippingCost.toFixed(2)} \u20ac`
              )}
            </span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-200">
            <span>Gesamt</span>
            <span>{grandTotal.toFixed(2)}&nbsp;&euro;</span>
          </div>
          <p className="text-xs text-gray-500">inkl. MwSt.</p>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Zahlungsart w&auml;hlen</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setPaymentMethod("stripe")}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              paymentMethod === "stripe"
                ? "border-brand-500 bg-brand-50"
                : "border-gray-200 bg-gray-100 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === "stripe" ? "border-brand-500" : "border-gray-400"
              }`}>
                {paymentMethod === "stripe" && <div className="w-2.5 h-2.5 rounded-full bg-brand-500" />}
              </div>
              <div>
                <p className="font-semibold text-gray-700 text-sm">Kreditkarte</p>
                <p className="text-xs text-gray-500">Visa, Mastercard, AMEX</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setPaymentMethod("paypal")}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              paymentMethod === "paypal"
                ? "border-[#0070ba] bg-[#0070ba]/10"
                : "border-gray-200 bg-gray-100 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === "paypal" ? "border-[#0070ba]" : "border-gray-400"
              }`}>
                {paymentMethod === "paypal" && <div className="w-2.5 h-2.5 rounded-full bg-[#0070ba]" />}
              </div>
              <div>
                <p className="font-semibold text-gray-700 text-sm">PayPal</p>
                <p className="text-xs text-gray-500">Auch Lastschrift &amp; Rechnung</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="flex items-center gap-2 p-3 bg-gray-100 border border-gray-200 rounded-lg">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          <span className="text-xs text-gray-500">SSL-verschl&uuml;sselt</span>
        </div>
        <div className="flex items-center gap-2 p-3 bg-gray-100 border border-gray-200 rounded-lg">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
          </svg>
          <span className="text-xs text-gray-500">30 Tage R&uuml;ckgabe</span>
        </div>
        <div className="flex items-center gap-2 p-3 bg-gray-100 border border-gray-200 rounded-lg">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H6.375c-.621 0-1.125-.504-1.125-1.125V14.25m17.25 0V5.625A1.125 1.125 0 0021.75 4.5H2.25A1.125 1.125 0 001.125 5.625v8.625" />
          </svg>
          <span className="text-xs text-gray-500">Schneller Versand</span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      {/* Payment Buttons - PayPalScriptProvider always mounted to prevent SDK reload */}
      {paypalClientId ? (
        <PayPalScriptProvider
          options={{
            clientId: paypalClientId,
            currency: "EUR",
            intent: "capture",
          }}
        >
          {paymentMethod === "stripe" && stripeButton}
          {paymentMethod === "paypal" && (
            <PayPalButtons
              style={{
                layout: "vertical",
                color: "gold",
                shape: "rect",
                label: "pay",
                height: 50,
              }}
              createOrder={async () => {
                try {
                  return await createPayPalOrder();
                } catch (err) {
                  setError(
                    err instanceof Error
                      ? err.message
                      : "PayPal-Fehler beim Erstellen der Bestellung."
                  );
                  throw err;
                }
              }}
              onApprove={async (data) => {
                await onPayPalApprove(data);
              }}
              onError={(err) => {
                console.error("PayPal Error:", err);
                setError("PayPal-Fehler. Bitte versuche es erneut.");
              }}
              onCancel={() => {
                setError(null);
              }}
            />
          )}
        </PayPalScriptProvider>
      ) : (
        <>
          {paymentMethod === "stripe" && stripeButton}
          {paymentMethod === "paypal" && paypalNotConfigured}
        </>
      )}

      {/* Guarantee note */}
      <p className="text-center text-xs text-gray-500 mt-4">
        30 Tage Geld-zur&uuml;ck-Garantie &ndash; kein Risiko
      </p>

      <p className="text-center text-xs text-gray-500 mt-2">
        Mit dem Kauf akzeptierst du unsere{" "}
        <Link href="/agb" className="underline hover:text-gray-700">AGB</Link>{" "}
        und{" "}
        <Link href="/widerruf" className="underline hover:text-gray-700">Widerrufsbelehrung</Link>.
      </p>
    </div>
  );
}
