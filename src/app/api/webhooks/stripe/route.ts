import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { fulfillOrder } from "@/lib/fulfillment";
import type Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Keine Signatur" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET fehlt");
    return NextResponse.json({ error: "Webhook nicht konfiguriert" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unbekannter Fehler";
    console.error("Webhook-Signatur ungültig:", message);
    return NextResponse.json({ error: "Ungültige Signatur" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (!event.livemode || session.payment_status !== "paid" || process.env.PAYMENTS_LIVE_ENABLED !== "true") {
      return NextResponse.json({ received: true, fulfillment: "skipped-non-live-or-unpaid" });
    }

    try {
      // Retrieve line items for this session
      const lineItems = await getStripe().checkout.sessions.listLineItems(session.id);

      // Parse product metadata from session
      const itemsMetadata: { productId: string; quantity: number }[] = [];

      if (session.metadata?.items) {
        try {
          const parsed = JSON.parse(session.metadata.items) as {
            id: string;
            qty: number;
          }[];
          for (const p of parsed) {
            itemsMetadata.push({ productId: p.id, quantity: p.qty });
          }
        } catch {
          console.error("Metadata-Items konnten nicht geparst werden");
        }
      }

      // Fallback: if no metadata, use line items count
      if (itemsMetadata.length === 0 && lineItems.data.length > 0) {
        for (const li of lineItems.data) {
          itemsMetadata.push({
            productId: li.description || "unknown",
            quantity: li.quantity || 1,
          });
        }
      }

      const shipping = session.collected_information?.shipping_details;
      const address = shipping?.address;

      await fulfillOrder({
        orderNumber: session.id.slice(-12).toUpperCase(),
        customerName: shipping?.name || session.customer_details?.name || "Unbekannt",
        address: [address?.line1, address?.line2].filter(Boolean).join(", "),
        city: address?.city || "",
        zip: address?.postal_code || "",
        countryCode: address?.country || "DE",
        phone: session.customer_details?.phone || "",
        email: session.customer_details?.email || "",
        items: itemsMetadata,
      });

      console.log(`Fulfillment gestartet für Stripe-Session: ${session.id}`);
    } catch (err) {
      console.error("Fulfillment-Fehler:", err);
      // Return 200 anyway so Stripe doesn't retry endlessly
    }
  }

  return NextResponse.json({ received: true });
}
