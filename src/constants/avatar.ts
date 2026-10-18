export const AVATAR_API_BASE = "https://api.sqrtdao.org";

/**
 * Gateways to resolve `ipfs://<cid>` avatars, tried in order until one loads.
 * Avatars are pinned through Pinata, so its standard CDN gateway comes first.
 * A dedicated Pinata gateway can be supplied via NEXT_PUBLIC_IPFS_GATEWAY
 * (e.g. https://<subdomain>.mypinata.cloud/ipfs/) and is preferred when set.
 */
const DEDICATED_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY;
const PINATA_GATEWAY = "https://gateway.pinata.cloud/ipfs/";

export const ipfsGatewayUrls = (cid: string): string[] => [
  ...(DEDICATED_GATEWAY ? [`${DEDICATED_GATEWAY.replace(/\/?$/, "/")}${cid}`] : []),
  `${PINATA_GATEWAY}${cid}`,
  `https://${cid}.ipfs.dweb.link/`,
  `https://${cid}.ipfs.w3s.link/`,
  `https://ipfs.io/ipfs/${cid}`,
];

/**
 * Turns a stored avatar value into an ordered list of fetchable URLs.
 * `ipfs://<cid>` expands to the gateway list; http(s) URLs pass through.
 * Returns [] when there's nothing to load (callers show their own fallback).
 */
export const avatarImageCandidates = (imageUrl?: string): string[] => {
  if (!imageUrl) return [];
  const v = imageUrl.trim();
  if (!v) return [];
  if (v.startsWith("ipfs://")) return ipfsGatewayUrls(v.slice("ipfs://".length));
  return [v];
};

/**
 * First fetchable HTTPS URL for a stored avatar value. Wallets reject
 * `ipfs://`, so anything handed to `wallet_watchAsset` must go through this.
 */
export const avatarHttpsUrl = (imageUrl?: string): string | undefined =>
  avatarImageCandidates(imageUrl)[0];



export const AVATAR_ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
];

export const AVATAR_MAX_FILE_SIZE = 5 * 1024 * 1024;

export const AVATAR_CROP_SIZE = 500;

export const AVATAR_SIGN_DOMAIN = {
  name: "sqrtDAO Avatars",
  version: "1",
} as const;

export const AVATAR_SIGN_TYPES = {
  SetupAvatar: [
    { name: "token", type: "address" },
    { name: "cid", type: "string" },
  ],
} as const;
