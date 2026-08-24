"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { IconSearch } from "@tabler/icons-react";
import { docSearchIndex, type DocSearchEntry } from "@/app/docs/search-index";

const MIN_QUERY_LENGTH = 2;
const MAX_RESULTS = 8;
const SNIPPET_BEFORE = 32;
const SNIPPET_AFTER = 72;

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const scoreOf = (entry: DocSearchEntry, query: string) =>
  (entry.title.toLowerCase().includes(query) ? 3 : 0) +
  (entry.text.toLowerCase().includes(query) ? 1 : 0);

type DocSearchProps = { onNavigate?: () => void };

export default function DocSearch({ onNavigate }: DocSearchProps) {
  const [query, setQuery] = useState("");
  const trimmed = query.trim();
  const q = trimmed.toLowerCase();

  const results = useMemo(() => {
    if (q.length < MIN_QUERY_LENGTH) return [];
    return docSearchIndex
      .map((entry) => ({ entry, score: scoreOf(entry, q) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_RESULTS)
      .map((r) => r.entry);
  }, [q]);

  const showResults = q.length >= MIN_QUERY_LENGTH;

  return (
    <div className="relative px-3 pt-4">
      <IconSearch
        size={16}
        strokeWidth={1.75}
        className="pointer-events-none absolute left-6 top-[29px] text-tertiary"
      />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && setQuery("")}
        placeholder="Search docs"
        aria-label="Search docs"
        className="w-full rounded-m border border-subtle bg-canvas py-2.5 pl-9 pr-3 text-body text-primary placeholder:text-tertiary focus:border-strong focus:outline-none"
      />
      {showResults && (
        <div className="absolute inset-x-3 top-full z-10 mt-1 max-h-80 overflow-y-auto rounded-l border border-muted bg-raised p-1 shadow-xl">
          {results.length === 0 && (
            <p className="px-3 py-3 text-body-s text-tertiary">No results for “{trimmed}”</p>
          )}
          <ul>
            {results.map((entry) => (
              <li key={`${entry.path}#${entry.anchor ?? ""}`}>
                <Link
                  href={`${entry.path}#${entry.anchor ?? ""}`}
                  onClick={() => {
                    setQuery("");
                    onNavigate?.();
                  }}
                  className="block rounded-m px-3 py-2 hover:bg-overlay"
                >
                  <span className="block text-body font-medium text-primary">{entry.title}</span>
                  {q && <Snippet text={entry.text} query={trimmed} />}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const Snippet = ({ text, query }: { text: string; query: string }) => {
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return null;
  const from = Math.max(0, index - SNIPPET_BEFORE);
  const chunk =
    (from > 0 ? "… " : "") + text.slice(from, index + SNIPPET_AFTER).trimEnd() + (index + SNIPPET_AFTER < text.length ? "…" : "");
  const parts = chunk.split(new RegExp(`(${escapeRegExp(query)})`, "i"));
  return (
    <p className="mt-0.5 line-clamp-2 text-caption leading-snug text-secondary">
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-transparent font-semibold text-accent">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </p>
  );
};
