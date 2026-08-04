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
  cjProductId?: string;
}

export interface Category {
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export const categories: Category[] = [
  {
    name: "Stimmungslicht & Ambiente",
    slug: "stimmungslicht-ambiente",
    icon: "✨",
    description: "Smarte Projektoren, Kristallleuchten & atmosphärisches Raumlicht",
  },
  {
    name: "Aroma & Raumklima",
    slug: "aroma-raumklima",
    icon: "🕯️",
    description: "Anti-Schwerkraft Befeuchter, Regentropfen-Diffuser & Wohlfühldüfte",
  },
  {
    name: "Ästhetische Ordnung & Gadgets",
    slug: "aesthetische-ordnung",
    icon: "🌿",
    description: "Minimalistische Organizer, MagSafe Stationen & stilvolle Alltagshelfer",
  },
];

export const products: Product[] = [
  // ── Stimmungslicht & Ambiente ─────────────────────────────
  {
    id: "tw-001",
    slug: "ambient-sunset-projektor-lampe",
    title: "Ambient Sunset Projektor-Lampe mit App-Steuerung",
    description:
      "Tauche dein Zimmer in das beruhigende Gold eines ewigen Sonnenuntergangs. Die Ambient Sunset Lampe erzeugt sanfte, warme Lichtauren und lässt sich per App in 16 Millionen Farben und Helligkeitsstufen anpassen. Der 360° schwenkbare Kristallkopf projiziert wunderschöne Farbverläufe an Wand und Decke – perfekt für Entspannung, Meditation und verträumte Abendstunden.",
    shortDescription: "Magisches Sonnenuntergangslicht mit 16 Mio. Farben & App-Steuerung.",
    price: 29.99,
    compareAtPrice: 44.99,
    category: "Stimmungslicht & Ambiente",
    categorySlug: "stimmungslicht-ambiente",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=800&fit=crop&q=80",
    ],
    features: [
      "16 Millionen Lichtfarben per Smartphone-App steuerbar",
      "360° drehbarer Kristallglas-Kopf für individuelle Projektionen",
      "Sanfter Sonnenuntergangs-Effekt für maximale Gemütlichkeit",
      "Musik-Synchronisationsmodus – Licht tanzt zur Musik",
      "Hochwertiges Aluminiumgehäuse mit USB-Anschluss",
    ],
    deliveryDays: "3–5 Werktage",
    rating: 4.9,
    reviewCount: 412,
    badge: "Bestseller",
    inStock: true,
    stockCount: 14,
    soldCount: 1890,
  },
  {
    id: "tw-002",
    slug: "3d-kristall-touch-tischleuchte-rose",
    title: "3D Kristall-Touch Tischleuchte mit Rose-Effekt",
    description:
      "Ein funkelndes Highlight für jeden Tisch. Durch den präzisen Diamantschliff projiziert diese kabellose Touch-Leuchte ein wunderschönes rosenförmiges Lichtmuster auf die Oberfläche. Mit einem Sanften Tippen auf die Oberseite wechselst du zwischen 16 Lichtfarben und 3 Helligkeitsstufen. Der integrierte Akku sorgt für bis zu 12 Stunden stimmungsvolles Licht ohne lästige Kabel.",
    shortDescription: "Kabellose Kristalllampe projiziert zauberhaftes Lichtmuster.",
    price: 27.99,
    compareAtPrice: 39.99,
    category: "Stimmungslicht & Ambiente",
    categorySlug: "stimmungslicht-ambiente",
    images: [
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop&q=80",
    ],
    features: [
      "Sensitiv-Touch-Steuerung & Fernbedienung inklusive",
      "16 brillante Farben & 3 Dimmstufen",
      "Bis zu 12 Stunden Akkulaufzeit (USB-C wiederaufladbar)",
      "Hochwertiges Acrylglas mit Diamant-Facettenschliff",
      "Perfekt für Nachttisch, Esstisch & Balkon",
    ],
    deliveryDays: "3–5 Werktage",
    rating: 4.8,
    reviewCount: 298,
    badge: "Neu",
    inStock: true,
    stockCount: 19,
    soldCount: 940,
  },
  {
    id: "tw-003",
    slug: "3d-bewegliches-sandkunst-licht",
    title: "Bewegliches 3D Sandkunst-Licht (Sanduhr-Design)",
    description:
      "Entspannung in ihrer schönsten Form. Jede Drehung des gläsernen Sandbildes erschafft ein völlig neues, einzigartiges Landschaftsbild aus feinem Sand und glitzernden Partikeln. Der umrahmende LED-Ring hüllt das sanft fallende Sandspiel in warmes, dimmbares Licht. Ein faszinierendes Kunstwerk, das den Geist beruhigt und den Stress des Tages vergessen lässt.",
    shortDescription: "Beruhigendes drehbares Sandbild im beleuchteten LED-Glaskreis.",
    price: 34.99,
    compareAtPrice: 49.99,
    category: "Stimmungslicht & Ambiente",
    categorySlug: "stimmungslicht-ambiente",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=800&fit=crop&q=80",
    ],
    features: [
      "Unendliche Sandlandschaften – jede Drehung kreiert ein Unikat",
      "Dimmbare LED-Warmbeleuchtung in 3 Stufen",
      "Hochtransparentes Glas für gestochen scharfe Sandmuster",
      "Wirkt nachweislich beruhigend & fördert die Konzentration",
      "Ideal als Blickfang auf Schreibtisch, Kommode & Regal",
    ],
    deliveryDays: "3–5 Werktage",
    rating: 4.9,
    reviewCount: 350,
    badge: "Tipp",
    inStock: true,
    stockCount: 11,
    soldCount: 1210,
  },
  {
    id: "tw-004",
    slug: "echtholz-led-nachttischlampe-wireless-charger",
    title: "Echtholz LED Nachttischlampe mit 15W Qi-Wireless Charger",
    description:
      "Skandinavische Eleganz für deinen Schlafraum. Diese Leuchte vereint warmes, augenschonendes LED-Licht mit einer leistungsstarken 15W Induktionsladefläche im Holzsockel. Der flexible Bogen lässt sich stufenlos dimmen und dient tagsüber als elegante Halterung für dein Smartphone.",
    shortDescription: "Dimmbare Designer-Holzlampe mit integrierter Qi-Schnellladefläche.",
    price: 44.99,
    compareAtPrice: 64.99,
    category: "Stimmungslicht & Ambiente",
    categorySlug: "stimmungslicht-ambiente",
    images: [
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop&q=80",
    ],
    features: [
      "15W Qi-Schnellladen – lädt dein Handy bequem über Nacht",
      "Touch-Dimmung mit 3 Farbtemperaturen (Warm bis Kaltweiß)",
      "Bogen als praktischer Smartphone-Aufsteller nutzbar",
      "Gefertigt aus nachhaltigem Echtholz & mattem Aluminium",
      "Augenschonendes, flackerfreies Licht zum Lesen",
    ],
    deliveryDays: "3–5 Werktage",
    rating: 4.9,
    reviewCount: 620,
    badge: "Beliebt",
    inStock: true,
    stockCount: 8,
    soldCount: 2150,
  },

  // ── Aroma & Raumklima ─────────────────────────────────────
  {
    id: "tw-005",
    slug: "anti-schwerkraft-aroma-diffuser-flammen-effekt",
    title: "Anti-Schwerkraft Aroma Diffuser mit Flammen-Effekt",
    description:
      "Die schwebende Magie für dein Raumklima. Durch eine optische Täuschung scheinen die Wassertropfen schwerelos nach oben zu steigen, während feiner Ultraschallnebel mit sanftem LED-Licht einen realistischen Flammeneffekt erzeugt. Befeuchtet die Luft spürbar und verteilt deine liebsten ätherischen Öle leise im Raum.",
    shortDescription: "Optischer Schwebe-Effekt mit fotorealistischem LED-Flammennebel.",
    price: 39.99,
    compareAtPrice: 59.99,
    category: "Aroma & Raumklima",
    categorySlug: "aroma-raumklima",
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=800&fit=crop&q=80",
    ],
    features: [
      "Spektakulärer Anti-Gravity Wassertropfen-Effekt",
      "Warmes LED-Kaminfeuer-Licht für gemütliche Stimmung",
      "Befeuchtet trockene Raumluft & verteilt Aroma-Öle",
      "Flüsterleiser Betrieb (<25 dB) – perfekt zum Schlafen",
      "Automatische Sicherheitsabschaltung bei leerem Tank",
    ],
    deliveryDays: "3–5 Werktage",
    rating: 4.9,
    reviewCount: 540,
    badge: "Bestseller",
    inStock: true,
    stockCount: 12,
    soldCount: 2310,
  },
  {
    id: "tw-006",
    slug: "wolken-regentropfen-aroma-diffuser",
    title: "Wolken-Regentropfen Aroma Diffuser mit Wassergeräusch",
    description:
      "Höre dem beruhigenden Plätschern echter Regentropfen zu. Dieser ästhetische Wolken-Diffuser gibt sanften Ultraschallnebel ab und lässt kleine Wassertropfen hörbar aus der Wolke perlen. Das sanfte Regengeräusch wirkt erwiesenermaßen entspannend, fördert tiefen Schlaf und schafft eine unnachahmliche Wohlfühlatmosphäre.",
    shortDescription: "Beruhigendes Regentropfen-Plätschern mit stimmungsvollem Wolkennebel.",
    price: 42.99,
    compareAtPrice: 59.99,
    category: "Aroma & Raumklima",
    categorySlug: "aroma-raumklima",
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&h=800&fit=crop&q=80",
    ],
    features: [
      "Echtes, beruhigendes Regentropfen-Plätschern zum Einschlafen",
      "7 wählbare Sanftlicht-Farben für das Wolkendach",
      "Ultraschall-Nebelfunktion für ätherische Duftöle",
      "Inklusive Fernbedienung & Timer-Funktion",
      "Sicherer 450ml Wassertank mit Auto-Off",
    ],
    deliveryDays: "3–5 Werktage",
    rating: 4.8,
    reviewCount: 380,
    badge: "Empfehlung",
    inStock: true,
    stockCount: 15,
    soldCount: 1420,
  },

  // ── Ästhetische Ordnung & Gadgets ─────────────────────────
  {
    id: "tw-007",
    slug: "bambus-kuechen-kosmetik-organizer",
    title: "Minimalistischer Bambus Organizer mit Stufen-Design",
    description:
      "Schaffe Ordnung mit natürlicher Eleganz. Dieser vielseitige Organizer aus 100% nachhaltigem Bambus bringt stilvolle Struktur auf deinen Schminktisch, die Küchenzeile oder den Schreibtisch. Die abgestuften Fächer halten Parfüm, Hautpflege, Stifte oder Gewürze immer übersichtlich griffbereit.",
    shortDescription: "Nachhaltiges 100% Bambus-Regal für Kosmetik, Deko & Schreibtisch.",
    price: 26.99,
    compareAtPrice: 34.99,
    category: "Ästhetische Ordnung & Gadgets",
    categorySlug: "aesthetische-ordnung",
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=800&fit=crop&q=80",
    ],
    features: [
      "100% nachhaltiges, fein geschliffenes Bambusholz",
      "Ergonomisches Stufen-Design für perfekten Überblick",
      "Wasserabweisend versiegelt – ideal auch fürs Badezimmer",
      "Vielseitig nutzbar für Kosmetik, Gewürze oder Büro",
      "Zeitloses skandinavisches Design",
    ],
    deliveryDays: "3–5 Werktage",
    rating: 4.8,
    reviewCount: 210,
    badge: "Neu",
    inStock: true,
    stockCount: 22,
    soldCount: 890,
  },
  {
    id: "tw-008",
    slug: "3in1-magsafe-ladestation-faltbar",
    title: "3-in-1 MagSafe Faltbare Ladestation aus Aluminium",
    description:
      "Kein Kabelwirrwarr mehr auf dem Nachttisch. Diese faltbare Premium-Ladestation lädt dein iPhone, deine Apple Watch und AirPods gleichzeitig kabellos an nur einem Kabel. Das elegante Aluminium-Chassis klappt flach zusammen – ideal für Reisen und einen aufgeräumten Nachttisch.",
    shortDescription: "Elegante 3-in-1 Induktions-Ladestation für Smartphone, Watch & Buds.",
    price: 39.99,
    compareAtPrice: 59.99,
    category: "Ästhetische Ordnung & Gadgets",
    categorySlug: "aesthetische-ordnung",
    images: [
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&h=800&fit=crop&q=80",
    ],
    features: [
      "Lädt 3 Geräte gleichzeitig (Smartphone, Watch, Kopfhörer)",
      "Starker MagSafe Magnet hält das Handy sicher aufrecht",
      "Flach zusammenklappbar fürs Reisegepäck",
      "Mattes Premium-Aluminiumgehäuse",
      "Inklusive Schnellladekabel & Adapter",
    ],
    deliveryDays: "3–5 Werktage",
    rating: 4.9,
    reviewCount: 780,
    badge: "Bestseller",
    inStock: true,
    stockCount: 10,
    soldCount: 3120,
  },
];

export function getBestsellers(): Product[] {
  return products.filter((p) => p.badge === "Bestseller" || p.soldCount > 2000);
}
