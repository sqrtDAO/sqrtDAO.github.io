import type { Metadata } from "next";
import { Oxanium, IBM_Plex_Sans_Condensed } from "next/font/google";
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
  title: "sqrtDAO — design the beginning fair",
  description: "Fair-launch infrastructure for tokens.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${oxanium.variable} ${ibmPlex.variable}`}>
      <body>{children}</body>
    </html>
  );
}
