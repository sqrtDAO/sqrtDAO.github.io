"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import AboutTokenDialog from "@/components/AboutTokenDialog/AboutTokenDialog";
import { Button } from "@/components/Button/Button";
import ClaimCard, {
  type ClaimCardProps,
} from "@/components/ClaimCard/ClaimCard";
import ClaimParticipationPanel from "@/components/ClaimParticipationPanel/ClaimParticipationPanel";
import DistributionHeader, {
  type DistributionHeaderProps,
} from "@/components/DistributionHeader/DistributionHeader";
import DistributionOverview, {
  type DdpState,
  type DistributionOverviewProps,
} from "@/components/DistributionOverview/DistributionOverview";
import EpochBlockChart from "@/components/EpochBlockChart/EpochBlockChart";
import EpochChartLegend from "@/components/EpochChartLegend/EpochChartLegend";
import EpochDetailDialogV2 from "@/components/EpochDetailDialogV2/EpochDetailDialogV2";
import EpochStatsCard, {
  type EpochStatsCardProps,
} from "@/components/EpochStatsCard/EpochStatsCard";
import FaqSection from "@/components/FaqSection/FaqSection";
import FundSplitBar, {
  type FundSplit,
} from "@/components/FundSplitBar/FundSplitBar";
import FundSplitDialog from "@/components/FundSplitDialog/FundSplitDialog";
import MainnetFooter from "@/components/MainnetFooter/MainnetFooter";
import MainnetHeader from "@/components/MainnetHeader/MainnetHeader";
import NativeTokenBanner from "@/components/NativeTokenBanner/NativeTokenBanner";
import type { ParticipationCardProps } from "@/components/ParticipationCard/ParticipationCard";
import ParticipationReviewDialogV2 from "@/components/ParticipationReviewDialogV2/ParticipationReviewDialogV2";
import type { DistributionStatus } from "@/components/Status/Status";
import { BODY_M } from "@/constants/typography";
import { useCountdown } from "@/hooks/useCountdown";
import type { EpochData } from "@/lib/charts/types";

const EpochComboChart = dynamic(
  () => import("@/components/EpochComboChart/EpochComboChart"),
  { ssr: false },
);

export type MainnetDdpData = {
  header: Omit<DistributionHeaderProps, "status">;
  overview: Omit<DistributionOverviewProps, "state" | "countdown">;
  countdownTargetMs: number;
  epochStats: Omit<EpochStatsCardProps, "children" | "epochLabel">;
  legend: React.ComponentProps<typeof EpochChartLegend>;
  epochs: EpochData[];
  tokenSymbol: string;
  tokenDecimals: number;
  quoteSymbol: string;
  quoteDecimals: number;
  /** A claim is in flight (drives the epoch dialog's loading state). */
  claiming?: boolean;
  split: FundSplit;
  claim?: ClaimCardProps;
  participation: Omit<
    ParticipationCardProps,
    "connected" | "disabled" | "onParticipate"
  >;
  review: Omit<
    React.ComponentProps<typeof ParticipationReviewDialogV2>,
    "imported" | "onClose"
  >;
  about: string;
  epochDurationSec: number;
  lastClearPrice: number;
};

type MainnetDdpProps = {
  variant: "native" | "imported";
  state: DdpState;
  connected: boolean;
  data: MainnetDdpData;
  epochActions?: {
    onParticipate?: (epoch: number) => void;
    onClaim?: (epoch: number) => void;
  };
};

type Dialog = "split" | "about" | "review" | "participate" | null;

const STATUS: Record<DdpState, DistributionStatus> = {
  upcoming: "upcoming",
  live: "live",
  finished: "ended",
};

