import { NextResponse } from "next/server";
import { Resend } from "resend";
import { callGroq } from "@/lib/groq";
import { getAllProducts } from "@/data/product-store";
import type { Product } from "@/data/products";
import { kv } from "@vercel/kv";

const OWNER_EMAIL = "kontakt.trendware@gmail.com";
const FROM_EMAIL = "TrendWare Agent <noreply@trendware.store>";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://trendware.store";
const GRAPH_API = "https://graph.facebook.com/v25.0";

// Post-Typen für Content-Rotation (Instagram Best Practices 2025/2026)
const POST_TYPES = [
  "product-showcase",     // Produktvorstellung mit Features + Preis
  "social-proof",         // Bewertungen, Bestseller-Status, Beliebtheit
  "problem-solution",     // Problem beschreiben → Produkt als Lösung
  "lifestyle",            // Produkt im Alltag, Emotionen, Wohlfühlen
  "deal-highlight",       // Angebot, Rabatt, Preisvergleich im Fokus
] as const;

type PostType = (typeof POST_TYPES)[number];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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
// KV: Track recently posted products to avoid repetition
// ---------------------------------------------------------------------------

async function getRecentlyPosted(): Promise<string[]> {
  try {
    return (await kv.get<string[]>("ig:recently-posted")) || [];
  } catch {
    return [];
  }
}

async function trackPostedProduct(slug: string): Promise<void> {
  try {
    const recent = await getRecentlyPosted();
    const updated = [slug, ...recent.filter((s) => s !== slug)].slice(0, 20);
    await kv.set("ig:recently-posted", updated, { ex: 60 * 60 * 24 * 30 });
  } catch {
    // KV not critical
  }
}

async function getNextPostType(): Promise<PostType> {
  try {
    const idx = (await kv.get<number>("ig:post-type-index")) || 0;
    const postType = POST_TYPES[idx % POST_TYPES.length];
    await kv.set("ig:post-type-index", (idx + 1) % POST_TYPES.length);
    return postType;
  } catch {
    return POST_TYPES[Math.floor(Math.random() * POST_TYPES.length)];
  }
}

// ---------------------------------------------------------------------------
// Gemini: Generate Instagram caption (E-Commerce optimiert)
// ---------------------------------------------------------------------------

