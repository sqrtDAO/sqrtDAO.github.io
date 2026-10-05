"use client";

import { Suspense, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, notFound } from "next/navigation";
import { Address, isAddress } from "viem";
import { useWalletClient, usePublicClient } from "wagmi";
import MainnetHeader from "@/components/MainnetHeader/MainnetHeader";
import { Button } from "@/components/Button/Button";
import { getDistributorV1Contract } from "@/contracts/contracts";
import { showToast } from "@/hooks/useToast";
import { getExplorerTxUrl } from "@/utils/explorer-utils";

type ReleaseState = "idle" | "releasing" | "done" | "error";

function ReleaseContent() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  if (!address || !isAddress(address)) notFound();

  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [state, setState] = useState<ReleaseState>("idle");
  const [txHash, setTxHash] = useState("");

  const explorerUrl =
    state === "done" && txHash && walletClient
      ? getExplorerTxUrl(walletClient.chain.id, txHash)
      : undefined;

  const onRelease = useCallback(async () => {
    if (!walletClient || !publicClient) return;
    const toastId = `release-${address}`;
    setState("releasing");
    showToast("release.pending", { id: toastId });
    try {
      const distributor = getDistributorV1Contract(
        walletClient,
        address as Address,
      );
      const hash = await distributor.write.releaseEpochFunds({
        account: walletClient.account,
        chain: walletClient.chain,
      });
      setTxHash(hash);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      if (receipt.status === "reverted") throw new Error("on-chain revert");
      setState("done");
      showToast("release.success", { id: toastId });
    } catch (e) {
      console.error("releaseEpochFunds failed:", e);
      setState("error");
      showToast("release.failed", { id: toastId });
    }
  }, [walletClient, publicClient, address]);

  return (
    <div className="flex h-dvh flex-col overflow-y-auto bg-canvas">
      <MainnetHeader />
      <main className="mx-auto flex w-full max-w-146 flex-col gap-4 px-4 py-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-h2 font-semibold tracking-[-0.01em] text-primary">
            Release epoch funds
          </h1>
          <p className="text-body-l leading-6 tracking-[0.02em] text-secondary">
            Sends each ended epoch&apos;s participation balance to the
            distribution&apos;s configured shares — price anchor (buy back &amp;
            burn), founder share and protocol fee.
          </p>
          <p className="text-body leading-6 tracking-[0.02em] text-tertiary">
            The distribution&apos;s <strong>releasePolicy</strong> decides who may
            call this. Launches use <strong>CreatorOrFactory</strong>, so connect as
            the creator or the factory operator.
          </p>
        </div>

        <p className="text-body leading-6 break-all text-primary">{address}</p>

        <div className="flex items-center gap-4">
          <Button
            variant="primary"
            size="m"
            disabled={state === "releasing"}
            onClick={onRelease}
          >
            {state === "releasing"
              ? "Releasing…"
              : state === "done"
                ? "Done"
                : "Release epoch funds"}
          </Button>
          <Link
            href={`/distribution?address=${address}`}
            className="sqrt-btn sqrt-btn--outline sqrt-btn--m"
          >
            <span className="sqrt-btn__label">Back to distribution</span>
          </Link>
        </div>

        {state === "error" && (
          <p className="text-body leading-6 text-danger">
            Release failed — you may not be allowed by the release policy, or there
            may be no ended epoch to release yet.
          </p>
        )}
        {state === "done" && (
          <p className="flex flex-wrap items-center gap-2 text-body leading-6 text-success">
            Epoch funds released.
            {explorerUrl && (
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline"
              >
                View transaction
              </a>
            )}
          </p>
        )}
      </main>
    </div>
  );
}

export default function DistributionFundReleasePage() {
  return (
    <Suspense>
      <ReleaseContent />
    </Suspense>
  );
}