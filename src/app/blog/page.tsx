import type { Metadata } from "next";
import BlogList from "@/components/Blog/BlogList";
import { blogMetadata } from "./metadata";
import { blogPosts } from "./posts";

export const metadata: Metadata = blogMetadata(
  "/blog/",
  "sqrtDAO blog",
  "Updates, deep dives and announcements from the sqrtDAO team.",
);

export default function BlogPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-gutter py-12 sm:py-20">
      <h1 className="font-display text-h2 font-bold text-primary sm:text-h1">Blog</h1>
      <p className="mt-3 text-body-l text-secondary">
        Updates, deep dives and announcements from the sqrtDAO team.
      </p>
      <BlogList posts={blogPosts} />
    </div>
  );
}
