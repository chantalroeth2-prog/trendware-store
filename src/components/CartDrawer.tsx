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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-gray-200 z-[70] transform transition-transform duration-300 ease-out flex flex-col ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="font-display text-lg font-bold text-gray-900">
            Warenkorb ({itemCount})
          </h2>
          <button
            onClick={closeDrawer}
            className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Free shipping progress bar */}
        {items.length > 0 && (
          <div className="px-4 pt-3 pb-2">
            {remainingForFreeShipping > 0 ? (
              <p className="text-xs text-gray-600 mb-1.5 font-medium">
                Noch <strong className="text-brand-600">{remainingForFreeShipping.toFixed(2).replace(".", ",")}&nbsp;&euro;</strong> bis zum kostenlosen Versand! 🚚
              </p>
            ) : (
              <p className="text-xs text-green-600 mb-1.5 font-semibold">
                ✅ Kostenloser Versand!
              </p>
            )}
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  remainingForFreeShipping <= 0
                    ? "bg-green-500"
                    : "bg-gradient-to-r from-brand-500 to-brand-400"
                }`}
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
              <p className="text-gray-500 text-sm">Dein Warenkorb ist leer</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-3 bg-gray-50 rounded-[16px] p-3">
                <Link href={`/product/${item.product.slug}`} onClick={closeDrawer} className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 relative">
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
                    <p className="text-sm font-medium text-gray-700 truncate hover:text-brand-600 transition-colors">
                      {item.product.title}
                    </p>
                  </Link>
                  <p className="text-sm font-bold text-gray-900 mt-1">
                    {(item.product.price * item.quantity).toFixed(2)}&nbsp;&euro;
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex items-center border border-gray-300 rounded bg-gray-100 text-xs">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-gray-500 hover:text-gray-900"
                      >
                        &minus;
                      </button>
                      <span className="px-2 py-0.5 text-gray-700">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-gray-500 hover:text-gray-900"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-xs text-red-500 hover:text-red-400 transition-colors"
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
          <div className="p-4 border-t border-gray-200 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Zwischensumme</span>
              <span className="font-bold text-gray-900">{total.toFixed(2)}&nbsp;&euro;</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="btn-accent w-full py-3 text-sm"
            >
              Sicher zur Kasse &rarr;
            </Link>
            <Link
              href="/cart"
              onClick={closeDrawer}
              className="block text-center text-sm text-brand-600 hover:text-brand-700"
            >
              Warenkorb ansehen
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
