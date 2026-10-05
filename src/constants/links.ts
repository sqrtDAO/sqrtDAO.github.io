export const DISCORD_URL = "https://discord.gg/hsW64egPRJ";
export const X_URL = "https://x.com/sqrtDAO";
export const DISTRIBUTION_LIST = "/distribution-list";
export const DOCS_URL = "https://sqrtdao.org/docs/";
export const CLAIM_ROOT_DISCORD_URL =
  "https://discord.com/channels/1492604911991652442/1535964852814876672/1538950892626120797";
export const GITHUB_URL = "https://github.com/sqrtDAO";
export const BLOG_HREF = "/blog";

export const TOKEN_LAUNCH_HREF = "/token-launch";
export const DISTRIBUTION_LAUNCH_HREF = "/distribution-launch";
// Legacy landing CTAs ("Try it on testnet") now point at the mainnet launch flow.
// TODO(design): re-label these landing CTAs once the v1 landing lands.
export const TRY_TESTNET_HREF = TOKEN_LAUNCH_HREF;

export const MAINNET_NAV = {
  launch: { label: "Launch token", href: TOKEN_LAUNCH_HREF },
  distribute: { label: "Distribute token", href: DISTRIBUTION_LAUNCH_HREF },
  explore: { label: "Explore distributions", href: DISTRIBUTION_LIST },
  blog: { label: "Blog", href: BLOG_HREF },
  docs: { label: "Documentation", href: DOCS_URL },
};
