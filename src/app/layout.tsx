import type { Metadata } from "next";
import { Inter, Comfortaa } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Analytics from "@/components/Analytics";
import ConversionBoosters from "@/components/ConversionBoosters";
import FlashSaleBanner from "@/components/FlashSaleBanner";

const inter = Inter({ subsets: ["latin"] });
const comfortaa = Comfortaa({
  subsets: ["latin"],
  variable: "--font-comfortaa",
});

export const metadata: Metadata = {
  title: {
    default: "TrendWare – Clever einkaufen. Clever leben.",
    template: "%s | TrendWare",
  },
  description:
    "Entdecke handverlesene Produkte für Zuhause, Büro, Fitness und mehr. Schneller Versand, 30 Tage Rückgaberecht.",
  metadataBase: new URL("https://trendware.store"),
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "TrendWare",
    title: "TrendWare – Smarte Produkte für deinen Alltag",
    description:
      "Handverlesene Gadgets ab 12,99 € – für Zuhause, Büro, Fitness & Haustiere. Kostenloser Versand ab 39 €.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrendWare – Smarte Produkte für deinen Alltag",
    description:
      "Handverlesene Gadgets ab 12,99 € – für Zuhause, Büro, Fitness & Haustiere. Kostenloser Versand ab 39 €.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body
        className={`${inter.className} ${comfortaa.variable} bg-white min-h-screen flex flex-col`}
      >
        <div className="bg-amber-500 text-slate-950 text-center text-xs sm:text-sm font-bold py-2 px-4 shadow-sm z-50">
          ⚠️ TESTBETRIEB – Bestellungen sind derzeit nicht möglich.
        </div>
        <FlashSaleBanner />
        <Analytics />
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <ConversionBoosters />
        </CartProvider>
      </body>
    </html>
  );
}
