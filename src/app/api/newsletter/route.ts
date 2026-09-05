import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { addNewsletterSubscriber, setEmailSequenceState } from "@/lib/kv";

const FROM_EMAIL = process.env.EMAIL_FROM || "TrendWare <onboarding@resend.dev>";
const OWNER_EMAIL = "kontakt.trendware@gmail.com";

export async function POST(request: NextRequest) {
  try {
    if (process.env.NEWSLETTER_ENABLED !== "true") {
      return NextResponse.json({ error: "Newsletter-Anmeldung ist derzeit deaktiviert." }, { status: 503 });
    }
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Bitte gib eine gültige E-Mail-Adresse ein." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY fehlt");
      return NextResponse.json(
        { error: "Newsletter-Anmeldung momentan nicht möglich." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    // Store subscriber in KV for weekly newsletter
    await addNewsletterSubscriber(cleanEmail);

    // Initialize email sequence state (Day 0 welcome = emailsSent: 1)
    await setEmailSequenceState(cleanEmail, {
      subscribedAt: new Date().toISOString(),
      lastEmailSent: new Date().toISOString(),
      emailsSent: 1,
    });

    // Send welcome email to subscriber with discount code
    await resend.emails.send({
      from: FROM_EMAIL,
      to: cleanEmail,
      subject: "Willkommen bei TrendWare – Dein 10% Rabattcode",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <div style="background:linear-gradient(135deg,#c87f5a,#e8a87c);padding:32px;border-radius:12px 12px 0 0;text-align:center">
            <h1 style="color:#fff;margin:0;font-size:28px">TrendWare</h1>
            <p style="color:rgba(255,255,255,0.8);margin:8px 0 0">Smarte Produkte für deinen Alltag</p>
          </div>
          <div style="padding:32px;background:#fff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
            <h2 style="color:#111;margin-top:0">Willkommen!</h2>
            <p style="color:#555;line-height:1.6">
              Schön, dass du dabei bist! Als Dankeschön erhältst du
              <strong>10% Rabatt</strong> auf deine erste Bestellung.
            </p>
            <div style="background:#faf5ef;border:2px dashed #e8a87c;border-radius:12px;padding:24px;text-align:center;margin:24px 0">
              <p style="color:#555;margin:0 0 8px;font-size:14px">Dein Rabattcode:</p>
              <p style="font-family:monospace;font-size:28px;font-weight:bold;color:#c87f5a;margin:0;letter-spacing:3px">WILLKOMMEN10</p>
            </div>
            <p style="color:#555;line-height:1.6">
              Gib den Code einfach beim Checkout ein und spare sofort 10%.
            </p>
            <div style="text-align:center;margin:24px 0">
              <a href="https://trendware7.store/shop" style="display:inline-block;background:#c87f5a;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600">
                Jetzt stöbern
              </a>
            </div>
            <p style="color:#999;font-size:12px;margin-top:32px;border-top:1px solid #eee;padding-top:16px">
              Du erhältst diese E-Mail, weil du dich für den TrendWare-Newsletter angemeldet hast.
              Zum Abmelden antworte einfach auf diese E-Mail mit "Abmelden".
            </p>
          </div>
        </div>
      `,
    });

    // Notify owner about new subscriber
    await resend.emails.send({
      from: FROM_EMAIL,
      to: OWNER_EMAIL,
      subject: `Neuer Newsletter-Abonnent: ${cleanEmail}`,
      html: `<p>Neue Newsletter-Anmeldung: <strong>${cleanEmail}</strong></p>
             <p style="color:#999;font-size:12px">${new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" })}</p>`,
    });

    return NextResponse.json({
      message: "Erfolgreich angemeldet! Prüfe dein Postfach für den Rabattcode.",
    });
  } catch (err) {
    console.error("Newsletter error:", err);
    return NextResponse.json(
      { error: "Anmeldung fehlgeschlagen. Bitte versuche es erneut." },
      { status: 500 }
    );
  }
}
