import { NextResponse } from "next/server";
import { Resend } from "resend";
import { callGroq } from "@/lib/groq";
import { getAllProducts } from "@/data/product-store";
import type { Product } from "@/data/products";
import { hasVerifiedReviews, isProductOrderable } from "@/lib/product-compliance";

const OWNER_EMAIL = "kontakt.trendware@gmail.com";
const FROM_EMAIL = process.env.EMAIL_FROM || "TrendWare Agent <onboarding@resend.dev>";
const BASE_URL = "https://trendware7.store";
const PINTEREST_API_BASE = "https://api.pinterest.com/v5";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Pick `count` random products, preferring different categories.
 */
function pickRandomProducts(products: Product[], count: number): Product[] {
  if (products.length <= count) return products;

  const byCategory: Record<string, Product[]> = {};
  for (const p of products) {
    const key = p.categorySlug;
    if (!byCategory[key]) byCategory[key] = [];
    byCategory[key].push(p);
  }

  const picked: Product[] = [];
  const usedSlugs = new Set<string>();
  const categoryKeys = Object.keys(byCategory).sort(() => Math.random() - 0.5);

  let catIndex = 0;
  while (picked.length < count) {
    const key = categoryKeys[catIndex % categoryKeys.length];
    const pool = byCategory[key].filter((p) => !usedSlugs.has(p.slug));
    if (pool.length > 0) {
      const rand = pool[Math.floor(Math.random() * pool.length)];
      picked.push(rand);
      usedSlugs.add(rand.slug);
    }
    catIndex++;
    if (catIndex > categoryKeys.length * count) break;
  }

  return picked;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ---------------------------------------------------------------------------
// Gemini: Generate SEO-optimised German pin descriptions
// ---------------------------------------------------------------------------

interface PinContent {
  product: Product;
  title: string;
  description: string;
}

async function generatePinContent(
  products: Product[]
): Promise<PinContent[]> {
  const results: PinContent[] = [];

  for (const product of products) {
    const prompt = `Du bist ein Pinterest-SEO-Experte für den deutschen Online-Shop "TrendWare" (trendware7.store).
Erstelle einen Pinterest-Pin für das folgende Produkt.

Produktname: ${product.title}
Kurzbeschreibung: ${product.shortDescription}
Preis: ${product.price.toFixed(2)} EUR${product.compareAtPrice ? ` (statt ${product.compareAtPrice.toFixed(2)} EUR)` : ""}
Kategorie: ${product.category}
Features: ${product.features.join(", ")}

Antworte NUR mit dem folgenden Format (keine Markdown-Codeblöcke):

===TITLE===
Ein kurzer, aufmerksamkeitsstarker Titel für den Pin (max. 100 Zeichen).
Muss Keywords enthalten, die deutsche Pinterest-Nutzer suchen würden.

===DESCRIPTION===
Eine SEO-optimierte Pin-Beschreibung auf Deutsch (150-300 Wörter).
- Natürlicher Schreibstil, aber keyword-reich
- Long-Tail Keywords für deutsche Pinterest-Suche einbauen
- Beschreibe das Produkt ausführlich mit allen Vorteilen
- Nenne den Preis und erwähne das Angebot falls reduziert
- Baue relevante Suchbegriffe ein (z.B. "Geschenkidee", "Home Deko", "Gadget")
- 5-8 relevante Hashtags am Ende
- Zielgruppe: 18-35, deutsch, design-affin, trendbewusst
- Erwähne am Ende: "Jetzt bei TrendWare entdecken"`;

    try {
      const text = await callGroq(prompt);

      const titleMatch = text.match(
        /===TITLE===([\s\S]*?)(?====DESCRIPTION===|$)/
      );
      const descMatch = text.match(/===DESCRIPTION===([\s\S]*?)$/);

      results.push({
        product,
        title: titleMatch?.[1]?.trim() || product.title,
        description: descMatch?.[1]?.trim() || product.shortDescription,
      });
    } catch (err) {
      console.error(
        `Groq Fehler für "${product.title}":`,
        err
      );
      results.push({
        product,
        title: product.title,
        description: `${product.shortDescription} - Jetzt bei TrendWare entdecken! ${product.features.join(". ")}. Preis: ${product.price.toFixed(2)} EUR.`,
      });
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Pinterest API v5: Create a pin
// ---------------------------------------------------------------------------

interface PinterestPinResult {
  success: boolean;
  pinId?: string;
  error?: string;
}

async function createPinterestPin(
  pin: PinContent,
  boardId: string,
  accessToken: string
): Promise<PinterestPinResult> {
  const productUrl = `${BASE_URL}/product/${pin.product.slug}`;
  const imageUrl = pin.product.images[0];

  if (!imageUrl) {
    return { success: false, error: "Kein Produktbild vorhanden" };
  }

  try {
    const response = await fetch(`${PINTEREST_API_BASE}/pins`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        board_id: boardId,
        title: pin.title.slice(0, 100),
        description: pin.description.slice(0, 500),
        link: productUrl,
        media_source: {
          source_type: "image_url",
          url: imageUrl,
        },
        alt_text: `${pin.product.title} - ${pin.product.shortDescription}`,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `Pinterest API Fehler (${response.status}):`,
        errorBody
      );
      return {
        success: false,
        error: `HTTP ${response.status}: ${errorBody.slice(0, 200)}`,
      };
    }

    const data = await response.json();
    return { success: true, pinId: data.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Pinterest API Verbindungsfehler:", message);
    return { success: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Email rendering
// ---------------------------------------------------------------------------

interface PinReport {
  pin: PinContent;
  posted: boolean;
  pinId?: string;
  error?: string;
}

function renderReportEmail(
  reports: PinReport[],
  pinterestConfigured: boolean
): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString("de-DE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const postedCount = reports.filter((r) => r.posted).length;
  const failedCount = reports.filter((r) => !r.posted).length;

  const cards = reports
    .map((report, index) => {
      const p = report.pin.product;
      const productImageUrl = p.images[0] || "";
      const price = p.price.toFixed(2);
      const comparePrice = p.compareAtPrice
        ? p.compareAtPrice.toFixed(2)
        : null;
      const productUrl = `${BASE_URL}/product/${p.slug}`;

      const statusBadge = report.posted
        ? '<span style="display:inline-block;background:#22c55e;color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px">Gepostet</span>'
        : '<span style="display:inline-block;background:#f59e0b;color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px">Manuell posten</span>';

      return `
        <!-- Pin ${index + 1} -->
        <div style="margin:24px 0;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden">
          <!-- Pin Header -->
          <div style="background:linear-gradient(135deg,#e60023,#ad081b);padding:16px 20px;display:flex;align-items:center;gap:16px">
            ${productImageUrl ? `<img src="${productImageUrl}" alt="${escapeHtml(p.title)}" style="width:70px;height:70px;object-fit:cover;border-radius:10px;border:2px solid rgba(255,255,255,0.3)" />` : ""}
            <div style="flex:1">
              <div style="display:flex;justify-content:space-between;align-items:start">
                <h3 style="margin:0;color:#fff;font-size:16px">${escapeHtml(p.title)}</h3>
              </div>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px">
                ${comparePrice ? `<span style="text-decoration:line-through;opacity:0.6">${comparePrice} EUR</span> ` : ""}${price} EUR &middot; ${escapeHtml(p.category)}
              </p>
            </div>
            <div>${statusBadge}</div>
          </div>

          <!-- Pin Content -->
          <div style="padding:20px">
            ${report.posted && report.pinId ? `<p style="margin:0 0 12px;color:#22c55e;font-size:13px;font-weight:600">Pin ID: ${report.pinId}</p>` : ""}
            ${report.error ? `<p style="margin:0 0 12px;color:#dc2626;font-size:13px">Fehler: ${escapeHtml(report.error)}</p>` : ""}

            <div style="margin-bottom:12px">
              <p style="margin:0 0 4px;color:#666;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">Pin-Titel:</p>
              <p style="margin:0;color:#333;font-size:15px;font-weight:600">${escapeHtml(report.pin.title)}</p>
            </div>

            <div style="margin-bottom:12px">
              <p style="margin:0 0 4px;color:#666;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">Pin-Beschreibung:</p>
              <pre style="background:#fafafa;border:1px solid #eee;border-radius:10px;padding:14px;font-family:'Segoe UI',Tahoma,sans-serif;font-size:12px;line-height:1.6;white-space:pre-wrap;word-wrap:break-word;color:#333;margin:0">${escapeHtml(report.pin.description)}</pre>
            </div>

            <div>
              <p style="margin:0 0 4px;color:#666;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">Produkt-Link:</p>
              <a href="${productUrl}" style="color:#e60023;font-size:13px">${productUrl}</a>
            </div>

            ${!report.posted ? `
            <div style="margin-top:16px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px">
              <p style="margin:0;color:#92400e;font-size:12px;line-height:1.5">
                <strong>Manuell posten:</strong> Kopiere Titel und Beschreibung oben und erstelle den Pin auf
                <a href="https://www.pinterest.de/pin-creation-tool/" style="color:#e60023;font-weight:600">pinterest.de</a>
                mit dem Produktbild.
              </p>
            </div>` : ""}
          </div>
        </div>`;
    })
    .join("");

  return `
    <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:640px;margin:0 auto;background:#f9fafb">
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#e60023,#ad081b);padding:32px 24px;border-radius:8px 8px 0 0;text-align:center">
        <h1 style="color:#fff;margin:0;font-size:24px">Trend<span style="color:#fecaca">Ware</span> Pinterest</h1>
        <h2 style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:18px;font-weight:400">
          ${pinterestConfigured ? "Wöchentlicher Pin-Report" : "Pin-Content zum manuellen Posten"}
        </h2>
        <p style="color:rgba(255,255,255,0.5);margin:8px 0 0;font-size:13px">${dateStr}</p>
      </div>

      <!-- Body -->
      <div style="padding:24px;background:#fff;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
        <!-- WICHTIG: Business-Account Hinweis -->
        <div style="background:#fef2f2;border:2px solid #fca5a5;border-radius:12px;padding:16px;margin:0 0 20px">
          <p style="margin:0;color:#991b1b;font-size:14px;font-weight:700;line-height:1.5">
            &#9888; WICHTIG: Nur auf dem TrendWare Business-Pinterest posten!
          </p>
          <p style="margin:6px 0 0;color:#b91c1c;font-size:13px;line-height:1.5">
            Dieser Content ist ausschließlich für den offiziellen TrendWare Pinterest-Account bestimmt.
            Bitte NICHT auf persönlichen Accounts posten!
          </p>
        </div>

        <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 8px">
          ${pinterestConfigured
            ? `${postedCount} Pins erfolgreich auf dem Business-Account gepostet${failedCount > 0 ? `, ${failedCount} fehlgeschlagen` : ""}.`
            : "Pinterest API nicht konfiguriert. Hier ist der fertige Pin-Content zum manuellen Posten auf dem TrendWare Business-Account."}
        </p>
        <p style="color:#888;font-size:13px;margin:0 0 24px">
          ${reports.length} Produkte &middot; ${postedCount} auto-gepostet &middot; ${failedCount} manuell
        </p>

        ${cards}

        <!-- Footer -->
        <div style="margin-top:32px;padding-top:20px;border-top:1px solid #eee;text-align:center">
          <p style="color:#999;font-size:12px;margin:0">
            Automatisch generiert von TrendWare Agent &middot; Pinterest API v5
          </p>
          ${!pinterestConfigured ? `
          <p style="color:#bbb;font-size:11px;margin:8px 0 0">
            Tipp: Setze PINTEREST_ACCESS_TOKEN und PINTEREST_BOARD_ID in den Umgebungsvariablen,
            damit Pins automatisch gepostet werden.
          </p>` : ""}
        </div>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Get all products
    const products = (await getAllProducts()).filter(isProductOrderable);
    if (!products.some(hasVerifiedReviews)) {
      return NextResponse.json({ success: true, message: "Pinterest-Automation pausiert: keine verifizierten Shop-Bewertungen vorhanden." });
    }
    if (products.length === 0) {
      return NextResponse.json({
        message: "Keine Produkte vorhanden.",
      });
    }

    // 2. Pick 3 random products (different categories if possible)
    const selected = pickRandomProducts(products, 3);
    console.log(
      `Pinterest Pin: ${selected.length} Produkte ausgewählt:`,
      selected.map((p) => p.title)
    );

    // 3. Generate SEO-optimised pin content via Gemini Flash
    const pinContents = await generatePinContent(selected);

    // 4. Check Pinterest API configuration
    const pinterestToken = process.env.PINTEREST_ACCESS_TOKEN;
    const pinterestBoardId = process.env.PINTEREST_BOARD_ID;
    const pinterestConfigured = !!(pinterestToken && pinterestBoardId);

    if (!pinterestConfigured) {
      console.warn(
        "Pinterest API nicht konfiguriert (PINTEREST_ACCESS_TOKEN oder PINTEREST_BOARD_ID fehlt). " +
        "Pin-Content wird per E-Mail zum manuellen Posten gesendet."
      );
    }

    // 5. Attempt to post pins to Pinterest (or just generate content for email)
    const reports: PinReport[] = [];

    for (const pin of pinContents) {
      if (pinterestConfigured) {
        const result = await createPinterestPin(
          pin,
          pinterestBoardId!,
          pinterestToken!
        );
        reports.push({
          pin,
          posted: result.success,
          pinId: result.pinId,
          error: result.error,
        });

        if (result.success) {
          console.log(
            `Pin erstellt für "${pin.product.title}": ${result.pinId}`
          );
        } else {
          console.error(
            `Pin-Erstellung fehlgeschlagen für "${pin.product.title}": ${result.error}`
          );
        }
      } else {
        reports.push({
          pin,
          posted: false,
          error: "Pinterest API nicht konfiguriert",
        });
      }
    }

    // 6. Send email report via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.warn("RESEND_API_KEY fehlt – E-Mail wird nicht versendet.");
      return NextResponse.json({
        message: "Pin-Content generiert, aber E-Mail-Versand nicht möglich (RESEND_API_KEY fehlt).",
        products: selected.map((p) => p.title),
        pinterestConfigured,
        posted: reports.filter((r) => r.posted).length,
      });
    }

    const resend = new Resend(resendKey);
    const html = renderReportEmail(reports, pinterestConfigured);

    const postedCount = reports.filter((r) => r.posted).length;
    const subject = pinterestConfigured
      ? `Pinterest: ${postedCount}/${reports.length} Pins gepostet`
      : `Pinterest Pin-Content: ${reports.length} Pins zum manuellen Posten`;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: OWNER_EMAIL,
      subject,
      html,
    });

    return NextResponse.json({
      message: pinterestConfigured
        ? "Pinterest Pins erstellt und Report versendet."
        : "Pin-Content generiert und per E-Mail versendet (manuelles Posten nötig).",
      products: selected.map((p) => ({
        title: p.title,
        category: p.category,
      })),
      pinterestConfigured,
      posted: postedCount,
      failed: reports.filter((r) => !r.posted).length,
    });
  } catch (error) {
    console.error("Pinterest Pin Cron Fehler:", error);
    return NextResponse.json(
      { error: "Fehler bei der Pinterest-Pin-Erstellung." },
      { status: 500 }
    );
  }
}
