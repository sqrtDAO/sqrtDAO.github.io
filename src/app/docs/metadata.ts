import type { Metadata } from "next";

const SITE_URL = "https://sqrtdao.org";

export const docMetadata = (path: string, title: string, description: string): Metadata => ({
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title: `${title} | sqrtDAO docs`,
    description,
    url: SITE_URL + path,
    siteName: "sqrtDAO",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    type: "website",
  },
});
