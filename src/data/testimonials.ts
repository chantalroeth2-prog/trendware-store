export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  text: string;
  product?: string;
  date: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Sarah M.",
    rating: 5,
    text: "Die LED-Nachttischlampe ist einfach wundersch\u00f6n! Perfektes Licht zum Lesen und der USB-Anschluss ist super praktisch. Bin begeistert!",
    product: "LED Nachttischlampe",
    date: "vor 2 Wochen",
  },
  {
    id: "t2",
    name: "Thomas K.",
    rating: 5,
    text: "Mega schnelle Lieferung und die Resistance B\u00e4nder sind top Qualit\u00e4t. Trainiere jetzt t\u00e4glich damit. Klare Kaufempfehlung!",
    product: "Resistance B\u00e4nder Set",
    date: "vor 3 Wochen",
  },
  {
    id: "t3",
    name: "Julia R.",
    rating: 5,
    text: "Das LED-Hundehalsband ist ein Lebensretter f\u00fcr unsere Abendspazierg\u00e4nge. Super hell und h\u00e4lt was es verspricht. Mein Hund ist jetzt der Star im Park!",
    product: "LED Hundehalsband",
    date: "vor 1 Woche",
  },
  {
    id: "t4",
    name: "Marco B.",
    rating: 5,
    text: "Der Laptop-St\u00e4nder hat mein Homeoffice komplett ver\u00e4ndert. Keine Nackenschmerzen mehr! Aus Aluminium, sehr stabil und sieht edel aus.",
    product: "Ergonomischer Laptop-St\u00e4nder",
    date: "vor 5 Tagen",
  },
  {
    id: "t5",
    name: "Lisa W.",
    rating: 4,
    text: "Die Massagepistole ist genau das, was ich nach dem Sport brauche. Klein genug f\u00fcr die Sporttasche und trotzdem richtig kraftvoll. Top!",
    product: "Mini Massagepistole",
    date: "vor 1 Monat",
  },
  {
    id: "t6",
    name: "Markus H.",
    rating: 5,
    text: "Wireless Charging Pad funktioniert einwandfrei mit meinem iPhone und Samsung. Super flach, l\u00e4dt schnell. Bester Kauf seit langem!",
    product: "Wireless Charging Pad",
    date: "vor 4 Tagen",
  },
  {
    id: "t7",
    name: "Anna F.",
    rating: 4,
    text: "Der Kabelorganizer h\u00e4lt wirklich, was er verspricht \u2013 endlich kein Kabelsalat mehr auf dem Schreibtisch. Einzig die Farbe ist etwas dunkler als auf dem Bild, aber funktional top.",
    product: "Kabel-Management Organizer",
    date: "vor 10 Tagen",
  },
  {
    id: "t8",
    name: "Florian D.",
    rating: 5,
    text: "Die Yoga-Matte ist dicker als erwartet und super rutschfest. Selbst bei intensiven Workouts verrutscht nichts. Preis-Leistung ist hervorragend!",
    product: "Premium Yoga-Matte",
    date: "vor 6 Tagen",
  },
];
