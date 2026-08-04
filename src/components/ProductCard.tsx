"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/data/products";
import { useCart } from "./CartProvider";
import { trackAddToCart } from "@/lib/tracking";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    trackAddToCart({ id: product.id, title: product.title, price: product.price, category: product.category });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const hasSecondImage = product.images.length > 1;

  return (
    <div className="group glass-card overflow-hidden transition-all duration-300 hover:-translate-y-1.5 h-full flex flex-col rounded-3xl border-brand-100/90 shadow-sm shadow-brand-900/5 hover:shadow-lg hover:shadow-brand-900/10 bg-white/80 backdrop-blur-md">
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="block relative">
        <div className="aspect-square overflow-hidden bg-surface-800/50 relative rounded-t-3xl">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className={`object-cover transition-all duration-500 ${
              hasSecondImage
                ? "group-hover:opacity-0"
                : "group-hover:scale-105"
            }`}
          />
          {hasSecondImage && (
            <Image
              src={product.images[1]}
              alt={`${product.title} - 2`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}
        </div>
        {product.badge && (
          <span className="absolute top-3.5 left-3.5 bg-gradient-to-r from-accent-500 to-rose-300 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-xs backdrop-blur-xs">
            {product.badge}
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="p-5 flex-1 flex flex-col">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-semibold text-stone-800 line-clamp-2 hover:text-brand-600 transition-colors mb-1 font-display">
            {product.title}
          </h3>
        </Link>

        <p className="text-xs text-stone-500 mb-2 line-clamp-1">{product.shortDescription}</p>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-stone-900">
            {product.price.toFixed(2)}&nbsp;&euro;
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-stone-400 line-through">
              {product.compareAtPrice.toFixed(2)}&nbsp;&euro;
            </span>
          )}
          {product.compareAtPrice && (
            <span className="text-xs font-semibold text-accent-600 bg-rose-100/80 border border-rose-200/60 px-2 py-0.5 rounded-full">
              -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Stock status */}
        {product.stockCount <= 10 ? (
          <div className="flex items-center gap-1.5 mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            <span className="text-xs text-rose-600 font-medium">
              Nur noch {product.stockCount} auf Lager
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 mb-3">
            <span className="inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            <span className="text-xs text-emerald-700 font-medium">Auf Lager</span>
          </div>
        )}

        {/* Add to Cart – pushed to bottom */}
        <div className="mt-auto">
          <button
            onClick={handleAdd}
            disabled={added}
            className={`w-full text-xs py-3 rounded-2xl font-semibold transition-all shadow-xs ${
              added
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                : "btn-primary"
            }`}
          >
            {added ? (
              <span className="flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Hinzugef&uuml;gt!
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                In den Warenkorb
              </span>
            )}
          </button>

          {/* Delivery microcopy */}
          <p className="text-[10px] text-stone-400 text-center mt-2">Lieferung in 3&ndash;7 Tagen</p>
        </div>
      </div>
    </div>
  );
}