// Figma 10690:87344 / 14640:107403 (imported) and 10690:87464 / 14639:105593 (native).
// Fully wired: the caller supplies contract-derived `data` plus handlers.
const MainnetDdp = ({ variant, state, connected, data, epochActions }: MainnetDdpProps) => {
  const [dialog, setDialog] = useState<Dialog>(null);
  const [edd, setEdd] = useState<EpochData | null>(null);
  const countdown = useCountdown(data.countdownTargetMs);
  const close = () => setDialog(null);
  const native = variant === "native";
  const claim = state === "upcoming" ? undefined : data.claim;
  const participation = {
    ...data.participation,
    connected,
    disabled: state === "finished",
    onParticipate: () => setDialog("review"),
  };

  return (
    <div className="flex h-dvh flex-col overflow-y-auto bg-canvas">
      <MainnetHeader />
      <main className="mx-auto flex w-full flex-1 gap-6 xl:max-w-330 xl:pt-4 xl:pb-6">
        <div className="flex min-w-0 flex-1 flex-col xl:w-218 xl:flex-none">
          <DistributionHeader {...data.header} status={STATUS[state]} />

          <div className="flex flex-col gap-2">
            {native && (
              <NativeTokenBanner onLearnMore={() => setDialog("about")} />
            )}

            <section className="flex flex-col gap-6 px-4 py-6 xl:px-0 xl:py-4">
              {claim && (
                <div className="xl:hidden">
                  <ClaimCard {...claim} />
                </div>
              )}
              <DistributionOverview
                {...data.overview}
                state={state}
                countdown={countdown}
              />
              <span className="xl:hidden">
                <Button
                  variant="primary"
                  size="m"
                  fullWidth
                  disabled={state === "finished"}
                  onClick={() => setDialog("participate")}
                >
                  Participate
                </Button>
              </span>
            </section>

            <section className="flex flex-col gap-4 bg-surface px-2 py-4 xl:gap-0 xl:p-2">
              {state !== "upcoming" && (
                <div className="order-2 xl:order-1">
                  <EpochStatsCard
                    {...data.epochStats}
                    epochLabel={
                      state === "finished" ? "Last epoch" : "Current epoch"
                    }
                  >
                    <EpochComboChart
                      epochs={data.epochs}
                      quoteSymbol={data.quoteSymbol}
                      tokenSymbol={data.tokenSymbol}
                      onSelectEpoch={setEdd}
                    />
                  </EpochStatsCard>
                </div>
              )}
              <div className="order-1 px-2 py-3 xl:order-2 xl:px-6 xl:py-5">
                <EpochChartLegend {...data.legend}>
                  <EpochBlockChart
                    epochs={data.epochs}
                    quoteSymbol={data.quoteSymbol}
                    tokenSymbol={data.tokenSymbol}
                    onSelectEpoch={setEdd}
                  />
                </EpochChartLegend>
              </div>
            </section>

            <section className="flex flex-col gap-2.5 px-4 py-6 xl:px-6 xl:py-5">
              <h2 className="font-display text-h3 text-primary">
                About this project
              </h2>
              <p className={`${BODY_M} text-secondary`}>{data.about}</p>
            </section>

            <FaqSection />
          </div>
        </div>

        <aside className="hidden w-106 shrink-0 flex-col gap-6 xl:flex">
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5 py-1">
              <h2 className="flex-1 font-display text-h3 text-primary">
                Epoch fund split
              </h2>
              <Button
                variant="ghost"
                size="s"
                onClick={() => setDialog("split")}
              >
                Details
              </Button>
            </div>
            <FundSplitBar split={data.split} />
          </section>
          <ClaimParticipationPanel
            claim={claim}
            participation={participation}
          />
        </aside>
      </main>
      <MainnetFooter />

      {dialog === "participate" && (
        // Mobile: the right-column panel as a sheet, like the live DDP's dialogue.
        <div
          className="fixed inset-0 z-40 flex items-end bg-canvas/90 xl:hidden"
          onClick={close}
        >
          <div className="w-full" onClick={(e) => e.stopPropagation()}>
            <ClaimParticipationPanel participation={participation} />
          </div>
        </div>
      )}
      {dialog === "split" && (
        <FundSplitDialog split={data.split} onClose={close} />
      )}
      {dialog === "about" && <AboutTokenDialog onClose={close} />}
      {dialog === "review" && (
        <ParticipationReviewDialogV2
          {...data.review}
          imported={!native}
          onClose={close}
          onConfirm={async () => {
            const result = await data.review.onConfirm?.();
            if (result !== false) close();
          }}
        />
      )}
      {edd && (
        <EpochDetailDialogV2
          epoch={edd}
          epochEndMs={data.countdownTargetMs}
          epochDurationSec={data.epochDurationSec}
          lastClearPrice={data.lastClearPrice}
          tokenSymbol={data.tokenSymbol}
          tokenDecimals={data.tokenDecimals}
          quoteSymbol={data.quoteSymbol}
          quoteDecimals={data.quoteDecimals}
          claiming={data.claiming ?? false}
          onClose={() => setEdd(null)}
          onParticipateClick={() => epochActions?.onParticipate?.(edd.epoch)}
          onClaimClick={() => epochActions?.onClaim?.(edd.epoch)}
        />
      )}
    </div>
  );
};

export default MainnetDdp;
