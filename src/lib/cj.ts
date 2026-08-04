const CJ_API_BASE = "https://developers.cjdropshipping.com/api2.0/v1";

let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (with 1h buffer)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 3600_000) {
    return cachedToken.token;
  }

  const apiKey = process.env.CJ_API_KEY;
  if (!apiKey) {
    throw new Error("CJ_API_KEY fehlt. Bitte in den Umgebungsvariablen setzen.");
  }

  const res = await fetch(`${CJ_API_BASE}/authentication/getAccessToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey }),
  });

  const data = await res.json();

  if (!data.result || !data.data?.accessToken) {
    throw new Error(`CJ Auth fehlgeschlagen: ${data.message || "Unbekannter Fehler"}`);
  }

  // Token is valid for 15 days
  cachedToken = {
    token: data.data.accessToken,
    expiresAt: Date.now() + 15 * 24 * 3600_000,
  };

  return cachedToken.token;
}

export interface CJOrderProduct {
  vid: string;
  quantity: number;
}

export interface CJOrderData {
  orderNumber: string;
  shippingCustomerName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingZip: string;
  shippingCountryCode: string;
  shippingPhone: string;
  products: CJOrderProduct[];
}

export async function createOrder(orderData: CJOrderData): Promise<{ orderId: string; orderNumber: string }> {
  const apiKey = process.env.CJ_API_KEY;
  if (!apiKey || apiKey === "dummy" || apiKey.startsWith("test_") || process.env.NEXT_PUBLIC_TEST_MODE === "true") {
    console.log(`[TEST-MODUS] CJ-Bestellung simuliert für Order #${orderData.orderNumber}`);
    return {
      orderId: `TEST-CJ-${Date.now()}`,
      orderNumber: orderData.orderNumber,
    };
  }
  const token = await getAccessToken();

  const res = await fetch(`${CJ_API_BASE}/shopping/order/createOrderV2`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "CJ-Access-Token": token,
    },
    body: JSON.stringify(orderData),
  });

  const data = await res.json();

  if (!data.result) {
    throw new Error(`CJ Bestellung fehlgeschlagen: ${data.message || "Unbekannter Fehler"}`);
  }

  return {
    orderId: data.data?.orderId || "",
    orderNumber: orderData.orderNumber,
  };
}

export async function getOrderStatus(orderId: string): Promise<{ status: string; trackNumber?: string }> {
  const token = await getAccessToken();

  const res = await fetch(`${CJ_API_BASE}/shopping/order/getOrderDetail?orderId=${orderId}`, {
    method: "GET",
    headers: { "CJ-Access-Token": token },
  });

  const data = await res.json();

  if (!data.result) {
    throw new Error(`CJ Status-Abfrage fehlgeschlagen: ${data.message || "Unbekannter Fehler"}`);
  }

  return {
    status: data.data?.orderStatus || "UNKNOWN",
    trackNumber: data.data?.trackNumber,
  };
}

// ── Product Search ──

export interface CJProduct {
  pid: string;
  productNameEn: string;
  productNameDe?: string;
  sellPrice: number;
  productImage: string[];
  categoryName?: string;
  variants: CJVariant[];
}

export interface CJVariant {
  vid: string;
  variantNameEn: string;
  variantSellPrice: number;
  variantImage?: string;
}

export interface CJSearchResult {
  products: CJProduct[];
  total: number;
}

/**
 * Search CJ Dropshipping product catalog.
 * Rate limit: 1 request per second.
 */
export async function searchCJProducts(
  query: string,
  pageSize: number = 10,
  pageNum: number = 1
): Promise<CJSearchResult> {
  const token = await getAccessToken();

  const params = new URLSearchParams({
    productNameEn: query,
    pageNum: String(pageNum),
    pageSize: String(pageSize),
  });

  const res = await fetch(`${CJ_API_BASE}/product/list?${params}`, {
    method: "GET",
    headers: { "CJ-Access-Token": token },
  });

  const data = await res.json();

  if (!data.result) {
    // Rate limited or other error
    if (data.code === 1600200) {
      throw new Error("CJ_RATE_LIMITED");
    }
    throw new Error(`CJ Suche fehlgeschlagen: ${data.message || "Unbekannter Fehler"}`);
  }

  const list = data.data?.list || [];
  const total = data.data?.total || 0;

  const products: CJProduct[] = list.map((item: Record<string, unknown>) => ({
    pid: (item.pid as string) || "",
    productNameEn: (item.productNameEn as string) || "",
    productNameDe: (item.productNameDe as string) || undefined,
    sellPrice: Number(item.sellPrice) || 0,
    productImage: Array.isArray(item.productImage) ? item.productImage : typeof item.productImage === "string" ? [item.productImage] : [],
    categoryName: (item.categoryName as string) || undefined,
    variants: Array.isArray(item.variants)
      ? (item.variants as Record<string, unknown>[]).map((v) => ({
          vid: (v.vid as string) || "",
          variantNameEn: (v.variantNameEn as string) || "",
          variantSellPrice: Number(v.variantSellPrice) || 0,
          variantImage: (v.variantImage as string) || undefined,
        }))
      : [],
  }));

  return { products, total };
}

/**
 * Get product details by CJ product ID (pid).
 */
export async function getCJProductDetail(pid: string): Promise<CJProduct | null> {
  const token = await getAccessToken();

  const res = await fetch(`${CJ_API_BASE}/product/query?pid=${pid}`, {
    method: "GET",
    headers: { "CJ-Access-Token": token },
  });

  const data = await res.json();

  if (!data.result || !data.data) {
    return null;
  }

  const item = data.data;
  return {
    pid: item.pid || "",
    productNameEn: item.productNameEn || "",
    productNameDe: item.productNameDe || undefined,
    sellPrice: Number(item.sellPrice) || 0,
    productImage: Array.isArray(item.productImage) ? item.productImage : typeof item.productImage === "string" ? [item.productImage] : [],
    categoryName: item.categoryName || undefined,
    variants: Array.isArray(item.variants)
      ? item.variants.map((v: Record<string, unknown>) => ({
          vid: (v.vid as string) || "",
          variantNameEn: (v.variantNameEn as string) || "",
          variantSellPrice: Number(v.variantSellPrice) || 0,
          variantImage: (v.variantImage as string) || undefined,
        }))
      : [],
  };
}

// ── Tracking ──

export async function getTracking(trackNumber: string): Promise<{ status: string; details: string[] }> {
  const token = await getAccessToken();

  const res = await fetch(`${CJ_API_BASE}/logistic/getTrackInfo?trackNumber=${trackNumber}`, {
    method: "GET",
    headers: { "CJ-Access-Token": token },
  });

  const data = await res.json();

  if (!data.result) {
    throw new Error(`CJ Tracking-Abfrage fehlgeschlagen: ${data.message || "Unbekannter Fehler"}`);
  }

  const trackInfo = data.data?.trackInfoList || [];
  return {
    status: data.data?.trackStatus || "UNKNOWN",
    details: trackInfo.map((info: { date: string; info: string }) => `${info.date}: ${info.info}`),
  };
}
