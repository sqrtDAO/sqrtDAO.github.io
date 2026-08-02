import type { Metadata } from "next";
import { Oxanium, IBM_Plex_Sans_Condensed } from "next/font/google";
import RainbowKitRoot from "@/components/RainbowKitRoot/RainbowKitRoot";
import "./theme.css";
import "./globals.css";

const oxanium = Oxanium({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const ibmPlex = IBM_Plex_Sans_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "sqrtDAO | Launch and distribute infrastructure",
  description:
    "Fair-launch infrastructure for tokens. Slow, pro-rata distribution across epochs, backing that can't be pulled, and no gatekeepers. Create a token or distribute an existing one | one fair engine, two ways in.",
  metadataBase: new URL("https://sqrtdao.org"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "sqrtDAO | Launch and distribute infrastructure",
    description:
      "Fair-launch infrastructure for tokens. Slow, pro-rata distribution across epochs, backing that can't be pulled, and no gatekeepers.",
    url: "https://sqrtdao.org",
    siteName: "sqrtDAO",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "sqrtDAO — Launch and distribute infrastructure for tokens",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "sqrtDAO | Launch and distribute infrastructure",
    description:
      "Fair-launch infrastructure for tokens. Slow, pro-rata distribution across epochs, backing that can't be pulled, and no gatekeepers.",
    images: ["/og.png"],
  },
  other: {
    "theme-color": "#0B0D12",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${oxanium.variable} ${ibmPlex.variable}`}>
      <head>
        <meta name="theme-color" content="#0B0D12" />
      </head>
      <body><RainbowKitRoot>{children}</RainbowKitRoot></body>
    </html>
  );
}
