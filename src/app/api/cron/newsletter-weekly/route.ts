import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { Resend } from "resend";
import { getNewsletterSubscribers } from "@/lib/kv";
import { getBestsellers } from "@/data/product-store";
import type { Product } from "@/data/product-store";

const FROM_EMAIL = process.env.EMAIL_FROM || "TrendWare <onboarding@resend.dev>";
const SITE_URL = "https://trendware7.store";

function formatPrice(price: number): string {
  return price.toFixed(2).replace(".", ",") + " \u20ac";
}

function discountPercent(product: Product): number | null {
  if (!product.compareAtPrice || product.compareAtPrice <= product.price) {
    return null;
  }
  return Math.round(
    ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
  );
}

function buildProductCard(product: Product): string {
  const discount = discountPercent(product);
  const image = product.images[0] ?? "";
  const productUrl = `${SITE_URL}/product/${product.slug}`;

  return `
    <td style="width:50%;padding:12px;vertical-align:top">
      <div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
        <div style="position:relative">
          <a href="${productUrl}">
            <img src="${image}" alt="${product.title}" style="width:100%;height:200px;object-fit:cover;display:block" />
          </a>
          ${
            discount
              ? `<span style="position:absolute;top:8px;right:8px;background:#ef4444;color:#fff;font-size:12px;font-weight:700;padding:4px 10px;border-radius:999px">-${discount}%</span>`
              : ""
          }
          ${
            product.badge
              ? `<span style="position:absolute;top:8px;left:8px;background:#c87f5a;color:#fff;font-size:12px;font-weight:700;padding:4px 10px;border-radius:999px">${product.badge}</span>`
              : ""
          }
        </div>
        <div style="padding:16px">
          <h3 style="margin:0 0 8px;font-size:15px;color:#111;line-height:1.3">${product.title}</h3>
          <p style="margin:0 0 12px;font-size:13px;color:#666;line-height:1.4">${product.shortDescription}</p>
          <div style="margin-bottom:12px">
            <span style="font-size:18px;font-weight:700;color:#c87f5a">${formatPrice(product.price)}</span>
            ${
              product.compareAtPrice
                ? `<span style="font-size:13px;color:#999;text-decoration:line-through;margin-left:8px">${formatPrice(product.compareAtPrice)}</span>`
                : ""
            }
          </div>
          <a href="${productUrl}" style="display:inline-block;background:#c87f5a;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600">
            Zum Produkt
          </a>
        </div>
      </div>
    </td>
  `;
}

function buildEmailHtml(products: Product[]): string {
  // Build rows of 2 products each
  const rows: string[] = [];
  for (let i = 0; i < products.length; i += 2) {
    const leftCard = buildProductCard(products[i]);
    const rightCard =
      i + 1 < products.length
        ? buildProductCard(products[i + 1])
        : '<td style="width:50%;padding:12px"></td>';
    rows.push(`<tr>${leftCard}${rightCard}</tr>`);
  }

  return `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:640px;margin:0 auto;padding:24px 16px">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#c87f5a,#e8a87c);padding:40px 32px;border-radius:16px 16px 0 0;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:28px;letter-spacing:-0.5px">TrendWare</h1>
      <p style="color:rgba(255,255,255,0.85);margin:12px 0 0;font-size:16px">Deine Highlights der Woche</p>
    </div>

    <!-- Intro -->
    <div style="background:#fff;padding:32px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb">
      <h2 style="margin:0 0 8px;color:#111;font-size:20px">Hallo!</h2>
      <p style="color:#555;line-height:1.6;margin:0">
        Hier findest du Produkte, zu denen verifizierte Bewertungen aus unserem Shop vorliegen.
      </p>
    </div>

    <!-- Products Grid -->
    <div style="background:#fff;padding:12px 20px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
        ${rows.join("")}
      </table>
    </div>

    <!-- Main CTA -->
    <div style="background:#fff;padding:32px;text-align:center;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb">
      <a href="${SITE_URL}/shop" style="display:inline-block;background:linear-gradient(135deg,#c87f5a,#e8a87c);color:#fff;padding:16px 48px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:700;letter-spacing:0.3px">
        Jetzt shoppen
      </a>
    </div>

    <!-- Footer -->
    <div style="background:#f9fafb;padding:24px 32px;border-radius:0 0 16px 16px;border:1px solid #e5e7eb;border-top:none;text-align:center">
      <p style="color:#999;font-size:12px;line-height:1.6;margin:0">
        Du erhältst diese E-Mail, weil du dich für den TrendWare-Newsletter angemeldet hast.<br/>
        Zum Abmelden antworte einfach auf diese E-Mail mit &bdquo;Abmelden&ldquo; oder schreibe an
        <a href="mailto:kontakt.trendware@gmail.com" style="color:#c87f5a">kontakt.trendware@gmail.com</a>.
      </p>
      <p style="color:#bbb;font-size:11px;margin:12px 0 0">&copy; ${new Date().getFullYear()} TrendWare</p>
    </div>

  </div>
</body>
</html>
  `.trim();
}

export async function GET(request: NextRequest) {
  try {
    // Verify CRON_SECRET
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "RESEND_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Fetch subscribers and bestseller products
    const [subscribers, bestsellers] = await Promise.all([
      getNewsletterSubscribers(),
      getBestsellers(),
    ]);

    if (subscribers.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No subscribers found",
        subscriberCount: 0,
        sentCount: 0,
      });
    }

    // Pick 4-6 products for the email
    const products = bestsellers.slice(0, 6);

    if (products.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No products available",
        subscriberCount: subscribers.length,
        sentCount: 0,
      });
    }

    const html = buildEmailHtml(products);
    const resend = new Resend(apiKey);

    // Use Resend batch API to send to all subscribers at once
    const batchEmails = subscribers.map((email) => ({
      from: FROM_EMAIL,
      to: email,
      subject: "Deine TrendWare-Highlights der Woche",
      html,
    }));

    // Resend batch API supports up to 100 emails per call
    const BATCH_SIZE = 100;
    let sentCount = 0;

    for (let i = 0; i < batchEmails.length; i += BATCH_SIZE) {
      const batch = batchEmails.slice(i, i + BATCH_SIZE);
      await resend.batch.send(batch);
      sentCount += batch.length;
    }

    return NextResponse.json({
      success: true,
      subscriberCount: subscribers.length,
      sentCount,
      productCount: products.length,
    });
  } catch (err) {
    console.error("Newsletter weekly cron error:", err);
    return NextResponse.json(
      {
        error: "Failed to send weekly newsletter",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
