"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartProvider";

const SHIPPING_THRESHOLD = 39;
const SHIPPING_COST = 4.99;

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart();

  const shippingCost = total >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const grandTotal = total + shippingCost;
  const remainingForFreeShipping = SHIPPING_THRESHOLD - total;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <svg
          className="w-20 h-20 text-gray-400 mx-auto mb-6"
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
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Dein Warenkorb ist leer
        </h1>
        <p className="text-gray-500 mb-6">
          Entdecke unsere Produkte und f&uuml;ll deinen Warenkorb.
        </p>
        <Link href="/shop" className="btn-primary">
          Jetzt einkaufen
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-600">
          Startseite
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">Warenkorb</span>
      </nav>

      <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-8">
        Warenkorb ({items.length} Artikel)
      </h1>

      {/* Free shipping progress bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        {remainingForFreeShipping > 0 ? (
          <p className="text-sm text-gray-600 mb-2 font-medium">
            Noch <strong className="text-brand-600">{remainingForFreeShipping.toFixed(2).replace(".", ",")}&nbsp;&euro;</strong> bis zum kostenlosen Versand! 🚚
          </p>
        ) : (
          <p className="text-sm text-green-600 mb-2 font-semibold">
            ✅ Kostenloser Versand!
          </p>
        )}
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              remainingForFreeShipping <= 0
                ? "bg-green-500"
                : "bg-gradient-to-r from-brand-500 to-brand-400"
            }`}
            style={{ width: `${Math.min(100, (total / SHIPPING_THRESHOLD) * 100)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex gap-4 glass-card p-4"
            >
              {/* Image */}
              <Link href={`/product/${item.product.slug}`} className="flex-shrink-0">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden bg-gray-100 relative">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.title}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <Link href={`/product/${item.product.slug}`}>
                  <h3 className="font-semibold text-gray-700 hover:text-brand-600 transition-colors text-sm md:text-base line-clamp-2">
                    {item.product.title}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 mt-0.5">
                  {item.product.category}
                </p>

                {/* Savings per item */}
                {item.product.compareAtPrice && (
                  <p className="text-xs text-green-600 mt-1">
                    Du sparst {((item.product.compareAtPrice - item.product.price) * item.quantity).toFixed(2)}&nbsp;&euro;
                  </p>
                )}

                <div className="flex items-center justify-between mt-3">
                  {/* Quantity */}
                  <div className="flex items-center border border-gray-300 rounded-lg bg-gray-100">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="px-3 py-1.5 text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      &minus;
                    </button>
                    <span className="px-3 py-1.5 text-sm font-medium text-gray-700 min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="px-3 py-1.5 text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {(item.product.price * item.quantity).toFixed(2)}&nbsp;&euro;
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-gray-500">
                        {item.product.price.toFixed(2)}&nbsp;&euro; / St&uuml;ck
                      </p>
                    )}
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="text-xs text-red-500 hover:text-red-400 mt-2 transition-colors"
                >
                  Entfernen
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Bestell&uuml;bersicht
            </h2>

            <div className="space-y-3 text-sm">
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
              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900 text-base">
                <span>Gesamt</span>
                <span>{grandTotal.toFixed(2)}&nbsp;&euro;</span>
              </div>
              <p className="text-xs text-gray-500">inkl. MwSt.</p>
            </div>

            <Link href="/checkout" className="btn-accent w-full mt-6 py-4 text-base">
              Sicher zur Kasse &rarr;
            </Link>

            {/* Urgency copy */}
            <p className="text-xs text-gray-500 text-center mt-3">
              Sichere dir deine Produkte &ndash; Lagerbestand begrenzt
            </p>

            <Link
              href="/shop"
              className="block text-center text-sm text-brand-600 hover:text-brand-700 mt-3"
            >
              Weiter einkaufen
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
