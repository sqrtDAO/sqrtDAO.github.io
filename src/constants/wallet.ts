// WalletConnect Cloud project id. The public one is baked in as a fallback so
// local builds and previews work without extra setup.
export const WC_PROJECT_ID =
  process.env.NEXT_PUBLIC_WC_PROJECT_ID || "af0315795cabd9f168cf79b92e96863a";

export const DAPP_DESCRIPTION = "Fair-launch infrastructure for tokens.";

/** `{uri}` is replaced with the `wc:` pairing URI the wallet has to approve. */
export type WalletLink = { universal?: string; native?: string };

export type WalletDefinition = {
  id: string;
  label: string;
  hint: string;
  /** EIP-6963 rdns list, so a row can use an injected extension when present. */
  rdns?: string[];
  link?: WalletLink;
};

/**
 * WalletConnect wallets. Deep link templates come from the WalletConnect
 * Explorer registry.
 *
 * Universal (`https://…`) links are preferred over custom schemes on Android:
 * a custom-scheme intent usually starts the wallet in its own task, so "back"
 * lands on the wallet's home screen and the dapp tab is left in the background.
 * App Links keep the back stack pointing at the browser tab.
 */
export const WC_WALLETS: WalletDefinition[] = [
  {
    id: "metamask",
    label: "MetaMask",
    hint: "Extension or mobile app",
    rdns: ["io.metamask"],
    link: {
      universal: "https://metamask.app.link/wc?uri={uri}",
      native: "metamask://wc?uri={uri}",
    },
  },
  {
    id: "rabby",
    label: "Rabby",
    hint: "Extension or mobile app",
    rdns: ["io.rabby"],
    // Rabby registers the custom scheme only, there is no universal link.
    link: { native: "rabby://wc?uri={uri}" },
  },
  {
    id: "trust",
    label: "Trust Wallet",
    hint: "Mobile app",
    link: {
      universal: "https://link.trustwallet.com/wc?uri={uri}",
      native: "trust://wc?uri={uri}",
    },
  },
  {
    id: "rainbow",
    label: "Rainbow",
    hint: "Mobile app",
    link: {
      universal: "https://rnbwapp.com/wc?uri={uri}",
      native: "rainbow://wc?uri={uri}",
    },
  },
  {
    id: "zerion",
    label: "Zerion",
    hint: "Mobile app",
    link: {
      universal: "https://wallet.zerion.io/wc?uri={uri}",
      native: "zerion://wc?uri={uri}",
    },
  },
];

/** Wallets we can hand a `wc:` URI to directly from the phone's browser. */
export const DEEPLINK_WALLETS = WC_WALLETS.filter((wallet) => wallet.link);

export const findWallet = (id: string) => WC_WALLETS.find((wallet) => wallet.id === id);
