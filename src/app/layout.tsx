import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { AgeGate } from "@/components/site/age-gate";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Elevations247 — Above the Rest",
    template: "%s · Elevations247",
  },
  description:
    "Stellenbosch's exclusive private cannabis members club. Premium cannabis, delivered 24/7. Members only.",
  keywords: [
    "Elevations247",
    "Stellenbosch cannabis",
    "private members club",
    "premium cannabis",
    "24/7 delivery",
  ],
  metadataBase: new URL("https://elevations247.co.za"),
  openGraph: {
    title: "Elevations247 — Above the Rest",
    description:
      "Premium cannabis. Delivered 24/7. Stellenbosch's exclusive private members club.",
    type: "website",
    locale: "en_ZA",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-background text-ink antialiased">
        <Toaster>
          <AgeGate />
          {children}
        </Toaster>
      </body>
    </html>
  );
}
