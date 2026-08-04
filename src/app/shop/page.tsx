import type { Metadata } from "next";
import { getAllProducts, categories } from "@/data/product-store";
import type { Product, Category } from "@/data/product-store";
import ShopClient from "./ShopClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Shop – Alle Produkte | TrendWare",
  description:
    "Entdecke unser gesamtes Sortiment: Smarte Gadgets für Zuhause, Büro, Fitness, Küche & Haustiere. Ab 12,99 € – Kostenloser Versand ab 39 €.",
  openGraph: {
    title: "TrendWare Shop – Smarte Produkte für deinen Alltag",
    description:
      "Handverlesene Gadgets ab 12,99 € – für Zuhause, Büro, Fitness & Haustiere. Kostenloser Versand ab 39 €.",
    type: "website",
  },
};

export default async function ShopPage() {
  const products = await getAllProducts();

  return <ShopClient products={products} categories={categories} />;
}
