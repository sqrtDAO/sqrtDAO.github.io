import { debugLog } from "@/lib/wallet/debug";

// MetaMask Connect hands us the deeplink it wants for every wallet round trip:
//
//   connect/mwp?p=…   the initial connection request
//   connect/mwp?id=…  a request wake-up: this is what makes MetaMask re-attach the
//                     session socket and pick up the queued switch/sign/send
//
// Both must be opened as-is. Rewriting the `id=` links to a path-less universal
// link (an earlier workaround for MetaMask's splash-screen bug) brings the app to
// the foreground but never re-attaches the session, so the request is never read
// — that is why switching to Robinhood and every transaction died after 60s
// ("Transport request timed out") and only worked after killing MetaMask.
export const METAMASK_REOPEN_LINK = "https://link.metamask.io/";

/** `metaMask({ mobile: { preferredOpenLink } })` — every link the SDK opens. */
export const openMetaMaskLink = (deeplink: string) => {
  debugLog("metamask:open", deeplink.slice(0, 120));
  window.location.assign(deeplink);
};
