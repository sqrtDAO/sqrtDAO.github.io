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
