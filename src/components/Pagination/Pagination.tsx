"use client";

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { IconButton } from "@/components/IconButton/IconButton";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

type PageToken = number | "ellipsis";

const buildPageTokens = (current: number, total: number): PageToken[] => {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = [...new Set([1, total, current - 1, current, current + 1])]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);

  const tokens: PageToken[] = [];
  pages.forEach((page, i) => {
    if (i > 0 && page - pages[i - 1] > 1) tokens.push("ellipsis");
    tokens.push(page);
  });
  return tokens;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const tokens = buildPageTokens(currentPage, totalPages);

  return (
    <div className={`flex items-center gap-4 ${className ?? ""}`}>
      <IconButton
        aria-label="Previous page"
        disabled={currentPage <= 1}
        icon={<IconChevronLeft size={24} strokeWidth={1.75} />}
        onClick={() => onPageChange(currentPage - 1)}
        size="m"
        variant="outline"
      />
      <div className="flex items-center gap-1">
        {tokens.map((token, i) =>
          token === "ellipsis" ? (
             
            <span
              key={`ellipsis-${i}`}
              className="flex w-7 items-center justify-center py-1 text-body leading-[22px] text-tertiary"
            >
              …
            </span>
          ) : (
            <button
              key={token}
              aria-current={token === currentPage ? "page" : undefined}
              className={`flex w-7 items-center justify-center py-1 text-body leading-[22px] ${
                token === currentPage ? "text-primary" : "text-tertiary"
              }`}
              onClick={() => onPageChange(token)}
              type="button"
            >
              {token}
            </button>
          ),
        )}
      </div>
      <IconButton
        aria-label="Next page"
        disabled={currentPage >= totalPages}
        icon={<IconChevronRight size={24} strokeWidth={1.75} />}
        onClick={() => onPageChange(currentPage + 1)}
        size="m"
        variant="outline"
      />
    </div>
  );
}
