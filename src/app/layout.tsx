import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vijay Iyyangar Bakery | Freshly Baked Everyday with Tradition & Love",
  description: "Vijay Iyyangar Bakery, B.C. Road, Bantwal, Karnataka. Serving fresh traditional Iyengar bakery favorites, custom designer cakes, pastries, puffs, and breads. Order online with WhatsApp integration.",
  keywords: "Vijay Iyyangar Bakery, Iyengar Bakery BC Road, Bantwal Bakery, Custom Cakes Bantwal, Fresh Breads, Honey Cake, Dil Pasand, Khara Bun",
  verification: {
    google: "T5AaBsIvTN6aDCRrmWqaXYxL3j9v7vG5-xS7yTcesIk",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${outfit.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
