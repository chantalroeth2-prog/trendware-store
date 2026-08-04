"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "./CartProvider";
import { useEffect } from "react";

const SHIPPING_THRESHOLD = 39;

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, total, itemCount, isDrawerOpen, closeDrawer } = useCart();

  const remainingForFreeShipping = Math.max(0, SHIPPING_THRESHOLD - total);
  const shippingProgress = Math.min(100, (total / SHIPPING_THRESHOLD) * 100);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    if (isDrawerOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen, closeDrawer]);

  return (
    <>
      {/* Backdrop */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-[60] transition-opacity"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white/95 backdrop-blur-xl border-l border-brand-100/80 z-[70] transform transition-transform duration-300 ease-out flex flex-col shadow-2xl ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-brand-100/60">
          <h2 className="font-display text-lg font-bold text-stone-900">
            Warenkorb ({itemCount})
          </h2>
          <button
            onClick={closeDrawer}
            className="p-2 text-stone-500 hover:text-stone-900 hover:bg-rose-50/60 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Free shipping progress bar */}
        {items.length > 0 && (
          <div className="px-5 pt-4 pb-2 bg-brand-50/40 border-b border-brand-100/40">
            {remainingForFreeShipping > 0 ? (
              <p className="text-xs text-stone-600 mb-2 font-medium">
                Noch <strong className="text-brand-600 font-semibold">{remainingForFreeShipping.toFixed(2).replace(".", ",")}&nbsp;&euro;</strong> bis zum kostenlosen Versand! 🚚
              </p>
            ) : (
              <p className="text-xs text-emerald-700 mb-2 font-semibold flex items-center gap-1">
                ✨ Kostenloser Versand freigeschaltet!
              </p>
            )}
            <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-brand-100/50">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  remainingForFreeShipping <= 0
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                    : "bg-gradient-to-r from-brand-500 via-brand-400 to-accent-500"
                }`}
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-4 text-brand-500">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                  />
                </svg>
              </div>
              <p className="text-stone-600 font-medium text-sm">Dein Warenkorb ist noch leer</p>
              <p className="text-stone-400 text-xs mt-1">Füge deine Lieblingsstücke hinzu!</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-3.5 bg-surface-900/80 border border-brand-100/80 rounded-2xl p-3 shadow-xs">
                <Link href={`/product/${item.product.slug}`} onClick={closeDrawer} className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-800 relative">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.product.slug}`} onClick={closeDrawer}>
                    <p className="text-sm font-medium text-stone-800 truncate hover:text-brand-600 transition-colors">
                      {item.product.title}
                    </p>
                  </Link>
                  <p className="text-sm font-bold text-stone-900 mt-1">
                    {(item.product.price * item.quantity).toFixed(2)}&nbsp;&euro;
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-brand-200/80 rounded-lg bg-white text-xs">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-stone-500 hover:text-stone-900 transition-colors"
                      >
                        &minus;
                      </button>
                      <span className="px-2 py-1 font-semibold text-stone-700">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-stone-500 hover:text-stone-900 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-xs text-rose-500 hover:text-rose-700 transition-colors"
                    >
                      Entfernen
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-brand-100/80 bg-white/80 space-y-3.5">
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Zwischensumme</span>
              <span className="font-bold text-stone-900 text-base">{total.toFixed(2)}&nbsp;&euro;</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="btn-accent w-full py-3.5 text-sm font-semibold rounded-2xl shadow-md"
            >
              Sicher zur Kasse &rarr;
            </Link>
            <Link
              href="/cart"
              onClick={closeDrawer}
              className="block text-center text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
            >
              Warenkorb details ansehen
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
