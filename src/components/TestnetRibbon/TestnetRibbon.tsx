"use client";

import { useRouter } from "next/navigation";
import { IconChevronRight } from "@tabler/icons-react";
import { useAccount, useSwitchChain } from "wagmi";
import { DEFAULT_CHAIN } from "@/constants/ecosystems";
import { DISTRIBUTION_LIST } from "@/constants/links";
import { BODY_S } from "@/constants/typography";
import { useActiveChainId, useSetChainParam } from "@/hooks/useActiveChain";
import { chainToName, isTestnet } from "@/utils/chain-utils";

type TestnetRibbonProps = {
  /** Stay on this page when going back to mainnet (launch step 1, import). */
  stay?: boolean;
};

const SHADE = "pointer-events-none absolute inset-y-0 w-6 from-(--color-infra-300) xl:w-18";

// Figma 16799:107739 — version 2 (desktop + mobile).
const TestnetRibbon = ({ stay = false }: TestnetRibbonProps) => {
  const { chainId } = useActiveChainId();
  const { isConnected } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const setChainParam = useSetChainParam();
  const router = useRouter();
  if (!isTestnet(chainId)) return null;

  const message = (
    <span className={`${BODY_S} text-on-amber`}>
      <strong>Testnet</strong> · {chainToName(chainId!)} · everything here runs on test funds.
      Nothing is real.
    </span>
  );

  const backToMainnet = async () => {
    if (isConnected) {
      try {
        await switchChainAsync({ chainId: DEFAULT_CHAIN.id });
      } catch {
        return; // rejected in the wallet — stay on testnet
      }
    }
    if (stay) setChainParam(DEFAULT_CHAIN.id);
    else router.push(DISTRIBUTION_LIST);
  };

  return (
    <div role="status" className="bg-(--color-infra-300) px-4 py-1 xl:px-0">
      <div className="mx-auto flex w-full max-w-325 items-center">
        <div className="relative flex min-w-0 flex-1 overflow-hidden">
          <div className="flex w-max animate-marquee whitespace-nowrap hover:[animation-play-state:paused] motion-reduce:animate-none">
            {[0, 1].map((half) => (
              <div key={half} aria-hidden={half === 1} className="flex gap-12 pr-12">
                {message}
                {message}
                {message}
              </div>
            ))}
          </div>
          <span className={`${SHADE} left-0 bg-linear-to-r`} />
          <span className={`${SHADE} right-0 bg-linear-to-l`} />
        </div>
        <button
          type="button"
          onClick={backToMainnet}
          className="flex shrink-0 items-center rounded-s bg-canvas px-2 py-1.5 text-body-s leading-4 font-medium tracking-[0.02em] text-primary hover:bg-surface"
        >
          <span className="px-1">
            <span className="xl:hidden">Mainnet</span>
            <span className="hidden xl:inline">Back to mainnet</span>
          </span>
          <IconChevronRight size={14} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default TestnetRibbon;
