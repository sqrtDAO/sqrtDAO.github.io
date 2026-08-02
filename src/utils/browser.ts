/**
 * Detects the WebKit rendering engine: desktop Safari, plus every iOS browser
 * (Chrome/Firefox/Edge on iOS all render via WebKit too, per Apple's App Store
 * policy, regardless of brand). `navigator.vendor` is Apple only for WebKit's
 * own browser UI; iOS browser wrappers keep their own vendor string, so they're
 * excluded via their UA tokens (CriOS/FxiOS/EdgiOS/OPiOS) even though they
 * share the same underlying renderer.
 */
export function isWebKit(): boolean {
  if (typeof navigator === "undefined") return false;
  const isApple = navigator.vendor === "Apple Computer, Inc.";
  const isChromiumOrGeckoWrapper = /CriOS|FxiOS|EdgiOS|OPiOS/.test(navigator.userAgent);
  return isApple && !isChromiumOrGeckoWrapper;
}
