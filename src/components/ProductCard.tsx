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
    <div className="group glass-card overflow-hidden transition-transform duration-300 hover:-translate-y-1 h-full flex flex-col">
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="block relative">
        <div className="aspect-square overflow-hidden bg-gray-100 relative">
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
          <span className="absolute top-3 left-3 bg-accent-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {product.badge}
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-brand-600 transition-colors mb-1">
            {product.title}
          </h3>
        </Link>

        <p className="text-xs text-gray-500 mb-2 line-clamp-1">{product.shortDescription}</p>

        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-gray-900">
            {product.price.toFixed(2)}&nbsp;&euro;
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-gray-500 line-through">
              {product.compareAtPrice.toFixed(2)}&nbsp;&euro;
            </span>
          )}
          {product.compareAtPrice && (
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
              -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Stock status */}
        {product.stockCount <= 10 ? (
          <div className="flex items-center gap-1.5 mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-xs text-red-500">
              Nur noch {product.stockCount} auf Lager
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 mb-3">
            <span className="inline-flex rounded-full h-2 w-2 bg-green-500" />
            <span className="text-xs text-green-600">Auf Lager</span>
          </div>
        )}

        {/* Add to Cart – pushed to bottom */}
        <div className="mt-auto">
          <button
            onClick={handleAdd}
            disabled={added}
            className={`w-full text-xs py-2.5 rounded-lg font-semibold transition-all ${
              added
                ? "bg-green-50 text-green-600 border border-green-200"
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
          <p className="text-[10px] text-gray-500 text-center mt-1.5">Lieferung in 3&ndash;7 Tagen</p>
        </div>
      </div>
    </div>
  );
}
