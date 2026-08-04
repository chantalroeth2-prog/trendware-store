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
    name: "Home & Living",
    slug: "home-living",
    icon: "🏠",
    description: "Smarte Gadgets, Stimmungslicht & Wohlfühl-Klima",
  },
  {
    name: "Haustiere",
    slug: "haustiere",
    icon: "🐾",
    description: "Premium-Komfort & Pflege für Hund und Katze",
  },
  {
    name: "Lifestyle & Fitness",
    slug: "lifestyle-fitness",
    icon: "💪",
    description: "Gesundheit, Regeneration & Wohlbefinden",
  },
  {
    name: "Büro & Organisation",
    slug: "buero-organisation",
    icon: "📎",
    description: "Ergonomie, Ordnung & Fokus am Arbeitsplatz",
  },
  {
    name: "Elektronik-Zubehör",
    slug: "elektronik-zubehoer",
    icon: "🔌",
    description: "MagSafe, Schnellladen & clevere Tech-Tools",
  },
];

export const products: Product[] = [
  // ── Home & Living ────────────────────────────────────────
  {
    id: "hl-001",
    slug: "anti-schwerkraft-aroma-diffuser-flammen-effekt",
    title: "Anti-Schwerkraft Aroma Diffuser mit Flammen-Effekt",
    description:
      "Verwandle dein Zuhause in eine Oase der Ruhe. Der Anti-Schwerkraft Aroma Diffuser lässt Wassertropfen optisch nach oben schweben und kombiniert dies mit einem faszinierenden LED-Flammeneffekt. Durch ultraschallfeinen Nebel wird deine Raumluft optimal befeuchtet und mit deinen Lieblings-Ätherischen-Ölen angereichert. Extrem leiser Betrieb (<25dB) und automatischer Schutzabschaltung bei leerem Wassertank.",
    shortDescription: "Schwebe-Effekt Wassertropfen mit fotorealistischem LED-Flammennebel.",
    price: 39.99,
    compareAtPrice: 59.99,
    category: "Home & Living",
    categorySlug: "home-living",
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=800&fit=crop&q=80",
    ],
    features: [
      "Faszinierendes Anti-Gravity Wassertropfen-Design",
      "Kombinierter LED-Flammeneffekt für gemütliche Stimmung",
      "Ultraschall-Luftbefeuchtung für gesunde Atemwege",
      "Flüsterleise (<25 dB) – ideal fürs Schlafzimmer",
      "Auto-Stop Funktion bei niedrigem Wasserstand",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.9,
    reviewCount: 482,
    badge: "Bestseller",
    inStock: true,
    stockCount: 14,
    soldCount: 1890,
  },
  {
    id: "hl-002",
    slug: "ambient-sunset-projektor-lampe-app",
    title: "Ambient Sunset Projektor-Lampe mit App-Steuerung",
    description:
      "Hole dir den perfekten Sonnenuntergang direkt in dein Zimmer. Die Ambient Sunset Lampe erzeugt atemberaubendes Stimmungslicht und projiziert warme Sonnenuntergangs-Auren an Wände und Decke. Per Smartphone-App stehen dir 16 Millionen Farben, Musik-Synchronisation und verschiedene Helligkeitsstufen zur Verfügung. Ideal für Aesthetic-Fotos, Content Creation oder entspannte Abende.",
    shortDescription: "360° drehbare Projektor-Lampe für Stimmungslicht mit 16 Mio. Farben.",
    price: 29.99,
    compareAtPrice: 44.99,
    category: "Home & Living",
    categorySlug: "home-living",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=800&fit=crop&q=80",
    ],
    features: [
      "App-Steuerung mit 16 Millionen Lichtfarben & Effekten",
      "360° flexibler Kristallkopf für jeden Projektionswinkel",
      "Perfekt für Content Creator, Fotos & Entspannung",
      "Musik-Sync Funktion – Licht tanzt zum Rhythmus",
      "Hochwertiges Aluminium-Gehäuse mit USB-Anschluss",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.8,
    reviewCount: 312,
    badge: "Neu",
    inStock: true,
    stockCount: 22,
    soldCount: 1120,
  },
  {
    id: "hl-003",
    slug: "led-nachttischlampe-touch-wireless-charger",
    title: "LED Touch Nachttischlampe mit 15W Wireless Charger",
    description:
      "Minimalistisches Design trifft auf maximale Funktionalität. Diese moderne LED-Tischleuchte bietet stufenloses Touch-Dimmen in 3 Farbtemperaturen (Warmweiß, Neutral, Kaltweiß). Die integrierte 15W Qi-Schnellladestation lädt dein Smartphone kabellos auf, sobald du es auf dem Holzfuß ablegst. Der verstellbare Bogen dient gleichzeitig als praktischer Smartphone-Ständer.",
    shortDescription: "Dimmbare Designer-Lampe mit integrierter 15W Qi-Induktionsladefläche.",
    price: 44.99,
    compareAtPrice: 69.99,
    category: "Home & Living",
    categorySlug: "home-living",
    images: [
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop&q=80",
    ],
    features: [
      "Integrierter 15W Qi-Wireless Fast Charger",
      "3 Lichtmodi & stufenloses Touch-Dimmen",
      "Verstellbarer Bügel als Handyhalterung nutzbar",
      "Hochwertige Echtholz-Optik & mattes Finish",
      "Augenschonendes, flackerfreies LED-Licht",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.9,
    reviewCount: 654,
    badge: "Beliebt",
    inStock: true,
    stockCount: 9,
    soldCount: 2310,
  },
  {
    id: "hl-004",
    slug: "ultraschall-schmuck-brillenreiniger-pro",
    title: "Ultraschall Schmuck- & Brillenreiniger Pro",
    description:
      "Professionelle Tiefenreinigung auf Knopfdruck. Mit 45.000 Hz hochfrequenten Ultraschallwellen entfernt der Pro-Cleaner selbst hartnäckigsten Schmutz, Talg und Oxidation an schwer zugänglichen Stellen – ganz ohne schädliche Chemie. Ideal für Brillen, Uhren, Schmuck, Rasierköpfe und Zahnschienen. In nur 3 Minuten strahlen deine Wertgegenstände wie am ersten Tag.",
    shortDescription: "45.000 Hz Ultraschall-Reiniger für strahlenden Schmuck & Brillen.",
    price: 34.99,
    compareAtPrice: 49.99,
    category: "Home & Living",
    categorySlug: "home-living",
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=800&fit=crop&q=80",
    ],
    features: [
      "Powerful 45.000 Hz Ultraschall-Tiefenreinigung",
      "Mühelose Reinigung nur mit einfachem Leitungswasser",
      "Auto-Timer mit 3 Reinigungsmodi (3, 5, 8 Min.)",
      "Edelstahl-Behälter (SUS304) – rostfrei & langlebig",
      "Kompakt & leise im täglichen Gebrauch",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.7,
    reviewCount: 289,
    badge: "Tipp",
    inStock: true,
    stockCount: 19,
    soldCount: 940,
  },

  // ── Haustiere ─────────────────────────────────────────────
  {
    id: "pet-001",
    slug: "orthopaedisches-anti-angst-hundebett-donuts",
    title: "Orthopädisches Anti-Angst Haustierbett Donuts",
    description:
      "Schenke deinem Vierbeiner den erholsamsten Schlaf seines Lebens. Das Donut-förmige Kuschelbett ist speziell entwickelt, um Angst und Stress bei Hunden und Katzen abzubauen. Der erhöhte Rand stützt Kopf und Nacken ab, während der superweiche Premium-Plüsch das Gefühl der Geborgenheit im Mutterfell simuliert. Waschbarer Bezug mit rutschfester Unterseite.",
    shortDescription: "Ultra-weiches Kuschelbett zur Stress- & Angstreduzierung.",
    price: 34.99,
    compareAtPrice: 54.99,
    category: "Haustiere",
    categorySlug: "haustiere",
    images: [
      "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=800&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&h=800&fit=crop&q=80",
    ],
    features: [
      "Gelenkschonende Memory-Foam Polsterung",
      "Beruhigendes Donut-Design lindert Stress & Angst",
      "Extrem weicher, atmungsaktiver Plüsch-Bezug",
      "Rutschfeste & wasserabweisende Unterseite",
      "Vollständig in der Waschmaschine waschbar",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.9,
    reviewCount: 890,
    badge: "Bestseller",
    inStock: true,
    stockCount: 12,
    soldCount: 3420,
  },
  {
    id: "pet-002",
    slug: "automatischer-haustier-trinkbrunnen-filter",
    title: "Automatischer Haustier-Trinkbrunnen mit Dreifach-Filter",
    description:
      "Katzen und Hunde lieben fließendes Wasser. Dieser geräuscharme Edelstahl-Trinkbrunnen motiviert dein Haustier nachweislich zu mehr Trinken und beugt Nierenerkrankungen vor. Das integrierte 3-fach Aktivkohle-Filtersystem reinigt das Wasser kontinuierlich von Haaren, Schwermetallen und Bakterien. Mit LED-Wasserstandsanzeige.",
    shortDescription: "Flüsterleiser Trinkbrunnen für frisches, gefiltertes Wasser.",
    price: 27.99,
    compareAtPrice: 39.99,
    category: "Haustiere",
    categorySlug: "haustiere",
    images: [
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800&h=800&fit=crop&q=80",
    ],
    features: [
      "2,5 Liter großes Fassungsvermögen für Tage",
      "Dreifach-Aktivkohlefilter gegen Verunreinigungen",
      "Ultra-leise Niedervolt-Pumpe (<20 dB)",
      "LED-Füllstandsanzeige mit automatischer Abschaltung",
      "Spülmaschinenfeste Edelstahl-Trinkschale",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.8,
    reviewCount: 512,
    badge: "Empfehlung",
    inStock: true,
    stockCount: 25,
    soldCount: 1760,
  },
  {
    id: "pet-003",
    slug: "dampf-fellpflege-buerste-hunde-katzen",
    title: "Elektrische Dampf-Fellpflegebürste 3-in-1",
    description:
      "Die Revolution in der Fellpflege. Diese innovative Bürste nutzt kühlen Ultraschall-Mischdampf, um verfilztes Unterfell sanft zu lösen, statische Aufladung zu verhindern und lose Haare sofort zu binden. Kein Herumfliegen von Haaren mehr! Die abgerundeten Silikon-Noppen massieren die Haut deines Lieblings sanft.",
    shortDescription: "Entfernt lose Haare mühelos mit schonender Dampf-Technologie.",
    price: 24.99,
    compareAtPrice: 34.99,
    category: "Haustiere",
    categorySlug: "haustiere",
    images: [
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=800&h=800&fit=crop&q=80",
    ],
    features: [
      "3-in-1: Bürsten, Dampfen & wohltuende Massage",
      "Bindet lose Haare durch sanften Sprühnebel",
      "Abgerundete Noppen schonen die empfindliche Haut",
      "USB-aufladbar & ergonomisches Handdesign",
      "Geeignet für alle Felllängen (Hunde & Katzen)",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.7,
    reviewCount: 340,
    badge: "Neu",
    inStock: true,
    stockCount: 30,
    soldCount: 1290,
  },

  // ── Lifestyle & Fitness ────────────────────────────────────
  {
    id: "fit-001",
    slug: "smarte-massagepistole-deep-tissue-6-aufsaetze",
    title: "Smarte Deep-Tissue Massagepistole mit 6 Aufsätzen",
    description:
      "Effektive Muskelregeneration & Schmerzlinderung für Zuhause. Mit bis zu 3.200 Schlägen pro Minute löst diese professionelle Massagepistole hartnäckige Muskelverspannungen und Faszienverklebungen im tiefen Gewebe. Der bürstenlose Leismotor arbeitet flüsterleise. Über das Touch-Display wählst du aus 30 Intensitätsstufen und 6 Spezialaufsätzen.",
    shortDescription: "Tiefenmuskel-Massagegerät mit Touch-Display & 30 Stufen.",
    price: 49.99,
    compareAtPrice: 89.99,
    category: "Lifestyle & Fitness",
    categorySlug: "lifestyle-fitness",
    images: [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=800&fit=crop&q=80",
    ],
    features: [
      "6 Spezialaufsätze für Nacken, Rücken, Beine & Gelenke",
      "30 einstellbare Geschwindigkeitsstufen (bis 3200 U/Min)",
      "Flüsterleiser High-Torque Motor (<35 dB)",
      "Langlebiger 2500mAh Akku (bis zu 6 Std. Laufzeit)",
      "Inklusive robuster Transporttasche",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.9,
    reviewCount: 940,
    badge: "Bestseller",
    inStock: true,
    stockCount: 8,
    soldCount: 4120,
  },
  {
    id: "fit-002",
    slug: "haltungs-korrektur-gurt-sensor-vibration",
    title: "Intelligenter Haltungskorrektur-Trainer mit Bio-Sensor",
    description:
      "Schluss mit Nackenschmerzen und Rundrücken. Dieser smarte Haltungstrainer erinnert dich durch sanfte, unaufdringliche Vibrationen daran, aufrecht zu sitzen oder zu stehen, sobald sich deine Wirbelsäule um mehr als 25° neigt. Diskret unter der Kleidung tragbar und stufenlos anpassbar.",
    shortDescription: "Bio-Sensor erinnert sanft per Vibration an aufrechte Haltung.",
    price: 24.99,
    compareAtPrice: 39.99,
    category: "Lifestyle & Fitness",
    categorySlug: "lifestyle-fitness",
    images: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=800&fit=crop&q=80",
    ],
    features: [
      "Präziser Winkel-Sensor erkennt Haltungsfehler sofort",
      "Sanfte Vibrationserinnerung stärkt Rückenmuskulatur",
      "Unsichtbar unter Alltagskleidung oder Hemd",
      "Einstellbare Gurte für Damen & Herren",
      "Akkulaufzeit bis zu 15 Tage pro Ladung",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.6,
    reviewCount: 410,
    badge: "Empfehlung",
    inStock: true,
    stockCount: 21,
    soldCount: 1540,
  },
  {
    id: "fit-003",
    slug: "thermo-trinkflasche-led-temperaturanzeige-750ml",
    title: "Edelstahl Thermo-Trinkflasche mit Touch-LED (750ml)",
    description:
      "Die perfekte Trinkflasche für unterwegs, Sport & Büro. Die doppelwandige Vakuum-Isolierung hält deine Getränke bis zu 12 Stunden heiß oder 24 Stunden eiskalt. Das integrierte HD-Touch-Display auf dem Deckel zeigt dir jederzeit die exakte Wassertemperatur im Inneren an – ganz ohne Aufbrühen.",
    shortDescription: "Doppelwandige Isolierflasche mit Temperaturanzeige auf dem Deckel.",
    price: 22.99,
    compareAtPrice: 34.99,
    category: "Lifestyle & Fitness",
    categorySlug: "lifestyle-fitness",
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=800&fit=crop&q=80",
    ],
    features: [
      "Touch-LED Display zeigt Temperatur präzise an",
      "24 Std. Kälte- / 12 Std. Hitzespeicher-Garantie",
      "BPA-freier, lebensmittelechter 304 Edelstahl",
      "100% Auslaufsicher – ideal für Tasche & Rucksack",
      "Inklusive herausnehmbarem Teesieb-Einsatz",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.8,
    reviewCount: 620,
    inStock: true,
    stockCount: 17,
    soldCount: 2890,
  },

  // ── Büro & Organisation ───────────────────────────────────
  {
    id: "off-001",
    slug: "ergonomisches-sitzkissen-gel-kuehlkern",
    title: "Ergonomisches Orthopädisches Sitzkissen mit Gel-Kühlkern",
    description:
      "Schmerzfrei durch den Arbeitstag im Homeoffice oder Büro. Das ergonomisch geformte Waben-Sitzkissen entlastet Steißbein, Hüfte und Ischiasnerv spürbar. Die Kombination aus hochdichtem Memory Foam und kühlender Gelschicht verhindert Hitzestau und sorgt für gesunde Sitzhaltung selbst nach 8 Stunden.",
    shortDescription: "Entlastet Steißbein & Wirbelsäule beim langen Sitzen.",
    price: 32.99,
    compareAtPrice: 49.99,
    category: "Büro & Organisation",
    categorySlug: "buero-organisation",
    images: [
      "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=800&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800&fit=crop&q=80",
    ],
    features: [
      "U-förmige Aussparung entlastet das Steißbein komplett",
      "Kühlender Gel-Kern verhindert lästiges Schwitzen",
      "Rutschfeste Unterseite haftet auf jedem Stuhl",
      "Atmungsaktiver, abnehmbarer Bezug (waschbar)",
      "Empfohlen von Ergonomie- & Physiotherapeuten",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.9,
    reviewCount: 780,
    badge: "Bestseller",
    inStock: true,
    stockCount: 11,
    soldCount: 3100,
  },
  {
    id: "off-002",
    slug: "desk-pad-schreibtischunterlage-leder-organizer",
    title: "Premium Schreibtischunterlage aus PU-Leder mit Kabel-Clips",
    description:
      "Veredle deinen Arbeitsplatz im Handumdrehen. Die großzügige 90x40cm Schreibtischauflage schützt deinen Tisch vor Kratzern, Flecken und Abnutzung. Die wasserabweisende Oberfläche ermöglicht präzises Mausgleiten ohne zusätzliches Mauspad. Inklusive 3 magnetischen Silikon-Kabel-Organizern.",
    shortDescription: "Großflächiges Schreibtisch-Pad (90x40cm) in edler Lederoptik.",
    price: 26.99,
    compareAtPrice: 39.99,
    category: "Büro & Organisation",
    categorySlug: "buero-organisation",
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=800&h=800&fit=crop&q=80",
    ],
    features: [
      "XXL-Format 90 x 40 cm – Platz für Tastatur & Maus",
      "Wasser- & fettabweisend – kinderleicht abwischbar",
      "Optimaler Maus-Mittelpunkt für präzise Steuerung",
      "Rutschfeste Unterseite aus hochwertigem Kork",
      "Inklusive 3 magnetischen Kabel-Organizern",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.8,
    reviewCount: 390,
    badge: "Neu",
    inStock: true,
    stockCount: 28,
    soldCount: 1450,
  },

  // ── Elektronik-Zubehör ─────────────────────────────────────
  {
    id: "tech-001",
    slug: "3in1-magsafe-kabellose-ladestation-faltbar",
    title: "3-in-1 MagSafe Faltbare Kabellose Ladestation",
    description:
      "Die ultimative All-in-One Ladestation für dein Apple- & Android-Ecosystem. Lade Smartphone, Smartwatch und Wireless-Kopfhörer gleichzeitig an nur einer Steckdose. Durch das innovative Falt-Design lässt sich der Lader flach zusammenklappen und passt in jede Hanteltasche oder jedes Handgepäck. Starke MagSafe-Magnete garantieren perfekten Halt.",
    shortDescription: "Gleichzeitiges kabelloses Laden für Smartphone, Watch & AirPods.",
    price: 39.99,
    compareAtPrice: 59.99,
    category: "Elektronik-Zubehör",
    categorySlug: "elektronik-zubehoer",
    images: [
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=800&h=800&fit=crop&q=80",
    ],
    features: [
      "Lädt 3 Geräte gleichzeitig (Smartphone, Watch, Buds)",
      "Starke MagSafe Ausrichtung verhindert Verrutschen",
      "Kompakt zusammenklappbar – perfekt für Reisen",
      "Intelligenter Schutz vor Überladung & Erwärmung",
      "Inklusive 18W USB-C Schnellladeadapter & Kabel",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.9,
    reviewCount: 1120,
    badge: "Bestseller",
    inStock: true,
    stockCount: 15,
    soldCount: 4890,
  },
  {
    id: "tech-002",
    slug: "magsafe-powerbank-10000mah-digital-display",
    title: "MagSafe Wireless Powerbank 10.000mAh mit Ständer",
    description:
      "Nie wieder leerer Akku unterwegs. Diese schlanke Powerbank haftet magnetisch bombenfest an der Rückseite deines Smartphones und lädt es kabellos mit bis zu 15W Schnellladung. Der ausklappbare Aluminium-Ständer verwandelt dein Handy während des Ladevorgangs in eine praktische Tischuhr oder Videobildschirm. Mit digitalem Prozent-Display.",
    shortDescription: "Magnetische 10.000mAh Powerbank mit ausklappbarem Metall-Ständer.",
    price: 34.99,
    compareAtPrice: 49.99,
    category: "Elektronik-Zubehör",
    categorySlug: "elektronik-zubehoer",
    images: [
      "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=800&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=800&fit=crop&q=80",
    ],
    features: [
      "10.000 mAh Kapazität – reichert Akku 2-3x komplett auf",
      "Ultra-starker MagSafe Magnet für sicheren Halt",
      "Integriertes digitales LED-Akkustandsdisplay",
      "Ausklappbarer Aluminium-Ringständer für Standmodus",
      "USB-C Bidirektionales Schnellladen (20W PD Output)",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.8,
    reviewCount: 680,
    badge: "Empfehlung",
    inStock: true,
    stockCount: 18,
    soldCount: 2780,
  },
  {
    id: "tech-003",
    slug: "7in1-reinigungs-kit-kopfhoerer-tastatur",
    title: "Multi-Reinigungs-Kit 7-in-1 für AirPods, Laptop & Displays",
    description:
      "Saubere Technik in Sekunden. Dieses kompakte Multi-Tool vereint 7 Reinigungs-Werkzeuge in einem leichten Stift-Gehäuse: Silikon-Spitze für Ohrhörer-Gitter, High-Density Bürste, Schwamm-Stift für Ladecases, Tastenabzieher und Display-Sprühreiniger mit integriertem Mikrofaser-Wischer.",
    shortDescription: "7 Werkzeuge in einem Stift für makellose Ohrhörer, Tastaturen & Screens.",
    price: 16.99,
    compareAtPrice: 24.99,
    category: "Elektronik-Zubehör",
    categorySlug: "elektronik-zubehoer",
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=800&fit=crop&q=80",
    ],
    features: [
      "7 spezialisierte Werkzeuge im kompakten Gehäuse",
      "Entfernt hartnäckigen Schmutz aus Ohrhörer-Gittern",
      "Inklusive nachfüllbarem Display-Sprühreiniger",
      "Sanfter Tastaturabzieher & Bürsten-Kopf",
      "Integrierte Mikrofaser-Wischfläche auf der Rückseite",
    ],
    deliveryDays: "3–7 Werktage",
    rating: 4.7,
    reviewCount: 430,
    badge: "Tipp",
    inStock: true,
    stockCount: 42,
    soldCount: 1820,
  },
];

export function getBestsellers(): Product[] {
  return products.filter((p) => p.badge === "Bestseller" || p.soldCount > 2000);
}
