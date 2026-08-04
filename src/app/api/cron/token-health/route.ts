import { NextResponse } from "next/server";
import { Resend } from "resend";

const OWNER_EMAIL = "kontakt.trendware@gmail.com";
const FROM_EMAIL = "TrendWare Agent <noreply@trendware.store>";
const GRAPH_API = "https://graph.facebook.com/v25.0";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pageToken = process.env.META_PAGE_ACCESS_TOKEN;
  if (!pageToken) {
    return NextResponse.json({ error: "META_PAGE_ACCESS_TOKEN fehlt" }, { status: 500 });
  }

  try {
    // Debug the token to check expiration
    const debugRes = await fetch(
      `${GRAPH_API}/debug_token?input_token=${pageToken}&access_token=${pageToken}`
    );
    const debugData = await debugRes.json();

    if (debugData.error) {
      // Token is already invalid
      await sendAlert(
        "Meta Token UNGÜLTIG",
        `Der Meta Page Access Token ist nicht mehr gültig: ${debugData.error.message}\n\nBitte neuen Token generieren unter: https://developers.facebook.com/tools/explorer/`
      );
      return NextResponse.json({ status: "invalid", error: debugData.error.message });
    }

    const tokenData = debugData.data;
    const expiresAt = tokenData?.expires_at;
    const scopes = tokenData?.scopes || [];
    const isValid = tokenData?.is_valid;

    // Check if token is valid
    if (!isValid) {
      await sendAlert(
        "Meta Token UNGÜLTIG",
        "Der Meta Page Access Token ist nicht mehr gültig. Bitte neuen Token generieren."
      );
      return NextResponse.json({ status: "invalid" });
    }

    // Check expiration (0 = never expires)
    if (expiresAt && expiresAt !== 0) {
      const expiresDate = new Date(expiresAt * 1000);
      const daysLeft = Math.floor((expiresDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

      if (daysLeft < 7) {
        await sendAlert(
          `Meta Token läuft in ${daysLeft} Tagen ab!`,
          `Der Token läuft am ${expiresDate.toLocaleDateString("de-DE")} ab.\n\nJetzt erneuern:\n1. https://developers.facebook.com/tools/explorer/ öffnen\n2. App "TrendWare" wählen\n3. Berechtigungen: pages_show_list, instagram_basic, instagram_content_publish, pages_read_engagement, pages_manage_metadata, pages_manage_posts\n4. Token generieren, TrendWare-Seite auswählen\n5. Token an den Assistenten geben zum Austausch`
        );
        return NextResponse.json({ status: "expiring_soon", daysLeft });
      }
    }

    // Quick API health check: can we read the IG account?
    const igId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
    if (igId) {
      const igRes = await fetch(
        `${GRAPH_API}/${igId}?fields=username,media_count&access_token=${pageToken}`
      );
      const igData = await igRes.json();
      if (igData.error) {
        await sendAlert(
          "Instagram API-Zugriff fehlgeschlagen",
          `Konnte Instagram-Account nicht lesen: ${igData.error.message}`
        );
        return NextResponse.json({ status: "ig_error", error: igData.error.message });
      }

      return NextResponse.json({
        status: "healthy",
        token: {
          valid: true,
          expires: expiresAt === 0 ? "never" : new Date(expiresAt * 1000).toISOString(),
          scopes: scopes.length,
        },
        instagram: {
          username: igData.username,
          mediaCount: igData.media_count,
        },
      });
    }

    return NextResponse.json({
      status: "healthy",
      token: { valid: true, expires: expiresAt === 0 ? "never" : "limited", scopes: scopes.length },
    });
  } catch (error) {
    console.error("Token health check error:", error);
    return NextResponse.json({ error: "Health check fehlgeschlagen" }, { status: 500 });
  }
}

async function sendAlert(subject: string, body: string) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const resend = new Resend(resendKey);
  await resend.emails.send({
    from: FROM_EMAIL,
    to: OWNER_EMAIL,
    subject: `[WARNUNG] ${subject}`,
    html: `
      <div style="font-family:system-ui;max-width:500px;margin:0 auto;padding:24px">
        <div style="background:#fef2f2;border:2px solid #fca5a5;border-radius:12px;padding:20px;margin-bottom:16px">
          <h2 style="margin:0 0 12px;color:#991b1b;font-size:18px">${subject}</h2>
          <pre style="margin:0;color:#b91c1c;font-size:14px;white-space:pre-wrap;line-height:1.6">${body}</pre>
        </div>
        <p style="color:#999;font-size:12px;text-align:center">TrendWare Token Health Monitor</p>
      </div>`,
  });
}
