import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getAllProducts } from "@/data/product-store";
import { isProductOrderable } from "@/lib/product-compliance";

/*
 * =============================================================
 * STRIPE CHECKOUT API ROUTE
 * =============================================================
 * Diese Route erstellt eine Stripe Checkout Session.
 *
 * SETUP:
 * 1. Trage deine Stripe-Keys in .env.local ein
 * 2. Im Testmodus: Verwende Karte 4242 4242 4242 4242
 * 3. Für Live: Ersetze Test-Keys durch Live-Keys
 *
 * ANPASSEN:
 * - Währung: Ändere "eur" zu deiner gewünschten Währung
 * - Versand: Passe shipping_options an deine Versandkosten an
 * - success_url / cancel_url: Passe bei Bedarf die Redirect-URLs an
 * =============================================================
 */

interface CheckoutItem {
  id: string;
  quantity: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const requestedItems: CheckoutItem[] = body.items;
    const country = body.country === "FR" ? "FR" : body.country === "DE" ? "DE" : null;

    if (!requestedItems || requestedItems.length === 0 || !country) {
      return NextResponse.json(
        { error: "Keine Artikel im Warenkorb." },
        { status: 400 }
      );
    }

    // Check if Stripe is configured
    if (
      process.env.PAYMENTS_LIVE_ENABLED !== "true" ||
      !process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_")
    ) {
      return NextResponse.json(
        {
          error:
            "Zahlungsdienstleister ist derzeit nicht verfügbar. Bitte versuche es später erneut.",
        },
        { status: 500 }
      );
    }

    const products = await getAllProducts();
    const productById = new Map(products.map((product) => [product.id, product]));
    const items = requestedItems.map((item) => ({ product: productById.get(item.id), quantity: item.quantity }));
    if (items.some(({ product, quantity }) => !product || !isProductOrderable(product) || !Number.isInteger(quantity) || quantity < 1 || quantity > 10)) {
      return NextResponse.json({ error: "Mindestens ein Produkt ist aktuell nicht bestellbar oder die Menge ist ungültig." }, { status: 409 });
    }
    const shippingCostCents = country === "FR" ? 699 : 499;
    const shippingOptions = [{
      shipping_rate_data: {
        type: "fixed_amount" as const,
        fixed_amount: { amount: shippingCostCents, currency: "eur" },
        display_name: "Standardversand",
      },
    }];

    // Derive base URL from request headers (works on Vercel and locally)
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

    // Encode product IDs + quantities as metadata for fulfillment
    const itemsMeta = items.map((item) => ({ id: item.product!.id, qty: item.quantity }));

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      currency: "eur",
      line_items: items.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.product!.title,
            images: item.product!.images[0] ? [item.product!.images[0]] : [],
          },
          unit_amount: Math.round(item.product!.price * 100),
        },
        quantity: item.quantity,
      })),
      metadata: {
        items: JSON.stringify(itemsMeta),
      },
      phone_number_collection: { enabled: true },
      shipping_options: shippingOptions,
      shipping_address_collection: {
        allowed_countries: [country],
      },
      billing_address_collection: "required",
      allow_promotion_codes: true,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unbekannter Fehler";
    console.error("Stripe Checkout Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
