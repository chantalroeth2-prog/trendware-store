import { NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";
import { Resend } from "resend";
import { getAllProducts } from "@/data/product-store";
import { getBlogPosts, addBlogPost } from "@/lib/kv";
import type { BlogPost } from "@/lib/kv";
import type { Product } from "@/data/products";

const OWNER_EMAIL = "kontakt.trendware@gmail.com";
const FROM_EMAIL = process.env.EMAIL_FROM || "TrendWare Agent <onboarding@resend.dev>";
const SITE_URL = "https://trendware7.store";

// ---------------------------------------------------------------------------
// Slug helper
// ---------------------------------------------------------------------------

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[äÄ]/g, "ae")
    .replace(/[öÖ]/g, "oe")
    .replace(/[üÜ]/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// ---------------------------------------------------------------------------
// Gemini blog generation
// ---------------------------------------------------------------------------

interface GeneratedPost {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  relatedProductSlugs: string[];
  primaryProductSlug: string;
}

async function generateBlogPosts(
  products: Product[],
  existingTitles: string[]
): Promise<GeneratedPost[]> {
  const productList = products
    .map(
      (p) =>
        `- "${p.title}" (slug: ${p.slug}, Preis: ${p.price.toFixed(2)} EUR, Kategorie: ${p.category}, Features: ${p.features.slice(0, 3).join(", ")})`
    )
    .join("\n");

  const existingList =
    existingTitles.length > 0
      ? existingTitles.map((t) => `- ${t}`).join("\n")
      : "Noch keine Artikel vorhanden.";

  const currentYear = new Date().getFullYear();

  const prompt = `Du bist ein erfahrener SEO-Content-Autor für den deutschen Online-Shop "Trendware" (trendware7.store).
TrendWare ist warm, persönlich und freundlich — wie ein guter Freund der dir Produkte empfiehlt. NICHT kalt oder corporate.
Markenidentität: Logo-Font Comfortaa (rund, freundlich), "trend" in dunkelbraun (#3d3530), "ware" in warmem Sienna (#c87f5a), kleines Paket-Icon. Farben: Sienna #c87f5a (primär), Apricot #e8a87c (hell), Dunkelbraun #3d3530 (Text), warmes Creme #faf5ef (Hintergrund).
TrendWare verkauft smarte Gadgets und Alltagshelfer für Zuhause, Büro, Fitness, Haustiere und Elektronik.

AKTUELLE PRODUKTE IM SHOP:
${productList}

BEREITS EXISTIERENDE BLOG-ARTIKEL (KEINE DUPLIKATE!):
${existingList}

AUFGABE:
Erstelle genau 2 hochwertige, ausführliche Blog-Artikel auf Deutsch. Jeder Artikel soll:

1. Ein Long-Tail-Keyword auf Deutsch als Hauptthema haben (z.B. "beste LED Nachttischlampe ${currentYear}", "Home Office einrichten Tipps", "Katzenspielzeug im Test")
2. Zwischen 1000 und 1500 Wörter lang sein
3. Genuinen Mehrwert bieten – Kaufberatung, Vergleiche, How-To-Anleitungen, Tipps
4. Natürliche Produkterwähnungen enthalten mit HTML-Links: <a href="/product/SLUG">Produktname</a>
5. Gut strukturiert sein mit H2 und H3 Überschriften
6. Keine werbliche Sprache – informativ, hilfreich, vertrauenswürdig. Schreibe in der Du-Form, warm und persönlich, wie ein Freund der einen guten Tipp gibt

ARTIKELTYPEN (wähle passende aus):
- Produktvergleich: "Die 5 besten ... im Vergleich ${currentYear}"
- Kaufratgeber: "... kaufen: Worauf du achten musst"
- How-To: "... einrichten/organisieren: Schritt-für-Schritt Anleitung"
- Listicle: "7 Gadgets die du für ... brauchst"
- Testbericht: "... im Test: Unsere Erfahrungen"
- Tipps: "10 Tipps für besseres ..."

WICHTIGE REGELN:
- Schreibe auf Deutsch mit korrekter Grammatik
- Verwende KEINE Emojis im Artikeltext
- HTML-Format für den Content (h2, h3, p, ul, li, a, strong, em)
- Jeder Artikel muss mindestens 2-3 Produkte aus dem Shop natürlich erwähnen und verlinken
- Die Artikel müssen sich thematisch von den bestehenden unterscheiden
- Schreibe für echte Leser, nicht für Suchmaschinen – aber optimiere trotzdem die Struktur
- Verwende konsequent die Du-Form (informelles Deutsch). Der Ton ist warm, einladend und persönlich — wie "dein smarter shop" eben klingt

Antworte NUR mit einem JSON-Array im folgenden Format (keine Markdown-Codeblocks):
[
  {
    "title": "Der vollständige Artikeltitel",
    "excerpt": "Eine 1-2 Satz Zusammenfassung für die Blog-Übersicht (max 160 Zeichen)",
    "content": "<h2>Überschrift</h2><p>Artikeltext mit <a href=\\"/product/slug\\">Produktlinks</a>...</p>",
    "tags": ["Tag1", "Tag2", "Tag3"],
    "relatedProductSlugs": ["slug-1", "slug-2", "slug-3"],
    "primaryProductSlug": "slug-des-wichtigsten-produkts"
  }
]`;

  const text = await callGroq(prompt, { maxTokens: 8000 });

  // Strip markdown code fences if present
  const cleaned = text
    .replace(/^```(?:json)?\s*\n?/, "")
    .replace(/\n?\s*```$/, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    const posts: GeneratedPost[] = Array.isArray(parsed) ? parsed : [];
    return posts.filter(isValidPost).slice(0, 2);
  } catch (err) {
    console.error("Blog-Writer JSON parse error:", err, "\nResponse:", text);
    return [];
  }
}

function isValidPost(post: GeneratedPost): boolean {
  return !!(
    post.title &&
    post.excerpt &&
    post.content &&
    post.content.length > 500 &&
    Array.isArray(post.tags) &&
    Array.isArray(post.relatedProductSlugs) &&
    post.primaryProductSlug
  );
}

// ---------------------------------------------------------------------------
// Email notification
// ---------------------------------------------------------------------------

function buildNotificationEmail(posts: BlogPost[]): string {
  const postCards = posts
    .map(
      (post) => `
      <div style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;margin:16px 0">
        <div style="padding:20px">
          <h3 style="margin:0 0 8px;color:#3d3530;font-size:16px">${post.title}</h3>
          <p style="margin:0 0 12px;color:#7a6e66;font-size:14px">${post.excerpt}</p>
          <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
            <a href="${SITE_URL}/blog/${post.slug}" style="display:inline-block;background:#c87f5a;color:#fff;padding:8px 20px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600">
              Artikel lesen
            </a>
            <span style="color:#999;font-size:12px">${post.readTimeMinutes} Min. Lesezeit</span>
            <span style="color:#999;font-size:12px">${post.tags.join(", ")}</span>
          </div>
        </div>
      </div>`
    )
    .join("");

  return `
    <div style="font-family:Comfortaa,sans-serif;max-width:600px;margin:0 auto;background:#faf5ef">
      <div style="background:linear-gradient(135deg,#c87f5a,#e8a87c);padding:24px;border-radius:8px 8px 0 0;text-align:center">
        <h1 style="color:#3d3530;margin:0;font-size:22px;font-family:Comfortaa,sans-serif">trend<span style="color:#c87f5a">ware</span> Blog</h1>
        <p style="color:rgba(61,53,48,0.6);margin:4px 0 0;font-size:11px">dein smarter shop</p>
        <p style="color:#3d3530;margin:8px 0 0;font-size:14px">Neue Artikel veröffentlicht</p>
      </div>
      <div style="padding:24px;background:#fff;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
        <p style="color:#3d3530;font-size:15px;line-height:1.6;margin:0 0 16px">
          Der Blog-Writer hat ${posts.length} neue Artikel generiert und veröffentlicht:
        </p>
        ${postCards}
        <p style="color:#999;font-size:12px;margin-top:24px;text-align:center">
          Automatisch generiert von TrendWare Blog-Writer
        </p>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Get all products and existing blog posts
    const [products, existingPosts] = await Promise.all([
      getAllProducts(),
      getBlogPosts().catch(() => [] as BlogPost[]),
    ]);

    if (products.length === 0) {
      return NextResponse.json({ message: "Keine Produkte vorhanden." });
    }

    const existingTitles = existingPosts.map((p) => p.title);

    // 2. Generate 2 blog posts via Gemini Flash
    const generatedPosts = await generateBlogPosts(products, existingTitles);

    if (generatedPosts.length === 0) {
      return NextResponse.json({
        message: "Keine Blog-Artikel generiert.",
        existingPosts: existingPosts.length,
      });
    }

    // 3. Build BlogPost objects and save to KV
    const now = new Date().toISOString();
    const savedPosts: BlogPost[] = [];

    for (const generated of generatedPosts) {
      // Find the primary product to use its image as cover
      const primaryProduct = products.find(
        (p) => p.slug === generated.primaryProductSlug
      );
      const coverImage =
        primaryProduct?.images[0] ||
        products[Math.floor(Math.random() * products.length)].images[0];

      // Estimate reading time (~200 words per minute in German)
      const wordCount = generated.content
        .replace(/<[^>]+>/g, "")
        .split(/\s+/).length;
      const readTimeMinutes = Math.max(3, Math.round(wordCount / 200));

      // Validate that relatedProductSlugs reference real products
      const validSlugs = new Set(products.map((p) => p.slug));
      const relatedProductSlugs = generated.relatedProductSlugs.filter((s) =>
        validSlugs.has(s)
      );

      const blogPost: BlogPost = {
        slug: toSlug(generated.title),
        title: generated.title,
        excerpt: generated.excerpt,
        content: generated.content,
        coverImage,
        author: "TrendWare Redaktion",
        publishedAt: now,
        readTimeMinutes,
        tags: generated.tags.slice(0, 5),
        relatedProductSlugs: relatedProductSlugs.slice(0, 4),
      };

      await addBlogPost(blogPost);
      savedPosts.push(blogPost);
    }

    // 4. Send email notification
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && savedPosts.length > 0) {
      try {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: FROM_EMAIL,
          to: OWNER_EMAIL,
          subject: `TrendWare Blog: ${savedPosts.length} neue Artikel veröffentlicht`,
          html: buildNotificationEmail(savedPosts),
        });
      } catch (emailErr) {
        console.error("Blog-Writer E-Mail Fehler:", emailErr);
      }
    }

    return NextResponse.json({
      message: `${savedPosts.length} Blog-Artikel generiert und veröffentlicht.`,
      posts: savedPosts.map((p) => ({
        title: p.title,
        slug: p.slug,
        url: `${SITE_URL}/blog/${p.slug}`,
        readTimeMinutes: p.readTimeMinutes,
        tags: p.tags,
      })),
    });
  } catch (error) {
    console.error("Blog-Writer Cron Fehler:", error);
    return NextResponse.json(
      { error: "Fehler bei der Blog-Generierung." },
      { status: 500 }
    );
  }
}
