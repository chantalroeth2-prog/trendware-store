import { getAllProducts } from "@/data/product-store";
import { isProductOrderable } from "@/lib/product-compliance";
import type { Product } from "@/data/products";

const BASE_URL = "https://trendware7.store";
const BRAND = "TrendWare";
const SHIPPING_COST = 4.99;

const CATEGORY_MAP: Record<string, string> = {
  "home-living": "Wohnen > Dekoration",
  haustiere: "Tierbedarf",
  "lifestyle-fitness": "Sport & Freizeit > Fitnessgeräte",
  "buero-organisation": "Bürobedarf",
  "elektronik-zubehoer": "Elektronik > Zubehör",
};

/**
 * Format a number with comma as decimal separator (German locale).
 */
function formatGermanPrice(price: number): string {
  return price.toFixed(2).replace(".", ",");
}

/**
 * Escape a CSV field: wrap in quotes if it contains semicolons, quotes, or newlines.
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
  const titel = product.title;
  const beschreibung = product.description;
  const preis = formatGermanPrice(product.price);
  const versandkosten = formatGermanPrice(SHIPPING_COST);
  const deepLink = `${BASE_URL}/product/${product.slug}`;
  const bildUrl = product.images[0] || "";
  const kategorie =
    CATEGORY_MAP[product.categorySlug] || product.category;
  const hersteller = BRAND;
  const verfuegbarkeit = isProductOrderable(product) ? "Lieferbar" : "Nicht verfügbar";

  return [
    escapeCsvField(ean),
    escapeCsvField(titel),
    escapeCsvField(beschreibung),
    preis,
    versandkosten,
    escapeCsvField(deepLink),
    escapeCsvField(bildUrl),
    escapeCsvField(kategorie),
    escapeCsvField(hersteller),
    escapeCsvField(verfuegbarkeit),
  ].join(";");
}

export async function GET() {
  try {
    const products = await getAllProducts();

    const header =
      "EAN;Titel;Beschreibung;Preis;Versandkosten;DeepLink;Bild-URL;Kategorie;Hersteller;Verfügbarkeit";
    const rows = products.map(buildCsvRow);
    const csv = [header, ...rows].join("\n");

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "Content-Disposition": 'inline; filename="idealo-feed.csv"',
      },
    });
  } catch (error) {
    console.error("idealo Feed Fehler:", error);
    return new Response("Fehler beim Generieren des idealo-Feeds.", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
