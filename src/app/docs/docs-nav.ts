export const CONTRACTS_REPO_URL = "https://github.com/sqrtDAO/contracts";

export type DocNavItem = { path: string; label: string };
export type DocNavGroup = { label?: string; items: DocNavItem[] };

export const docsNav: DocNavGroup[] = [
  { items: [{ path: "/docs/", label: "Getting started" }] },
  {
    label: "Guides",
    items: [
      { path: "/docs/participate/", label: "How to participate" },
      { path: "/docs/launch-a-token/", label: "Launch a token" },
    ],
  },
  {
    label: "Core concepts",
    items: [
      { path: "/docs/epoch-distribution/", label: "Epoch-based distribution" },
      { path: "/docs/buy-back-and-burn/", label: "Buy back & burn" },
    ],
  },
  {
    label: "Reference",
    items: [
      { path: "/docs/contract-addresses/", label: "Contract addresses" },
      { path: "/docs/contracts-v1/", label: "Contracts v1" },
    ],
  },
  { items: [{ path: "/docs/faq/", label: "FAQ" }] },
  { items: [{ path: "/docs/glossary/", label: "Glossary" }] },
];

export const flatDocsNav = docsNav.flatMap((group) => group.items);
