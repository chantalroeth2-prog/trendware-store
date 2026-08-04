import { NextResponse } from "next/server";
import { Resend } from "resend";
import { callGroq } from "@/lib/groq";
import { getAllProducts } from "@/data/product-store";
import type { Product } from "@/data/products";

const OWNER_EMAIL = "kontakt.trendware@gmail.com";
const FROM_EMAIL = "TrendWare Agent <noreply@trendware.store>";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Pick `count` random products, preferring different categories.
 */
function pickRandomProducts(products: Product[], count: number): Product[] {
  if (products.length <= count) return products;

  // Group by category
  const byCategory: Record<string, Product[]> = {};
  for (const p of products) {
    const key = p.categorySlug;
    if (!byCategory[key]) byCategory[key] = [];
    byCategory[key].push(p);
  }

  const picked: Product[] = [];
  const usedSlugs = new Set<string>();
  const categoryKeys = Object.keys(byCategory).sort(() => Math.random() - 0.5);

  // Round-robin through categories
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
    // Safety: if we cycled through all categories without finding anything, break
    if (catIndex > categoryKeys.length * count) break;
  }

  return picked;
}

/**
 * Build the product info block that is injected into the Gemini prompt.
 */
function productInfoBlock(product: Product): string {
  return [
    `Produktname: ${product.title}`,
    `Kurzbeschreibung: ${product.shortDescription}`,
    `Preis: ${product.price.toFixed(2)} EUR${product.compareAtPrice ? ` (statt ${product.compareAtPrice.toFixed(2)} EUR)` : ""}`,
    `Kategorie: ${product.category}`,
    `Features: ${product.features.join(", ")}`,
    `Bewertung: ${product.rating}/5 (${product.reviewCount} Bewertungen)`,
    `Bild-URL: ${product.images[0] || "keine"}`,
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Gemini content generation
// ---------------------------------------------------------------------------

interface SocialContent {
  product: Product;
  tiktok: string;
  instagram: string;
  pinterest: string;
}

async function generateSocialContent(
  products: Product[]
): Promise<SocialContent[]> {
  const results: SocialContent[] = [];

  for (const product of products) {
    const prompt = `Du bist ein Social-Media-Creator für den deutschen Online-Shop "TrendWare" (trendware.store) — Tagline: "dein smarter shop".
TrendWare ist warm, persönlich und freundlich — wie ein guter Freund der dir Produkte empfiehlt. NICHT kalt oder corporate.
Markenidentität: Logo-Font Comfortaa (rund, freundlich), "trend" in dunkelbraun (#3d3530), "ware" in warmem Sienna (#c87f5a), kleines Paket-Icon. Farben: Sienna #c87f5a (primär), Apricot #e8a87c (hell), Dunkelbraun #3d3530 (Text), warmes Creme #faf5ef (Hintergrund).
Tonalität: Du-Form, warm, einladend, locker — wie eine Freundin die einen Tipp gibt.
Du denkst VIDEO FIRST und orientierst dich am Temu/Shein-Stil: viele kurze, einfache Videos die wie echte User-Videos wirken — NICHT wie Hochglanz-Werbung.

${productInfoBlock(product)}

Erstelle DREI Content-Stücke. Antworte NUR mit dem folgenden Format (keine Markdown-Codeblöcke, kein JSON):

===TIKTOK===
Erstelle ein TikTok-Reel-Skript (7-15 Sekunden, KURZ!). Es soll wie ein echtes UGC-Video wirken, nicht wie Werbung.
- FORMAT: Wähle eins: Unboxing / Produkt-Demo im Alltag / "Ich hab das für X EUR bekommen" / Vorher-Nachher / POV-Reaktion / Mini-Haul
- HOOK (erste 1-2 Sek): Ein Satz der sofort Neugier weckt. Beispiele: "Ich hätte nie gedacht dass..." / "Das hat nur X EUR gekostet" / "POV: Du entdeckst gerade..." / "Warum redet niemand über..."
- SZENE: Beschreibe genau: Kamera-Perspektive (POV, Selfie, Over-the-Shoulder, Flatlay), was im Bild ist (Hände, Produkt, echte Umgebung), Bewegungen (auspacken, drehen, anwenden)
- TONALITÄT: Lockere gesprochene Sprache, wie eine echte Person die ein Produkt zeigt. Kleine Unvollkommenheiten sind gewollt. KEIN Marketing-Sprech.
- CTA: Natürlich eingebaut ("Link in Bio" oder "Schreibt mal in die Kommentare")
- Zeitangaben in eckigen Klammern [0:00-0:02]
- DAUER: Maximal 15 Sekunden!

===INSTAGRAM===
Erstelle ein Instagram-Reel-Konzept (6-12 Sekunden) + Caption. VIDEO hat Priorität über Bilder!
- FORMAT: Wähle eins: Schnelle Produkt-Demo / "Das brauchst du" / Auspacken + erste Reaktion / Alltags-Szene mit Produkt / Transformation
- HOOK (erste 1-2 Sek): Starker visueller Hook + Text-Overlay-Vorschlag
- SZENE: Kamera-Perspektive, Setting (echte Wohnung/Küche/Schreibtisch), Person/Hand im Bild, Produktbewegung, Schnitte
- VIDEODAUER: 6-12 Sekunden
- CAPTION: 2-3 lockere Sätze (kein Marketing-Deutsch, sondern wie ein Freund der einen Tipp gibt) + CTA
- HASHTAGS: 12 Hashtags (4 Nische, 4 Zielgruppe, 2 Brand z.B. #trendware #deinsmartershop, 2 Aktion)
- ALTERNATIV: Falls ein Carousel besser passt, erstelle 5 Slides mit visueller Beschreibung

===PINTEREST===
Erstelle eine Pinterest-Pin-Beschreibung + Video-Pin-Idee.
- VIDEO-PIN: Kurze Beschreibung für einen 6-15 Sek Video-Pin (was zeigen, welche Bewegung, welcher Text-Overlay)
- SEO-BESCHREIBUNG: 150-300 Wörter, natürlicher Schreibstil, keyword-reich für deutsche Pinterest-Suche
- 5-8 relevante Hashtags am Ende
- Zielgruppe: 18-35, deutsch, design-affin

WICHTIG: Alles soll sich anfühlen wie von einer echten Kundin mit dem Handy aufgenommen. Kein perfekter KI-Content. Lockere, echte Sprache. Der Ton ist warm und persönlich — TrendWare ist "dein smarter shop", nicht eine kalte Marke.`;

    // Retry up to 2 times on failure
    let lastError: unknown = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const text = await callGroq(prompt, { maxTokens: 4096 });

        // Parse sections
        const tiktokMatch = text.match(
          /===TIKTOK===([\s\S]*?)(?====INSTAGRAM===|$)/
        );
        const instagramMatch = text.match(
          /===INSTAGRAM===([\s\S]*?)(?====PINTEREST===|$)/
        );
        const pinterestMatch = text.match(/===PINTEREST===([\s\S]*?)$/);

        results.push({
          product,
          tiktok: tiktokMatch?.[1]?.trim() || text,
          instagram: instagramMatch?.[1]?.trim() || "",
          pinterest: pinterestMatch?.[1]?.trim() || "",
        });
        lastError = null;
        break;
      } catch (err) {
        lastError = err;
        console.error(
          `Groq Fehler für "${product.title}" (Versuch ${attempt + 1}/2):`,
          err
        );
        if (attempt < 1) {
          // Wait 3 seconds before retry
          await new Promise((r) => setTimeout(r, 3000));
        }
      }
    }

    if (lastError) {
      results.push({
        product,
        tiktok: `Fehler bei der Generierung für ${product.title} (nach 2 Versuchen)`,
        instagram: "",
        pinterest: "",
      });
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Email rendering
// ---------------------------------------------------------------------------

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderEmail(contents: SocialContent[]): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString("de-DE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const contentCards = contents
    .map((c, index) => {
      const productImageUrl = c.product.images[0] || "";
      const price = c.product.price.toFixed(2);
      const comparePrice = c.product.compareAtPrice
        ? c.product.compareAtPrice.toFixed(2)
        : null;

      return `
        <!-- Produkt ${index + 1} -->
        <div style="margin:32px 0;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden">
          <!-- Produkt-Header -->
          <div style="background:linear-gradient(135deg,#c87f5a,#e8a87c);padding:20px;display:flex;align-items:center;gap:16px">
            ${productImageUrl ? `<img src="${productImageUrl}" alt="${escapeHtml(c.product.title)}" style="width:80px;height:80px;object-fit:cover;border-radius:12px;border:3px solid rgba(255,255,255,0.3)" />` : ""}
            <div>
              <h3 style="margin:0;color:#3d3530;font-size:18px">${escapeHtml(c.product.title)}</h3>
              <p style="margin:4px 0 0;color:rgba(61,53,48,0.8);font-size:14px">
                ${comparePrice ? `<span style="text-decoration:line-through;opacity:0.6">${comparePrice} EUR</span> ` : ""}${price} EUR &middot; ${escapeHtml(c.product.category)}
              </p>
            </div>
          </div>

          <!-- TikTok -->
          <div style="padding:20px;border-bottom:1px solid #f3f4f6">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
              <span style="display:inline-block;background:#010101;color:#fff;font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px">TikTok</span>
              <span style="color:#999;font-size:12px">UGC Reel-Skript (7-15 Sek.)</span>
            </div>
            <pre style="background:#fafafa;border:1px solid #eee;border-radius:10px;padding:16px;font-family:'Segoe UI',Tahoma,sans-serif;font-size:13px;line-height:1.6;white-space:pre-wrap;word-wrap:break-word;color:#333;margin:0">${escapeHtml(c.tiktok)}</pre>
          </div>

          <!-- Instagram -->
          <div style="padding:20px;border-bottom:1px solid #f3f4f6">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
              <span style="display:inline-block;background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);color:#fff;font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px">Instagram</span>
              <span style="color:#999;font-size:12px">Reel-Konzept + Caption</span>
            </div>
            <pre style="background:#fafafa;border:1px solid #eee;border-radius:10px;padding:16px;font-family:'Segoe UI',Tahoma,sans-serif;font-size:13px;line-height:1.6;white-space:pre-wrap;word-wrap:break-word;color:#333;margin:0">${escapeHtml(c.instagram)}</pre>
          </div>

          <!-- Pinterest -->
          <div style="padding:20px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
              <span style="display:inline-block;background:#e60023;color:#fff;font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px">Pinterest</span>
              <span style="color:#999;font-size:12px">Video-Pin + SEO-Beschreibung</span>
            </div>
            <pre style="background:#fafafa;border:1px solid #eee;border-radius:10px;padding:16px;font-family:'Segoe UI',Tahoma,sans-serif;font-size:13px;line-height:1.6;white-space:pre-wrap;word-wrap:break-word;color:#333;margin:0">${escapeHtml(c.pinterest)}</pre>
          </div>
        </div>`;
    })
    .join("");

  return `
    <div style="font-family:Comfortaa,'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:640px;margin:0 auto;background:#faf5ef">
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#c87f5a,#e8a87c);padding:32px 24px;border-radius:8px 8px 0 0;text-align:center">
        <h1 style="color:#3d3530;margin:0;font-size:24px;font-family:Comfortaa,sans-serif">trend<span style="color:#c87f5a">ware</span></h1>
        <p style="color:rgba(61,53,48,0.6);margin:4px 0 0;font-size:12px">dein smarter shop</p>
        <h2 style="color:#3d3530;margin:8px 0 0;font-size:18px;font-weight:400">Social Media Content der Woche</h2>
        <p style="color:rgba(61,53,48,0.5);margin:8px 0 0;font-size:13px">${dateStr}</p>
      </div>

      <!-- Body -->
      <div style="padding:24px;background:#fff;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
        <!-- WICHTIG: Business-Account Hinweis -->
        <div style="background:#fef2f2;border:2px solid #fca5a5;border-radius:12px;padding:16px;margin:0 0 20px">
          <p style="margin:0;color:#991b1b;font-size:14px;font-weight:700;line-height:1.5">
            &#9888; WICHTIG: Nur auf TrendWare Business-Accounts posten!
          </p>
          <p style="margin:6px 0 0;color:#b91c1c;font-size:13px;line-height:1.5">
            Dieser Content ist ausschließlich für die offiziellen TrendWare Business-Accounts bestimmt.
            Bitte NICHT auf persönlichen Accounts posten!
          </p>
          <ul style="margin:8px 0 0;padding-left:20px;color:#b91c1c;font-size:13px;line-height:1.8">
            <li><strong>TikTok:</strong> Nur auf dem TrendWare Business-TikTok</li>
            <li><strong>Instagram:</strong> Nur auf dem TrendWare Business-Instagram</li>
            <li><strong>Pinterest:</strong> Nur auf dem TrendWare Business-Pinterest</li>
          </ul>
        </div>

        <p style="color:#3d3530;font-size:15px;line-height:1.6;margin:0 0 8px">
          Hier ist dein fertig generierter Social-Media-Content für diese Woche.
          Einfach kopieren, anpassen und auf den Business-Accounts posten!
        </p>
        <p style="color:#7a6e66;font-size:13px;margin:0 0 24px">
          ${contents.length} Produkte &middot; ${contents.length * 3} Content-Stücke &middot; 3 Plattformen
        </p>

        ${contentCards}

        <!-- Footer -->
        <div style="margin-top:32px;padding-top:20px;border-top:1px solid #eee;text-align:center">
          <p style="color:#999;font-size:12px;margin:0">
            Automatisch generiert von TrendWare Agent
          </p>
          <p style="color:#bbb;font-size:11px;margin:4px 0 0">
            Tipp: Passe den Content leicht an, bevor du ihn postest, damit er noch authentischer wirkt.
          </p>
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
    const products = await getAllProducts();
    if (products.length === 0) {
      return NextResponse.json({
        message: "Keine Produkte vorhanden.",
      });
    }

    // 2. Pick 3 random products (different categories if possible)
    const selected = pickRandomProducts(products, 3);
    console.log(
      `Social Content: ${selected.length} Produkte ausgewählt:`,
      selected.map((p) => p.title)
    );

    // 3. Generate social media content via Gemini Flash
    const contents = await generateSocialContent(selected);

    // 4. Send email via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.warn("RESEND_API_KEY fehlt – E-Mail wird nicht versendet.");
      return NextResponse.json({
        message: "Content generiert, aber E-Mail-Versand nicht möglich (RESEND_API_KEY fehlt).",
        products: selected.map((p) => p.title),
      });
    }

    const resend = new Resend(resendKey);
    const html = renderEmail(contents);

    await resend.emails.send({
      from: FROM_EMAIL,
      to: OWNER_EMAIL,
      subject: "Social Media Content der Woche",
      html,
    });

    return NextResponse.json({
      message: "Social Media Content generiert und versendet.",
      products: selected.map((p) => ({
        title: p.title,
        category: p.category,
      })),
      contentPieces: contents.length * 3,
    });
  } catch (error) {
    console.error("Social Content Cron Fehler:", error);
    return NextResponse.json(
      { error: "Fehler bei der Social-Content-Generierung." },
      { status: 500 }
    );
  }
}
