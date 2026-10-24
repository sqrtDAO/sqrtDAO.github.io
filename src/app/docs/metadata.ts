import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/constants/site";

const OG_IMAGE = { url: "/og.png", width: 1200, height: 630 };

export const docMetadata = (path: string, title: string, description: string): Metadata => {
  const ogTitle = `${title} | ${SITE_NAME} docs`;
  const image = { ...OG_IMAGE, alt: ogTitle };

  return {
    // Absolute: a title template defined in app/docs/layout.tsx is not applied
    // to /docs/ itself (Next skips the template of the leaf layout), so the
    // suffix is spelled out here and stays identical on every docs page.
    title: { absolute: ogTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      title: ogTitle,
      description,
      url: SITE_URL + path,
      siteName: SITE_NAME,
      images: [image],
      type: "website",
    },
    // Without this, docs pages inherit the root layout's twitter block and
    // share as the homepage.
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [image],
    },
  };
};
