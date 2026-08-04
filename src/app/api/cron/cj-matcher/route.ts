import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { callGroq } from "@/lib/groq";
import { Resend } from "resend";
import { getAllProducts } from "@/data/product-store";
import { searchCJProducts, type CJProduct } from "@/lib/cj";
import {
  setCJPendingMatches,
  getCJPendingMatches,
  setProductOverride,
  type CJMatchPending,
} from "@/lib/kv";
import type { Product } from "@/data/products";

const OWNER_EMAIL = "kontakt.trendware@gmail.com";
const FROM_EMAIL = "TrendWare Agent <noreply@trendware.store>";

// ---------------------------------------------------------------------------
// Gemini: translate German product names to English search terms
// ---------------------------------------------------------------------------

interface SearchTerms {
  slug: string;
  terms: string[];
}

async function generateSearchTerms(
  products: Product[]
): Promise<SearchTerms[]> {
  const productList = products
    .map(
      (p) =>
        `- slug: "${p.slug}", title: "${p.title}", features: "${p.features.slice(0, 2).join(", ")}"`
    )
    .join("\n");

  const prompt = `Du bist ein Experte für Dropshipping-Produkte auf CJ Dropshipping.

Ich habe folgende deutsche Produkte, die ich auf CJ Dropshipping finden muss.
Generiere für jedes Produkt 3 englische Suchbegriffe, die auf cjdropshipping.com die besten Treffer liefern.

WICHTIG:
- Verwende typische AliExpress/CJ-Produktnamen (z.B. "LED desk lamp touch" statt "nightstand lamp")
- Sei spezifisch aber nicht zu lang (2-4 Wörter pro Suchbegriff)
- Denke daran dass CJ chinesische Lieferanten hat - verwende deren typische Produktbezeichnungen

PRODUKTE:
${productList}

Antworte NUR mit einem JSON-Array (keine Markdown-Codeblocks):
[
  { "slug": "product-slug", "terms": ["search term 1", "search term 2", "search term 3"] }
]`;

  const text = await callGroq(prompt);

  const cleaned = text
    .replace(/^```(?:json)?\s*\n?/, "")
    .replace(/\n?\s*```$/, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    console.error("CJ-Matcher: Groq JSON parse error:", text);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Gemini: pick the best CJ match for a product
// ---------------------------------------------------------------------------

interface MatchResult {
  pid: string;
  vid: string;
  name: string;
  price: number;
  image: string;
  confidence: "high" | "medium" | "low" | "none";
  reason: string;
}

async function pickBestMatch(
  product: Product,
  cjResults: CJProduct[]
): Promise<MatchResult | null> {
  if (cjResults.length === 0) return null;

  const cjList = cjResults
    .slice(0, 8)
    .map((cj, i) => {
      const variants = cj.variants
        .slice(0, 3)
        .map((v) => `vid:${v.vid} "${v.variantNameEn}" $${v.variantSellPrice}`)
        .join("; ");
      return `${i + 1}. pid:${cj.pid} "${cj.productNameEn}" Preis:$${cj.sellPrice} Varianten:[${variants}]`;
    })
    .join("\n");

  const prompt = `Du bist ein Dropshipping-Experte. Finde das beste Match auf CJ Dropshipping für dieses Produkt:

MEIN PRODUKT:
- Name: "${product.title}"
- Beschreibung: "${product.shortDescription}"
- Preis: ${product.price.toFixed(2)} EUR (Verkaufspreis, Einkauf sollte 30-60% davon sein)
- Features: ${product.features.slice(0, 3).join(", ")}

CJ SUCHERGEBNISSE:
${cjList}

REGELN:
- Wähle das Produkt das am besten zu meinem Produkt passt (Funktion, nicht nur Name)
- Der CJ-Preis sollte deutlich unter meinem Verkaufspreis liegen (Marge!)
- Bei mehreren Varianten: wähle die Standard-/populärste Variante
- Wenn KEIN Produkt passt, setze confidence auf "none"

Antworte NUR mit JSON (keine Codeblocks):
{
  "pid": "die-pid-oder-leer",
  "vid": "die-vid-der-besten-variante-oder-leer",
  "name": "CJ Produktname",
  "price": 0.00,
  "image": "",
  "confidence": "high|medium|low|none",
  "reason": "Kurze Begründung auf Deutsch"
}`;

  const text = await callGroq(prompt);

  const cleaned = text
    .replace(/^```(?:json)?\s*\n?/, "")
    .replace(/\n?\s*```$/, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned) as MatchResult;
    if (parsed.confidence === "none" || !parsed.pid) return null;

    // Fill in image from CJ results if not provided
    if (!parsed.image) {
      const matched = cjResults.find((c) => c.pid === parsed.pid);
      if (matched?.productImage?.[0]) {
        parsed.image = matched.productImage[0];
      }
    }

    return parsed;
  } catch {
    console.error("CJ-Matcher: pickBestMatch JSON error:", text);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Rate-limited search helper
// ---------------------------------------------------------------------------

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function searchWithRetry(
  query: string,
  retries: number = 2
): Promise<CJProduct[]> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await searchCJProducts(query, 8);
      return result.products;
    } catch (err) {
      if (err instanceof Error && err.message === "CJ_RATE_LIMITED") {
        // Exponential backoff: 2s, 4s, 8s
        const delay = 2000 * Math.pow(2, attempt);
        console.log(`CJ rate limited, waiting ${delay}ms...`);
        await sleep(delay);
        continue;
      }
      throw err;
    }
  }
  return [];
}

