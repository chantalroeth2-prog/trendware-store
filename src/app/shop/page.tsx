import type { Metadata } from "next";
import { getAllProducts, categories } from "@/data/product-store";
import type { Product, Category } from "@/data/product-store";
import ShopClient from "./ShopClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Shop – Alle Produkte | TrendWare",
  description:
    "Entdecke unsere ausgewählten Alltagshelfer für Zuhause, Ordnung und Ambiente.",
  openGraph: {
    title: "TrendWare Shop – Smarte Produkte für deinen Alltag",
    description:
      "Ausgewählte Alltagshelfer für Zuhause, Ordnung und Ambiente.",
    type: "website",
  },
};

export default async function ShopPage() {
  const products = await getAllProducts();

  return <ShopClient products={products} categories={categories} />;
}
