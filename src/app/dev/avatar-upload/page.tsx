"use client";

import { useState, useRef } from "react";
import { useWalletClient } from "wagmi";
import { isAddress } from "viem";
import Uploader from "@/components/Uploader/Uploader";
import { Button } from "@/components/Button/Button";
import {
  requestUploadLink,
  uploadToIpfs,
  setupTokenAvatar,
} from "@/utils/avatar-api";
import { AVATAR_SIGN_DOMAIN, AVATAR_SIGN_TYPES } from "@/constants/avatar";
import { getAddresses } from "@/contracts/contract-addresses";

type Status = { type: "idle" } | { type: "loading"; message: string } | { type: "error"; message: string } | { type: "success"; message: string };

export default function AvatarUploadPage() {
  const [tokenAddress, setTokenAddress] = useState("");
  const { data: walletClient } = useWalletClient();
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const fileRef = useRef<File | null>(null);

  const handleUpload = async () => {
    if (!walletClient) {
      setStatus({ type: "error", message: "Connect your wallet first" });
      return;
    }
    if (!isAddress(tokenAddress)) {
      setStatus({ type: "error", message: "Invalid token address" });
      return;
    }
    if (!fileRef.current) {
      setStatus({ type: "error", message: "Select an image file first" });
      return;
    }

    const chainId = walletClient.chain.id;
    let addresses;
    try {
      addresses = getAddresses(chainId);
    } catch {
      setStatus({ type: "error", message: `Unsupported chain: ${chainId}` });
      return;
    }

    setStatus({ type: "loading", message: "Requesting upload link..." });
    try {
      const { upload_url } = await requestUploadLink();
      setStatus({ type: "loading", message: "Uploading to IPFS..." });
      const cid = await uploadToIpfs(fileRef.current, upload_url);
      setStatus({ type: "loading", message: "Signing with wallet..." });
      const signature = await walletClient.signTypedData({
        domain: {
          ...AVATAR_SIGN_DOMAIN,
          chainId,
          verifyingContract: addresses.tokenFactory,
        },
        types: AVATAR_SIGN_TYPES,
        primaryType: "SetupAvatar",
        message: { token: tokenAddress as `0x${string}`, cid },
      });
      setStatus({ type: "loading", message: "Setting avatar on-chain..." });
      await setupTokenAvatar(tokenAddress as `0x${string}`, cid, signature, chainId);
      setStatus({ type: "success", message: "Avatar set successfully!" });
    } catch (e) {
      setStatus({ type: "error", message: e instanceof Error ? e.message : "Upload failed" });
    }
  };

  const statusColor =
    status.type === "error" ? "text-red-400" : status.type === "success" ? "text-green-400" : "text-gray-400";

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
      <h1 className="text-heading-2xl text-primary">Upload Token Avatar</h1>

      <label className="flex flex-col gap-2">
        <span className="text-body-l text-secondary">Token Address</span>
        <input
          className="rounded border border-muted bg-black px-4 py-3 text-body text-primary outline-none focus:border-accent"
          placeholder="0x..."
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
        />
      </label>

      <Uploader
        onUpload={(f) => { fileRef.current = f; }}
        onRemove={() => { fileRef.current = null; }}
      />

      <Button
        onClick={handleUpload}
        disabled={status.type === "loading"}
        size="l"
      >
        {status.type === "loading" ? "Uploading..." : "Upload Avatar"}
      </Button>

      {status.type !== "idle" && (
        <p className={`text-body leading-6 ${statusColor}`}>
          {status.message}
        </p>
      )}
    </div>
  );
}