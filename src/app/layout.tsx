import type { Metadata, Viewport } from "next";
import { Oswald, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { AgeGate } from "@/components/site/age-gate";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-plex-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Breaking Bud — The Science of a Better High",
    template: "%s · Breaking Bud",
  },
  description:
    "Lab-graded flower, named like elements. A chemistry-lab dispensary — members only, open 24/7 in Stellenbosch.",
  keywords: [
    "Breaking Bud",
    "Stellenbosch cannabis",
    "private members club",
    "lab-graded flower",
    "24/7 cannabis",
    "periodic table cannabis",
  ],
  metadataBase: new URL("https://breakingbud.co.za"),
  openGraph: {
    title: "Breaking Bud — The Science of a Better High",
    description:
      "Lab-graded flower, named like elements. Members only, open 24/7 in Stellenbosch.",
    type: "website",
    locale: "en_ZA",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F7F2" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0C0A" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plexSans.variable} ${oswald.variable} ${plexMono.variable} bg-background`}
    >
      <body className="min-h-screen bg-background text-ink antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Toaster>
            <AgeGate />
            {children}
          </Toaster>
        </ThemeProvider>
      </body>
    </html>
  );
}
