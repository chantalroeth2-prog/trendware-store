import { readFileSync } from 'fs';

const envContent = readFileSync(new URL('../.env.local', import.meta.url).pathname, 'utf8');
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
}

const PAGE_TOKEN = process.env.META_PAGE_ACCESS_TOKEN;
const IG_ID = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
const PAGE_ID = process.env.META_PAGE_ID;
const BASE = 'https://graph.facebook.com/v25.0';
const IMG_BASE = 'https://trendware.store/ig';

// Posts in reverse order (post 9 first so grid looks right)
const posts = [
  {
    image: 'post-09-cta.png',
    caption: `Bereit für Produkte, die dein Leben einfacher machen?\n\nWir haben für jeden etwas dabei — egal ob du dein Zuhause aufpeppen, produktiver arbeiten oder fitter werden willst.\n\nUnd mit dem Code WILLKOMMEN10 sparst du direkt 10% auf deine erste Bestellung!\n\nJetzt entdecken: Link in Bio\n\n#trendware #jetztentdecken #onlineshop #gadgets #rabatt #neukunden #deutschershop #smarteprodukte #musthave #shopping`,
  },
  {
    image: 'post-08-produkt-highlight.png',
    caption: `PRODUKT DER WOCHE: LED Sternenhimmel-Projektor mit Fernbedienung\n\nVerwandle jedes Zimmer in ein Sternenparadies!\n\n- 16 Farbmodi und Helligkeitsstufen\n- 360 Grad Rotation\n- Timer-Funktion (1-6 Stunden)\n- USB-betrieben mit Fernbedienung\n\nStatt 44,99 EUR nur 31,99 EUR — du sparst 29%!\n\nLink in Bio\n\n#sternenhimmel #ledprojektor #nachtlicht #schlafzimmer #stimmungslicht #homedecor #geschenkidee #trendware #angebot #produktderwoche`,
  },
  {
    image: 'post-07-versand.png',
    caption: `Kostenloser Versand ab 39 EUR — so einfach ist das!\n\nLieferzeit: 5-12 Werktage\nRückgabe: 30 Tage, kostenlos\nZahlung: PayPal, Kreditkarte\n\nJede Bestellung mit Sendungsverfolgung.\n\nFragen? Schreib uns eine DM!\n\n#versand #kostenloserversand #lieferung #paypal #sicherbestellen #trendware #onlineshop`,
  },
  {
    image: 'post-06-zitat.png',
    caption: `"Dein Zuhause verdient Produkte, die genauso besonders sind wie du."\n\nKleine Veränderungen, großer Unterschied. Ein smartes Gadget hier, ein schönes Accessoire da — und der Alltag fühlt sich besser an.\n\nWas ist das eine Produkt, das euren Alltag verbessert hat?\n\n#motivation #zuhause #inspiration #wohlfühlen #gemütlich #homedecor #alltagsheld #trendware`,
  },
  {
    image: 'post-05-kategorien.png',
    caption: `Für jeden Bereich deines Lebens das passende Produkt:\n\nHome & Living — Mach dein Zuhause gemütlicher\nLifestyle — Accessoires die auffallen\nKüche — Smarte Helfer für jeden Tag\nFitness — Dein Homegym-Upgrade\nBüro & Technik — Produktiver arbeiten\nHaustiere — Das Beste für deinen Liebling\n\n30+ Produkte warten auf dich. Welche Kategorie interessiert dich?\n\n#kategorien #homeandliving #lifestyle #küche #fitness #büro #haustiere #gadgets #trendware`,
  },
  {
    image: 'post-04-rabatt.png',
    caption: `10% RABATT auf deine erste Bestellung!\n\nEinfach den Code an der Kasse eingeben:\n\nWILLKOMMEN10\n\nGültig auf das gesamte Sortiment. Kein Mindestbestellwert.\n\nLink in Bio!\n\n#rabatt #gutscheincode #sparen #erstbestellung #willkommensrabatt #10prozent #onlineshopping #trendware`,
  },
  {
    image: 'post-03-bestseller.png',
    caption: `Unsere Top 4 Bestseller!\n\n1. LED Sternenhimmel-Projektor — statt 44,99 nur 31,99 EUR\n2. Bambus Küchen-Organizer — statt 39,99 nur 27,99 EUR\n3. Fitness Widerstandsbänder Set — 24,99 EUR\n4. Magnetische Handyhalterung — statt 29,99 nur 19,99 EUR\n\nWelches würdest du dir holen?\n\nLink in Bio\n\n#bestseller #topprodukte #sparen #angebot #trendware #musthave`,
  },
  {
    image: 'post-02-versprechen.png',
    caption: `Unser Versprechen an dich:\n\nHandverlesen — Jedes Produkt von uns getestet\nSchneller Versand — Kostenlos ab 39 EUR\n30 Tage Rückgaberecht — Kein Risiko\nSupport mit Herz — Immer für dich da\n\nDas meinen wir ernst.\n\n#kundenzufriedenheit #onlineshopping #vertrauen #qualität #sicherbestellen #trendware`,
  },
  {
    image: 'post-01-willkommen.png',
    caption: `Willkommen bei TrendWare!\n\nSmarte Produkte, die deinen Alltag verbessern — ob Zuhause, im Büro oder beim Sport.\n\n- Jedes Produkt handverlesen\n- Faire Preise\n- Kostenloser Versand ab 39 EUR\n\nEntdecke was dir noch fehlt: Link in Bio\n\n#trendware #onlineshop #gadgets #homeandliving #lifestyle #deutschershop #neuentdeckt #smarteprodukte`,
  },
];

