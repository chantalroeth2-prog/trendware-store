import { NextRequest, NextResponse } from "next/server";
import { fulfillOrder } from "@/lib/fulfillment";

const PAYPAL_API_BASE =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !secret) {
    throw new Error("PayPal Client ID oder Secret fehlt");
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderID } = body;

    if (!orderID) {
      return NextResponse.json(
        { error: "Keine Order-ID angegeben." },
        { status: 400 }
      );
    }

    const accessToken = await getPayPalAccessToken();

    const res = await fetch(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const errBody = await res.text();
      console.error("PayPal Capture HTTP Error:", res.status, errBody);
      return NextResponse.json(
        { error: "Zahlung konnte nicht abgeschlossen werden." },
        { status: 502 }
      );
    }

    const captureData = await res.json();

    if (captureData.status === "COMPLETED") {
      // Trigger fulfillment after successful capture
      try {
        // Get order details for fulfillment
        const detailRes = await fetch(
          `${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const orderDetails = await detailRes.json();

        const purchaseUnit = orderDetails.purchase_units?.[0];
        const shipping = purchaseUnit?.shipping;
        const payer = orderDetails.payer;

        // Parse product IDs from custom_id or reference_id
        const items: { productId: string; quantity: number }[] = [];
        const paypalItems = purchaseUnit?.items || [];

        for (const item of paypalItems) {
          if (item.custom_id) {
            items.push({
              productId: item.custom_id,
              quantity: parseInt(item.quantity, 10) || 1,
            });
          }
        }

        // Fallback: parse from reference_id on purchase unit
        if (items.length === 0 && purchaseUnit?.reference_id) {
          try {
            const parsed = JSON.parse(purchaseUnit.reference_id) as {
              id: string;
              qty: number;
            }[];
            for (const p of parsed) {
              items.push({ productId: p.id, quantity: p.qty });
            }
          } catch {
            // reference_id wasn't JSON, skip
          }
        }

        const address = shipping?.address;
        await fulfillOrder({
          orderNumber: `PP-${orderID.slice(-10).toUpperCase()}`,
          customerName: shipping?.name?.full_name || `${payer?.name?.given_name || ""} ${payer?.name?.surname || ""}`.trim() || "Unbekannt",
          address: [address?.address_line_1, address?.address_line_2].filter(Boolean).join(", "),
          city: address?.admin_area_2 || "",
          zip: address?.postal_code || "",
          countryCode: address?.country_code || "DE",
          phone: payer?.phone?.phone_number?.national_number || "",
          email: payer?.email_address || "",
          items,
        });

        console.log(`Fulfillment gestartet für PayPal-Order: ${orderID}`);
      } catch (err) {
        console.error("Fulfillment-Fehler bei PayPal:", err);
        // Don't fail the capture response because of fulfillment error
      }

      return NextResponse.json({
        success: true,
        orderID: captureData.id,
        status: captureData.status,
      });
    } else {
      console.error("PayPal Capture Error:", captureData);
      return NextResponse.json(
        { error: "Zahlung konnte nicht abgeschlossen werden." },
        { status: 500 }
      );
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unbekannter Fehler";
    console.error("PayPal Capture Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