// ---------------------------------------------------------------------------
// Email builder
// ---------------------------------------------------------------------------

function buildMatchEmail(
  matches: CJMatchPending[],
  skipped: string[]
): string {
  const matchCards = matches
    .map((m) => {
      const approveUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://trendware.store"}/api/agent/approve-cj?token=${m.token}`;
      const confidenceColor =
        m.confidence === "high"
          ? "#22c55e"
          : m.confidence === "medium"
            ? "#f59e0b"
            : "#ef4444";

      return `
        <div style="border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin:12px 0">
          <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px">
            ${m.cjImage ? `<img src="${m.cjImage}" alt="" style="width:60px;height:60px;border-radius:8px;object-fit:cover" />` : ""}
            <div>
              <h3 style="margin:0;color:#3d3530;font-size:15px">${m.productTitle}</h3>
              <span style="display:inline-block;background:${confidenceColor};color:white;font-size:11px;font-weight:bold;padding:2px 8px;border-radius:12px;margin-top:4px">
                ${m.confidence}
              </span>
            </div>
          </div>
          <div style="background:#faf5ef;border-radius:8px;padding:12px;margin:8px 0">
            <p style="margin:2px 0;font-size:13px;color:#3d3530"><strong>CJ Match:</strong> ${m.cjName}</p>
            <p style="margin:2px 0;font-size:13px;color:#7a6e66"><strong>CJ Preis:</strong> $${m.cjPrice.toFixed(2)} | <strong>PID:</strong> ${m.cjPid} | <strong>VID:</strong> ${m.cjVid}</p>
          </div>
          <a href="${approveUrl}" style="display:inline-block;margin-top:8px;padding:10px 24px;background:#c87f5a;color:white;text-decoration:none;border-radius:8px;font-weight:bold;font-size:14px">
            Match bestätigen
          </a>
        </div>`;
    })
    .join("");

  const skippedList =
    skipped.length > 0
      ? `<div style="margin-top:16px;padding:12px;background:#fef3c7;border-radius:8px">
          <p style="margin:0 0 4px;font-size:13px;font-weight:bold;color:#92400e">Kein Match gefunden für:</p>
          <ul style="margin:0;padding-left:20px;color:#92400e;font-size:12px">
            ${skipped.map((s) => `<li>${s}</li>`).join("")}
          </ul>
        </div>`
      : "";

  return `
    <div style="font-family:Comfortaa,sans-serif;max-width:600px;margin:0 auto;background:#faf5ef">
      <div style="background:linear-gradient(135deg,#c87f5a,#e8a87c);padding:24px;border-radius:8px 8px 0 0;text-align:center">
        <h1 style="color:#3d3530;margin:0;font-family:Comfortaa,sans-serif">trend<span style="color:#c87f5a">ware</span> Agent</h1>
        <p style="color:rgba(61,53,48,0.6);margin:4px 0 0;font-size:11px">dein smarter shop</p>
        <p style="color:#3d3530;margin:8px 0 0;font-size:14px">CJ Produkt-Matching</p>
      </div>
      <div style="padding:24px;background:#fff;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
        <p style="color:#3d3530;font-size:14px;line-height:1.6;margin:0 0 16px">
          Der Agent hat ${matches.length} CJ-Matches gefunden. Klicke auf "Match bestätigen", um die CJ Product ID zu speichern. Damit kann der Shop automatisch bei CJ bestellen.
        </p>
        ${matchCards}
        ${skippedList}
        <p style="color:#999;font-size:12px;margin-top:24px;text-align:center">
          Links sind 7 Tage gültig. Automatisch generiert von TrendWare CJ-Matcher.
        </p>
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

  try {
    // 1. Get all products and find those without cjProductId
    const allProducts = await getAllProducts();
    const unmatched = allProducts.filter(
      (p) => !p.cjProductId || p.cjProductId === "TODO"
    );

    if (unmatched.length === 0) {
      return NextResponse.json({
        message: "Alle Produkte haben bereits eine CJ Product ID.",
      });
    }

    // Process max 10 products per run to stay within rate limits
    const batch = unmatched.slice(0, 10);

    // 2. Generate English search terms via Gemini
    const searchTermsList = await generateSearchTerms(batch);

    if (searchTermsList.length === 0) {
      return NextResponse.json({
        message: "Konnte keine Suchbegriffe generieren.",
      });
    }

    // 3. Search CJ and find matches
    const secret = new TextEncoder().encode(process.env.AGENT_APPROVE_SECRET);
    const newMatches: CJMatchPending[] = [];
    const skipped: string[] = [];

    for (const product of batch) {
      const searchTerms = searchTermsList.find(
        (st) => st.slug === product.slug
      );
      if (!searchTerms || searchTerms.terms.length === 0) {
        skipped.push(product.title);
        continue;
      }

      // Search with each term and collect results
      let allCJResults: CJProduct[] = [];
      for (const term of searchTerms.terms) {
        await sleep(1500); // Respect rate limit
        try {
          const results = await searchWithRetry(term);
          allCJResults = [...allCJResults, ...results];
        } catch (err) {
          console.error(`CJ search failed for "${term}":`, err);
        }
      }

      // Deduplicate by pid
      const seen = new Set<string>();
      allCJResults = allCJResults.filter((p) => {
        if (seen.has(p.pid)) return false;
        seen.add(p.pid);
        return true;
      });

      if (allCJResults.length === 0) {
        skipped.push(product.title);
        continue;
      }

      // 4. Use Gemini to pick the best match
      const match = await pickBestMatch(product, allCJResults);

      if (!match) {
        skipped.push(product.title);
        continue;
      }

      // Create approval token
      const id = `cj-${product.slug}-${Date.now()}`;
      const token = await new SignJWT({
        type: "cj-match",
        matchId: id,
        productSlug: product.slug,
        cjVid: match.vid,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(secret);

      newMatches.push({
        id,
        productSlug: product.slug,
        productTitle: product.title,
        cjPid: match.pid,
        cjVid: match.vid,
        cjName: match.name,
        cjPrice: match.price,
        cjImage: match.image,
        confidence: match.confidence,
        token,
        createdAt: new Date().toISOString(),
      });
    }

    // 5. Save matches to KV
    if (newMatches.length > 0) {
      const existing = await getCJPendingMatches();
      // Remove duplicates for same product slug
      const existingSlugs = new Set(newMatches.map((m) => m.productSlug));
      const kept = existing.filter((m) => !existingSlugs.has(m.productSlug));
      await setCJPendingMatches([...kept, ...newMatches]);
    }

    // 6. Send email
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && (newMatches.length > 0 || skipped.length > 0)) {
      try {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: FROM_EMAIL,
          to: OWNER_EMAIL,
          subject: `TrendWare CJ-Matcher: ${newMatches.length} Matches gefunden`,
          html: buildMatchEmail(newMatches, skipped),
        });
      } catch (emailErr) {
        console.error("CJ-Matcher E-Mail Fehler:", emailErr);
      }
    }

    return NextResponse.json({
      message: `${newMatches.length} Matches gefunden, ${skipped.length} ohne Treffer.`,
      matches: newMatches.map((m) => ({
        product: m.productTitle,
        cjName: m.cjName,
        confidence: m.confidence,
      })),
      skipped,
      remaining: unmatched.length - batch.length,
    });
  } catch (error) {
    console.error("CJ-Matcher Cron Fehler:", error);
    return NextResponse.json(
      { error: "Fehler beim CJ-Matching." },
      { status: 500 }
    );
  }
}
