import type { Product } from "@/data/products";

interface AdCreative {
  productTitle: string;
  productSlug: string;
  productPrice: number;
  productImage: string;
  productUrl: string;
  platform: "tiktok" | "meta";
  hook: string;
  adText: string;
  cta: string;
  targeting: string;
  angle: string;
}

export interface AdPackage {
  product: {
    title: string;
    slug: string;
    price: number;
    image: string;
    url: string;
    category: string;
  };
  creatives: AdCreative[];
}

const HOOKS: Record<string, string[]> = {
  haustiere: [
    "Dein Hund wird dieses Gadget lieben",
    "Das braucht jeder Haustierbesitzer",
    "Seit ich das habe, sind Abendspaziergänge so viel besser",
    "Meine Katze flippt jedes Mal aus",
  ],
  "lifestyle-fitness": [
    "Dieses Gadget hat mein Workout verändert",
    "3 Fitness-Gadgets unter 25 €, die wirklich was bringen",
    "Home Workout auf einem neuen Level",
    "Warum hat mir das niemand früher gesagt?!",
  ],
  "zuhause-deko": [
    "POV: Du richtest dein Zimmer für unter 30 € um",
    "Dieses Teil macht jedes Zimmer sofort gemütlicher",
    "Meine Freundin dachte, das kostet 80 €",
    "Das Gadget, das mir am meisten Komplimente bringt",
  ],
  "buero-produktivitaet": [
    "Dieses 25-€-Gadget hat mein Home Office verändert",
    "Vorher/Nachher: Mein Schreibtisch-Upgrade",
    "Warum hat mir das niemand früher gezeigt?!",
    "Remote Work Game Changer für unter 30 €",
  ],
  "kueche-haushalt": [
    "Das smarteste Küchen-Gadget das ich je hatte",
    "Kochen wird damit so viel einfacher",
    "Meine Küche sieht jetzt aus wie bei Pinterest",
    "Unter 25 € und ich benutze es jeden Tag",
  ],
};

const ANGLES = [
  { name: "Problem-Lösung", template: (p: string) => `Kennst du das Problem? [Alltagsproblem]. ${p} macht es einfach besser. Probier's aus!` },
  { name: "Produktnutzen", template: (p: string) => `${p}: Zeige ausschließlich die belegten Funktionen im tatsächlichen Alltagseinsatz.` },
];

function getHooks(categorySlug: string): string[] {
  return HOOKS[categorySlug] || HOOKS["zuhause-deko"];
}

function generateAdText(product: Product, hook: string, angle: typeof ANGLES[0]): string {
  return `${hook}\n\n${angle.template(product.title)}\n\nAb ${product.price.toFixed(2)} € | Versandkosten werden im Checkout angezeigt\ntrendware7.store`;
}

function generateTargeting(product: Product): string {
  const targetingMap: Record<string, string> = {
    haustiere: "Interessen: Hunde, Katzen, Haustiere, Fressnapf, Zooplus | Alter: 18-45 | Standort: DE",
    "lifestyle-fitness": "Interessen: Fitness, Home Workout, Yoga, Gymshark | Alter: 18-35 | Standort: DE",
    "zuhause-deko": "Interessen: Interior Design, IKEA, Pinterest, Minimalismus | Alter: 18-40 | Standort: DE",
    "buero-produktivitaet": "Interessen: Home Office, Freelancer, Produktivität, Remote Work | Alter: 22-40 | Standort: DE",
    "kueche-haushalt": "Interessen: Kochen, Kitchen Gadgets, Food, Haushalt | Alter: 20-45 | Standort: DE",
  };
  return targetingMap[product.categorySlug] || "Broad: DE, 18-40, keine Einschränkung (Algorithmus vertrauen)";
}

