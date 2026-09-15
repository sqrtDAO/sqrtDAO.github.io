"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { IconSearch } from "@tabler/icons-react";
import { postDate, type BlogPost } from "@/app/blog/posts";

const MIN_QUERY_LENGTH = 2;

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (q.length < MIN_QUERY_LENGTH) return posts;
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(q) || post.description.toLowerCase().includes(q),
    );
  }, [posts, q]);

  const searching = q.length >= MIN_QUERY_LENGTH;

  return (
    <div className="mt-10">
      <div className="relative">
        <IconSearch
          size={16}
          strokeWidth={1.75}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-tertiary"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && setQuery("")}
          placeholder="Search posts"
          aria-label="Search posts"
          className="w-full rounded-m border border-subtle bg-canvas py-3 pl-10 pr-3 text-body text-primary placeholder:text-tertiary focus:border-strong focus:outline-none"
        />
      </div>

      <ul className="mt-6 flex flex-col gap-4">
        {results.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}/`}
              className="block rounded-l border border-subtle bg-raised p-6 transition-colors hover:border-strong"
            >
              <p className="text-caption uppercase tracking-widest text-tertiary">
                {postDate(post)}
              </p>
              <p className="mt-2 font-display text-h4 font-semibold text-primary">{post.title}</p>
              <p className="mt-2 line-clamp-2 text-body-s text-secondary">{post.description}</p>
            </Link>
          </li>
        ))}
      </ul>

      {searching && results.length === 0 && (
        <p className="mt-6 text-body-s text-tertiary">No results for “{query.trim()}”</p>
      )}
    </div>
  );
}
