"use client";

import { useState } from "react";
import { IconCalendarShare } from "@tabler/icons-react";
import MainnetHeader from "@/components/MainnetHeader/MainnetHeader";
import NativeTokenBanner from "@/components/NativeTokenBanner/NativeTokenBanner";
import Alert from "@/components/Alert/Alert";
import ImportedTokenAlert from "@/components/ImportedTokenAlert/ImportedTokenAlert";
import ClaimCard from "@/components/ClaimCard/ClaimCard";
import ParticipationCard from "@/components/ParticipationCard/ParticipationCard";
import ClaimParticipationPanel from "@/components/ClaimParticipationPanel/ClaimParticipationPanel";
import EpochChartLegend from "@/components/EpochChartLegend/EpochChartLegend";
import EpochBlockChart from "@/components/EpochBlockChart/EpochBlockChart";
import EpochDetailDialogV2 from "@/components/EpochDetailDialogV2/EpochDetailDialogV2";
import { Button } from "@/components/Button/Button";
import type { EpochData, EpochState } from "@/lib/charts/types";
import { CHART_EPOCHS, LEGEND, PARTICIPATION } from "../_preview/ddp-mocks";

const E18 = 10n ** 18n;
const eddEpoch = (
  state: EpochState,
  variant: "participated" | "normal" | "zero",
): EpochData => ({
  epoch: 234,
  state,
  participationAmount: variant === "zero" ? 0n : 20_000n * E18,
  clearPrice: 0.002,
  supply: 12,
  supplyAmount: 12n * E18,
  participants: variant === "zero" ? 0 : 23,
  participated: variant === "participated",
  userParticipationAmount: variant === "participated" ? 2_400n * E18 : 0n,
  claimed: false,
  timestamp: 0,
});
const EDD_STATES: EpochState[] = ["current", "future", "passed"];
const EDD_VARIANTS = ["participated", "normal", "zero"] as const;

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="flex w-full flex-col gap-4">
    <h2 className="font-display text-h4 text-secondary">{title}</h2>
    {children}
  </section>
);

const DdpComponentsPage = () => {
  const [edd, setEdd] = useState<EpochData | null>(null);
  const [epochEndMs] = useState(() => Date.now() + 2 * 3600_000 + 42 * 60_000);

  return (
    <div className="flex h-dvh flex-col overflow-y-auto bg-canvas">
      <MainnetHeader />
      <main className="mx-auto flex w-full flex-col gap-12 px-4 py-8 xl:max-w-330 xl:px-0">
        <Section title="Native token banner (bg-kasumi)">
          <div className="-mx-4 xl:mx-0 xl:max-w-218">
            <NativeTokenBanner onLearnMore={() => {}} />
          </div>
        </Section>

        <Section title="Alerts">
          <div className="flex flex-col gap-6 xl:max-w-100.5">
            <ImportedTokenAlert />
            <Alert
              tone="info"
              title="Claim delay is 21 days"
              description="You can claim your [TOKEN] share after 21 June 2026, 12:34 UTC."
              action={
                <Button
                  variant="ghost"
                  size="s"
                  leadingIcon={<IconCalendarShare size={14} />}
                >
                  Add to calendar
                </Button>
              }
            />
          </div>
        </Section>

        <Section title="Claim card (bg-sumi) — ready / claiming / done">
          <div className="flex flex-col gap-6 xl:flex-row">
            {(["ready", "claiming", "done"] as const).map((state) => (
              <div key={state} className="w-full xl:w-102">
                <ClaimCard state={state} amount="20,000,000" symbol="USDT" />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Participation card — not connected / connected / disabled">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
            <div className="w-full xl:w-102">
              <ParticipationCard {...PARTICIPATION} />
            </div>
            <div className="w-full xl:w-102">
              <ParticipationCard {...PARTICIPATION} connected />
            </div>
            <div className="w-full xl:w-102">
              <ParticipationCard {...PARTICIPATION} disabled />
            </div>
          </div>
        </Section>

        <Section title="Claim & participation panel">
          <ClaimParticipationPanel
            claim={{ state: "ready", amount: "20,000,000", symbol: "USDT" }}
            participation={{ ...PARTICIPATION, connected: true }}
          />
        </Section>

        <Section title="Epoch chart legend (around the locked EpochBlockChart)">
          <div className="rounded-(--radius-l) bg-surface p-4 xl:max-w-214 xl:px-6 xl:py-5">
            <EpochChartLegend {...LEGEND}>
              <EpochBlockChart
                epochs={CHART_EPOCHS}
                quoteSymbol="USDT"
                tokenSymbol="TOKEN"
              />
            </EpochChartLegend>
          </div>
        </Section>

        <Section title="Epoch detail dialog V2 — click to open">
          <div className="grid grid-cols-3 gap-2 xl:max-w-150">
            {EDD_STATES.flatMap((state) =>
              EDD_VARIANTS.map((variant) => (
                <Button
                  key={`${state}-${variant}`}
                  variant="outline"
                  size="s"
                  onClick={() => setEdd(eddEpoch(state, variant))}
                >
                  {
                    { current: "Live", future: "Upcoming", passed: "Closed" }[
                      state
                    ]
                  }{" "}
                  · {variant}
                </Button>
              )),
            )}
          </div>
        </Section>
      </main>

      {edd && (
        <EpochDetailDialogV2
          epoch={edd}
          epochEndMs={epochEndMs}
          epochDurationSec={1200}
          lastClearPrice={0.002}
          tokenSymbol="TOKEN"
          tokenDecimals={18}
          quoteSymbol="USDT"
          quoteDecimals={18}
          claiming={false}
          onClose={() => setEdd(null)}
          onParticipateClick={() => {
            /* TODO: teammate wires onParticipateClick */
          }}
          onClaimClick={() => {
            /* TODO: teammate wires onClaimClick */
          }}
        />
      )}
    </div>
  );
};

export default DdpComponentsPage;