function buildCaptionPrompt(product: Product, postType: PostType): string {
  const priceStr = `${product.price.toFixed(2)} EUR`;
  const oldPrice = product.compareAtPrice
    ? `${product.compareAtPrice.toFixed(2)} EUR`
    : null;
  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  const productInfo = `
Produktname: ${product.title}
Kurzbeschreibung: ${product.shortDescription}
Preis: ${priceStr}${oldPrice ? ` (statt ${oldPrice}, -${discount}%)` : ""}
Kategorie: ${product.category}
Features: ${product.features.join(", ")}
Bewertung: ${product.rating}/5 (${product.reviewCount} Bewertungen)
Shop-URL: trendware.store`;

  const typeInstructions: Record<PostType, string> = {
    "product-showcase": `POST-TYP: Produktvorstellung
Zeige das Produkt mit seinen besten Features. Starte mit einem starken Hook (Frage oder mutiger Statement).
Struktur: Hook → 3-4 Key-Features als kurze Zeilen → Preis → CTA.`,

    "social-proof": `POST-TYP: Social Proof / Beliebtheit
Betone die Bewertungen, dass es ein Bestseller ist, oder dass andere Kunden es lieben.
Struktur: Hook ("Unser meistgefragtes Produkt..." / "X Bewertungen sprechen für sich") → Warum es beliebt ist → Preis → CTA.`,

    "problem-solution": `POST-TYP: Problem → Lösung
Starte mit einem alltäglichen Problem der Zielgruppe. Dann präsentiere das Produkt als elegante Lösung.
Struktur: Problem-Hook ("Kennst du das..." / "Schluss mit...") → Produkt als Antwort → Key-Benefit → Preis → CTA.`,

    "lifestyle": `POST-TYP: Lifestyle / Emotional
Beschreibe ein Gefühl oder eine Szene, in der das Produkt den Alltag verbessert. Weniger Daten, mehr Emotion.
Struktur: Stimmungsvoller Einstieg → Wie es sich anfühlt → Beiläufig Produkt + Preis → Weicher CTA.`,

    "deal-highlight": `POST-TYP: Angebot / Deal
${discount > 0 ? `Stelle den Rabatt von ${discount}% in den Vordergrund. Dringlichkeit erzeugen.` : "Betone den fairen Preis und das Preis-Leistungs-Verhältnis."}
Struktur: Preis-Hook ("Statt X nur Y" / "Unter Z EUR") → Was man bekommt → Warum es sich lohnt → Dringender CTA.`,
  };

  return `Du bist eine echte Person die für den deutschen Online-Shop "TrendWare" postet — Tagline: "dein smarter shop".
TrendWare ist warm, persönlich und freundlich — wie ein guter Freund der dir Produkte empfiehlt. NICHT kalt oder corporate.
Markenfarben: Warmes Sienna (#c87f5a), helles Apricot (#e8a87c), dunkles Braun (#3d3530) auf warmem Creme (#faf5ef). Logo-Font: Comfortaa (rund, freundlich) — "trend" in dunkelbraun, "ware" in sienna, mit kleinem Paket-Icon.
Dein Stil: Locker, ehrlich, wie eine Freundin die einen Tipp gibt. Du-Form immer. KEIN typischer Marketing- oder KI-Text.
Denke wie ein UGC-Creator: authentisch, nahbar, mit echten Reaktionen. Der Ton ist warm und einladend, nie distanziert.

${typeInstructions[postType]}

PRODUKT-DATEN:
${productInfo}

STRIKTE REGELN:
1. HOOK: Die erste Zeile MUSS sofort Aufmerksamkeit erregen. Schreib wie du REDEN würdest: "Ehrlich, das Teil hat mich überrascht" / "Ok warte, das muss ich euch zeigen" / "Für unter 30 EUR? Echt jetzt?"
2. STRUKTUR: Nach dem Hook eine Leerzeile. Dann Inhalt. Dann Leerzeile vor dem CTA.
3. TONALITÄT: Gesprochene Alltagssprache. Kurze Sätze. Darf auch mal unvollständig sein. KEINE Marketing-Floskeln wie "Entdecke jetzt" oder "Unser exklusives Angebot". Schreib wie eine echte Person auf Instagram.
4. CTA: Natürlich eingebaut, nicht erzwungen. "Link in Bio" oder "Schaut mal vorbei" oder "Schreibt mir eure Meinung".
5. HASHTAGS: Genau 12 Hashtags am Ende nach einer Leerzeile. Mix aus:
   - 4 Nischen-Hashtags zur Kategorie
   - 4 Zielgruppen-Hashtags (z.B. #erstewohnung #adulting #wglife)
   - 2 Produkt-Hashtags (#trendware #deinsmartershop)
   - 2 Trend-Hashtags (#musthave2026 #temuvibes)
6. LÄNGE: 100-200 Wörter. Lieber kurz und knackig als lang und langweilig.
7. KEINE Emojis im Fliesstext.
8. Preis erwähnen, aber beiläufig ("für ${priceStr}" / "unter 30 EUR").${discount > 0 ? ` Rabatt (${discount}%) hervorheben, z.B. "statt ${oldPrice} nur ${priceStr} — fast ein Drittel gespart".` : ""}

Antworte NUR mit der fertigen Caption. Keine Erklärung, kein Rahmentext.`;
}

async function generateCaption(
  product: Product,
  postType: PostType
): Promise<string> {
  const prompt = buildCaptionPrompt(product, postType);

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const caption = await callGroq(prompt);
      if (caption.length > 50) return caption;
    } catch (err) {
      console.error(`Groq Fehler (Versuch ${attempt + 1}/2):`, err);
      if (attempt < 1) await new Promise((r) => setTimeout(r, 3000));
    }
  }

  // Fallback caption
  const discount = product.compareAtPrice
    ? ` Statt ${product.compareAtPrice.toFixed(2)} EUR nur ${product.price.toFixed(2)} EUR — du sparst ${Math.round((1 - product.price / product.compareAtPrice) * 100)}%!`
    : ` Nur ${product.price.toFixed(2)} EUR.`;
  return `${product.title} — ${product.shortDescription}${discount}\n\nJetzt entdecken: Link in Bio\n\n#trendware #deinsmartershop #gadgets #${product.categorySlug} #deutschershop #musthave #sparen #smarteprodukte #trending #shopping #homeandliving #lifestyle`;
}

// ---------------------------------------------------------------------------
// Instagram Graph API: Publish a photo post
// ---------------------------------------------------------------------------

interface PublishResult {
  success: boolean;
  postId?: string;
  error?: string;
}

