"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useClarityConsent } from "@/hooks/useClarityConsent";
import { setClarityTags, trackClarityEvent } from "@/utils/clarity";

const getPageType = (pathname: string) => {
  if (pathname === "/") return "landing";
  if (pathname.startsWith("/blog")) return "blog";
  if (pathname.startsWith("/docs")) return "docs";
  if (pathname.startsWith("/token-launch")) return "launch";
  if (pathname.startsWith("/distribution-launch")) return "distribution_launch";
  if (pathname.startsWith("/distribution")) return "distribution";
  return "other";
};

const getContentSlug = (pathname: string, pageType: string) => {
  if (pageType !== "blog" && pageType !== "docs") return undefined;
  return pathname.split("/").filter(Boolean).slice(1).join("/") || "index";
};

// App Router navigation doesn't reload the page, so tag every route explicitly.
const ClarityTracker = () => {
  const pathname = usePathname();
  const consented = useClarityConsent();

  useEffect(() => {
    if (!consented) return;
    const pageType = getPageType(pathname);
    setClarityTags({
      page: pathname,
      page_type: pageType,
      content_slug: getContentSlug(pathname, pageType),
    });
    trackClarityEvent(`page_view_${pageType}`);
  }, [consented, pathname]);

  return null;
};

export default ClarityTracker;
