import type { Product } from "@/data/products";

interface RawImageResult {
  url: string;
  width: number;
  height: number;
  sourceDomain: string;
  sourceUrl: string;
  title: string;
}

function getSerpApiKey(): string {
  const key = process.env.SERPAPI_API_KEY;
  if (!key) throw new Error("SERPAPI_API_KEY fehlt.");
  return key;
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "";
  }
}

// ── Stockfoto-Erkennung ──────────────────────────────────────────────

/**
 * Domains die generische Stockfotos hosten – diese zeigen NICHT das echte Produkt.
 */
const STOCK_PHOTO_DOMAINS = [
  "unsplash.com", "images.unsplash.com",
  "pexels.com", "images.pexels.com",
  "pixabay.com", "cdn.pixabay.com",
  "stockphoto.com", "istockphoto.com",
  "shutterstock.com", "stock.adobe.com",
  "depositphotos.com", "dreamstime.com",
  "gettyimages.com", "freepik.com",
  "rawpixel.com", "burst.shopify.com",
  "picsum.photos", "fastly.picsum.photos",
  "placeholder.com", "via.placeholder.com",
  "placehold.co", "dummyimage.com",
];

/**
 * Prüft ob eine URL von einer Stockfoto-Plattform stammt.
 * Stockfotos zeigen generische/symbolische Bilder, nicht das echte Produkt
 * das der Kunde bestellt und geliefert bekommt.
 */
export function isStockPhotoUrl(url: string): boolean {
  const domain = extractDomain(url);
  return STOCK_PHOTO_DOMAINS.some((d) => domain.includes(d));
}

/**
 * Prüft ob ALLE Bilder eines Produkts Stockfotos sind.
 */
export function hasOnlyStockPhotos(images: string[]): boolean {
  return images.length > 0 && images.every(isStockPhotoUrl);
}

/**
 * Prüft ob mindestens ein Bild ein Stockfoto ist.
 */
export function hasAnyStockPhotos(images: string[]): boolean {
  return images.some(isStockPhotoUrl);
}

// ── Bevorzugte Quellen ───────────────────────────────────────────────

/**
 * E-Commerce-Domains die konsistente, echte Produktfotos haben.
 * Bilder von diesen Quellen zeigen das tatsächliche Produkt.
 */
const PREFERRED_DOMAINS = [
  "amazon.de", "amazon.com", "m.media-amazon.com",
  "aliexpress.com", "de.aliexpress.com", "ae01.alicdn.com",
  "ebay.de", "ebay.com", "i.ebayimg.com",
  "otto.de", "mediamarkt.de", "saturn.de",
  "idealo.de", "kaufland.de",
  "galaxus.de", "pearl.de", "manomano.de",
  "lidl.de", "aldi-sued.de",
];

const BAD_DOMAINS = [
  "facebook.com", "instagram.com", "tiktok.com",
  "twitter.com", "x.com", "pinterest.com",
  "reddit.com", "youtube.com",
  ...STOCK_PHOTO_DOMAINS, // Stockfoto-Domains IMMER ausschließen
];

// ── Suchstrategien ───────────────────────────────────────────────────

/**
 * Baut eine optimierte Suchanfrage für Google Shopping.
 * Ziel: Das EXAKTE Produkt finden, nicht ähnliche.
 */
export function buildShoppingQuery(product: Product): string {
  // Kernbegriffe aus dem Titel extrahieren (ohne Klammerzusätze)
  const cleanTitle = product.title
    .replace(/\([^)]*\)/g, "") // Klammern entfernen
    .replace(/[–—]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return `${cleanTitle} kaufen`;
}

/**
 * Baut eine Suchanfrage für Google Images.
 * Fokus auf Produktfotos, nicht Lifestyle-Bilder.
 */
