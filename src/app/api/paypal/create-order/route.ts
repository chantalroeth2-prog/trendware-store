import { NextRequest, NextResponse } from "next/server";
import { getAllProducts } from "@/data/product-store";
import { isProductOrderable } from "@/lib/product-compliance";

/*
 * =============================================================
 * PAYPAL – ORDER ERSTELLEN
 * =============================================================
 * Erstellt eine PayPal-Order mit den Warenkorb-Artikeln.
 * PayPal zeigt dann die Bestellübersicht im Popup an.
 *
 * SETUP:
 * 1. PayPal Developer Account: https://developer.paypal.com
 * 2. App erstellen unter: https://developer.paypal.com/dashboard/applications/sandbox
 * 3. Client ID + Secret in .env.local eintragen
 * =============================================================
 */

const PAYPAL_API_BASE =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !secret) {
    throw new Error("PayPal Client ID oder Secret fehlt in .env.local");
  }

  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error(`PayPal Token-Fehler: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.access_token;
}

interface CheckoutItem {
  id: string;
  quantity: number;
}

export async function POST(request: NextRequest) {
  try {
    if (
      process.env.PAYMENTS_LIVE_ENABLED !== "true" ||
      process.env.PAYPAL_MODE !== "live" ||
      !process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
      !process.env.PAYPAL_CLIENT_SECRET
    ) {
      return NextResponse.json(
        { error: "PayPal-Zahlung ist derzeit nicht verfügbar." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const requestedItems: CheckoutItem[] = body.items;
    const country = body.country === "FR" ? "FR" : body.country === "DE" ? "DE" : null;

    if (!requestedItems || requestedItems.length === 0 || !country) {
      return NextResponse.json(
        { error: "Keine Artikel im Warenkorb." },
        { status: 400 }
      );
    }

    const products = await getAllProducts();
    const productById = new Map(products.map((product) => [product.id, product]));
    const items = requestedItems.map((item) => ({ product: productById.get(item.id), quantity: item.quantity }));
    if (items.some(({ product, quantity }) => !product || !isProductOrderable(product) || !Number.isInteger(quantity) || quantity < 1 || quantity > 10)) {
      return NextResponse.json({ error: "Mindestens ein Produkt ist aktuell nicht bestellbar oder die Menge ist ungültig." }, { status: 409 });
    }
    const subtotal = items.reduce((sum, item) => sum + item.product!.price * item.quantity, 0);
    const shipping = country === "FR" ? 6.99 : 4.99;
    const total = subtotal + shipping;

    const accessToken = await getPayPalAccessToken();

    const orderPayload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "EUR",
            value: total.toFixed(2),
            breakdown: {
              item_total: { currency_code: "EUR", value: subtotal.toFixed(2) },
              shipping: { currency_code: "EUR", value: shipping.toFixed(2) },
            },
          },
          items: items.map((item) => ({
            name: item.product!.title.substring(0, 127),
            unit_amount: {
              currency_code: "EUR",
              value: item.product!.price.toFixed(2),
            },
            quantity: String(item.quantity),
            category: "PHYSICAL_GOODS",
            custom_id: item.product!.id,
          })),
        },
      ],
    };

    const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderPayload),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("PayPal Create Order HTTP Error:", res.status, errBody);
      return NextResponse.json(
        { error: "PayPal-Bestellung konnte nicht erstellt werden." },
        { status: 502 }
      );
    }

    const order = await res.json();

    if (order.id) {
      return NextResponse.json({ id: order.id });
    } else {
      console.error("PayPal Create Order Error:", order);
      return NextResponse.json(
        { error: "PayPal-Bestellung konnte nicht erstellt werden." },
        { status: 500 }
      );
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unbekannter Fehler";
    console.error("PayPal Create Order Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
