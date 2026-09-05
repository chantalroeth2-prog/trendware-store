import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getAllProducts } from "@/data/product-store";
import { setProductOverride } from "@/lib/kv";
import {
  auditProductImages,
  findBetterImages,
  hasOnlyStockPhotos,
  hasAnyStockPhotos,
  isStockPhotoUrl,
} from "@/lib/research/image-search";

const OWNER_EMAIL = "kontakt.trendware@gmail.com";
const FROM_EMAIL = process.env.EMAIL_FROM || "TrendWare Agent <onboarding@resend.dev>";

// Pro Durchlauf max. Produkte suchen (SerpAPI-Budget: 100/Monat)
// Jedes Produkt braucht 1-2 Credits (Shopping + optional Images)
const MAX_IMAGE_SEARCHES = 30;

/**
 * Prüft ob Bilder von gemischten Quellen stammen (wahrscheinlich verschiedene Produkte).
 */
function hasInconsistentImages(images: string[]): boolean {
  // Stockfotos ignorieren – die werden separat behandelt
  const nonStockImages = images.filter((url) => !isStockPhotoUrl(url));
  if (nonStockImages.length <= 1) return false;

  const domains = nonStockImages.map((url) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return "";
    }
  });

  const uniqueDomains = new Set(domains.filter(Boolean));
  if (uniqueDomains.size >= 3) return true;
  if (nonStockImages.length <= 2 && uniqueDomains.size >= 2) return true;

  return false;
}

/**
 * Audit-Gründe, sortiert nach Schwere:
 * - stock_photo: Bilder zeigen NICHT das echte Produkt (KRITISCH)
 * - broken: Bilder laden nicht
 * - inconsistent: Bilder von verschiedenen Quellen/Produkten
 * - too_few: Weniger als 2 Bilder
 */
type AuditReason = "stock_photo" | "broken" | "inconsistent" | "too_few";

