import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Alle Felder sind erforderlich." },
        { status: 400 }
      );
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const FORWARD_EMAIL = process.env.CONTACT_FORWARD_EMAIL;

    if (!RESEND_API_KEY || !FORWARD_EMAIL) {
      console.error("RESEND_API_KEY oder CONTACT_FORWARD_EMAIL fehlt in .env.local");
      return NextResponse.json(
        { error: "Serverkonfiguration unvollständig." },
        { status: 500 }
      );
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "TrendWare Kontaktformular <onboarding@resend.dev>",
        to: [FORWARD_EMAIL],
        reply_to: email,
        subject: `[TrendWare Kontakt] ${subject}`,
        html: `
          <h2>Neue Nachricht über das Kontaktformular</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>E-Mail:</strong> ${escapeHtml(email)}</p>
          <p><strong>Betreff:</strong> ${escapeHtml(subject)}</p>
          <hr />
          <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
        `,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error("Resend API Fehler:", errData);
      return NextResponse.json(
        { error: "E-Mail konnte nicht gesendet werden." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Kontaktformular Fehler:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler." },
      { status: 500 }
    );
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
