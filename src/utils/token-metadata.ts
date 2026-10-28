import { avatarHttpsUrl } from "@/constants/avatar";

type TokenMetadataInput = {
  name: string;
  symbol: string;
  description?: string;
  /** Stored avatar value (`ipfs://<cid>` or an https URL). */
  avatar?: string;
  website?: string;
};

const toBase64 = (value: string): string => {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
};

/**
 * Builds the reserved `"metadata"` value for a new TokenV1. MetadataStore
 * serves this one value from `metadata()` (ERC-7729), `contractURI()`
 * (ERC-7572) and `tokenURI()` (EIP-1046) — without it those getters return "".
 * Images are resolved to a plain https URL because consumers reject `ipfs://`.
 */
export const buildTokenMetadataUri = ({
  name,
  symbol,
  description,
  avatar,
  website,
}: TokenMetadataInput): string => {
  const image = avatarHttpsUrl(avatar);
  const payload: Record<string, string> = { name, symbol };
  if (description?.trim()) payload.description = description.trim();
  if (image) payload.image = image;
  if (website?.trim()) payload.external_url = website.trim();
  return `data:application/json;base64,${toBase64(JSON.stringify(payload))}`;
};

/** Editable profile keys stored as plain metadata entries on the token. */
export type TokenProfile = {
  avatar: string;
  description: string;
  website: string;
  github: string;
  x: string;
  discord: string;
};

export const EMPTY_PROFILE: TokenProfile = {
  avatar: "",
  description: "",
  website: "",
  github: "",
  x: "",
  discord: "",
};

/** Narrows an arbitrary on-chain metadata key to an editable profile field. */
export const isTokenProfileKey = (key: string): key is keyof TokenProfile =>
  Object.hasOwn(EMPTY_PROFILE, key);

/** Every profile entry plus the reserved `"metadata"` one derived from it. */
export const tokenMetadataEntries = (name: string, symbol: string, profile: TokenProfile) => [
  { key: "metadata", value: buildTokenMetadataUri({ name, symbol, ...profile }) },
  ...Object.entries(profile).map(([key, value]) => ({ key, value })),
];

type MetadataPair = { key: string; value: string };

const toMetadataMap = (entries: readonly MetadataPair[]) =>
  Object.fromEntries(
    entries
      .filter((entry) => entry.value.trim() !== "")
      .map((entry) => [entry.key, entry.value.trim()]),
  );

/** Token metadata is the fallback; distribution metadata wins per key. */
export const mergeMetadata = (
  fallback: readonly MetadataPair[],
  override: readonly MetadataPair[],
): Record<string, string> => ({
  ...toMetadataMap(fallback),
  ...toMetadataMap(override),
});
