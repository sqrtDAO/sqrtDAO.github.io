import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/constants/site";
import type { BlogPost } from "./posts";

const OG_IMAGE = { url: "/og.png", width: 1200, height: 630 };

export const blogMetadata = (path: string, title: string, description: string): Metadata => {
  const image = { ...OG_IMAGE, alt: `${title} — ${SITE_NAME}` };

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: SITE_URL + path,
      siteName: SITE_NAME,
      images: [image],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
};

export const blogPostMetadata = (post: BlogPost): Metadata => {
  // post.ogImage is a 1200x630 crop generated from post.image.
  const image = { url: post.ogImage, width: 1200, height: 630, alt: post.title };

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}/` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${post.slug}/`,
      siteName: SITE_NAME,
      images: [image],
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [image],
    },
  };
};