async function publishToInstagram(
  imageUrl: string,
  caption: string,
  igAccountId: string,
  accessToken: string
): Promise<PublishResult> {
  try {
    // Step 1: Create media container
    const createRes = await fetch(
      `${GRAPH_API}/${igAccountId}/media`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: imageUrl,
          caption,
          access_token: accessToken,
        }),
      }
    );

    const createData = await createRes.json();

    if (createData.error) {
      return { success: false, error: createData.error.message };
    }

    const containerId = createData.id;
    console.log(`Media container created: ${containerId}`);

    // Step 2: Wait for container to be ready (poll status)
    let ready = false;
    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setTimeout(r, 3000));

      const statusRes = await fetch(
        `${GRAPH_API}/${containerId}?fields=status_code&access_token=${accessToken}`
      );
      const statusData = await statusRes.json();

      if (statusData.status_code === "FINISHED") {
        ready = true;
        break;
      } else if (statusData.status_code === "ERROR") {
        return { success: false, error: "Media processing failed" };
      }
      console.log(`Waiting for media... status: ${statusData.status_code}`);
    }

    if (!ready) {
      return { success: false, error: "Media processing timeout" };
    }

    // Step 3: Publish the container
    const publishRes = await fetch(
      `${GRAPH_API}/${igAccountId}/media_publish`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creation_id: containerId,
          access_token: accessToken,
        }),
      }
    );

    const publishData = await publishRes.json();

    if (publishData.error) {
      return { success: false, error: publishData.error.message };
    }

    return { success: true, postId: publishData.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Instagram API Fehler:", msg);
    return { success: false, error: msg };
  }
}

// ---------------------------------------------------------------------------
// Facebook Cross-Post: Share product on Facebook page too
// ---------------------------------------------------------------------------

