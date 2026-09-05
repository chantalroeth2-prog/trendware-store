import { getAllProducts } from "@/data/product-store";
import { isProductOrderable } from "@/lib/product-compliance";
import type { Product } from "@/data/product-store";

const BASE_URL = "https://trendware7.store";
const BRAND = "TrendWare";
const CURRENCY = "EUR";
const SHIPPING_COST = "4.99";

const CATEGORY_MAP: Record<string, string> = {
  "home-living": "Haus & Garten > Wohneinrichtung",
  haustiere: "Tierbedarf",
  "lifestyle-fitness": "Sportartikel > Fitnessgeräte",
  "buero-organisation": "Bürobedarf",
  "elektronik-zubehoer": "Elektronik > Elektronikzubehör",
};

/** Escape special XML characters */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Format a price as "29.99 EUR" */
function formatPrice(price: number): string {
  return `${price.toFixed(2)} ${CURRENCY}`;
}

function buildItemXml(product: Product): string {
  const productUrl = `${BASE_URL}/product/${product.slug}`;
  const availability = isProductOrderable(product) ? "in_stock" : "out_of_stock";
  const googleCategory =
    CATEGORY_MAP[product.categorySlug] || "Sonstige";

  const shippingPrice = SHIPPING_COST;

  // Primary image
  const primaryImage = product.images[0] ?? "";
  // Additional images (all except the first)
  const additionalImages = product.images.slice(1);

  // Build product_type from category name
  const productType = product.category;

  let xml = `    <item>
      <g:id>${escapeXml(product.id)}</g:id>
      <g:title>${escapeXml(product.title)}</g:title>
      <g:description>${escapeXml(product.description)}</g:description>
      <g:link>${escapeXml(productUrl)}</g:link>
      <g:image_link>${escapeXml(primaryImage)}</g:image_link>
`;

  for (const img of additionalImages) {
    xml += `      <g:additional_image_link>${escapeXml(img)}</g:additional_image_link>\n`;
  }

  xml += `      <g:price>${formatPrice(product.compareAtPrice ?? product.price)}</g:price>
`;

  // If there is a compareAtPrice (original price), the current price is the sale price
  if (product.compareAtPrice && product.compareAtPrice > product.price) {
    xml += `      <g:sale_price>${formatPrice(product.price)}</g:sale_price>\n`;
  }

  xml += `      <g:availability>${availability}</g:availability>
      <g:condition>new</g:condition>
      <g:brand>${escapeXml(BRAND)}</g:brand>
      <g:google_product_category>${escapeXml(googleCategory)}</g:google_product_category>
      <g:product_type>${escapeXml(productType)}</g:product_type>
      <g:shipping>
        <g:country>DE</g:country>
        <g:service>Standard</g:service>
        <g:price>${shippingPrice} ${CURRENCY}</g:price>
      </g:shipping>
    </item>`;

  return xml;
}

export async function GET() {
  try {
    const products = await getAllProducts();

    const itemsXml = products.map(buildItemXml).join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>TrendWare - Trendige Produkte für deinen Alltag</title>
    <link>${BASE_URL}</link>
    <description>Offizieller Google Merchant Center Produktfeed von TrendWare</description>
${itemsXml}
  </channel>
</rss>`;

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Google Merchant Feed Fehler:", error);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><error>Feed konnte nicht generiert werden.</error>`,
      {
        status: 500,
        headers: { "Content-Type": "application/xml; charset=utf-8" },
      }
    );
  }
}