async function createAndPublish(imageUrl, caption) {
  // Step 1: Create container
  const createRes = await fetch(`${BASE}/${IG_ID}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_url: imageUrl, caption, access_token: PAGE_TOKEN }),
  });
  const createData = await createRes.json();
  if (createData.error) throw new Error(createData.error.message);
  const containerId = createData.id;

  // Step 2: Wait for processing
  for (let i = 0; i < 15; i++) {
    await new Promise(r => setTimeout(r, 3000));
    const statusRes = await fetch(`${BASE}/${containerId}?fields=status_code&access_token=${PAGE_TOKEN}`);
    const status = await statusRes.json();
    if (status.status_code === 'FINISHED') break;
    if (status.status_code === 'ERROR') throw new Error('Media processing failed');
  }

  // Step 3: Publish
  const pubRes = await fetch(`${BASE}/${IG_ID}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creation_id: containerId, access_token: PAGE_TOKEN }),
  });
  const pubData = await pubRes.json();
  if (pubData.error) throw new Error(pubData.error.message);
  return pubData.id;
}

// Post all 9 images
console.log('Posting 9 images to Instagram @trendware...\n');

for (let i = 0; i < posts.length; i++) {
  const post = posts[i];
  const imageUrl = `${IMG_BASE}/${post.image}`;
  try {
    const postId = await createAndPublish(imageUrl, post.caption);
    console.log(`✓ ${post.image} → Post ID: ${postId}`);
  } catch (err) {
    console.error(`✗ ${post.image} → Fehler: ${err.message}`);
  }
  // Wait 10 seconds between posts to avoid rate limiting
  if (i < posts.length - 1) {
    console.log('  Warte 10s...');
    await new Promise(r => setTimeout(r, 10000));
  }
}

// Update Facebook page info
console.log('\nUpdating Facebook page...');
try {
  const fbRes = await fetch(`${BASE}/${PAGE_ID}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      about: 'Clever einkaufen. Clever leben. Handverlesene Gadgets für Zuhause, Büro, Fitness und mehr.',
      description: 'TrendWare ist dein Online-Shop für smarte Produkte, die deinen Alltag verbessern. Handverlesene Gadgets ab 12,99 EUR mit kostenlosem Versand ab 39 EUR. 30 Tage Rückgaberecht.',
      website: 'https://trendware.store',
      phone: '',
      emails: JSON.stringify(['kontakt.trendware@gmail.com']),
      access_token: PAGE_TOKEN,
    }),
  });
  const fbData = await fbRes.json();
  console.log('Facebook page updated:', fbData);
} catch (err) {
  console.error('Facebook update error:', err.message);
}

// Post welcome message on Facebook page
console.log('\nPosting welcome message on Facebook...');
try {
  const fbPostRes = await fetch(`${BASE}/${PAGE_ID}/feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `Willkommen bei TrendWare!\n\nWir sind dein neuer Online-Shop für smarte Produkte, die deinen Alltag verbessern.\n\nHandverlesene Gadgets für Zuhause, Büro, Fitness & mehr\nFaire Preise ab 12,99 EUR\nKostenloser Versand ab 39 EUR\n30 Tage Rückgaberecht\n\nJetzt entdecken: https://trendware.store\n\nMit dem Code WILLKOMMEN10 sparst du 10% auf deine erste Bestellung!`,
      link: 'https://trendware.store',
      access_token: PAGE_TOKEN,
    }),
  });
  const fbPostData = await fbPostRes.json();
  console.log('Facebook post:', fbPostData);
} catch (err) {
  console.error('Facebook post error:', err.message);
}

console.log('\nDone!');