export function buildImageQuery(product: Product): string {
  const cleanTitle = product.title
    .replace(/\([^)]*\)/g, "")
    .replace(/[–—-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // "produktfoto" oder "produktbild" hilft, echte Produktfotos zu finden
  return `${cleanTitle} produktfoto`;
}

/**
 * Alternative Suchanfrage mit Kategorie-Kontext.
 */
function buildBroadQuery(product: Product): string {
  // Kürzer, breiter – findet mehr Ergebnisse
  const words = product.title.split(/\s+/).slice(0, 4).join(" ");
  return `${words} ${product.category}`;
}

// ── Google Shopping Suche ────────────────────────────────────────────

/**
 * Sucht das Produkt über Google Shopping.
 * Google Shopping zeigt echte Produktlistings mit korrekten Bildern.
 * Kostet 1 SerpAPI-Credit.
 */
export async function searchGoogleShopping(
  query: string,
  count: number = 6
): Promise<string[]> {
  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google_shopping");
  url.searchParams.set("q", query);
  url.searchParams.set("gl", "de");
  url.searchParams.set("hl", "de");
  url.searchParams.set("api_key", getSerpApiKey());

  const res = await fetch(url.toString());
  if (!res.ok) {
    console.error(`Google Shopping search failed: ${res.status}`);
    return [];
  }

  const data = (await res.json()) as {
    shopping_results?: Array<{
      title?: string;
      thumbnail?: string;
      link?: string;
      source?: string;
      product_id?: string;
    }>;
  };

  const results = (data.shopping_results || [])
    .filter((r) => r.thumbnail && r.thumbnail.startsWith("http"))
    .map((r) => r.thumbnail!)
    .slice(0, count);

  // Google Shopping Thumbnails sind oft klein (ca. 200px),
  // aber sie zeigen das KORREKTE Produkt. Das ist wichtiger als Auflösung.
  const validated = await validateImageUrls(results);
  return validated;
}

// ── Google Images Suche ──────────────────────────────────────────────

/**
 * Sucht Produktbilder über Google Images.
 * Gruppiert nach Quell-Domain und nimmt Bilder von EINER Quelle
 * um sicherzustellen, dass alle Bilder dasselbe Produkt zeigen.
 * Kostet 1 SerpAPI-Credit.
 */
export async function searchProductImages(
  query: string,
  count: number = 4
): Promise<string[]> {
  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google_images");
  url.searchParams.set("q", query);
  url.searchParams.set("gl", "de");
  url.searchParams.set("hl", "de");
  url.searchParams.set("tbs", "isz:m"); // medium size
  url.searchParams.set("ijn", "0");
  url.searchParams.set("api_key", getSerpApiKey());

  const res = await fetch(url.toString());
  if (!res.ok) {
    console.error(`Image search failed: ${res.status}`);
    return [];
  }

  const data = (await res.json()) as {
    images_results?: Array<{
      original?: string;
      thumbnail?: string;
      original_width?: number;
      original_height?: number;
      source?: string;
      link?: string;
      title?: string;
    }>;
  };

  const results: RawImageResult[] = (data.images_results || [])
    .filter((img) => {
      if (!img.original) return false;
      if ((img.original_width || 0) < 400 || (img.original_height || 0) < 400) return false;
      const domain = extractDomain(img.original);
      if (BAD_DOMAINS.some((d) => domain.includes(d))) return false;
      const ratio = (img.original_width || 1) / (img.original_height || 1);
      if (ratio < 0.4 || ratio > 2.5) return false;
      return true;
    })
    .map((img) => ({
      url: img.original!,
      width: img.original_width || 0,
      height: img.original_height || 0,
      sourceDomain: extractDomain(img.link || img.source || ""),
      sourceUrl: img.link || "",
      title: img.title || "",
    }));

  // Gruppiere nach Quell-Domain
  const domainGroups = new Map<string, RawImageResult[]>();
  for (const img of results) {
    const domain = img.sourceDomain;
    if (!domain) continue;
    const group = domainGroups.get(domain) || [];
    group.push(img);
    domainGroups.set(domain, group);
  }

  // Bewerte jede Domain-Gruppe
  const scoredGroups = Array.from(domainGroups.entries())
    .map(([domain, images]) => {
      let score = images.length * 10;

      // Hoher Bonus für E-Commerce-Domains (echte Produktfotos)
      if (PREFERRED_DOMAINS.some((d) => domain.includes(d))) {
        score += 40; // Erhöht von 25 → 40
      }

      // Bonus für Amazon/AliExpress (die wahrscheinlichsten Quellen für Dropship-Produkte)
      if (domain.includes("amazon") || domain.includes("aliexpress") || domain.includes("alicdn")) {
        score += 20;
      }

      // Bonus für größere Bilder
      const avgSize = images.reduce((sum, img) => sum + img.width * img.height, 0) / images.length;
      if (avgSize > 500 * 500) score += 5;
      if (avgSize > 800 * 800) score += 10;

      // Bonus für quadratische Bilder (typische Produktfotos)
      const squareCount = images.filter((img) => {
        const ratio = img.width / img.height;
        return ratio >= 0.8 && ratio <= 1.2;
      }).length;
      score += squareCount * 3;

      return { domain, images, score };
    })
    .sort((a, b) => b.score - a.score);

  // Beste Domain-Gruppe nehmen und validieren
  for (const group of scoredGroups.slice(0, 3)) {
    const urls = group.images.slice(0, count + 2).map((img) => img.url);
    const validated = await validateImageUrls(urls);

    if (validated.length >= Math.min(count, 2)) {
      console.log(
        `Bilder von ${group.domain}: ${validated.length} validiert (Score: ${group.score})`
      );
      return validated.slice(0, count);
    }
  }

  // Fallback: Beste validierte Bilder von einer Quelle
  for (const group of scoredGroups) {
    const urls = group.images.map((img) => img.url);
    const validated = await validateImageUrls(urls);
    if (validated.length > 0) {
      console.log(
        `Fallback: ${validated.length} Bild(er) von ${group.domain}`
      );
      return validated.slice(0, count);
    }
  }

  return [];
}

// ── Haupt-Suchfunktion ──────────────────────────────────────────────

/**
 * Findet echte Produktbilder für ein Produkt.
 *
 * Strategie (3 Stufen, maximal 2 SerpAPI-Credits):
 * 1. Google Shopping → findet das exakte Produkt-Listing
 * 2. Google Images mit exakter Suche → findet Produktfotos von E-Commerce-Seiten
 * 3. Google Images mit breiter Suche → Fallback
 *
 * WICHTIG: Gibt NUR Bilder von E-Commerce-Quellen zurück,
 * NIEMALS Stockfotos (Unsplash, Pexels, etc.).
 */
export async function findBetterImages(
  product: Product,
  count: number = 4
): Promise<string[]> {
  // Stufe 1: Google Shopping (präziseste Quelle für Produktbilder)
  const shoppingQuery = buildShoppingQuery(product);
  console.log(`Shopping-Suche: "${shoppingQuery}"`);
  const shoppingResults = await searchGoogleShopping(shoppingQuery, count + 2);

  if (shoppingResults.length >= 2) {
    console.log(`→ ${shoppingResults.length} Shopping-Bilder gefunden`);
    return shoppingResults.slice(0, count);
  }

  // Stufe 2: Google Images mit exakter Suche (1 Credit)
  const exactQuery = buildImageQuery(product);
  console.log(`Image-Suche: "${exactQuery}"`);
  const exactResults = await searchProductImages(exactQuery, count);

  if (exactResults.length >= 2) {
    // Shopping-Ergebnisse vorne einfügen falls vorhanden
    const combined = [
      ...shoppingResults,
      ...exactResults.filter((u) => !shoppingResults.includes(u)),
    ].slice(0, count);
    console.log(`→ ${combined.length} kombinierte Bilder gefunden`);
    return combined;
  }

  // Stufe 3: Breite Suche als Fallback
  const broadQuery = buildBroadQuery(product);
  console.log(`Breite Suche: "${broadQuery}"`);
  const broadResults = await searchProductImages(broadQuery, count);

  // Alle Ergebnisse kombinieren, Shopping zuerst
  const all = [
    ...shoppingResults,
    ...exactResults.filter((u) => !shoppingResults.includes(u)),
    ...broadResults.filter((u) => !shoppingResults.includes(u) && !exactResults.includes(u)),
  ].slice(0, count);

  console.log(`→ ${all.length} Bilder insgesamt gefunden`);
  return all;
}

// ── Bildvalidierung ──────────────────────────────────────────────────

async function validateImageUrls(urls: string[]): Promise<string[]> {
  const results = await Promise.allSettled(
    urls.map(async (url) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      try {
        const res = await fetch(url, {
          method: "HEAD",
          signal: controller.signal,
          headers: { "User-Agent": "Mozilla/5.0" },
        });

        clearTimeout(timeout);

        if (!res.ok) return null;

        const contentType = res.headers.get("content-type") || "";
        if (!contentType.startsWith("image/")) return null;

        const size = parseInt(res.headers.get("content-length") || "0", 10);
        if (size > 0 && size < 5000) return null; // Placeholder

        return url;
      } catch {
        clearTimeout(timeout);
        return null;
      }
    })
  );

  return results
    .filter(
      (r): r is PromiseFulfilledResult<string> =>
        r.status === "fulfilled" && r.value !== null
    )
    .map((r) => r.value);
}

/**
 * Prüft ob die aktuellen Bilder eines Produkts erreichbar sind.
 */
export async function auditProductImages(
  product: Product
): Promise<{ brokenIndices: number[]; allBroken: boolean }> {
  const results = await Promise.allSettled(
    product.images.map(async (url, index) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      try {
        const res = await fetch(url, {
          method: "HEAD",
          signal: controller.signal,
          headers: { "User-Agent": "Mozilla/5.0" },
        });
        clearTimeout(timeout);
        return res.ok ? null : index;
      } catch {
        clearTimeout(timeout);
        return index;
      }
    })
  );

  const brokenIndices = results
    .filter(
      (r): r is PromiseFulfilledResult<number> =>
        r.status === "fulfilled" && r.value !== null
    )
    .map((r) => r.value);

  return {
    brokenIndices,
    allBroken: brokenIndices.length === product.images.length,
  };
}
