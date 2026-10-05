import type { Address, PublicClient } from "viem";
import { importer } from "ipfs-unixfs-importer";
import { MemoryBlockstore } from "blockstore-core/memory";
import { tokenV1Abi } from "@/contracts/abis";
import { AVATAR_API_BASE, AVATAR_IPFS_GATEWAY } from "@/constants/avatar";

type UploadLinkResponse = {
  upload_url: string;
  expires_in: number;
  max_file_size: number;
  allowed_mime_types: string[];
};

type PinataUploadResponse = {
  data: { cid: string };
};

const toError = async (res: Response): Promise<Error> => {
  const text = await res.text();
  try {
    return new Error(JSON.parse(text).error ?? text);
  } catch {
    return new Error(text || res.statusText);
  }
};

/** Predicts the CIDv1 the Pinata upload will produce (Pinata's v1 recipe). */
export const predictCid = async (file: File): Promise<string> => {
  const blockstore = new MemoryBlockstore();
  const content = new Uint8Array(await file.arrayBuffer());
  let rootCid = "";
  for await (const result of importer([{ content }], blockstore, {
    cidVersion: 1,
    rawLeaves: true,
  })) {
    rootCid = result.cid.toString();
  }
  if (!rootCid) throw new Error("Could not compute avatar CID");
  return rootCid;
};

export const requestUploadLink = async (
  token: Address,
  cid: string,
  chainId: number,
): Promise<UploadLinkResponse> => {
  const params = new URLSearchParams({
    token,
    cid,
    chain_id: String(chainId),
  });
  const res = await fetch(
    `${AVATAR_API_BASE}/token-avatar/get-upload-link/?${params.toString()}`,
  );
  if (!res.ok) throw await toError(res);
  return res.json();
};

export const uploadToIpfs = async (
  file: File,
  uploadUrl: string,
): Promise<string> => {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(uploadUrl, { method: "POST", body: form });
  if (!res.ok) throw await toError(res);
  const { data } = (await res.json()) as PinataUploadResponse;
  return data.cid;
};

/** Reads the `avatar` entry from the token's on-chain metadata. */
export const readTokenAvatar = async (
  publicClient: PublicClient,
  token: Address,
): Promise<string | null> => {
  const entries = await publicClient.readContract({
    address: token,
    abi: tokenV1Abi,
    functionName: "getAllMetadata",
  });
  const avatar = entries.find((entry) => entry.key === "avatar")?.value;
  if (!avatar) return null;
  const cid = avatar.startsWith("ipfs://") ? avatar.slice("ipfs://".length) : avatar;
  return cid ? `${AVATAR_IPFS_GATEWAY}${cid}` : null;
};
