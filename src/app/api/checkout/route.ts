import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

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

const SHIPPING_THRESHOLD_CENTS = 3900; // 39 EUR
const SHIPPING_COST_CENTS = 499; // 4.99 EUR

interface CheckoutItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const items: CheckoutItem[] = body.items;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Keine Artikel im Warenkorb." },
        { status: 400 }
      );
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        {
          error:
            "Zahlungsdienstleister ist derzeit nicht verfügbar. Bitte versuche es später erneut.",
        },
        { status: 500 }
      );
    }

    const subtotalCents = items.reduce(
      (sum, item) => sum + Math.round(item.price * 100) * item.quantity,
      0
    );

    const shippingOptions =
      subtotalCents >= SHIPPING_THRESHOLD_CENTS
        ? [
            {
              shipping_rate_data: {
                type: "fixed_amount" as const,
                fixed_amount: { amount: 0, currency: "eur" },
                display_name: "Kostenloser Versand",
                delivery_estimate: {
                  minimum: { unit: "business_day" as const, value: 3 },
                  maximum: { unit: "business_day" as const, value: 7 },
                },
              },
            },
          ]
        : [
            {
              shipping_rate_data: {
                type: "fixed_amount" as const,
                fixed_amount: { amount: SHIPPING_COST_CENTS, currency: "eur" },
                display_name: "Standardversand",
                delivery_estimate: {
                  minimum: { unit: "business_day" as const, value: 3 },
                  maximum: { unit: "business_day" as const, value: 7 },
                },
              },
            },
          ];

    // Derive base URL from request headers (works on Vercel and locally)
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const baseUrl = `${protocol}://${host}`;

    // Encode product IDs + quantities as metadata for fulfillment
    const itemsMeta = items.map((item) => ({ id: item.id, qty: item.quantity }));

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      currency: "eur",
      line_items: items.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.title,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      metadata: {
        items: JSON.stringify(itemsMeta),
      },
      phone_number_collection: { enabled: true },
      shipping_options: shippingOptions,
      shipping_address_collection: {
        allowed_countries: ["DE", "AT", "CH"],
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
