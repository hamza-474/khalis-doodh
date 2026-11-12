import type { Metadata } from "next";
import { Manrope, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "Khalis Doodh — Verified Milk Delivery Across Punjab",
  description: "Verified local milk delivery in Punjab. Pure milk starts with a route you can trust.",
  openGraph: {
    title: "Khalis Doodh — Verified Milk Delivery Across Punjab",
    description: "Verified local milk delivery in Punjab. Pure milk starts with a route you can trust.",
    type: "website",
    locale: "en_PK",
    siteName: "Khalis Doodh",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${notoSansArabic.variable}`}>
      <body>{children}</body>
    </html>
  );
}
