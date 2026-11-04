// CAMPAIGN: no-fee-november — delete this file (and every `CAMPAIGN: no-fee-november` touch point) to remove the campaign.
export const NO_FEE_NOVEMBER = {
  enabled: true,
  startMs: Date.UTC(2026, 10, 4),
  // exclusive: the whole of 18 Nov (UTC) is inside the window
  endMs: Date.UTC(2026, 10, 19),
  copy: {
    tickerLead: "No Fee November.",
    ticker: "Launch by 18 Nov and pay 0% protocol fee, forever.",
  },
} as const;

const inWindow = (ms: number) =>
  ms >= NO_FEE_NOVEMBER.startMs && ms < NO_FEE_NOVEMBER.endMs;

export const isNoFeeNovemberActive = (now: number) =>
  NO_FEE_NOVEMBER.enabled && inWindow(now);
