import type { Product } from "@/data/products";
import type { TrendData, ProductSuggestion } from "@/types/research";
import { categories } from "@/data/products";
import { searchProductImages } from "./image-search";
import { callGroq } from "@/lib/groq";

export async function analyzeTrends(
  trends: TrendData[],
  currentProducts: Product[]
): Promise<ProductSuggestion[]> {
  const categoryList = categories
    .map((c) => `- ${c.name} (slug: ${c.slug})`)
    .join("\n");

  const productList = currentProducts
    .map(
      (p) =>
        `- "${p.title}" (slug: ${p.slug}, Preis: ${p.price}€, Kategorie: ${p.category})`
    )
    .join("\n");

  const trendList = trends
    .map(
      (t) =>
        `[${t.source}] ${t.keyword}${t.title ? ` – ${t.title}` : ""}${t.price ? ` (${t.price}€)` : ""}${t.imageUrl ? ` Bild: ${t.imageUrl}` : ""}`
    )
    .join("\n");

  const prompt = `Du bist ein KI-Produktberater für den deutschen Dropshipping-Shop "TrendWare".
Der Shop verkauft smarte Gadgets und Alltagshelfer im Preisbereich 12-45€.

AKTUELLE KATEGORIEN:
${categoryList}

AKTUELLE PRODUKTE (${currentProducts.length} Stück):
${productList}

AKTUELLE TREND-DATEN:
${trendList}

AUFGABE:
Analysiere die Trend-Daten und gib maximal 5 konkrete Vorschläge als JSON-Array zurück.
Jeder Vorschlag muss einem dieser Typen entsprechen:

1. "new_product" – Ein neues Produkt, das zum Shop passt und gerade im Trend liegt.
2. "price_update" – Preisanpassung eines bestehenden Produkts (basierend auf Marktdaten).
3. "image_update" – Bessere/aktuellere Bilder für ein bestehendes Produkt.

REGELN:
- Nur Produkte im Bereich 10-50€
- Muss zu einer bestehenden Kategorie passen
- Keine Duplikate zu bestehenden Produkten
- Bei new_product: Erstelle vollständige Produktdaten auf Deutsch
- Bei Preis/Bild-Updates: Referenziere den slug des bestehenden Produkts
- Bevorzuge Produkte mit hohem Trendpotenzial
- Schlage nur Bilder von Unsplash (images.unsplash.com) vor

Antworte NUR mit einem JSON-Array im folgenden Format (keine Markdown-Codeblöcke):
[
  {
    "type": "new_product",
    "title": "Produkttitel",
    "reason": "Warum dieses Produkt",
    "product": {
      "title": "Produkttitel",
      "description": "Ausführliche Beschreibung...",
      "shortDescription": "Kurzbeschreibung in einem Satz.",
      "price": 24.99,
      "compareAtPrice": 34.99,
      "category": "Kategoriename",
      "categorySlug": "kategorie-slug",
      "images": ["https://images.unsplash.com/photo-xxx?w=600&h=600&fit=crop"],
      "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
      "deliveryDays": "3–7 Werktage"
    }
  },
  {
    "type": "price_update",
    "targetSlug": "produkt-slug",
    "title": "Preisanpassung: Produktname",
    "reason": "Marktpreis liegt bei X€",
    "newPrice": 19.99
  },
  {
    "type": "image_update",
    "targetSlug": "produkt-slug",
    "title": "Neue Bilder: Produktname",
    "reason": "Aktuellere Produktbilder verfügbar",
    "newImages": ["https://images.unsplash.com/photo-yyy?w=600&h=600&fit=crop"]
  }
]`;

  const text = await callGroq(prompt);

  // Strip markdown code fences if present
  const cleaned = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");

  try {
    const parsed = JSON.parse(cleaned);
    const suggestions: ProductSuggestion[] = Array.isArray(parsed)
      ? parsed
      : parsed.suggestions || parsed.data || [];
    const valid = suggestions.filter(isValidSuggestion).slice(0, 5);

    // Replace LLM-generated image URLs with real searched images
    const enhanced = await enhanceSuggestionsWithRealImages(valid);
    return enhanced;
  } catch (err) {
    console.error("LLM JSON-Parse fehlgeschlagen:", err, "\nAntwort:", text);
    return [];
  }
}

/**
 * Replace LLM-invented image URLs with real images from Google Image Search.
 * Uses 1 SerpAPI credit per suggestion that has images.
 */
async function enhanceSuggestionsWithRealImages(
  suggestions: ProductSuggestion[]
): Promise<ProductSuggestion[]> {
  return Promise.all(
    suggestions.map(async (s) => {
      try {
        if (s.type === "new_product" && s.product) {
          const query = `${s.product.title} produkt`;
          const images = await searchProductImages(query, 4);
          if (images.length > 0) {
            return { ...s, product: { ...s.product, images } };
          }
        }
        if (s.type === "image_update" && s.title) {
          const query = `${s.title.replace("Neue Bilder: ", "")} produkt`;
          const images = await searchProductImages(query, 4);
          if (images.length > 0) {
            return { ...s, newImages: images };
          }
        }
      } catch (err) {
        console.error(`Bildersuche fehlgeschlagen für "${s.title}":`, err);
      }
      return s;
    })
  );
}

function isValidSuggestion(s: ProductSuggestion): boolean {
  if (!s.type || !s.title || !s.reason) return false;

  switch (s.type) {
    case "new_product":
      return !!(
        s.product &&
        s.product.title &&
        s.product.price > 0 &&
        s.product.categorySlug &&
        s.product.images?.length
      );
    case "price_update":
      return !!(s.targetSlug && s.newPrice && s.newPrice > 0);
    case "image_update":
      return !!(s.targetSlug && s.newImages?.length);
    default:
      return false;
  }
}
