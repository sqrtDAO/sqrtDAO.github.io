import type { WalletLink } from "@/constants/wallet";

/** `wc:` pairing URI → the wallet's deep link. Universal links win (see wallet.ts). */
export const walletDeepLink = (link: WalletLink, uri: string) => {
  const template = link.universal ?? link.native;
  return template?.replace("{uri}", encodeURIComponent(uri));
};

export const openDeepLink = (url: string) => {
  window.location.assign(url);
};
