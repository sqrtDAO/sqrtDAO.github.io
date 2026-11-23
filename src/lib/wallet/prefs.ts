// MetaMask Connect (its own relay + App Link) is the default on mobile. If it
// doesn't come back on some device, the user picks the WalletConnect fallback
// once and we keep using that on this browser instead of making them repeat it.
const METAMASK_TRANSPORT_KEY = "sqrtdao.metamask.transport";

export const metaMaskTransport = (): "connect" | "walletconnect" => {
  try {
    return localStorage.getItem(METAMASK_TRANSPORT_KEY) === "walletconnect"
      ? "walletconnect"
      : "connect";
  } catch {
    return "connect";
  }
};

export const preferWalletConnectTransport = () => {
  try {
    localStorage.setItem(METAMASK_TRANSPORT_KEY, "walletconnect");
  } catch {
    // private mode — the choice just won't stick
  }
};
