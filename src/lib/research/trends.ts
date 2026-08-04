import type { TrendData } from "@/types/research";

function getSerpApiKey(): string {
  const key = process.env.SERPAPI_API_KEY;
  if (!key) throw new Error("SERPAPI_API_KEY fehlt.");
  return key;
}

async function serpApiRequest(params: Record<string, string>): Promise<unknown> {
  const url = new URL("https://serpapi.com/search.json");
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  url.searchParams.set("api_key", getSerpApiKey());

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`SerpAPI error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/**
 * Fetch trending search terms from Google Trends (DE market).
 */
export async function fetchGoogleTrends(): Promise<TrendData[]> {
  const data = (await serpApiRequest({
    engine: "google_trends_trending_now",
    geo: "DE",
    hl: "de",
  })) as {
    trending_searches?: Array<{
      query: string;
      articles?: Array<{ title?: string; link?: string }>;
    }>;
  };

  const searches = data.trending_searches || [];

  return searches.slice(0, 20).map((item) => ({
    source: "google_trends" as const,
    keyword: item.query,
    title: item.articles?.[0]?.title,
    link: item.articles?.[0]?.link,
  }));
}

/**
 * Fetch Amazon.de bestsellers for relevant categories via Google Shopping.
 */
export async function fetchAmazonBestsellers(): Promise<TrendData[]> {
  const data = (await serpApiRequest({
    engine: "google_shopping",
    q: "bestseller gadgets haushalt 2025",
    gl: "de",
    hl: "de",
    tbs: "mr:1,merchagg:g113872638|m114189498", // Amazon.de merchant filter
  })) as {
    shopping_results?: Array<{
      title?: string;
      price?: string;
      thumbnail?: string;
      link?: string;
      position?: number;
    }>;
  };

  const results = data.shopping_results || [];

  return results.slice(0, 15).map((item) => ({
    source: "amazon" as const,
    keyword: item.title || "",
    title: item.title,
    price: item.price ? parseFloat(item.price.replace(/[^0-9.,]/g, "").replace(",", ".")) : undefined,
    imageUrl: item.thumbnail,
    link: item.link,
    rank: item.position,
  }));
}

/**
 * Fetch AliExpress trending products via Google Shopping.
 */
export async function fetchAliExpressTrending(): Promise<TrendData[]> {
  const data = (await serpApiRequest({
    engine: "google_shopping",
    q: "trending gadgets dropshipping 2025",
    gl: "de",
    hl: "de",
  })) as {
    shopping_results?: Array<{
      title?: string;
      price?: string;
      thumbnail?: string;
      link?: string;
      position?: number;
    }>;
  };

  const results = data.shopping_results || [];

  return results.slice(0, 15).map((item) => ({
    source: "aliexpress" as const,
    keyword: item.title || "",
    title: item.title,
    price: item.price ? parseFloat(item.price.replace(/[^0-9.,]/g, "").replace(",", ".")) : undefined,
    imageUrl: item.thumbnail,
    link: item.link,
    rank: item.position,
  }));
}
