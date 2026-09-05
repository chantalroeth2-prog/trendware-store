import { getAllProducts } from "@/data/product-store";
import type { Product } from "@/data/products";
import { isProductOrderable } from "@/lib/product-compliance";

const BASE_URL = "https://trendware7.store";
const BRAND = "TrendWare";
const SHIPPING_COST = 4.99;

const CATEGORY_MAP: Record<string, string> = {
  "home-living": "Wohnen & Einrichten",
  haustiere: "Tierbedarf",
  "lifestyle-fitness": "Sport & Fitness",
  "buero-organisation": "Büro & Schreibwaren",
  "elektronik-zubehoer": "Computer & Zubehör",
};

/**
 * Format a number with comma as decimal separator (German locale).
 */
function formatGermanPrice(price: number): string {
  return price.toFixed(2).replace(".", ",");
}

/**
 * Escape a CSV field for billiger.de format (semicolon-separated).
 * Wrap in quotes if it contains semicolons, quotes, or newlines.
 * Double any internal quotes.
 */
function escapeCsvField(value: string): string {
  const cleaned = value.replace(/[\r\n]+/g, " ").trim();
  if (
    cleaned.includes(";") ||
    cleaned.includes('"') ||
    cleaned.includes("\n")
  ) {
    return `"${cleaned.replace(/"/g, '""')}"`;
  }
  return cleaned;
}

function buildCsvRow(product: Product): string {
  const ean = product.id;
  const hersteller = BRAND;
  const bezeichnung = product.title;
  const preis = formatGermanPrice(product.price);
  const versand = formatGermanPrice(SHIPPING_COST);
  const deepLink = `${BASE_URL}/product/${product.slug}`;
  const bild = product.images[0] || "";
  const kategorie =
    CATEGORY_MAP[product.categorySlug] || product.category;

  return [
    escapeCsvField(ean),
    escapeCsvField(hersteller),
    escapeCsvField(bezeichnung),
    preis,
    versand,
    escapeCsvField(deepLink),
    escapeCsvField(bild),
    escapeCsvField(kategorie),
  ].join(";");
}

export async function GET() {
  try {
    const products = await getAllProducts();

    const header =
      "EAN;Hersteller;Bezeichnung;Preis;Versand;DeepLink;Bild;Kategorie";
    const rows = products.filter(isProductOrderable).map(buildCsvRow);
    const csv = [header, ...rows].join("\n");

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "Content-Disposition": 'inline; filename="billiger-feed.csv"',
      },
    });
  } catch (error) {
    console.error("billiger.de Feed Fehler:", error);
    return new Response("Fehler beim Generieren des billiger.de-Feeds.", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
