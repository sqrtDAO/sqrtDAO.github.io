export const AVATAR_API_BASE = "https://api.sqrtdao.org";

/**
 * Gateways to resolve `ipfs://<cid>` avatars, tried in order until one loads.
 * NOTE: `gateway.pinata.cloud` (the deprecated shared gateway) does NOT serve
 * content pinned via Pinata's v3 files API, so it's a last resort. A dedicated
 * gateway can be supplied via NEXT_PUBLIC_IPFS_GATEWAY (e.g. https://x.mypinata.cloud/ipfs/).
 */
const DEDICATED_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY;

export const ipfsGatewayUrls = (cid: string): string[] => [
  ...(DEDICATED_GATEWAY ? [`${DEDICATED_GATEWAY.replace(/\/?$/, "/")}${cid}`] : []),
  `https://${cid}.ipfs.dweb.link/`,
  `https://${cid}.ipfs.w3s.link/`,
  `https://ipfs.io/ipfs/${cid}`,
  `https://gateway.pinata.cloud/ipfs/${cid}`,
];



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
