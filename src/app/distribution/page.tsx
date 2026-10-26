"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, notFound } from "next/navigation";
import { isAddress, zeroAddress } from "viem";
import { usePublicClient } from "wagmi";
import { IconLoader2 } from "@tabler/icons-react";
import DistributionDetailV2 from "@/components/DistributionDetailV2/DistributionDetailV2";
import MainnetHeader from "@/components/MainnetHeader/MainnetHeader";
import MainnetFooter from "@/components/MainnetFooter/MainnetFooter";
import { getDistributionV1FactoryContract } from "@/contracts/contracts";
import { chainNameToId } from "@/utils/chain-utils";

type Deployment = "checking" | "sqrtdao" | "external";

function DistributionContent() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const chain = searchParams.get("chain");
  // chain is mandatory: resolve it from the URL so the factory lookup runs on
  // the same chain the distribution lives on.
  const chainId = chainNameToId(chain);
  const publicClient = usePublicClient(chainId ? { chainId } : undefined);

  const [deployment, setDeployment] = useState<Deployment>("checking");

  // Only distributions deployed by sqrtDAO's DistributionV1Factory are served:
  // creatorOf(distributor) is set for ours and zero for anything else.
  useEffect(() => {
    if (!address || !isAddress(address) || chainId === undefined || !publicClient)
      return;
    let active = true;
    getDistributionV1FactoryContract(publicClient)
      .read.creatorOf([address])
      .then((creator) => {
        if (!active) return;
        if (creator === zeroAddress) {
          console.error(
            `Distribution ${address} on chain ${chainId} was not deployed by sqrtDAO's DistributionV1Factory (creatorOf returned the zero address)`,
          );
          setDeployment("external");
          return;
        }
        setDeployment("sqrtdao");
      })
      .catch((error) => {
        if (!active) return;
        // An RPC failure is not proof the distribution is foreign, so keep the
        // page instead of 404-ing a legitimate distribution.
        console.error(
          `Failed to verify distribution ${address} on chain ${chainId} against DistributionV1Factory`,
          error,
        );
        setDeployment("sqrtdao");
      });
    return () => {
      active = false;
    };
  }, [address, chainId, publicClient]);

  // Invalid address, unsupported/missing chain, or a distribution we did not deploy.
  if (!address || !isAddress(address) || chainId === undefined) notFound();
  if (deployment === "external") notFound();

  if (deployment === "checking") {
    return (
      <div className="flex h-dvh flex-col overflow-y-auto bg-canvas">
        <MainnetHeader />
        <div className="flex flex-1 items-center justify-center">
          <IconLoader2 size={32} className="animate-spin text-tertiary" />
        </div>
        <MainnetFooter />
      </div>
    );
  }

  // A different distribution (or chain) is a different page: remount so no
  // contract-scoped state — chart pages, forms, claims — leaks across.
  return (
    <DistributionDetailV2
      key={`${chain}:${address}`}
      contractAddress={address}
      chainSlug={chain}
    />
  );
}

export default function DistributionPage() {
  return (
    <Suspense>
      <DistributionContent />
    </Suspense>
  );
}
