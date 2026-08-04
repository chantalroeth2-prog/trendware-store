export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  categorySlug: string;
  images: string[];
  features: string[];
  deliveryDays: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  inStock: boolean;
  stockCount: number;
  soldCount: number;
  cjProductId?: string; // CJ variant ID (vid) – muss pro Produkt manuell gesetzt werden
}

export interface Category {
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export const categories: Category[] = [
  {
    name: "Home & Living",
    slug: "home-living",
    icon: "\u{1F3E0}",
    description: "Deko, Licht & smarte Gadgets für dein Zuhause",
  },
  {
    name: "Haustiere",
    slug: "haustiere",
    icon: "\u{1F43E}",
    description: "Alles für Hund, Katze & Co.",
  },
  {
    name: "Lifestyle & Fitness",
    slug: "lifestyle-fitness",
    icon: "\u{1F4AA}",
    description: "Fit & aktiv im Alltag",
  },
  {
    name: "Büro & Organisation",
    slug: "buero-organisation",
    icon: "\u{1F4CE}",
    description: "Ordnung & Produktivität am Arbeitsplatz",
  },
  {
    name: "Elektronik-Zubehör",
    slug: "elektronik-zubehoer",
    icon: "\u{1F50C}",
    description: "Kabel, Halterungen & nützliches Tech-Zubehör",
  },
];

export const products: Product[] = [
  // ── Home & Living ────────────────────────────────────────
  {
    id: "hl-001",
    slug: "led-nachttischlampe-touch",
    title: "LED Nachttischlampe mit Touch-Dimmer",
    description:
      "Elegante LED-Nachttischlampe mit stufenlosem Touch-Dimmer und warmweißem Licht. Perfekt für gemütliche Abende und als stilvolles Deko-Element in jedem Raum. Der integrierte USB-Anschluss lädt dein Smartphone bequem über Nacht auf. Energieeffizient mit nur 5W Leistungsaufnahme bei hoher Lichtausbeute.",
    shortDescription: "Dimmbare LED-Lampe mit USB-Anschluss und elegantem Design.",
    price: 34.99,
    compareAtPrice: 49.99,
    category: "Home & Living",
    categorySlug: "home-living",
    images: [
      "https://images.unsplash.com/photo-1691493502458-fbe21809a665?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1609906335755-d8ad5e920a23?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1767968105114-ed4ff2c8d629?w=600&h=600&fit=crop",
    ],
    features: [
      "Stufenloser Touch-Dimmer für individuelle Helligkeit",
      "Warmweißes LED-Licht (3000K) – angenehm für die Augen",
      "Integrierter USB-Ladeanschluss",
      "Energieeffizient mit nur 5W Leistung",
      "Schlichtes, modernes Design in Matt-Weiß",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.7,
    reviewCount: 234,
    badge: "Bestseller",
    inStock: true,
    stockCount: 18,
    soldCount: 1247,
    // cjProductId: "TODO", // CJ variant ID für: LED Nachttischlampe
  },
  {
    id: "hl-002",
    slug: "bambus-kuechen-organizer",
    title: "Bambus Küchen-Organizer Set (5-teilig)",
    description:
      "Hochwertiges 5-teiliges Organizer-Set aus nachhaltigem Bambus. Bringt Ordnung in jede Küchenschublade und sieht dabei fantastisch aus. Jedes Teil ist präzise gefertigt und passt in Standard-Schubladen. Leicht zu reinigen und langlebig.",
    shortDescription: "Nachhaltiges 5-teiliges Bambus-Set für Küchenschubladen.",
    price: 29.99,
    compareAtPrice: 39.99,
    category: "Home & Living",
    categorySlug: "home-living",
    images: [
      "https://images.unsplash.com/photo-1761772593493-23a630a333b3?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1764539572367-6095eb4f5c98?w=600&h=600&fit=crop",
    ],
    features: [
      "5 verschiedene Größen für jede Schublade",
      "100% nachhaltiger Bambus",
      "Leicht zu reinigen – einfach abwischen",
      "Passt in Standard-Küchenschubladen",
      "Stapelbar für flexible Anordnung",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.5,
    reviewCount: 187,
    badge: "Neu",
    inStock: true,
    stockCount: 34,
    soldCount: 892,
    // cjProductId: "TODO", // CJ variant ID für: Bambus Küchen-Organizer
  },
  {
    id: "hl-003",
    slug: "makramee-wandbehang-boho",
    title: "Makramee Wandbehang Boho-Style",
    description:
      "Handgefertigter Makramee-Wandbehang im angesagten Boho-Stil. Ein echtes Statement-Piece für dein Wohn- oder Schlafzimmer. Aus hochwertiger Baumwollkordel gefertigt, ca. 80x60cm groß.",
    shortDescription: "Handgefertigter Boho-Wandbehang aus Baumwolle, 80x60cm.",
    price: 24.99,
    compareAtPrice: 34.99,
    category: "Home & Living",
    categorySlug: "home-living",
    images: [
      "https://images.unsplash.com/photo-1632761644913-0da6105863cb?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1634120881706-a763fdfec912?w=600&h=600&fit=crop",
    ],
    features: [
      "Handgefertigt aus 100% Baumwolle",
      "Ca. 80 x 60 cm – perfekte Größe für jede Wand",
      "Inkl. Holzstab zur Aufhängung",
      "Boho / Scandi Design",
      "Jedes Stück ein Unikat",
    ],
    deliveryDays: "5–10 Werktage",
    rating: 4.6,
    reviewCount: 98,
    inStock: true,
    stockCount: 12,
    soldCount: 534,
    // cjProductId: "TODO", // CJ variant ID für: Makramee Wandbehang
  },
  {
    id: "hl-004",
    slug: "aroma-diffuser-holz",
    title: "Aroma Diffuser Holzoptik mit LED",
    description:
      "Ultraschall-Aroma-Diffuser in edler Holzoptik mit 7 LED-Farbmodi. Verteilt ätherische Öle sanft im Raum und sorgt für angenehme Atmosphäre. 300ml Tank für bis zu 10 Stunden Laufzeit. Flüsterleise und mit Auto-Abschaltung.",
    shortDescription: "300ml Ultraschall-Diffuser mit 7 LED-Farben in Holzoptik.",
    price: 27.99,
    compareAtPrice: 37.99,
    category: "Home & Living",
    categorySlug: "home-living",
    images: [
      "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop",
    ],
    features: [
      "300ml Tank – bis zu 10 Stunden Laufzeit",
      "7 LED-Farbmodi für Stimmungslicht",
      "Flüsterleiser Ultraschall-Betrieb",
      "Auto-Abschaltung bei leerem Tank",
      "Edle Holzoptik passend zu jedem Interieur",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.4,
    reviewCount: 156,
    inStock: true,
    stockCount: 22,
    soldCount: 678,
    // cjProductId: "TODO", // CJ variant ID für: Aroma Diffuser
  },
  {
    id: "hl-005",
    slug: "led-sternenhimmel-projektor",
    title: "LED Sternenhimmel-Projektor mit Fernbedienung",
    description:
      "Verwandele dein Schlafzimmer in eine Galaxie! Der Sternenhimmel-Projektor erzeugt atemberaubende Lichteffekte mit einstellbarer Rotation und Farbwechsel. Mit Timer und Fernbedienung – perfekt zum Einschlafen oder als Partylicht.",
    shortDescription: "Galaxie-Projektor mit Rotation, Timer und Fernbedienung.",
    price: 31.99,
    compareAtPrice: 44.99,
    category: "Home & Living",
    categorySlug: "home-living",
    images: [
      "https://images.unsplash.com/photo-1518066000714-58c45f1a2c0a?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=600&h=600&fit=crop",
    ],
    features: [
      "Realistischer Sternenhimmel mit Nebeleffekt",
      "360° Rotation für dynamische Lichtshow",
      "Inkl. Fernbedienung und Timer (1–4 Stunden)",
      "USB-betrieben – auch per Powerbank nutzbar",
      "Perfekt für Schlafzimmer, Kinderzimmer oder Partys",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.6,
    reviewCount: 312,
    badge: "Beliebt",
    inStock: true,
    stockCount: 8,
    soldCount: 1589,
    // cjProductId: "TODO", // CJ variant ID für: LED Sternenhimmel-Projektor
  },
  {
    id: "hl-006",
    slug: "schwimmende-regal-set",
    title: "Schwebendes Wandregal Set (3-teilig)",
    description:
      "Minimalistisches 3-teiliges Wandregal-Set in Schwarz. Unsichtbare Befestigung sorgt für den schwebenden Effekt. Perfekt für Bücher, Deko und Pflanzen. Belastbar bis 5kg pro Regal.",
    shortDescription: "3 minimalistische Wandregale mit unsichtbarer Befestigung.",
    price: 36.99,
    compareAtPrice: 49.99,
    category: "Home & Living",
    categorySlug: "home-living",
    images: [
      "https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600&h=600&fit=crop",
    ],
    features: [
      "3 Regale in verschiedenen Größen (40/50/60cm)",
      "Unsichtbare Befestigung – schwebender Effekt",
      "Bis zu 5kg Belastbarkeit pro Regal",
      "Matt-schwarzes Finish",
      "Inkl. Montagematerial und Anleitung",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.5,
    reviewCount: 89,
    inStock: true,
    stockCount: 26,
    soldCount: 423,
    // cjProductId: "TODO", // CJ variant ID für: Schwebendes Wandregal Set
  },

  // ── Haustiere ────────────────────────────────────────────
  {
    id: "ht-001",
    slug: "interaktives-katzenspielzeug",
    title: "Interaktives Katzenspielzeug mit Feder & LED",
    description:
      "Automatisches Katzenspielzeug mit rotierender Feder und integriertem LED-Licht. Hält deine Katze stundenlang beschäftigt – auch wenn du nicht zuhause bist. 3 Geschwindigkeitsstufen und automatische Abschaltung nach 15 Minuten.",
    shortDescription: "Automatisches Spielzeug mit Feder und LED für Katzen.",
    price: 19.99,
    compareAtPrice: 29.99,
    category: "Haustiere",
    categorySlug: "haustiere",
    images: [
      "https://images.unsplash.com/photo-1676572901324-9cfacb1b8f15?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1568459612283-e5f5e5a13184?w=600&h=600&fit=crop",
    ],
    features: [
      "3 Geschwindigkeitsstufen",
      "Integriertes LED-Licht für extra Spielspaß",
      "Auto-Off nach 15 Minuten (schont den Akku)",
      "USB aufladbar – kein Batteriewechsel nötig",
      "Rutschfeste Unterseite",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.4,
    reviewCount: 312,
    badge: "Beliebt",
    inStock: true,
    stockCount: 41,
    soldCount: 2134,
    // cjProductId: "TODO", // CJ variant ID für: Interaktives Katzenspielzeug
  },
  {
    id: "ht-002",
    slug: "led-hundehalsband",
    title: "LED Hundehalsband – Leuchtend & Wasserdicht",
    description:
      "Leuchtendes LED-Hundehalsband für sichere Spaziergänge bei Dunkelheit. Per USB aufladbar, wasserdicht (IPX6) und in 3 Leuchtmodi einstellbar. In verschiedenen Größen erhältlich.",
    shortDescription: "USB-aufladbares LED-Halsband, wasserdicht, 3 Modi.",
    price: 16.99,
    compareAtPrice: 24.99,
    category: "Haustiere",
    categorySlug: "haustiere",
    images: [
      "https://images.unsplash.com/photo-1632720196624-0ff5630f918b?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1627581480785-eb0b104c10e8?w=600&h=600&fit=crop",
    ],
    features: [
      "3 Leuchtmodi: Dauerlicht, Blinken, Pulsieren",
      "Wasserdicht nach IPX6",
      "USB aufladbar (ca. 2h Ladezeit, 5h Leuchtdauer)",
      "Verstellbar von 35 bis 60 cm",
      "Sichtbar bis zu 500m Entfernung",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.8,
    reviewCount: 456,
    badge: "Bestseller",
    inStock: true,
    stockCount: 7,
    soldCount: 3456,
    // cjProductId: "TODO", // CJ variant ID für: LED Hundehalsband
  },
  {
    id: "ht-003",
    slug: "automatischer-wassernapf",
    title: "Automatischer Wassernapf mit Aktivkohle-Filter",
    description:
      "Automatischer Trinkbrunnen für Hunde und Katzen mit integriertem Aktivkohle-Filter. 2 Liter Fassungsvermögen, ultra-leise Pumpe und abnehmbares Design für einfache Reinigung.",
    shortDescription: "2L Trinkbrunnen mit Filter für Hunde & Katzen.",
    price: 27.99,
    compareAtPrice: 39.99,
    category: "Haustiere",
    categorySlug: "haustiere",
    images: [
      "https://images.unsplash.com/photo-1561078284-4ed6c797c38b?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1591558557730-790829e60e6c?w=600&h=600&fit=crop",
    ],
    features: [
      "2 Liter Fassungsvermögen",
      "Aktivkohle-Filter für sauberes Wasser",
      "Ultra-leise Pumpe (< 30 dB)",
      "Einfach zerlegbar und spülmaschinenfest",
      "Für Katzen und kleine bis mittelgroße Hunde",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.3,
    reviewCount: 178,
    inStock: true,
    stockCount: 29,
    soldCount: 876,
    // cjProductId: "TODO", // CJ variant ID für: Automatischer Wassernapf
  },
  {
    id: "ht-004",
    slug: "haustier-transporttasche",
    title: "Faltbare Haustier-Transporttasche (airline-geeignet)",
    description:
      "Praktische, faltbare Transporttasche für kleine Hunde und Katzen. Airline-geeignet, mit Mesh-Fenstern für Belüftung und gepolstertem Boden für maximalen Komfort. Bis 8kg Tiergewicht.",
    shortDescription: "Faltbare Airline-Transporttasche für Hunde & Katzen bis 8kg.",
    price: 33.99,
    compareAtPrice: 45.99,
    category: "Haustiere",
    categorySlug: "haustiere",
    images: [
      "https://images.unsplash.com/photo-1567612529009-afe25813a308?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1601758124096-1fd661873eab?w=600&h=600&fit=crop",
    ],
    features: [
      "Airline-kompatibel (passt unter den Sitz)",
      "Mesh-Fenster für optimale Belüftung",
      "Herausnehmbarer, waschbarer Polsterboden",
      "Faltbar für platzsparende Aufbewahrung",
      "Für Tiere bis 8kg geeignet",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.5,
    reviewCount: 234,
    badge: "Neu",
    inStock: true,
    stockCount: 15,
    soldCount: 567,
    // cjProductId: "TODO", // CJ variant ID für: Haustier-Transporttasche
  },
  {
    id: "ht-005",
    slug: "selbstreinigendes-katzenklo",
    title: "Selbstreinigende Katzentoilette mit Sieb",
    description:
      "Innovative Katzentoilette mit integriertem Siebeinsatz. Einfach drehen und die Klumpen werden automatisch aufgefangen. Kein Schaufeln mehr nötig! Großer Innenraum für Katzen aller Größen.",
    shortDescription: "Katzentoilette mit Rotations-Siebsystem – nie wieder schaufeln.",
    price: 38.99,
    compareAtPrice: 52.99,
    category: "Haustiere",
    categorySlug: "haustiere",
    images: [
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511044568932-338cba0ad803?w=600&h=600&fit=crop",
    ],
    features: [
      "Patentiertes Rotations-Siebsystem",
      "Kein tägliches Schaufeln mehr nötig",
      "Großer Innenraum für alle Katzengrößen",
      "Geruchsverschluss durch geschlossene Auffangschale",
      "Einfach zu reinigen und hygienisch",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.2,
    reviewCount: 145,
    inStock: true,
    stockCount: 19,
    soldCount: 723,
    // cjProductId: "TODO", // CJ variant ID für: Selbstreinigende Katzentoilette
  },
  {
    id: "ht-006",
    slug: "gps-tracker-haustiere",
    title: "Mini GPS-Tracker für Haustiere",
    description:
      "Kompakter GPS-Tracker für Hunde und Katzen mit Echtzeit-Ortung per App. Wasserdicht (IP67), bis zu 5 Tage Akkulaufzeit und nur 28g leicht. Geofence-Alarm benachrichtigt dich, wenn dein Tier den sicheren Bereich verlässt.",
    shortDescription: "28g leichter GPS-Tracker mit App und Geofence-Alarm.",
    price: 42.99,
    compareAtPrice: 59.99,
    category: "Haustiere",
    categorySlug: "haustiere",
    images: [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=600&fit=crop",
    ],
    features: [
      "Echtzeit-GPS-Ortung per Smartphone-App",
      "Nur 28g – kaum spürbar am Halsband",
      "Wasserdicht nach IP67",
      "Bis zu 5 Tage Akkulaufzeit",
      "Geofence-Alarm bei Verlassen des Bereichs",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.6,
    reviewCount: 389,
    badge: "Bestseller",
    inStock: true,
    stockCount: 5,
    soldCount: 2890,
    // cjProductId: "TODO", // CJ variant ID für: Mini GPS-Tracker
  },

  // ── Lifestyle & Fitness ──────────────────────────────────
  {
    id: "lf-001",
    slug: "resistance-baender-set",
    title: "Resistance Bänder Set (5-teilig, inkl. Tasche)",
    description:
      "Professionelles 5-teiliges Widerstandsbänder-Set mit unterschiedlichen Stärken für jedes Fitnesslevel. Ideal für Home-Workouts, Reha und unterwegs. Inkl. praktischer Transporttasche und Übungsposter.",
    shortDescription: "5 Widerstandsbänder für jedes Level inkl. Tragetasche.",
    price: 22.99,
    compareAtPrice: 34.99,
    category: "Lifestyle & Fitness",
    categorySlug: "lifestyle-fitness",
    images: [
      "https://images.unsplash.com/photo-1584827386916-b5351d3ba34b?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&h=600&fit=crop",
    ],
    features: [
      "5 Stärken: Extra Light bis Extra Heavy",
      "Naturlatex – hautfreundlich und langlebig",
      "Inkl. Transporttasche und Übungsposter",
      "Perfekt für Zuhause, Büro oder unterwegs",
      "Für Anfänger bis Fortgeschrittene",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.6,
    reviewCount: 523,
    badge: "Bestseller",
    inStock: true,
    stockCount: 52,
    soldCount: 4567,
    // cjProductId: "TODO", // CJ variant ID für: Resistance Bänder Set
  },
  {
    id: "lf-002",
    slug: "mini-massagepistole",
    title: "Mini Massagepistole – Kompakt & Kraftvoll",
    description:
      "Kompakte Massagepistole für gezielte Muskelentspannung nach dem Training oder im Büro. 4 Aufsätze, 6 Intensitätsstufen, ultra-leise und mit starkem Akku für bis zu 4 Stunden Laufzeit.",
    shortDescription: "Kompakte Massagepistole mit 4 Aufsätzen und 6 Stufen.",
    price: 44.99,
    compareAtPrice: 59.99,
    category: "Lifestyle & Fitness",
    categorySlug: "lifestyle-fitness",
    images: [
      "https://images.unsplash.com/photo-1611908200005-b898ddde09cf?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1611862529438-48b4bf7c6a76?w=600&h=600&fit=crop",
    ],
    features: [
      "4 austauschbare Massage-Aufsätze",
      "6 Intensitätsstufen (1.200–3.200 U/min)",
      "Ultra-leise (< 45 dB)",
      "Bis zu 4 Stunden Akkulaufzeit",
      "Nur 450g – passt in jede Tasche",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.5,
    reviewCount: 289,
    badge: "Beliebt",
    inStock: true,
    stockCount: 14,
    soldCount: 1876,
    // cjProductId: "TODO", // CJ variant ID für: Mini Massagepistole
  },
  {
    id: "lf-003",
    slug: "trinkflasche-zeitmarkierung",
    title: "Trinkflasche mit Zeitmarkierung (1 Liter)",
    description:
      "Motivierende 1-Liter-Trinkflasche mit Zeitmarkierungen, die dich den ganzen Tag ans Trinken erinnern. BPA-frei, auslaufsicher und spülmaschinenfest. Der integrierte Frucht-Einsatz macht Wasser zum Geschmackserlebnis.",
    shortDescription: "1L Trinkflasche mit Zeitmarkierung und Frucht-Einsatz.",
    price: 18.99,
    compareAtPrice: 27.99,
    category: "Lifestyle & Fitness",
    categorySlug: "lifestyle-fitness",
    images: [
      "https://images.unsplash.com/photo-1616118132534-381148898bb4?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1530891035393-9f321c57acdb?w=600&h=600&fit=crop",
    ],
    features: [
      "Zeitmarkierungen für optimale Trinkerinnerung",
      "BPA-frei und 100% auslaufsicher",
      "Inkl. herausnehmbarem Frucht-Einsatz",
      "Spülmaschinenfest",
      "1.000 ml Fassungsvermögen",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.4,
    reviewCount: 412,
    inStock: true,
    stockCount: 67,
    soldCount: 2345,
    // cjProductId: "TODO", // CJ variant ID für: Trinkflasche mit Zeitmarkierung
  },
  {
    id: "lf-004",
    slug: "yoga-matte-premium",
    title: "Premium Yogamatte rutschfest (6mm, TPE)",
    description:
      "Professionelle Yogamatte aus umweltfreundlichem TPE-Material. Doppelseitige Struktur für optimalen Grip auf beiden Seiten. 183x61cm, 6mm dick für ideale Dämpfung. Leicht, faltbar und inkl. Tragegurt.",
    shortDescription: "Rutschfeste TPE-Yogamatte, 183x61cm, 6mm, inkl. Tragegurt.",
    price: 29.99,
    compareAtPrice: 42.99,
    category: "Lifestyle & Fitness",
    categorySlug: "lifestyle-fitness",
    images: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop",
    ],
    features: [
      "Umweltfreundliches TPE-Material (frei von PVC)",
      "Doppelseitige rutschfeste Struktur",
      "183 x 61 cm, 6mm Dicke für optimale Dämpfung",
      "Leicht (nur 800g) und zusammenrollbar",
      "Inkl. Tragegurt für einfachen Transport",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.7,
    reviewCount: 367,
    badge: "Neu",
    inStock: true,
    stockCount: 33,
    soldCount: 1234,
    // cjProductId: "TODO", // CJ variant ID für: Premium Yogamatte
  },
  {
    id: "lf-005",
    slug: "springseil-digital",
    title: "Digitales Springseil mit Kalorienzähler",
    description:
      "Smartes Springseil mit digitalem LCD-Display, das Sprünge, Kalorien und Trainingszeit zählt. Kugelgelagerte Griffe für flüssige Rotation. Seillänge einstellbar. Auch als seilloses Training (Cordless-Modus) nutzbar.",
    shortDescription: "Smartes Springseil mit LCD-Display und Kalorienzähler.",
    price: 17.99,
    compareAtPrice: 25.99,
    category: "Lifestyle & Fitness",
    categorySlug: "lifestyle-fitness",
    images: [
      "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=600&fit=crop",
    ],
    features: [
      "LCD-Display: Sprünge, Kalorien, Zeit",
      "Kugelgelagerte Griffe für flüssige Rotation",
      "Einstellbare Seillänge (bis 3m)",
      "Cordless-Modus für Indoor-Training",
      "Ergonomische, rutschfeste Griffe",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.3,
    reviewCount: 198,
    inStock: true,
    stockCount: 48,
    soldCount: 956,
    // cjProductId: "TODO", // CJ variant ID für: Digitales Springseil
  },
  {
    id: "lf-006",
    slug: "akupressur-set",
    title: "Akupressurmatte & Kissen Set",
    description:
      "Wohltuendes Akupressur-Set mit Matte und Kissen. Tausende präzise Druckpunkte stimulieren die Durchblutung und lösen Verspannungen. Ideal nach einem langen Arbeitstag oder intensivem Training. Inkl. Tragetasche.",
    shortDescription: "Akupressurmatte mit Kissen für Entspannung und Durchblutung.",
    price: 26.99,
    compareAtPrice: 36.99,
    category: "Lifestyle & Fitness",
    categorySlug: "lifestyle-fitness",
    images: [
      "https://images.unsplash.com/photo-1552693673-1bf958298935?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=600&fit=crop",
    ],
    features: [
      "Über 6.000 Akupressurpunkte auf der Matte",
      "Inkl. passendes Nackenkissen",
      "Fördert Durchblutung und Entspannung",
      "Hochwertige Baumwoll-Leinen-Hülle",
      "Inkl. Tragetasche für unterwegs",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.5,
    reviewCount: 278,
    badge: "Beliebt",
    inStock: true,
    stockCount: 21,
    soldCount: 1567,
    // cjProductId: "TODO", // CJ variant ID für: Akupressurmatte & Kissen Set
  },

  // ── Büro & Organisation ─────────────────────────────────
  {
    id: "bo-001",
    slug: "kabelmanagement-clips",
    title: "Kabelmanagement Clips Set (20 Stück)",
    description:
      "Schluss mit Kabelsalat! 20 selbstklebende Kabelclips in 3 Größen bringen Ordnung auf deinen Schreibtisch. Starker 3M-Kleber hält auf jeder glatten Oberfläche und lässt sich rückstandsfrei entfernen.",
    shortDescription: "20 selbstklebende Kabelclips in 3 Größen.",
    price: 12.99,
    compareAtPrice: 19.99,
    category: "Büro & Organisation",
    categorySlug: "buero-organisation",
    images: [
      "https://images.unsplash.com/photo-1723214263202-3f3766d919eb?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1679496124837-0d1973713b62?w=600&h=600&fit=crop",
    ],
    features: [
      "20 Clips in 3 Größen (S, M, L)",
      "Starker 3M-Kleber – hält auf jeder Oberfläche",
      "Rückstandsfrei entfernbar",
      "Für Kabel von 3mm bis 12mm Durchmesser",
      "Transparent und unauffällig",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.3,
    reviewCount: 167,
    inStock: true,
    stockCount: 89,
    soldCount: 1234,
    // cjProductId: "TODO", // CJ variant ID für: Kabelmanagement Clips
  },
  {
    id: "bo-002",
    slug: "ergonomischer-laptop-staender",
    title: "Ergonomischer Laptop-Ständer (Aluminium)",
    description:
      "Höhenverstellbarer Laptop-Ständer aus hochwertigem Aluminium für ergonomisches Arbeiten. Kompatibel mit allen Laptops von 10 bis 17 Zoll. Verbessert die Kühlung und bringt den Bildschirm auf Augenhöhe.",
    shortDescription: "Höhenverstellbarer Alu-Ständer für 10–17 Zoll Laptops.",
    price: 32.99,
    compareAtPrice: 44.99,
    category: "Büro & Organisation",
    categorySlug: "buero-organisation",
    images: [
      "https://images.unsplash.com/photo-1667430806405-70ef5bc4970f?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1632832319655-57ccf441a6b4?w=600&h=600&fit=crop",
    ],
    features: [
      "6-stufig höhenverstellbar",
      "Hochwertiges Aluminium – stabil und leicht",
      "Kompatibel mit 10–17 Zoll Laptops",
      "Verbesserte Luftzirkulation / Kühlung",
      "Zusammenklappbar für Transport",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.7,
    reviewCount: 342,
    badge: "Beliebt",
    inStock: true,
    stockCount: 11,
    soldCount: 2345,
    // cjProductId: "TODO", // CJ variant ID für: Ergonomischer Laptop-Ständer
  },
  {
    id: "bo-003",
    slug: "schreibtisch-organizer-holz",
    title: "Schreibtisch-Organizer aus Walnuss-Holz",
    description:
      "Stilvoller Schreibtisch-Organizer aus echtem Walnuss-Holz mit Fächern für Stifte, Handy, Visitenkarten und Kleinkram. Macht jeden Arbeitsplatz aufgeräumter und schöner.",
    shortDescription: "Edler Holz-Organizer mit mehreren Fächern für den Schreibtisch.",
    price: 26.99,
    compareAtPrice: 34.99,
    category: "Büro & Organisation",
    categorySlug: "buero-organisation",
    images: [
      "https://images.unsplash.com/photo-1751107756600-fb136501dec7?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1614623171216-7755e8650e8e?w=600&h=600&fit=crop",
    ],
    features: [
      "Echtes Walnuss-Holz – jedes Stück einzigartig",
      "Fächer für Stifte, Handy, Karten und mehr",
      "Kompaktes Maß: 22 x 14 x 10 cm",
      "Filz-Unterseite schützt den Schreibtisch",
      "Auch als Geschenk ideal",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.8,
    reviewCount: 203,
    badge: "Neu",
    inStock: true,
    stockCount: 16,
    soldCount: 987,
    // cjProductId: "TODO", // CJ variant ID für: Schreibtisch-Organizer Walnuss
  },
  {
    id: "bo-004",
    slug: "whiteboard-folie-selbstklebend",
    title: "Selbstklebende Whiteboard-Folie (200x45cm)",
    description:
      "Verwandle jede glatte Oberfläche in ein Whiteboard! Selbstklebende Folie, beschreibbar mit allen gängigen Whiteboard-Markern und trocken abwischbar. Perfekt für Büro, Homeoffice oder Kinderzimmer.",
    shortDescription: "200x45cm selbstklebende Whiteboard-Folie, trocken abwischbar.",
    price: 14.99,
    compareAtPrice: 22.99,
    category: "Büro & Organisation",
    categorySlug: "buero-organisation",
    images: [
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=600&fit=crop",
    ],
    features: [
      "200 x 45 cm – zuschneidbar auf jede Größe",
      "Selbstklebend – haftet auf glatten Oberflächen",
      "Beschreibbar mit allen Whiteboard-Markern",
      "Trocken abwischbar ohne Rückstände",
      "Inkl. 1 Whiteboard-Marker",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.2,
    reviewCount: 134,
    inStock: true,
    stockCount: 56,
    soldCount: 678,
    // cjProductId: "TODO", // CJ variant ID für: Whiteboard-Folie
  },
  {
    id: "bo-005",
    slug: "ergonomische-handgelenkauflage",
    title: "Ergonomische Handgelenkauflage (Memory Foam)",
    description:
      "Memory-Foam-Handgelenkauflage für Maus und Tastatur. Entlastet Handgelenke und beugt RSI vor. Rutschfeste Unterseite, samtweiche Oberfläche und in elegantem Schwarz.",
    shortDescription: "Memory-Foam-Handgelenkstütze für ergonomisches Arbeiten.",
    price: 15.99,
    compareAtPrice: 22.99,
    category: "Büro & Organisation",
    categorySlug: "buero-organisation",
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop",
    ],
    features: [
      "Premium Memory Foam passt sich perfekt an",
      "Beugt RSI und Karpaltunnel-Syndrom vor",
      "Rutschfeste Gummi-Unterseite",
      "Samtweiche, abwaschbare Oberfläche",
      "Universalgröße für jede Tastatur",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.6,
    reviewCount: 256,
    badge: "Beliebt",
    inStock: true,
    stockCount: 38,
    soldCount: 1890,
    // cjProductId: "TODO", // CJ variant ID für: Ergonomische Handgelenkauflage
  },
  {
    id: "bo-006",
    slug: "monitor-lichtleiste",
    title: "Monitor-Lichtleiste mit Dimmer (USB)",
    description:
      "Elegante LED-Lichtleiste für den Monitor mit stufenlosem Dimmer und Farbtemperaturregelung. Beleuchtet den Schreibtisch blendfrei und schont die Augen. Einfache Klemmontage, USB-betrieben.",
    shortDescription: "USB-LED-Monitorlampe mit Dimmer und Farbtemperaturregelung.",
    price: 24.99,
    compareAtPrice: 34.99,
    category: "Büro & Organisation",
    categorySlug: "buero-organisation",
    images: [
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1616400619175-5beda3a17896?w=600&h=600&fit=crop",
    ],
    features: [
      "Stufenloser Dimmer und Farbtemperatur (3000–6500K)",
      "Blendfreie, asymmetrische Beleuchtung",
      "Einfache Klemmontage – kein Bohren",
      "USB-betrieben (5V) – passt an jeden PC",
      "Platzsparend und elegant in Schwarz",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.7,
    reviewCount: 312,
    badge: "Bestseller",
    inStock: true,
    stockCount: 9,
    soldCount: 2678,
    // cjProductId: "TODO", // CJ variant ID für: Monitor-Lichtleiste
  },

  // ── Elektronik-Zubehör ──────────────────────────────────
  {
    id: "ez-001",
    slug: "wireless-charging-pad",
    title: "Wireless Charging Pad 15W (Qi-zertifiziert)",
    description:
      "Schnelles kabelloses Laden mit bis zu 15W für alle Qi-fähigen Geräte. Ultra-flaches Design (nur 7mm), rutschfeste Oberfläche und intelligenter Schutz vor Überladung. Kompatibel mit iPhone, Samsung, Google Pixel und mehr.",
    shortDescription: "15W Qi-Ladepad, ultra-flach, für alle Smartphones.",
    price: 19.99,
    compareAtPrice: 29.99,
    category: "Elektronik-Zubehör",
    categorySlug: "elektronik-zubehoer",
    images: [
      "https://images.unsplash.com/photo-1633381638729-27f730955c23?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1588438761428-9451c893df20?w=600&h=600&fit=crop",
    ],
    features: [
      "Bis zu 15W schnelles kabelloses Laden",
      "Qi-zertifiziert – kompatibel mit allen Qi-Geräten",
      "Ultra-flach: nur 7mm Höhe",
      "LED-Statusanzeige (dezent, nicht störend nachts)",
      "Schutz vor Überladung, Überhitzung & Kurzschluss",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.5,
    reviewCount: 567,
    badge: "Bestseller",
    inStock: true,
    stockCount: 31,
    soldCount: 4321,
    // cjProductId: "TODO", // CJ variant ID für: Wireless Charging Pad
  },
  {
    id: "ez-002",
    slug: "usb-c-hub-7in1",
    title: "USB-C Hub 7-in-1 (HDMI, USB 3.0, SD, PD)",
    description:
      "Kompakter USB-C Hub mit 7 Anschlüssen: HDMI 4K, 2x USB 3.0, SD/microSD-Kartenleser, USB-C Power Delivery (100W Pass-Through). Aus gebürstetem Aluminium, plug & play ohne Treiber.",
    shortDescription: "7-in-1 USB-C Hub mit HDMI 4K, USB 3.0, SD und PD.",
    price: 28.99,
    compareAtPrice: 39.99,
    category: "Elektronik-Zubehör",
    categorySlug: "elektronik-zubehoer",
    images: [
      "https://images.unsplash.com/photo-1616578781650-cd818fa41e57?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1625465403911-d12ba887d258?w=600&h=600&fit=crop",
    ],
    features: [
      "HDMI-Ausgang bis 4K@30Hz",
      "2x USB 3.0 (bis 5 Gbps)",
      "SD & microSD Kartenleser",
      "USB-C PD Pass-Through (bis 100W)",
      "Plug & Play – keine Treiber nötig",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.6,
    reviewCount: 389,
    inStock: true,
    stockCount: 24,
    soldCount: 1567,
    // cjProductId: "TODO", // CJ variant ID für: USB-C Hub 7-in-1
  },
  {
    id: "ez-003",
    slug: "magnetische-smartphone-halterung",
    title: "Magnetische Smartphone-Halterung fürs Auto",
    description:
      "Starke magnetische Handyhalterung für die Autoentlüftung. Hält jedes Smartphone sicher – auch auf holprigen Straßen. 360-Grad drehbar, Einhand-Bedienung und universell kompatibel. Inkl. 2 Metallplättchen.",
    shortDescription: "360-Grad Magnet-Handyhalterung für die Autoentlüftung.",
    price: 14.99,
    compareAtPrice: 21.99,
    category: "Elektronik-Zubehör",
    categorySlug: "elektronik-zubehoer",
    images: [
      "https://images.unsplash.com/photo-1720070226469-fa9cb4f29b00?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1602518219078-365906ef621c?w=600&h=600&fit=crop",
    ],
    features: [
      "6 starke N52-Magnete – hält bombenfest",
      "360-Grad drehbar und schwenkbar",
      "Einhand-Bedienung",
      "Universell kompatibel (inkl. 2 Metallplättchen)",
      "Einfache Clip-Montage an der Lüftung",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.4,
    reviewCount: 278,
    inStock: true,
    stockCount: 73,
    soldCount: 1890,
    // cjProductId: "TODO", // CJ variant ID für: Magnetische Smartphone-Halterung
  },
  {
    id: "ez-004",
    slug: "bluetooth-kopfhoerer-sport",
    title: "Bluetooth Sport-Kopfhörer (IPX7, 48h Akku)",
    description:
      "Kabellose Sport-Kopfhörer mit sicherem Ohrbügel-Design. IPX7 wasserdicht – perfekt für Regen und intensives Training. 48 Stunden Gesamtspielzeit mit Ladecase. Kraftvoller Bass und kristallklare Höhen.",
    shortDescription: "IPX7 Sport-Kopfhörer mit 48h Akku und sicherem Sitz.",
    price: 34.99,
    compareAtPrice: 49.99,
    category: "Elektronik-Zubehör",
    categorySlug: "elektronik-zubehoer",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&h=600&fit=crop",
    ],
    features: [
      "IPX7 wasserdicht – für Sport und Regen",
      "48h Gesamtspielzeit mit Ladecase",
      "Sicherer Sitz durch ergonomische Ohrbügel",
      "Bluetooth 5.3 mit stabiler Verbindung",
      "Kraftvoller Bass und klare Höhen",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.5,
    reviewCount: 423,
    badge: "Neu",
    inStock: true,
    stockCount: 17,
    soldCount: 1234,
    // cjProductId: "TODO", // CJ variant ID für: Bluetooth Sport-Kopfhörer
  },
  {
    id: "ez-005",
    slug: "mini-powerbank-5000",
    title: "Mini Powerbank 5000mAh (nur 100g)",
    description:
      "Ultra-kompakte Powerbank, die in jede Hosentasche passt. 5000mAh reichen für eine volle Smartphone-Ladung. Mit integriertem Kabel (USB-C & Lightning) – kein extra Kabel nötig. Nur 100g leicht.",
    shortDescription: "100g leichte Mini-Powerbank mit integriertem Kabel.",
    price: 21.99,
    compareAtPrice: 29.99,
    category: "Elektronik-Zubehör",
    categorySlug: "elektronik-zubehoer",
    images: [
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&h=600&fit=crop",
    ],
    features: [
      "5000mAh – eine volle Smartphone-Ladung",
      "Nur 100g und kreditkartengroß",
      "Integriertes USB-C und Lightning Kabel",
      "LED-Ladeanzeige",
      "Flugzeug-zugelassen (unter 100Wh)",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.4,
    reviewCount: 345,
    badge: "Beliebt",
    inStock: true,
    stockCount: 42,
    soldCount: 2567,
    // cjProductId: "TODO", // CJ variant ID für: Mini Powerbank
  },
  {
    id: "ez-006",
    slug: "webcam-2k-autofokus",
    title: "2K Webcam mit Autofokus & Ringlicht",
    description:
      "Professionelle 2K-Webcam mit integriertem 3-stufigem Ringlicht. Autofokus sorgt immer für ein scharfes Bild. Dual-Mikrofone mit Rauschunterdrückung. Plug & Play über USB – kompatibel mit Zoom, Teams, Skype & Co.",
    shortDescription: "2K Webcam mit Ringlicht, Autofokus und Dual-Mikrofon.",
    price: 39.99,
    compareAtPrice: 54.99,
    category: "Elektronik-Zubehör",
    categorySlug: "elektronik-zubehoer",
    images: [
      "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1596566777540-ba09e1146ab0?w=600&h=600&fit=crop",
    ],
    features: [
      "2K QHD Auflösung (2560x1440p)",
      "Integriertes 3-stufiges Ringlicht",
      "Autofokus für immer scharfes Bild",
      "Dual-Mikrofone mit Rauschunterdrückung",
      "Plug & Play USB – kompatibel mit allen Plattformen",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.6,
    reviewCount: 267,
    inStock: true,
    stockCount: 13,
    soldCount: 1456,
    // cjProductId: "TODO", // CJ variant ID für: 2K Webcam
  },
];

// Hilfsfunktionen
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getTrendProducts(): Product[] {
  return products.filter((p) => p.badge).slice(0, 8);
}

export function getBestsellers(): Product[] {
  return [...products].sort((a, b) => b.soldCount - a.soldCount).slice(0, 8);
}

export function getNewArrivals(): Product[] {
  return products.filter((p) => p.badge === "Neu");
}

export function searchProducts(query: string): Product[] {
  const lower = query.toLowerCase();
  return products.filter(
    (p) =>
      p.title.toLowerCase().includes(lower) ||
      p.shortDescription.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower)
  );
}

export function getCategoryWithCount(): (Category & { productCount: number })[] {
  return categories.map((cat) => ({
    ...cat,
    productCount: products.filter((p) => p.categorySlug === cat.slug).length,
  }));
}