export function generateAdPackages(products: Product[], maxProducts: number = 3): AdPackage[] {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://trendware7.store";

  const topProducts = products.slice(0, maxProducts);

  return topProducts.map((product) => {
    const hooks = getHooks(product.categorySlug);
    const productUrl = `${baseUrl}/product/${product.slug}`;

    const creatives: AdCreative[] = [];

    // Generate 2 creatives per product (different angles)
    for (let i = 0; i < Math.min(2, ANGLES.length); i++) {
      const hook = hooks[i % hooks.length];
      const angle = ANGLES[i];

      creatives.push({
        productTitle: product.title,
        productSlug: product.slug,
        productPrice: product.price,
        productImage: product.images[0],
        productUrl,
        platform: i === 0 ? "tiktok" : "meta",
        hook,
        adText: generateAdText(product, hook, angle),
        cta: "Jetzt entdecken",
        targeting: generateTargeting(product),
        angle: angle.name,
      });
    }

    return {
      product: {
        title: product.title,
        slug: product.slug,
        price: product.price,
        image: product.images[0],
        url: productUrl,
        category: product.category,
      },
      creatives,
    };
  });
}

export function renderAdPackagesHtml(packages: AdPackage[]): string {
  if (packages.length === 0) return "";

  const cards = packages
    .map((pkg) => {
      const creativeCards = pkg.creatives
        .map(
          (c) => `
          <div style="background:#faf5ef;border-radius:8px;padding:16px;margin:8px 0">
            <div style="display:flex;gap:4px;margin-bottom:8px">
              <span style="display:inline-block;background:${c.platform === "tiktok" ? "#00f2ea" : "#1877f2"};color:${c.platform === "tiktok" ? "#000" : "#fff"};font-size:11px;font-weight:bold;padding:3px 8px;border-radius:12px">
                ${c.platform === "tiktok" ? "TikTok" : "Meta"}
              </span>
              <span style="display:inline-block;background:#e9ecef;color:#495057;font-size:11px;font-weight:bold;padding:3px 8px;border-radius:12px">
                ${c.angle}
              </span>
            </div>
            <p style="margin:0 0 8px;font-weight:bold;color:#3d3530;font-size:14px">Hook: "${c.hook}"</p>
            <pre style="background:#fff;border:1px solid #e8a87c;border-radius:6px;padding:12px;font-size:13px;white-space:pre-wrap;font-family:Comfortaa,sans-serif;color:#3d3530;margin:0 0 8px">${c.adText}</pre>
            <p style="margin:4px 0;font-size:12px;color:#7a6e66"><strong>CTA:</strong> ${c.cta}</p>
            <p style="margin:4px 0;font-size:12px;color:#7a6e66"><strong>Targeting:</strong> ${c.targeting}</p>
            <p style="margin:4px 0;font-size:12px;color:#7a6e66"><strong>Ziel-URL:</strong> <a href="${c.productUrl}" style="color:#c87f5a">${c.productUrl}</a></p>
            <p style="margin:4px 0;font-size:12px;color:#7a6e66"><strong>Bild:</strong> <a href="${c.productImage}" style="color:#c87f5a">Produktbild öffnen</a></p>
          </div>`
        )
        .join("");

      return `
        <div style="border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin:12px 0">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
            <img src="${pkg.product.image}" alt="${pkg.product.title}" style="width:60px;height:60px;border-radius:8px;object-fit:cover" />
            <div>
              <h3 style="margin:0;color:#3d3530;font-size:16px">${pkg.product.title}</h3>
              <p style="margin:2px 0;color:#7a6e66;font-size:13px">${pkg.product.category} | ${pkg.product.price.toFixed(2)} €</p>
            </div>
          </div>
          ${creativeCards}
        </div>`;
    })
    .join("");

  return `
    <div style="border-top:2px solid #c87f5a;margin-top:32px;padding-top:24px">
      <h2 style="color:#3d3530;margin:0 0 8px;font-family:Comfortaa,sans-serif">Fertige Ad-Creatives</h2>
      <p style="color:#7a6e66;font-size:14px;margin:0 0 16px">
        Kopiere die Texte direkt in TikTok Ads Manager oder Meta Ads Manager.
        Lade das Produktbild als Creative hoch und setze die Ziel-URL ein.
      </p>
      ${cards}
    </div>`;
}
