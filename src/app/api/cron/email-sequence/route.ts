import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { Resend } from "resend";
import {
  getNewsletterSubscribers,
  getEmailSequenceState,
  setEmailSequenceState,
} from "@/lib/kv";
import { getBestsellers, getNewArrivals } from "@/data/product-store";
import type { Product } from "@/data/product-store";

const FROM_EMAIL = process.env.EMAIL_FROM || "TrendWare <onboarding@resend.dev>";
const SITE_URL = "https://trendware7.store";

// ── Helpers ──

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

function daysSince(isoDate: string): number {
  const then = new Date(isoDate).getTime();
  const now = Date.now();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

// ── Product Card (matching existing newsletter style) ──

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

function buildProductRows(products: Product[]): string {
  const rows: string[] = [];
  for (let i = 0; i < products.length; i += 2) {
    const leftCard = buildProductCard(products[i]);
    const rightCard =
      i + 1 < products.length
        ? buildProductCard(products[i + 1])
        : '<td style="width:50%;padding:12px"></td>';
    rows.push(`<tr>${leftCard}${rightCard}</tr>`);
  }
  return rows.join("");
}

// ── Email Template Wrapper ──

function wrapEmail(options: {
  headline: string;
  subtitle: string;
  bodyHtml: string;
  ctaText: string;
  ctaUrl: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:640px;margin:0 auto;padding:24px 16px">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#c87f5a,#e8a87c);padding:40px 32px;border-radius:16px 16px 0 0;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:28px;letter-spacing:-0.5px">TrendWare</h1>
      <p style="color:rgba(255,255,255,0.85);margin:12px 0 0;font-size:16px">${options.subtitle}</p>
    </div>

    <!-- Body -->
    <div style="background:#fff;padding:32px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb">
      <h2 style="margin:0 0 8px;color:#111;font-size:20px">${options.headline}</h2>
      ${options.bodyHtml}
    </div>

    <!-- Main CTA -->
    <div style="background:#fff;padding:32px;text-align:center;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb">
      <a href="${options.ctaUrl}" style="display:inline-block;background:linear-gradient(135deg,#c87f5a,#e8a87c);color:#fff;padding:16px 48px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:700;letter-spacing:0.3px">
        ${options.ctaText}
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

// ── Sequence Step 2 (Day 2): verified-review showcase ──

function buildDay2Email(products: Product[]): { subject: string; html: string } {
  const top4 = products.slice(0, 4);
  return {
    subject: "Produkte mit verifizierten Bewertungen",
    html: wrapEmail({
      headline: "Von Kundinnen und Kunden bewertet",
      subtitle: "Ausschließlich verifizierte Bewertungen aus unserem Shop",
      bodyHtml: `
        <p style="color:#555;line-height:1.6;margin:0 0 16px">
          Zu diesen Produkten liegen verifizierte Bewertungen aus unserem Shop vor:
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
          ${buildProductRows(top4)}
        </table>
      `,
      ctaText: "Produkte entdecken",
      ctaUrl: `${SITE_URL}/shop`,
    }),
  };
}

// ── Sequence Step 3 (Day 5): Urgency Reminder ──

function buildDay5Email(products: Product[]): { subject: string; html: string } {
  const top3 = products.slice(0, 3);
  return {
    subject: "Dein 10% Rabattcode l\u00e4uft bald ab!",
    html: wrapEmail({
      headline: "Nicht vergessen: Dein Rabatt wartet!",
      subtitle: "Dein Code l\u00e4uft bald ab",
      bodyHtml: `
        <p style="color:#555;line-height:1.6;margin:0 0 16px">
          Dein persönlicher <strong>10% Willkommens-Rabatt</strong> ist bald nicht mehr gültig.
          Nutze ihn jetzt, bevor es zu spät ist!
        </p>
        <div style="background:#faf5ef;border:2px dashed #e8a87c;border-radius:12px;padding:24px;text-align:center;margin:0 0 24px">
          <p style="color:#555;margin:0 0 8px;font-size:14px">Dein Rabattcode:</p>
          <p style="font-family:monospace;font-size:28px;font-weight:bold;color:#c87f5a;margin:0;letter-spacing:3px">WILLKOMMEN10</p>
          <p style="color:#ef4444;margin:12px 0 0;font-size:14px;font-weight:600">Nur noch wenige Tage gültig!</p>
        </div>
        <p style="color:#555;line-height:1.6;margin:0 0 16px">
          Hier sind einige Produkte, die perfekt zu deinem Rabatt passen:
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
          ${buildProductRows(top3)}
        </table>
      `,
      ctaText: "Jetzt 10% sparen",
      ctaUrl: `${SITE_URL}/shop`,
    }),
  };
}

// ── Sequence Step 4 (Day 10): New Arrivals ──

function buildDay10Email(products: Product[]): { subject: string; html: string } {
  const items = products.slice(0, 4);
  return {
    subject: "Neu eingetroffen bei TrendWare",
    html: wrapEmail({
      headline: "Frisch eingetroffen!",
      subtitle: "Neue Produkte im Shop",
      bodyHtml: `
        <p style="color:#555;line-height:1.6;margin:0 0 16px">
          Wir haben neue smarte Produkte für dich! Entdecke unsere neuesten Ergänzungen –
          frisch im Sortiment und bereit, deinen Alltag zu verbessern.
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
          ${buildProductRows(items)}
        </table>
      `,
      ctaText: "Alle Neuheiten ansehen",
      ctaUrl: `${SITE_URL}/shop`,
    }),
  };
}

// ── Sequence Step 5 (Day 20): Comeback Offer ──

function buildDay20Email(products: Product[]): { subject: string; html: string } {
  const top4 = products.slice(0, 4);
  return {
    subject: "Wir vermissen dich! Hier ist ein Extra-Rabatt",
    html: wrapEmail({
      headline: "Wir vermissen dich!",
      subtitle: "Ein besonderes Angebot nur f\u00fcr dich",
      bodyHtml: `
        <p style="color:#555;line-height:1.6;margin:0 0 16px">
          Lange nicht gesehen! Weil wir dich als Kunden gewinnen möchten, haben wir einen
          <strong>exklusiven 15% Rabattcode</strong> nur für dich.
        </p>
        <div style="background:#f0fdf4;border:2px dashed #22c55e;border-radius:12px;padding:24px;text-align:center;margin:0 0 24px">
          <p style="color:#555;margin:0 0 8px;font-size:14px">Dein exklusiver Rabattcode:</p>
          <p style="font-family:monospace;font-size:28px;font-weight:bold;color:#16a34a;margin:0;letter-spacing:3px">COMEBACK15</p>
          <p style="color:#16a34a;margin:12px 0 0;font-size:14px;font-weight:600">15% Rabatt auf deine gesamte Bestellung!</p>
        </div>
        <p style="color:#555;line-height:1.6;margin:0 0 16px">
          Hier sind einige Produkte mit verifizierten Bewertungen:
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
          ${buildProductRows(top4)}
        </table>
      `,
      ctaText: "Jetzt 15% sparen",
      ctaUrl: `${SITE_URL}/shop`,
    }),
  };
}

// ── Sequence Logic ──

interface SequenceEmail {
  subject: string;
  html: string;
}

/**
 * Determines which email (if any) should be sent next for a subscriber.
 * Returns null if no email is due.
 *
 * Sequence (emailsSent tracks how many have been sent, starting at 1 for welcome):
 *   emailsSent=1 -> Day 2:  Bestseller showcase
 *   emailsSent=2 -> Day 5:  Urgency reminder (WILLKOMMEN10)
 *   emailsSent=3 -> Day 10: New arrivals
 *   emailsSent=4 -> Day 20: Comeback offer (COMEBACK15)
 *   emailsSent=5 -> Sequence complete
 */
function getNextSequenceEmail(
  emailsSent: number,
  daysSinceSubscribed: number,
  bestsellers: Product[],
  newArrivals: Product[]
): SequenceEmail | null {
  switch (emailsSent) {
    case 1:
      if (daysSinceSubscribed >= 2) return buildDay2Email(bestsellers);
      break;
    case 2:
      if (daysSinceSubscribed >= 5) return buildDay5Email(bestsellers);
      break;
    case 3:
      if (daysSinceSubscribed >= 10) {
        // Use new arrivals if available, fall back to bestsellers
        const items = newArrivals.length > 0 ? newArrivals : bestsellers;
        return buildDay10Email(items);
      }
      break;
    case 4:
      if (daysSinceSubscribed >= 20) return buildDay20Email(bestsellers);
      break;
    default:
      // Sequence complete (emailsSent >= 5)
      break;
  }
  return null;
}

// ── Route Handler ──

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

    // Fetch subscribers and products in parallel
    const [subscribers, bestsellers, newArrivals] = await Promise.all([
      getNewsletterSubscribers(),
      getBestsellers(),
      getNewArrivals(),
    ]);

    if (bestsellers.length === 0) {
      return NextResponse.json({ success: true, message: "Bewertungsautomation pausiert: keine verifizierten Shop-Bewertungen vorhanden.", processed: 0, sent: 0, skipped: subscribers.length });
    }

    if (subscribers.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No subscribers found",
        processed: 0,
        sent: 0,
        skipped: 0,
      });
    }

    const resend = new Resend(apiKey);
    const BATCH_SIZE = 100;

    let sent = 0;
    let skipped = 0;
    let noState = 0;

    // Collect emails to send in batches grouped by sequence step
    const emailsToSend: { to: string; subject: string; html: string; email: string; newEmailsSent: number }[] = [];

    for (const subscriberEmail of subscribers) {
      const state = await getEmailSequenceState(subscriberEmail);

      // If no sequence state exists (subscriber signed up before this feature),
      // initialize them with current timestamp and emailsSent=1 (assume welcome was sent)
      if (!state) {
        noState++;
        await setEmailSequenceState(subscriberEmail, {
          subscribedAt: new Date().toISOString(),
          lastEmailSent: new Date().toISOString(),
          emailsSent: 1,
        });
        continue;
      }

      // Sequence complete
      if (state.emailsSent >= 5) {
        skipped++;
        continue;
      }

      const daysSinceSubscribed = daysSince(state.subscribedAt);
      const nextEmail = getNextSequenceEmail(
        state.emailsSent,
        daysSinceSubscribed,
        bestsellers,
        newArrivals
      );

      if (!nextEmail) {
        skipped++;
        continue;
      }

      emailsToSend.push({
        to: subscriberEmail,
        subject: nextEmail.subject,
        html: nextEmail.html,
        email: subscriberEmail,
        newEmailsSent: state.emailsSent + 1,
      });
    }

    // Send emails using Resend batch API
    for (let i = 0; i < emailsToSend.length; i += BATCH_SIZE) {
      const batch = emailsToSend.slice(i, i + BATCH_SIZE);

      const batchPayload = batch.map((item) => ({
        from: FROM_EMAIL,
        to: item.to,
        subject: item.subject,
        html: item.html,
      }));

      await resend.batch.send(batchPayload);

      // Update sequence state for each subscriber in this batch
      for (const item of batch) {
        await setEmailSequenceState(item.email, {
          subscribedAt: (await getEmailSequenceState(item.email))!.subscribedAt,
          lastEmailSent: new Date().toISOString(),
          emailsSent: item.newEmailsSent,
        });
        sent++;
      }
    }

    return NextResponse.json({
      success: true,
      processed: subscribers.length,
      sent,
      skipped,
      initialized: noState,
    });
  } catch (err) {
    console.error("Email sequence cron error:", err);
    return NextResponse.json(
      {
        error: "Failed to process email sequence",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