async function crossPostToFacebook(
  product: Product,
  caption: string,
  accessToken: string
): Promise<{ success: boolean; postId?: string; error?: string }> {
  const pageId = process.env.META_PAGE_ID;
  if (!pageId) return { success: false, error: "META_PAGE_ID fehlt" };

  try {
    // Strip hashtags for Facebook (they don't perform well there)
    const fbCaption = caption
      .replace(/\n\n#[\s\S]*$/, "")
      .replace(/Link in Bio/gi, `https://trendware.store/produkt/${product.slug}`);

    const res = await fetch(`${GRAPH_API}/${pageId}/feed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: fbCaption,
        link: `${BASE_URL}/produkt/${product.slug}`,
        access_token: accessToken,
      }),
    });
    const data = await res.json();
    if (data.error) return { success: false, error: data.error.message };
    return { success: true, postId: data.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

// ---------------------------------------------------------------------------
// Email report
// ---------------------------------------------------------------------------

function renderReportEmail(
  results: Array<{ product: Product; caption: string; postType: PostType; result: PublishResult }>
): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString("de-DE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const posted = results.filter((r) => r.result.success).length;
  const failed = results.filter((r) => !r.result.success).length;

  const cards = results
    .map((r, i) => {
      const statusBadge = r.result.success
        ? '<span style="background:#22c55e;color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px">Live</span>'
        : `<span style="background:#dc2626;color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px">Fehler</span>`;

      return `
        <div style="margin:20px 0;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
          <div style="background:linear-gradient(135deg,#c87f5a,#e8a87c);padding:16px;display:flex;align-items:center;gap:12px">
            <div style="flex:1">
              <h3 style="margin:0;color:#3d3530;font-size:16px">${escapeHtml(r.product.title)}</h3>
              <p style="margin:4px 0 0;color:rgba(61,53,48,0.7);font-size:13px">${r.product.price.toFixed(2)} EUR &middot; Typ: ${r.postType}</p>
            </div>
            ${statusBadge}
          </div>
          <div style="padding:16px">
            ${r.result.success ? `<p style="color:#22c55e;font-size:12px;margin:0 0 8px">Post ID: ${r.result.postId}</p>` : ""}
            ${r.result.error ? `<p style="color:#dc2626;font-size:12px;margin:0 0 8px">Fehler: ${escapeHtml(r.result.error)}</p>` : ""}
            <pre style="background:#f9fafb;border:1px solid #eee;border-radius:8px;padding:12px;font-family:system-ui;font-size:12px;line-height:1.5;white-space:pre-wrap;color:#333;margin:0">${escapeHtml(r.caption)}</pre>
          </div>
        </div>`;
    })
    .join("");

  return `
    <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#c87f5a,#e8a87c);padding:24px;border-radius:8px 8px 0 0;text-align:center">
        <h1 style="color:#3d3530;margin:0;font-size:22px;font-family:Comfortaa,sans-serif">Instagram Auto-Post Report</h1>
        <p style="color:rgba(61,53,48,0.6);margin:6px 0 0;font-size:13px">${dateStr}</p>
      </div>
      <div style="padding:20px;background:#fff;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
        <p style="color:#3d3530;font-size:14px;margin:0 0 4px">${posted} Posts veröffentlicht${failed > 0 ? `, ${failed} fehlgeschlagen` : ""}.</p>
        <p style="color:#999;font-size:12px;margin:0 0 20px">Account: @trendware.shop</p>

        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px;margin-bottom:16px">
          <p style="margin:0;color:#166534;font-size:13px;font-weight:600">Alle Posts wurden auf dem TrendWare Business-Account veröffentlicht.</p>
        </div>

        ${cards}
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pageToken = process.env.META_PAGE_ACCESS_TOKEN;
  const igAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

  if (!pageToken || !igAccountId) {
    return NextResponse.json(
      { error: "META_PAGE_ACCESS_TOKEN oder INSTAGRAM_BUSINESS_ACCOUNT_ID fehlt." },
      { status: 500 }
    );
  }

  try {
    const products = await getAllProducts();
    if (products.length === 0) {
      return NextResponse.json({ message: "Keine Produkte vorhanden." });
    }

    // Avoid repeating recently posted products
    const recentSlugs = await getRecentlyPosted();
    const freshProducts = products.filter((p) => !recentSlugs.includes(p.slug));
    const pool = freshProducts.length >= 2 ? freshProducts : products;

    // Prioritize: discounted products, high-rated, then random
    const sorted = [...pool].sort((a, b) => {
      const aDiscount = a.compareAtPrice ? (1 - a.price / a.compareAtPrice) : 0;
      const bDiscount = b.compareAtPrice ? (1 - b.price / b.compareAtPrice) : 0;
      if (Math.abs(aDiscount - bDiscount) > 0.05) return bDiscount - aDiscount;
      if (a.rating !== b.rating) return b.rating - a.rating;
      return Math.random() - 0.5;
    });

    // Pick 1 product per daily post (quality over quantity)
    const selected = pickRandomProducts(sorted, 1);
    const postType = await getNextPostType();

    console.log(
      `Instagram Auto-Post [${postType}]: ${selected.length} Produkt:`,
      selected.map((p) => p.title)
    );

    const results: Array<{
      product: Product;
      caption: string;
      postType: PostType;
      result: PublishResult;
    }> = [];

    for (const product of selected) {
      // Generate caption with post type
      const caption = await generateCaption(product, postType);

      // Use the first product image (must be publicly accessible)
      const imageUrl = product.images[0];

      if (!imageUrl) {
        results.push({
          product,
          caption,
          postType,
          result: { success: false, error: "Kein Produktbild vorhanden" },
        });
        continue;
      }

      // Publish to Instagram
      const result = await publishToInstagram(imageUrl, caption, igAccountId, pageToken);
      results.push({ product, caption, postType, result });

      if (result.success) {
        console.log(`Instagram Post live: ${product.title} (${result.postId})`);
        await trackPostedProduct(product.slug);

        // Cross-post to Facebook
        const fbResult = await crossPostToFacebook(product, caption, pageToken);
        if (fbResult.success) {
          console.log(`Facebook Cross-Post live: ${product.title} (${fbResult.postId})`);
        } else {
          console.error(`Facebook Cross-Post fehlgeschlagen: ${fbResult.error}`);
        }
      } else {
        console.error(`Instagram Post fehlgeschlagen: ${product.title} — ${result.error}`);
      }

      // Wait between posts to avoid rate limiting
      await new Promise((r) => setTimeout(r, 5000));
    }

    // Send email report
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const resend = new Resend(resendKey);
      const posted = results.filter((r) => r.result.success).length;
      await resend.emails.send({
        from: FROM_EMAIL,
        to: OWNER_EMAIL,
        subject: `Instagram: ${posted}/${results.length} Posts veröffentlicht`,
        html: renderReportEmail(results),
      });
    }

    return NextResponse.json({
      message: "Instagram Auto-Post abgeschlossen.",
      posted: results.filter((r) => r.result.success).length,
      failed: results.filter((r) => !r.result.success).length,
      posts: results.map((r) => ({
        product: r.product.title,
        postType: r.postType,
        success: r.result.success,
        postId: r.result.postId,
        error: r.result.error,
      })),
    });
  } catch (error) {
    console.error("Instagram Auto-Post Fehler:", error);
    return NextResponse.json(
      { error: "Fehler beim Instagram Auto-Posting." },
      { status: 500 }
    );
  }
}
