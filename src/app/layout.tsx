import type { Metadata } from "next";
import { Inter, Comfortaa } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

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
  metadataBase: new URL("https://trendware7.store"),
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "TrendWare",
    title: "TrendWare – Smarte Produkte für deinen Alltag",
    description:
      "Ausgewählte Alltagshelfer für Zuhause, Ordnung und Ambiente.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrendWare – Smarte Produkte für deinen Alltag",
    description:
      "Ausgewählte Alltagshelfer für Zuhause, Ordnung und Ambiente.",
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
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
