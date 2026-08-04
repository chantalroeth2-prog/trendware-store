import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import {
  getPendingSuggestionById,
  removePendingSuggestion,
  setProductOverride,
  addProduct,
} from "@/lib/kv";
import type { Product } from "@/data/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return htmlResponse(
      "Fehler",
      "Kein Token angegeben.",
      "#ef4444"
    );
  }

  try {
    // 1. Verify JWT
    const secret = new TextEncoder().encode(process.env.AGENT_APPROVE_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const suggestionId = payload.suggestionId as string;

    if (!suggestionId) {
      return htmlResponse(
        "Fehler",
        "Ungültiges Token.",
        "#ef4444"
      );
    }

    // 2. Load suggestion from KV
    const pending = await getPendingSuggestionById(suggestionId);

    if (!pending) {
      return htmlResponse(
        "Nicht gefunden",
        "Dieser Vorschlag wurde bereits verarbeitet oder ist abgelaufen.",
        "#f59e0b"
      );
    }

    if (pending.status !== "pending") {
      return htmlResponse(
        "Bereits verarbeitet",
        "Dieser Vorschlag wurde bereits bestätigt.",
        "#f59e0b"
      );
    }

    const { suggestion } = pending;

    // 3. Apply the suggestion
    switch (suggestion.type) {
      case "new_product": {
        if (!suggestion.product) {
          return htmlResponse(
            "Fehler",
            "Produktdaten fehlen.",
            "#ef4444"
          );
        }

        const slug = suggestion.product.title
          .toLowerCase()
          .replace(/[äÄ]/g, "ae")
          .replace(/[öÖ]/g, "oe")
          .replace(/[üÜ]/g, "ue")
          .replace(/[ß]/g, "ss")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

        const newProduct: Product = {
          id: `agent-${Date.now()}`,
          slug,
          title: suggestion.product.title,
          description: suggestion.product.description,
          shortDescription: suggestion.product.shortDescription,
          price: suggestion.product.price,
          compareAtPrice: suggestion.product.compareAtPrice,
          category: suggestion.product.category,
          categorySlug: suggestion.product.categorySlug,
          images: suggestion.product.images,
          features: suggestion.product.features,
          deliveryDays: suggestion.product.deliveryDays,
          rating: 4.5,
          reviewCount: 0,
          badge: "Neu",
          inStock: true,
          stockCount: 50,
          soldCount: 0,
        };

        await addProduct(newProduct);
        await removePendingSuggestion(suggestionId);

        return htmlResponse(
          "Produkt hinzugefügt!",
          `"${newProduct.title}" ist jetzt im Shop verfügbar.`,
          "#22c55e"
        );
      }

      case "price_update": {
        if (!suggestion.targetSlug || !suggestion.newPrice) {
          return htmlResponse(
            "Fehler",
            "Preis oder Produkt-Slug fehlt.",
            "#ef4444"
          );
        }

        await setProductOverride(suggestion.targetSlug, {
          price: suggestion.newPrice,
        });
        await removePendingSuggestion(suggestionId);

        return htmlResponse(
          "Preis aktualisiert!",
          `Produkt "${suggestion.targetSlug}" hat jetzt den Preis ${suggestion.newPrice.toFixed(2)} €.`,
          "#22c55e"
        );
      }

      case "image_update": {
        if (!suggestion.targetSlug || !suggestion.newImages?.length) {
          return htmlResponse(
            "Fehler",
            "Bilder oder Produkt-Slug fehlt.",
            "#ef4444"
          );
        }

        await setProductOverride(suggestion.targetSlug, {
          images: suggestion.newImages,
        });
        await removePendingSuggestion(suggestionId);

        return htmlResponse(
          "Bilder aktualisiert!",
          `Produkt "${suggestion.targetSlug}" hat jetzt ${suggestion.newImages.length} neue Bilder.`,
          "#22c55e"
        );
      }

      default:
        return htmlResponse(
          "Fehler",
          "Unbekannter Vorschlagstyp.",
          "#ef4444"
        );
    }
  } catch (err) {
    console.error("Approve Fehler:", err);

    const message =
      err instanceof Error && err.message.includes("expired")
        ? "Dieser Bestätigungslink ist abgelaufen (max. 7 Tage gültig)."
        : "Ein Fehler ist aufgetreten. Bitte versuche es erneut.";

    return htmlResponse("Fehler", message, "#ef4444");
  }
}

function htmlResponse(
  title: string,
  message: string,
  color: string
): NextResponse {
  const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} – TrendWare Agent</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0f0f23;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 16px;
    }
    .card {
      background: #1a1a2e;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 40px;
      max-width: 480px;
      text-align: center;
    }
    .icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      font-size: 28px;
    }
    h1 { font-size: 24px; margin: 0 0 12px; }
    p { color: #9ca3af; line-height: 1.6; }
    a {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 28px;
      background: #e8a87c;
      color: #fff;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon" style="background:${color}20">
      ${color === "#22c55e" ? "&#10003;" : color === "#f59e0b" ? "&#9888;" : "&#10007;"}
    </div>
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="/">Zum Shop</a>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
