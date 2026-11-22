const MOBILE_UA = /android|iphone|ipad|ipod|iemobile|mobile/i;

export const isMobileBrowser = () =>
  typeof navigator !== "undefined" && MOBILE_UA.test(navigator.userAgent);

/**
 * The MetaMask extension (or the MetaMask in-app browser) announces itself on
 * window.ethereum. wagmi drops MetaMask's EIP-6963 connector because the
 * MetaMask connector already claims its rdns, so this is how we know the row can
 * go through the extension instead of MetaMask Connect's QR code.
 */
export const hasInjectedMetaMask = () =>
  typeof window !== "undefined" &&
  Boolean((window as { ethereum?: { isMetaMask?: boolean } }).ethereum?.isMetaMask);

/** Any extension/dapp-browser provider on window.ethereum (EIP-1193). */
export const hasInjectedProvider = () =>
  typeof window !== "undefined" && Boolean((window as { ethereum?: unknown }).ethereum);
