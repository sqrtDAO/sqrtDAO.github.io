export const AVATAR_API_BASE = "https://api.sqrtdao.org";

export const AVATAR_ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
];

export const AVATAR_MAX_FILE_SIZE = 5 * 1024 * 1024;

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
