import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { Resend } from "resend";
import {
  fetchGoogleTrends,
  fetchAmazonBestsellers,
  fetchAliExpressTrending,
} from "@/lib/research/trends";
import { analyzeTrends } from "@/lib/research/analyzer";
import { generateAdPackages, renderAdPackagesHtml } from "@/lib/research/ad-generator";
import { getAllProducts } from "@/data/product-store";
import { setPendingSuggestions } from "@/lib/kv";
import type { PendingSuggestion } from "@/types/research";

const OWNER_EMAIL = "kontakt.trendware@gmail.com";
const FROM_EMAIL = "TrendWare Agent <noreply@trendware.store>";

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Fetch trends from all sources
    const [googleTrends, amazonTrends, aliExpressTrends] = await Promise.all([
      fetchGoogleTrends().catch((err) => {
        console.error("Google Trends Fehler:", err);
        return [];
      }),
      fetchAmazonBestsellers().catch((err) => {
        console.error("Amazon Trends Fehler:", err);
        return [];
      }),
      fetchAliExpressTrending().catch((err) => {
        console.error("AliExpress Trends Fehler:", err);
        return [];
      }),
    ]);

    const allTrends = [...googleTrends, ...amazonTrends, ...aliExpressTrends];

    if (allTrends.length === 0) {
      return NextResponse.json({
        message: "Keine Trend-Daten verfügbar.",
        trends: 0,
      });
    }

    // 2. Get current products for context
    const currentProducts = await getAllProducts();

    // 3. Analyze with Gemini Flash
    const suggestions = await analyzeTrends(allTrends, currentProducts);

    if (suggestions.length === 0) {
      return NextResponse.json({
        message: "Keine Vorschläge generiert.",
        trends: allTrends.length,
      });
    }

    // 4. Create pending suggestions with JWT tokens
    const secret = new TextEncoder().encode(process.env.AGENT_APPROVE_SECRET);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://trendware.de";

    const pendingSuggestions: PendingSuggestion[] = await Promise.all(
      suggestions.map(async (suggestion, index) => {
        const id = `${Date.now()}-${index}`;
        const token = await new SignJWT({ suggestionId: id })
          .setProtectedHeader({ alg: "HS256" })
          .setExpirationTime("7d")
          .sign(secret);

        return {
          id,
          suggestion,
          token,
          createdAt: new Date().toISOString(),
          status: "pending" as const,
        };
      })
    );

    // 5. Save to KV
    await setPendingSuggestions(pendingSuggestions);

    // 6. Generate ad creatives for top products
    const adPackages = generateAdPackages(currentProducts, 3);
    const adCreativesHtml = renderAdPackagesHtml(adPackages);

    // 7. Send email to owner
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const resend = new Resend(resendKey);

      const suggestionCards = pendingSuggestions
        .map((ps) => {
          const s = ps.suggestion;
          const approveUrl = `${baseUrl}/api/agent/approve?token=${ps.token}`;

          const typeLabel =
            s.type === "new_product"
              ? "Neues Produkt"
              : s.type === "price_update"
              ? "Preisänderung"
              : "Bild-Update";

          const typeColor =
            s.type === "new_product"
              ? "#22c55e"
              : s.type === "price_update"
              ? "#f59e0b"
              : "#3b82f6";

          const details =
            s.type === "new_product" && s.product
              ? `<p style="margin:4px 0"><strong>Preis:</strong> ${s.product.price.toFixed(2)} €</p>
                 <p style="margin:4px 0"><strong>Kategorie:</strong> ${s.product.category}</p>`
              : s.type === "price_update"
              ? `<p style="margin:4px 0"><strong>Produkt:</strong> ${s.targetSlug}</p>
                 <p style="margin:4px 0"><strong>Neuer Preis:</strong> ${s.newPrice?.toFixed(2)} €</p>`
              : `<p style="margin:4px 0"><strong>Produkt:</strong> ${s.targetSlug}</p>
                 <p style="margin:4px 0"><strong>Neue Bilder:</strong> ${s.newImages?.length} Stück</p>`;

          return `
            <div style="border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin:12px 0">
              <div style="display:inline-block;background:${typeColor};color:white;font-size:12px;font-weight:bold;padding:4px 10px;border-radius:20px;margin-bottom:8px">
                ${typeLabel}
              </div>
              <h3 style="margin:8px 0;color:#333">${s.title}</h3>
              <p style="color:#666;font-size:14px">${s.reason}</p>
              ${details}
              <a href="${approveUrl}" style="display:inline-block;margin-top:12px;padding:10px 24px;background:#e8a87c;color:white;text-decoration:none;border-radius:8px;font-weight:bold;font-size:14px">
                Bestätigen
              </a>
            </div>`;
        })
        .join("");

      await resend.emails.send({
        from: FROM_EMAIL,
        to: OWNER_EMAIL,
        subject: `TrendWare Agent: ${pendingSuggestions.length} Vorschläge + ${adPackages.length} Ad-Creatives`,
        html: `
          <div style="font-family:Comfortaa,sans-serif;max-width:600px;margin:0 auto;background:#faf5ef">
            <div style="background:linear-gradient(135deg,#c87f5a,#e8a87c);padding:24px;border-radius:8px 8px 0 0;text-align:center">
              <h1 style="color:#3d3530;margin:0;font-family:Comfortaa,sans-serif">trend<span style="color:#c87f5a">ware</span> Agent</h1>
              <p style="color:rgba(61,53,48,0.6);margin:4px 0 0;font-size:11px">dein smarter shop</p>
            </div>
            <div style="padding:24px;background:#fff;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
              <h2 style="color:#3d3530">Täglicher Trend-Report</h2>
              <p style="color:#7a6e66">
                ${allTrends.length} Trends analysiert, ${pendingSuggestions.length} Vorschläge generiert, ${adPackages.length} Ad-Creatives erstellt.
                Klicke auf "Bestätigen", um einen Vorschlag live zu schalten.
              </p>
              ${suggestionCards}
              ${adCreativesHtml}
              <p style="color:#999;font-size:12px;margin-top:24px">
                Links sind 7 Tage gültig. Nicht bestätigte Vorschläge werden automatisch gelöscht.
              </p>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({
      message: "Recherche abgeschlossen.",
      trends: allTrends.length,
      suggestions: pendingSuggestions.length,
      adCreatives: adPackages.length,
    });
  } catch (error) {
    console.error("Cron Research Fehler:", error);
    return NextResponse.json(
      { error: "Interner Fehler bei der Recherche." },
      { status: 500 }
    );
  }
}