const REASON_PRIORITY: Record<AuditReason, number> = {
  stock_photo: 4, // Höchste Priorität: Kunde bekommt falsches Produkt!
  broken: 3,
  inconsistent: 2,
  too_few: 1,
};

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const autoApply = new URL(request.url).searchParams.get("auto") === "1";

  try {
    const products = await getAllProducts();
    const results: {
      slug: string;
      title: string;
      reason: AuditReason;
      details: string;
      oldImages: string[];
      newImages: string[];
      applied: boolean;
    }[] = [];

    let searchesUsed = 0;

    console.log(`Bild-Audit: Prüfe ${products.length} Produkte...`);

    // Phase 1: Alle Produkte analysieren
    const auditResults = await Promise.all(
      products.map(async (product) => {
        const audit = await auditProductImages(product);
        const stockPhotos = hasOnlyStockPhotos(product.images);
        const anyStock = hasAnyStockPhotos(product.images);
        const inconsistent = hasInconsistentImages(product.images);
        const tooFew = product.images.length < 2;

        // Hauptgrund bestimmen
        let reason: AuditReason | null = null;
        if (stockPhotos || anyStock) {
          reason = "stock_photo";
        } else if (audit.brokenIndices.length > 0) {
          reason = "broken";
        } else if (inconsistent) {
          reason = "inconsistent";
        } else if (tooFew) {
          reason = "too_few";
        }

        return {
          product,
          audit,
          stockPhotos,
          anyStock,
          inconsistent,
          tooFew,
          reason,
          needsFix: reason !== null,
        };
      })
    );

    // Sortieren: Stockfotos zuerst (kritischstes Problem), dann nach Verkaufszahlen
    const prioritized = auditResults
      .filter((r) => r.needsFix && r.reason !== null)
      .sort((a, b) => {
        const prioA = REASON_PRIORITY[a.reason!];
        const prioB = REASON_PRIORITY[b.reason!];
        if (prioA !== prioB) return prioB - prioA;
        return b.product.soldCount - a.product.soldCount;
      });

    console.log(
      `Probleme gefunden: ${prioritized.length} Produkte ` +
      `(${prioritized.filter((r) => r.reason === "stock_photo").length} Stockfotos, ` +
      `${prioritized.filter((r) => r.reason === "broken").length} defekt, ` +
      `${prioritized.filter((r) => r.reason === "inconsistent").length} inkonsistent, ` +
      `${prioritized.filter((r) => r.reason === "too_few").length} zu wenige)`
    );

    // Phase 2: Bessere Bilder suchen
    for (const { product, audit, reason, stockPhotos, anyStock } of prioritized) {
      if (searchesUsed >= MAX_IMAGE_SEARCHES) break;

      const details =
        reason === "stock_photo"
          ? stockPhotos
            ? `Alle ${product.images.length} Bilder sind Stockfotos (Unsplash/Pexels) – zeigen NICHT das echte Produkt`
            : `${product.images.filter(isStockPhotoUrl).length}/${product.images.length} Bilder sind Stockfotos`
          : reason === "broken"
          ? `${audit.brokenIndices.length}/${product.images.length} Bilder defekt`
          : reason === "inconsistent"
          ? `Bilder von verschiedenen Quellen (verschiedene Produkte sichtbar)`
          : `Nur ${product.images.length} Bild(er) vorhanden`;

      console.log(`\nSuche echte Produktbilder für "${product.title}" (${details})...`);

      const newImages = await findBetterImages(product, 4);
      searchesUsed++;

      if (newImages.length === 0) {
        console.log(`→ Keine Bilder gefunden für "${product.title}"`);
        continue;
      }

      // Merge-Strategie basierend auf Problem-Typ
      let mergedImages: string[];

      if (reason === "stock_photo") {
        // ALLE Stockfotos ersetzen – sie zeigen das falsche Produkt
        if (stockPhotos) {
          // Komplett ersetzen
          mergedImages = newImages;
        } else {
          // Nur Stockfotos ersetzen, echte Bilder behalten
          const realImages = product.images.filter((url) => !isStockPhotoUrl(url));
          mergedImages = [
            ...realImages,
            ...newImages.filter((u) => !realImages.includes(u)),
          ].slice(0, 4);
        }
      } else if (reason === "broken" || reason === "inconsistent" || audit.allBroken) {
        // Komplett ersetzen
        mergedImages = newImages;
      } else {
        // too_few: Ergänzen
        const needed = Math.max(0, 4 - product.images.length);
        mergedImages = [
          ...product.images,
          ...newImages
            .filter((u) => !product.images.includes(u))
            .slice(0, needed),
        ];
      }

      if (mergedImages.length === 0) continue;

      const applied = autoApply;
      if (autoApply) {
        await setProductOverride(product.slug, { images: mergedImages });
        console.log(`→ ${mergedImages.length} neue Bilder gespeichert für "${product.title}"`);
      }

      results.push({
        slug: product.slug,
        title: product.title,
        reason: reason!,
        details,
        oldImages: product.images,
        newImages: mergedImages,
        applied,
      });
    }

    // Phase 3: E-Mail-Report
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && results.length > 0) {
      const resend = new Resend(resendKey);

      const reasonLabel: Record<AuditReason, string> = {
        stock_photo: "Stockfoto (falsches Produkt!)",
        broken: "Defekte Bilder",
        inconsistent: "Verschiedene Produkte",
        too_few: "Zu wenige Bilder",
      };
      const reasonColor: Record<AuditReason, string> = {
        stock_photo: "#dc2626", // Rot – kritisch
        broken: "#ef4444",
        inconsistent: "#f59e0b",
        too_few: "#3b82f6",
      };

      const cards = results
        .map((r) => {
          const oldPreview = r.oldImages
            .slice(0, 4)
            .map(
              (img) =>
                `<img src="${img}" alt="" style="width:60px;height:60px;object-fit:cover;border-radius:6px;border:2px solid #fca5a5" />`
            )
            .join("");

          const newPreview = r.newImages
            .slice(0, 4)
            .map(
              (img) =>
                `<img src="${img}" alt="" style="width:60px;height:60px;object-fit:cover;border-radius:6px;border:2px solid #86efac" />`
            )
            .join("");

          return `
            <div style="border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin:12px 0">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                <h3 style="margin:0;color:#333;font-size:15px">${r.title}</h3>
                <div style="display:flex;gap:4px;flex-wrap:wrap">
                  <span style="display:inline-block;background:${reasonColor[r.reason]};color:white;font-size:10px;font-weight:bold;padding:2px 8px;border-radius:10px">
                    ${reasonLabel[r.reason]}
                  </span>
                  ${r.applied ? '<span style="display:inline-block;background:#22c55e;color:white;font-size:10px;font-weight:bold;padding:2px 8px;border-radius:10px">Auto-ersetzt</span>' : '<span style="display:inline-block;background:#f59e0b;color:white;font-size:10px;font-weight:bold;padding:2px 8px;border-radius:10px">Manuell prüfen</span>'}
                </div>
              </div>
              <p style="color:#666;font-size:12px;margin:4px 0">${r.details}</p>
              <div style="margin-top:8px">
                <p style="color:#ef4444;font-size:11px;margin:0 0 4px;font-weight:600">Vorher (falsch):</p>
                <div style="display:flex;gap:4px;margin-bottom:8px">${oldPreview}</div>
                <p style="color:#22c55e;font-size:11px;margin:0 0 4px;font-weight:600">Nachher (echtes Produkt):</p>
                <div style="display:flex;gap:4px">${newPreview}</div>
              </div>
            </div>`;
        })
        .join("");

      const summary = {
        stock: results.filter((r) => r.reason === "stock_photo").length,
        broken: results.filter((r) => r.reason === "broken").length,
        inconsistent: results.filter((r) => r.reason === "inconsistent").length,
        tooFew: results.filter((r) => r.reason === "too_few").length,
        applied: results.filter((r) => r.applied).length,
      };

      await resend.emails.send({
        from: FROM_EMAIL,
        to: OWNER_EMAIL,
        subject: `Bild-Audit: ${summary.stock} Stockfotos ${autoApply ? "ersetzt" : "gefunden"}, ${results.length} Produkte geprüft`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <div style="background:linear-gradient(135deg,#c87f5a,#e8a87c);padding:24px;border-radius:8px 8px 0 0">
              <h1 style="color:#fff;margin:0">TrendWare Bild-Audit</h1>
              <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:14px">
                ${autoApply ? "Automatische Korrektur aktiv" : "Manueller Prüfmodus"}
              </p>
            </div>
            <div style="padding:24px;background:#fff;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">

              ${summary.stock > 0 ? `
                <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px;margin-bottom:16px">
                  <strong style="color:#dc2626">Kritisch:</strong>
                  <span style="color:#7f1d1d">${summary.stock} Produkte haben Stockfotos statt echten Produktbildern.
                  Kunden bekommen andere Produkte als auf den Bildern gezeigt!</span>
                </div>
              ` : ""}

              <p style="color:#333;margin:0 0 16px">
                <strong>${products.length}</strong> Produkte geprüft &middot;
                <strong>${searchesUsed}</strong> SerpAPI-Credits &middot;
                <strong>${summary.applied}</strong> auto-ersetzt
              </p>

              <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">
                ${summary.stock ? `<span style="background:#fef2f2;color:#dc2626;font-size:12px;padding:4px 10px;border-radius:8px;font-weight:600">${summary.stock} Stockfotos</span>` : ""}
                ${summary.broken ? `<span style="background:#fef2f2;color:#ef4444;font-size:12px;padding:4px 10px;border-radius:8px;font-weight:600">${summary.broken} defekt</span>` : ""}
                ${summary.inconsistent ? `<span style="background:#fffbeb;color:#f59e0b;font-size:12px;padding:4px 10px;border-radius:8px;font-weight:600">${summary.inconsistent} inkonsistent</span>` : ""}
                ${summary.tooFew ? `<span style="background:#eff6ff;color:#3b82f6;font-size:12px;padding:4px 10px;border-radius:8px;font-weight:600">${summary.tooFew} zu wenige</span>` : ""}
              </div>

              ${cards}
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({
      message: "Bild-Audit abgeschlossen.",
      productsChecked: products.length,
      productsWithIssues: results.length,
      searchesUsed,
      autoApplied: autoApply,
      summary: {
        stockPhotos: results.filter((r) => r.reason === "stock_photo").length,
        broken: results.filter((r) => r.reason === "broken").length,
        inconsistent: results.filter((r) => r.reason === "inconsistent").length,
        tooFew: results.filter((r) => r.reason === "too_few").length,
        replaced: results.filter((r) => r.applied).length,
      },
      results: results.map((r) => ({
        slug: r.slug,
        reason: r.reason,
        details: r.details,
        newImagesCount: r.newImages.length,
        applied: r.applied,
      })),
    });
  } catch (error) {
    console.error("Bild-Audit Fehler:", error);
    return NextResponse.json(
      { error: "Fehler beim Bild-Audit." },
      { status: 500 }
    );
  }
}
