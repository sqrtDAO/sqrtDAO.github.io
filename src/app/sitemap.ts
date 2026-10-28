import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constants/site";
import { blogPosts } from "./blog/posts";
import { flatDocsNav } from "./docs/docs-nav";

// Required for metadata routes under `output: "export"`.
export const dynamic = "force-static";

// Generated at build time from the same sources the nav and blog index render
// from, so adding a doc page or a post can't leave the sitemap stale.
// App-flow routes (/distribution*, /token-launch) are intentionally absent:
// they are noindex (see their layout.tsx).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog/`, changeFrequency: "weekly", priority: 0.7 },
    ...flatDocsNav.map((doc) => ({
      url: `${SITE_URL}${doc.path}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...blogPosts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}/`,
      lastModified: post.date,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
