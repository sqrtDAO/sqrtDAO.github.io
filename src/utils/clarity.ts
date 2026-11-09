// Public by design: Clarity project IDs ship in the page HTML. The env var is
// only an override for previews / a different project, not a secret.
export const CLARITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "zagww469ze";

export const CLARITY_CONSENT_KEY = "sqrtdao.clarity-consent";
export const CLARITY_CONSENT_EVENT = "sqrtdao:clarity-consent";

export type ClarityConsent = "granted" | "denied";

export const subscribeToClarityConsent = (onChange: () => void) => {
  window.addEventListener(CLARITY_CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CLARITY_CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
};

type ClarityQueue = unknown[][];
type ClarityFn = ((...args: unknown[]) => void) & { q?: ClarityQueue };

declare global {
  interface Window {
    clarity?: ClarityFn;
  }
}

export const getClarityConsent = (): ClarityConsent | null => {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(CLARITY_CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
};

export const hasClarityConsent = () => getClarityConsent() === "granted";

// Clarity's snippet keeps calls made before clarity.js loads in a queue. Install
// the same stub as soon as consent is granted so early events and tags are not lost.
export const ensureClarityQueue = () => {
  if (typeof window === "undefined" || window.clarity) return;
  const stub = ((...args: unknown[]) => {
    stub.q = stub.q ?? [];
    stub.q.push(args);
  }) as ClarityFn;
  stub.q = [];
  window.clarity = stub;
};

export const setClarityConsent = (consent: ClarityConsent) => {
  if (typeof window === "undefined") return;
  if (consent === "granted") ensureClarityQueue();
  try {
    window.localStorage.setItem(CLARITY_CONSENT_KEY, consent);
  } catch {}
  window.clarity?.("consentv2", {
    ad_Storage: "denied",
    analytics_Storage: consent,
  });
  window.dispatchEvent(new Event(CLARITY_CONSENT_EVENT));
};

export const resetClarityConsent = () => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CLARITY_CONSENT_KEY);
  } catch {}
  window.clarity?.("consentv2", {
    ad_Storage: "denied",
    analytics_Storage: "denied",
  });
  window.dispatchEvent(new Event(CLARITY_CONSENT_EVENT));
};

export const trackClarityEvent = (event: string) => {
  if (typeof window === "undefined") return;
  window.clarity?.("event", event);
};

// Wallet address as the Clarity custom user ID, so the same wallet can be
// searched across sessions. Only call this after analytics consent.
export const identifyClarityUser = (customId: string) => {
  if (typeof window === "undefined") return;
  window.clarity?.("identify", customId);
};

export const setClarityTags = (tags: Record<string, string | string[] | undefined>) => {
  if (typeof window === "undefined") return;
  Object.entries(tags).forEach(([key, value]) => {
    if (value !== undefined) window.clarity?.("set", key, value);
  });
};

// On a return visit the consent is already stored, so install the queue before
// React effects run — otherwise early page tags are dropped until Clarity loads.
if (typeof window !== "undefined" && hasClarityConsent()) ensureClarityQueue();
