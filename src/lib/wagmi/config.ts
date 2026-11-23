import { createConfig } from "wagmi";
import { injected, metaMask, walletConnect } from "@wagmi/connectors";
import { DAPP_DESCRIPTION, WC_PROJECT_ID } from "@/constants/wallet";
import { SITE_NAME, SITE_URL } from "@/constants/site";
import { LIVE_CHAINS } from "@/utils/chain-utils";
import { RPC_URLS, transports } from "@/lib/wagmi/transports";
import { openMetaMaskLink } from "@/lib/wallet/metamask-link";

const appUrl = () => (typeof window === "undefined" ? SITE_URL : window.location.origin);
const appHref = () => (typeof window === "undefined" ? SITE_URL : window.location.href);

// MetaMask Connect forwards `chain.rpcUrls.default.http[0]` to the wallet as the
// endpoint it broadcasts through, so point every chain at the same endpoints the
// app reads from — a slow third-party default is what makes a send time out.
const chains = LIVE_CHAINS.map((chain) => {
  const urls = RPC_URLS[chain.id];
  return urls?.length
    ? { ...chain, rpcUrls: { ...chain.rpcUrls, default: { http: urls } } }
    : chain;
}) as typeof LIVE_CHAINS;

// Metadata is read lazily: the WalletConnect provider is created on the first
// connect, and `redirect` must point at the page the user is on *then*, so the
// wallet bounces them back to the same tab instead of leaving the browser in
// the background and opening the app on its home screen.
const dappMetadata = {
  name: SITE_NAME,
  description: DAPP_DESCRIPTION,
  icons: [`${SITE_URL}/og.png`],
  get url() {
    return appUrl();
  },
  get redirect() {
    return { universal: appHref() };
  },
};

const isBrowser = typeof window !== "undefined";

export const wagmiConfig = createConfig({
  chains,
  transports,
  ssr: true,
  connectors: [
    // MetaMask's own SDK (the one Uniswap ships): the extension through
    // EIP-6963, the mobile app through MetaMask Connect over its own relay.
    metaMask({
      dapp: { name: SITE_NAME, url: appUrl(), iconUrl: `${appUrl()}/og.png` },
      analytics: { enabled: false },
      // `metamask://connect/mwp?p=…` for the connection request (the App Link
      // form makes MetaMask treat the path as a dapp URL and drop the payload),
      // and a launcher-style wake link for the `id=` requests — see
      // `lib/wallet/metamask-link.ts`.
      mobile: { preferredOpenLink: openMetaMaskLink },
    }),
    // Everything else, and MetaMask too when the mobile app is old enough that
    // MetaMask Connect is not available. `showQrModal: false` — the pairing URI
    // is rendered by our own modal so deeplinks can be opened explicitly.
    //
    // Browser only: wagmi calls `connector.setup()` eagerly, and the
    // WalletConnect provider's storage constructor touches indexedDB, which
    // throws (and logs an unhandled rejection) while prerendering.
    ...(isBrowser
      ? [
          walletConnect({
            projectId: WC_PROJECT_ID,
            showQrModal: false,
            metadata: dappMetadata,
          }),
        ]
      : []),
    // Any other injected extension (and the wallet a dapp browser injects).
    injected(),
  ],
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
