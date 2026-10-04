export const DISCORD_URL = "https://discord.gg/hsW64egPRJ";
export const X_URL = "https://x.com/sqrtDAO";
export const DISTRIBUTION_LIST = "/distribution-list";
export const TRY_TESTNET_HREF = "/launch-and-distribute";
export const DOCS_URL = "https://sqrtdao.org/docs/";
export const CLAIM_ROOT_DISCORD_URL =
  "https://discord.com/channels/1492604911991652442/1535964852814876672/1538950892626120797";
export const GITHUB_URL = "https://github.com/sqrtDAO";
export const LINKEDIN_URL = "#"; // TODO: real LinkedIn URL
export const BLOG_HREF = "/blog";

// Mainnet shells live under /dev/mainnet until the swap; repoint here.
export const MAINNET_LAUNCH_HREF = "/dev/mainnet/launch";
export const MAINNET_DISTRIBUTE_HREF = "/dev/mainnet/router";
export const MAINNET_IMPORT_HREF = "/dev/mainnet/import";
export const MAINNET_DISTRIBUTE_WIZARD_HREF = "/dev/mainnet/distribute";

export const MAINNET_NAV = {
  // Launch token opens the router, which branches to the launch or distribution wizard.
  launch: { label: "Launch token", href: MAINNET_DISTRIBUTE_HREF },
  testnet: { label: "Demo testnet", href: TRY_TESTNET_HREF },
  explore: { label: "Explore distributions", href: DISTRIBUTION_LIST },
  blog: { label: "Blog", href: BLOG_HREF },
  docs: { label: "Documentation", href: DOCS_URL },
};
