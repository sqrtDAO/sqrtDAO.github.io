import type { Metadata } from "next";
import { Oxanium, IBM_Plex_Sans_Condensed } from "next/font/google";
import RainbowKitRoot from "@/components/RainbowKitRoot/RainbowKitRoot";
import ToastContainer from "@/components/ToastContainer/ToastContainer";
import { SITE_NAME, SITE_URL } from "@/constants/site";
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

const DESCRIPTION =
  "Fair-launch infrastructure for tokens: pro-rata distribution across epochs, backing that can't be pulled, and no gatekeepers.";

const SOCIAL_DESCRIPTION =
  "Fair-launch infrastructure for tokens. Slow, pro-rata distribution across epochs, backing that can't be pulled, and no gatekeepers.";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | Launch and distribute infrastructure`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: `${SITE_NAME} | Launch and distribute infrastructure`,
    description: SOCIAL_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Launch and distribute infrastructure for tokens`,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Launch and distribute infrastructure`,
    description: SOCIAL_DESCRIPTION,
    images: ["/og.png"],
  },
  other: {
    "theme-color": "#0B0D12",
    "base:app_id": "6a7df3d61726567795dd07db",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${oxanium.variable} ${ibmPlex.variable}`}>
      <body>
        <RainbowKitRoot>{children}</RainbowKitRoot>
        <ToastContainer />
      </body>
    </html>
  );
}
