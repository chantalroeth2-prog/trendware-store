import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import {
  getCJPendingMatches,
  removeCJPendingMatch,
  setProductOverride,
} from "@/lib/kv";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return htmlResponse("Fehler", "Kein Token angegeben.", "#ef4444");
  }

  try {
    // 1. Verify JWT
    const secret = new TextEncoder().encode(process.env.AGENT_APPROVE_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (payload.type !== "cj-match") {
      return htmlResponse("Fehler", "Ungültiges Token-Format.", "#ef4444");
    }

    const matchId = payload.matchId as string;
    const productSlug = payload.productSlug as string;
    const cjVid = payload.cjVid as string;

    if (!matchId || !productSlug || !cjVid) {
      return htmlResponse("Fehler", "Unvollständige Token-Daten.", "#ef4444");
    }

    // 2. Find the pending match
    const matches = await getCJPendingMatches();
    const match = matches.find((m) => m.id === matchId);

    if (!match) {
      return htmlResponse(
        "Bereits verarbeitet",
        "Dieses CJ-Match wurde bereits bestätigt oder ist abgelaufen.",
        "#f59e0b"
      );
    }

    // 3. Apply: save cjProductId as product override
    await setProductOverride(productSlug, {
      cjProductId: cjVid,
    });

    // 4. Remove from pending
    await removeCJPendingMatch(matchId);

    return htmlResponse(
      "CJ-Match bestätigt!",
      `Produkt "${match.productTitle}" hat jetzt die CJ Product ID: ${cjVid}. Bestellungen können nun automatisch an CJ weitergeleitet werden.`,
      "#22c55e"
    );
  } catch (err) {
    console.error("CJ Approve Fehler:", err);

    const message =
      err instanceof Error && err.message.includes("expired")
        ? "Dieser Bestätigungslink ist abgelaufen (max. 7 Tage gültig)."
        : "Ein Fehler ist aufgetreten. Bitte versuche es erneut.";

    return htmlResponse("Fehler", message, "#ef4444");
  }
}

function htmlResponse(
  title: string,
  message: string,
  color: string
): NextResponse {
  const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} – TrendWare CJ-Matcher</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #faf5ef;
      color: #3d3530;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 16px;
    }
    .card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 40px;
      max-width: 480px;
      text-align: center;
      box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    }
    .icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      font-size: 28px;
    }
    h1 { font-size: 22px; margin: 0 0 12px; color: #3d3530; }
    p { color: #7a6e66; line-height: 1.6; font-size: 14px; }
    a {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 28px;
      background: #c87f5a;
      color: #fff;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
    }
    a:hover { background: #b06a48; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon" style="background:${color}20">
      ${color === "#22c55e" ? "&#10003;" : color === "#f59e0b" ? "&#9888;" : "&#10007;"}
    </div>
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="/">Zum Shop</a>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
