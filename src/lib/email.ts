import { Resend } from "resend";

const OWNER_EMAIL = "kontakt.trendware@gmail.com";
const FROM_EMAIL = process.env.EMAIL_FROM || "TrendWare <onboarding@resend.dev>";

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY fehlt. Bitte in den Umgebungsvariablen setzen.");
  }
  return new Resend(key);
}

export interface OrderItem {
  title: string;
  quantity: number;
  price: number;
  productId: string;
  cjProductId?: string;
}

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  address: string;
  city: string;
  zip: string;
  countryCode: string;
  items: OrderItem[];
  total: number;
  cjOrderId?: string;
  manualItems: OrderItem[];
}

export async function sendOwnerNotification(data: OrderEmailData): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key || key === "dummy" || key.startsWith("test_") || process.env.NEXT_PUBLIC_TEST_MODE === "true") {
    console.log(`[TEST-MODUS] Owner-E-Mail simuliert für Bestellung #${data.orderNumber}`);
    return;
  }
  const resend = getResend();

  const itemRows = data.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${item.title}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${item.price.toFixed(2)} &euro;</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.cjProductId ? "CJ Auto" : "Manuell"}</td>
        </tr>`
    )
    .join("");

  const manualWarning =
    data.manualItems.length > 0
      ? `<div style="background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:16px;margin:16px 0">
          <strong>Manuell zu erfüllen:</strong>
          <ul>${data.manualItems.map((i) => `<li>${i.title} (${i.quantity}x)</li>`).join("")}</ul>
        </div>`
      : "";

  const cjStatus = data.cjOrderId
    ? `<p style="color:#28a745"><strong>CJ-Bestellung erstellt:</strong> ${data.cjOrderId}</p>`
    : data.manualItems.length === data.items.length
      ? `<p style="color:#dc3545"><strong>Keine CJ-Bestellung</strong> – alle Produkte müssen manuell versendet werden.</p>`
      : "";

  await resend.emails.send({
    from: FROM_EMAIL,
    to: OWNER_EMAIL,
    subject: `Neue Bestellung #${data.orderNumber}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#333">Neue Bestellung #${data.orderNumber}</h2>

        <h3>Kunde</h3>
        <p>
          ${data.customerName}<br/>
          ${data.address}<br/>
          ${data.zip} ${data.city}<br/>
          ${data.countryCode}<br/>
          <a href="mailto:${data.customerEmail}">${data.customerEmail}</a>
        </p>

        <h3>Bestellte Artikel</h3>
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:#f8f9fa">
              <th style="padding:8px;text-align:left">Produkt</th>
              <th style="padding:8px;text-align:center">Menge</th>
              <th style="padding:8px;text-align:right">Preis</th>
              <th style="padding:8px;text-align:center">Fulfillment</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding:8px;font-weight:bold">Gesamt</td>
              <td style="padding:8px;text-align:right;font-weight:bold">${data.total.toFixed(2)} &euro;</td>
              <td></td>
            </tr>
          </tfoot>
        </table>

        ${cjStatus}
        ${manualWarning}
      </div>
    `,
  });
}

export async function sendCustomerConfirmation(data: OrderEmailData): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key || key === "dummy" || key.startsWith("test_") || process.env.NEXT_PUBLIC_TEST_MODE === "true") {
    console.log(`[TEST-MODUS] Kunden-E-Mail simuliert für Bestellung #${data.orderNumber}`);
    return;
  }
  const resend = getResend();

  const itemRows = data.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${item.title}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${item.price.toFixed(2)} &euro;</td>
        </tr>`
    )
    .join("");

  await resend.emails.send({
    from: FROM_EMAIL,
    to: data.customerEmail,
    subject: `Deine Bestellung bei TrendWare #${data.orderNumber}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1a1a2e;padding:24px;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0">Trend<span style="color:#e8a87c">Ware</span></h1>
        </div>

        <div style="padding:24px;background:#fff;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
          <h2 style="color:#333">Vielen Dank für deine Bestellung!</h2>
          <p>Hallo ${data.customerName},</p>
          <p>wir haben deine Bestellung <strong>#${data.orderNumber}</strong> erhalten und bearbeiten sie jetzt.</p>

          <h3>Deine Bestellung</h3>
          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr style="background:#f8f9fa">
                <th style="padding:8px;text-align:left">Produkt</th>
                <th style="padding:8px;text-align:center">Menge</th>
                <th style="padding:8px;text-align:right">Preis</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding:8px;font-weight:bold">Gesamt</td>
                <td style="padding:8px;text-align:right;font-weight:bold">${data.total.toFixed(2)} &euro;</td>
              </tr>
            </tfoot>
          </table>

          <h3>Lieferadresse</h3>
          <p>
            ${data.customerName}<br/>
            ${data.address}<br/>
            ${data.zip} ${data.city}<br/>
            ${data.countryCode}
          </p>

          <div style="background:#f0f4ff;border-radius:8px;padding:16px;margin:16px 0">
            <strong>Voraussichtliche Lieferzeit:</strong> 7–14 Werktage<br/>
            Du erhältst eine Versandbestätigung mit Tracking-Link, sobald dein Paket unterwegs ist.
          </div>

          <p>
            Fragen? Schreib uns an
            <a href="mailto:kontakt.trendware@gmail.com">kontakt.trendware@gmail.com</a>
          </p>

          <p style="color:#999;font-size:12px;margin-top:24px">
            &copy; TrendWare – Smarte Produkte für deinen Alltag
          </p>
        </div>
      </div>
    `,
  });
}
