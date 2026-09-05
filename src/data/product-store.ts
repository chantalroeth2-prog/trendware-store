import {
  products as staticProducts,
  categories,
  type Product,
  type Category,
} from "./products";
import {
  getProductOverrides,
  getProductAdditions,
} from "@/lib/kv";
import { hasVerifiedReviews } from "@/lib/product-compliance";

// Re-export types and categories for convenience
export type { Product, Category };
export { categories };

/**
 * Returns all products: static products (with KV overrides applied) + KV additions.
 * Must be called from Server Components or API routes (async).
 */
export async function getAllProducts(): Promise<Product[]> {
  let overrides: Record<string, Partial<Product>> = {};
  let additions: Product[] = [];

  try {
    [overrides, additions] = await Promise.all([
      getProductOverrides(),
      getProductAdditions(),
    ]);
  } catch {
    // KV unavailable (local dev without KV) – fall back to static only
    console.warn("KV nicht erreichbar – nur statische Produkte werden geladen.");
  }

  // Apply overrides to static products
  const merged = staticProducts.map((product) => {
    const override = overrides[product.slug];
    if (override) {
      return { ...product, ...override };
    }
    return product;
  });

  // Append additions (filter out any that clash with static slugs)
  const staticSlugs = new Set(staticProducts.map((p) => p.slug));
  const newProducts = additions.filter((p) => !staticSlugs.has(p.slug));

  return [...merged, ...newProducts];
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  const all = await getAllProducts();
  return all.find((p) => p.slug === slug);
}

export async function getProductsByCategory(
  categorySlug: string
): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.categorySlug === categorySlug);
}

export async function getTrendProducts(): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.badge).slice(0, 8);
}

export async function getBestsellers(): Promise<Product[]> {
  const all = await getAllProducts();
  return all
    .filter(hasVerifiedReviews)
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 8);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await getAllProducts();
  return all.slice(0, 8);
}

export async function getNewArrivals(): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.badge === "Neu");
}

export async function searchProducts(query: string): Promise<Product[]> {
  const all = await getAllProducts();
  const lower = query.toLowerCase();
  return all.filter(
    (p) =>
      p.title.toLowerCase().includes(lower) ||
      p.shortDescription.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower)
  );
}

export async function getCategoryWithCount(): Promise<
  (Category & { productCount: number })[]
> {
  const all = await getAllProducts();
  return categories.map((cat) => ({
    ...cat,
    productCount: all.filter((p) => p.categorySlug === cat.slug).length,
  }));
}
