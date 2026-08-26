"use client";

import { Suspense, useState, useCallback } from "react";
import { useSearchParams, notFound } from "next/navigation";
import { Address, isAddress } from "viem";
import {
  useWalletClient,
  usePublicClient,
} from "wagmi";
import Header from "@/components/Header/Header";
import { Button } from "@/components/Button/Button";
import { getDistributorV1Contract } from "@/contracts/contracts";

function DrainContent() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  if (!address || !isAddress(address)) notFound();

  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [drainState, setDrainState] = useState<"idle" | "draining" | "done" | "error">("idle");
  const [txHash, setTxHash] = useState<string>("");

  const handleDrain = useCallback(async () => {
    if (!walletClient || !publicClient) return;
    setDrainState("draining");
    try {
      const distributor = getDistributorV1Contract(walletClient, address as Address);
      const tx = await distributor.write.callDrainHook({
        account: walletClient.account,
        chain: walletClient.chain,
      });
      setTxHash(tx);
      const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
      if (receipt.status === "reverted") {
        throw new Error("on-chain revert");
      }
      setDrainState("done");
    } catch (e) {
      console.error("Drain failed:", e);
      setDrainState("error");
    }
  }, [walletClient, publicClient, address]);

  return (
    <div className="p-8">
      <Header />
      <div className="max-w-md mx-auto mt-16">
        <h1 className="text-2xl font-bold mb-4">Distribution Drain</h1>
        <p className="text-gray-400 mb-8">Contract: {address}</p>
        <Button
          variant="primary"
          size="m"
          disabled={drainState === "draining"}
          onClick={handleDrain}
        >
          {drainState === "draining" ? "Draining..." : drainState === "done" ? "Done" : "Drain"}
        </Button>
        {drainState === "error" && (
          <p className="text-red-500 mt-4">
            Drain failed. Please try again.
            {txHash && (
              <span className="block break-all mt-1">Transaction: {txHash}</span>
            )}
          </p>
        )}
        {drainState === "done" && txHash && (
          <p className="mt-4 break-all text-white">
            Transaction: {txHash}
          </p>
        )}
      </div>
    </div>
  );
}

export default function DistributionDrainPage() {
  return (
    <Suspense>
      <DrainContent />
    </Suspense>
  );
}
