import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { SITE_NAME } from "@/constants/site";

// Route-scoped: overrides Tailwind's --font-mono only inside /hackathon (root layout is frozen).
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
  display: "swap",
});

const TITLE = "sqrtDAO Builder Hackathon";
const DESCRIPTION =
  "A four-week launch hackathon for builders, 23 Nov → 20 Dec. Ship your project, launch your token on sqrtDAO and get funded by your community. No forms, no applications.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/hackathon/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/hackathon/",
    siteName: SITE_NAME,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: TITLE }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
};

const HackathonLayout = ({ children }: { children: React.ReactNode }) => (
  <div className={plexMono.variable}>{children}</div>
);

export default HackathonLayout;
