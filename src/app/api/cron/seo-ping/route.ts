import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getAllProducts } from "@/data/product-store";

const BASE_URL = "https://trendware7.store";
const SITEMAP_URL = `${BASE_URL}/sitemap.xml`;
const OWNER_EMAIL = "kontakt.trendware@gmail.com";
const FROM_EMAIL = process.env.EMAIL_FROM || "TrendWare Agent <onboarding@resend.dev>";

/* ── Helper: static page URLs that should be submitted ─────── */
function getStaticUrls(): string[] {
  return [
    BASE_URL,
    `${BASE_URL}/shop`,
    `${BASE_URL}/agb`,
    `${BASE_URL}/datenschutz`,
    `${BASE_URL}/widerruf`,
    `${BASE_URL}/impressum`,
    `${BASE_URL}/versand`,
    `${BASE_URL}/kontakt`,
  ];
}

/* ── Google Ping ─────────────────────────────────────────────── */
async function pingGoogle(): Promise<{ ok: boolean; status: number; body: string }> {
  try {
    const url = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
    const res = await fetch(url, { method: "GET" });
    const body = await res.text();
    return { ok: res.ok, status: res.status, body: body.slice(0, 500) };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      body: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/* ── Bing / IndexNow Ping ────────────────────────────────────── */
async function pingIndexNow(
  urlList: string[]
): Promise<{ ok: boolean; status: number; body: string }> {
  const key = process.env.INDEXNOW_KEY;
  if (!key) {
    return { ok: false, status: 0, body: "INDEXNOW_KEY env var not set" };
  }

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: "trendware7.store",
        key,
        keyLocation: `${BASE_URL}/${key}.txt`,
        urlList,
      }),
    });
    const body = await res.text();
    return { ok: res.ok || res.status === 202, status: res.status, body: body.slice(0, 500) };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      body: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/* ── Main handler ────────────────────────────────────────────── */
export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Build the full URL list
    const products = await getAllProducts();
    const productUrls = products.map((p) => `${BASE_URL}/product/${p.slug}`);
    const allUrls = [...getStaticUrls(), ...productUrls];

    // Ping Google and Bing/IndexNow in parallel
    const [googleResult, indexNowResult] = await Promise.all([
      pingGoogle(),
      pingIndexNow(allUrls),
    ]);

    const timestamp = new Date().toISOString();

    // Send email report
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const resend = new Resend(resendKey);

      const statusBadge = (ok: boolean) =>
        ok
          ? '<span style="display:inline-block;background:#22c55e;color:white;font-size:11px;font-weight:bold;padding:3px 10px;border-radius:10px">OK</span>'
          : '<span style="display:inline-block;background:#ef4444;color:white;font-size:11px;font-weight:bold;padding:3px 10px;border-radius:10px">FEHLER</span>';

      await resend.emails.send({
        from: FROM_EMAIL,
        to: OWNER_EMAIL,
        subject: `SEO Ping: Google ${googleResult.ok ? "OK" : "FEHLER"} | IndexNow ${indexNowResult.ok ? "OK" : "FEHLER"} (${allUrls.length} URLs)`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <div style="background:linear-gradient(135deg,#955838,#e8a87c);padding:24px;border-radius:8px 8px 0 0">
              <h1 style="color:#fff;margin:0">TrendWare SEO Ping</h1>
              <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:14px">
                ${timestamp}
              </p>
            </div>
            <div style="padding:24px;background:#fff;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">

              <p style="color:#333;margin:0 0 16px">
                <strong>${allUrls.length}</strong> URLs eingereicht
                (<strong>${productUrls.length}</strong> Produkte + <strong>${getStaticUrls().length}</strong> statische Seiten)
              </p>

              <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
                <thead>
                  <tr style="border-bottom:2px solid #e5e7eb">
                    <th style="text-align:left;padding:8px;color:#666;font-size:13px">Dienst</th>
                    <th style="text-align:left;padding:8px;color:#666;font-size:13px">Status</th>
                    <th style="text-align:left;padding:8px;color:#666;font-size:13px">HTTP</th>
                    <th style="text-align:left;padding:8px;color:#666;font-size:13px">Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom:1px solid #f3f4f6">
                    <td style="padding:8px;font-weight:600">Google Ping</td>
                    <td style="padding:8px">${statusBadge(googleResult.ok)}</td>
                    <td style="padding:8px;font-family:monospace;font-size:13px">${googleResult.status}</td>
                    <td style="padding:8px;color:#666;font-size:12px;max-width:200px;overflow:hidden;text-overflow:ellipsis">${googleResult.body.slice(0, 120)}</td>
                  </tr>
                  <tr style="border-bottom:1px solid #f3f4f6">
                    <td style="padding:8px;font-weight:600">Bing / IndexNow</td>
                    <td style="padding:8px">${statusBadge(indexNowResult.ok)}</td>
                    <td style="padding:8px;font-family:monospace;font-size:13px">${indexNowResult.status}</td>
                    <td style="padding:8px;color:#666;font-size:12px;max-width:200px;overflow:hidden;text-overflow:ellipsis">${indexNowResult.body.slice(0, 120) || "(empty)"}</td>
                  </tr>
                </tbody>
              </table>

              <details style="margin-top:12px">
                <summary style="cursor:pointer;color:#955838;font-weight:600;font-size:14px">
                  Alle ${allUrls.length} eingereichten URLs anzeigen
                </summary>
                <ul style="margin-top:8px;padding-left:20px;font-size:12px;color:#666">
                  ${allUrls.map((u) => `<li style="margin:2px 0"><a href="${u}" style="color:#955838">${u}</a></li>`).join("")}
                </ul>
              </details>

              <p style="color:#999;font-size:11px;margin-top:20px">
                Dieser Bericht wird täglich um 06:00 UTC automatisch erstellt.
              </p>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({
      message: "SEO ping completed.",
      timestamp,
      urlCount: allUrls.length,
      google: { ok: googleResult.ok, status: googleResult.status },
      indexNow: { ok: indexNowResult.ok, status: indexNowResult.status },
    });
  } catch (error) {
    console.error("SEO Ping Fehler:", error);
    return NextResponse.json(
      { error: "Fehler beim SEO-Ping." },
      { status: 500 }
    );
  }
}
