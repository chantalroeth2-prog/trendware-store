import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/cj";

const CJ_API_BASE = "https://developers.cjdropshipping.com/api2.0/v1";
const AUDIT_TOKEN = "tw-audit-20260905-7d31e4f2";

const allowedProductIds = new Set([
  "CJSN112543501AZ",
  "CJJT197237202BY",
  "CJJT142481001AZ",
  "CJYD192984101AZ",
  "CJJT163563001AZ",
  "CJSN164392801AZ",
  "CJNS152304201AZ",
  "CJJT172338201AZ",
  "CJSJ160146601AZ",
]);

const allowedSearches: Record<string, string> = {
  sand: "3D moving sand art lamp",
  woodlamp: "wood LED bedside lamp wireless charger",
  raindrop: "cloud raindrop aroma diffuser",
  bamboo: "bamboo organizer",
};

async function cjFetch(path: string, init?: RequestInit) {
  const token = await getAccessToken();
  const response = await fetch(`${CJ_API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "CJ-Access-Token": token,
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  return { status: response.status, body: await response.json() };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("token") !== AUDIT_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pid = url.searchParams.get("pid");
  if (pid) {
    if (!allowedProductIds.has(pid)) {
      return NextResponse.json({ error: "Product not allowlisted" }, { status: 400 });
    }
    return NextResponse.json(await cjFetch(`/product/query?pid=${encodeURIComponent(pid)}`));
  }

  const searchKey = url.searchParams.get("search");
  if (searchKey) {
    const term = allowedSearches[searchKey];
    if (!term) return NextResponse.json({ error: "Search not allowlisted" }, { status: 400 });
    const query = new URLSearchParams({ productNameEn: term, pageNum: "1", pageSize: "20" });
    return NextResponse.json(await cjFetch(`/product/list?${query}`));
  }

  const vid = url.searchParams.get("vid");
  const country = url.searchParams.get("country");
  if (vid && (country === "DE" || country === "FR")) {
    const variant = await cjFetch(`/product/variant/query?vid=${encodeURIComponent(vid)}`);
    const stock = await cjFetch(`/product/stock/queryByVid?vid=${encodeURIComponent(vid)}`);
    const freight = await cjFetch("/logistic/freightCalculate", {
      method: "POST",
      body: JSON.stringify({
        startCountryCode: "CN",
        endCountryCode: country,
        products: [{ vid, quantity: 1 }],
      }),
    });
    return NextResponse.json({ variant, stock, freight });
  }

  return NextResponse.json({ error: "Missing supported audit operation" }, { status: 400 });
}

