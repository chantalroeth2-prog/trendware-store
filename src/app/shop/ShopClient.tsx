"use client";

import { useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ViewToggle from "@/components/ViewToggle";
import ScrollReveal from "@/components/ScrollReveal";
import type { Product, Category } from "@/data/products";

type SortOption = "standard" | "price-asc" | "price-desc" | "newest";

function ShopContent({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [view, setView] = useState<"grid" | "list">("grid");

  const activeCategory = searchParams.get("category") || "alle";
  const searchQuery = searchParams.get("search") || "";
  const sortBy = (searchParams.get("sort") as SortOption) || "standard";

  // Client-side filtering from pre-fetched products
  const searchProducts = (query: string) => {
    const lower = query.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(lower) ||
        p.shortDescription.toLowerCase().includes(lower) ||
        p.category.toLowerCase().includes(lower)
    );
  };

  let filteredProducts = searchQuery
    ? searchProducts(searchQuery)
    : activeCategory === "alle"
    ? [...products]
    : products.filter((p) => p.categorySlug === activeCategory);

  switch (sortBy) {
    case "price-asc":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      filteredProducts = filteredProducts
        .filter((p) => p.badge === "Neu")
        .concat(filteredProducts.filter((p) => p.badge !== "Neu"));
      break;
    case "standard":
    default:
      break;
  }

  const activeCategoryObj = categories.find((c) => c.slug === activeCategory);
  const activeCategoryName = searchQuery
    ? `Suche: \u201e${searchQuery}\u201c`
    : activeCategory === "alle"
    ? "Alle Produkte"
    : activeCategoryObj?.name || "Alle Produkte";

  const activeCategoryDescription = !searchQuery && activeCategory !== "alle"
    ? activeCategoryObj?.description
    : undefined;

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newSort === "standard") {
      params.delete("sort");
    } else {
      params.set("sort", newSort);
    }
    router.push(`/shop?${params.toString()}`);
  };

  const handleViewChange = useCallback((v: "grid" | "list") => {
    setView(v);
  }, []);

  const recommendations = products.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-600">Startseite</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{activeCategoryName}</span>
      </nav>

      <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        {activeCategoryName}
      </h1>

      {/* Category description */}
      {activeCategoryDescription && (
        <p className="text-sm text-gray-500 mb-6">{activeCategoryDescription}</p>
      )}
      {!activeCategoryDescription && <div className="mb-4" />}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/shop"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === "alle" && !searchQuery
              ? "bg-brand-600 text-white"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
        >
          Alle
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/shop?category=${cat.slug}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat.slug
                ? "bg-brand-600 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            {cat.icon} {cat.name}
          </Link>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">
          {filteredProducts.length} Produkt{filteredProducts.length !== 1 && "e"}
        </p>
        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-brand-500"
          >
            <option value="standard">Standard</option>
            <option value="price-asc">Preis: aufsteigend</option>
            <option value="price-desc">Preis: absteigend</option>
            <option value="newest">Neueste zuerst</option>
          </select>
          <ViewToggle onChange={handleViewChange} />
        </div>
      </div>

      {/* Product Grid/List */}
      {filteredProducts.length > 0 ? (
        <div
          className={
            view === "grid"
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
              : "grid grid-cols-1 md:grid-cols-2 gap-4"
          }
        >
          {filteredProducts.map((product, i) => (
            <ScrollReveal key={product.id} delay={Math.min(i * 50, 300)} className="h-full">
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-2">
            {searchQuery
              ? `Keine Ergebnisse f\u00fcr \u201e${searchQuery}\u201c`
              : "Keine Produkte in dieser Kategorie gefunden."}
          </p>
          <Link href="/shop" className="btn-primary mt-4 inline-block">
            Alle Produkte anzeigen
          </Link>

          {/* Neutral product fallback */}
          <div className="mt-12 text-left">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-6 text-center">
              Weitere Produktauswahl
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {recommendations.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopClient({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="h-8 w-48 bg-gray-100 rounded animate-pulse mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-[16px] animate-pulse" />
            ))}
          </div>
        </div>
      }
    >
      <ShopContent products={products} categories={categories} />
    </Suspense>
  );
}
