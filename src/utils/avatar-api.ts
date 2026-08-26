import type { Address } from "viem";
import { AVATAR_API_BASE } from "@/constants/avatar";

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

export const requestUploadLink = async (): Promise<UploadLinkResponse> => {
  const res = await fetch(`${AVATAR_API_BASE}/get-upload-link/`);
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

export const setupTokenAvatar = async (
  address: Address,
  cid: string,
): Promise<void> => {
  const res = await fetch(`${AVATAR_API_BASE}/setup-avatar/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, cid }),
  });
  if (!res.ok) throw await toError(res);
};

export const getTokenAvatar = async (
  address: Address,
): Promise<string | null> => {
  const res = await fetch(`${AVATAR_API_BASE}/get-avatar/?address=${address}`);
  if (res.status === 404) return null;
  if (!res.ok) throw await toError(res);
  const { avatar } = await res.json();
  return avatar;
};
