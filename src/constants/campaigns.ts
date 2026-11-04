// CAMPAIGN: no-fee-november — delete this file (and every `CAMPAIGN: no-fee-november` touch point) to remove the campaign.
export const NO_FEE_NOVEMBER = {
  enabled: true,
  // Keep the "0% protocol fee" badges as proof on distributions that started in the window, after it ends.
  showCampaignBadgesAfterEnd: true,
  name: "No Fee November",
  startMs: Date.UTC(2026, 10, 4),
  // exclusive: the whole of 18 Nov (UTC) is inside the window
  endMs: Date.UTC(2026, 10, 19),
  copy: {
    tickerLead: "No Fee November.",
    ticker: "Launch by 18 Nov and pay 0% protocol fee, forever.",
    rulesTitle: "No Fee November: 0% protocol fee",
    rulesBody:
      "Start your distribution between 4 and 18 Nov 2026 and pay no protocol fee. The 0% stays for its whole life, not just this month.",
    review: "No Fee November: 0% protocol fee, locked for the life of this distribution.",
    launchedDuring: "Launched during No Fee November",
    badge: "0% protocol fee",
    launchEntry: "No Fee November: launch by 18 Nov and pay 0% protocol fee, forever.",
  },
} as const;

const inWindow = (ms: number) => ms >= NO_FEE_NOVEMBER.startMs && ms < NO_FEE_NOVEMBER.endMs;

export const isNoFeeNovemberActive = (now: number) => NO_FEE_NOVEMBER.enabled && inWindow(now);

export const startedInNoFeeNovember = (startMs: number) => NO_FEE_NOVEMBER.enabled && inWindow(startMs);

export const showNoFeeNovemberBadge = (startMs: number, campaignActive: boolean) =>
  startedInNoFeeNovember(startMs) && (NO_FEE_NOVEMBER.showCampaignBadgesAfterEnd || campaignActive);
