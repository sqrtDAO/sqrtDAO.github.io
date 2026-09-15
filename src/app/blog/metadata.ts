import type { Metadata } from "next";
import type { BlogPost } from "./posts";

const SITE_URL = "https://sqrtdao.org";

export const blogMetadata = (path: string, title: string, description: string): Metadata => ({
  title: { absolute: title },
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: SITE_URL + path,
    siteName: "sqrtDAO",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    type: "website",
  },
});

export const blogPostMetadata = (post: BlogPost): Metadata => ({
  title: post.title,
  description: post.description,
  alternates: { canonical: `/blog/${post.slug}/` },
  openGraph: {
    title: post.title,
    description: post.description,
    url: `${SITE_URL}/blog/${post.slug}/`,
    siteName: "sqrtDAO",
    images: [{ url: post.image, width: 1200, height: 630 }],
    type: "article",
    publishedTime: post.date,
  },
  twitter: {
    card: "summary_large_image",
    images: [{ url: post.image, width: 1200, height: 630 }],
  },
});
