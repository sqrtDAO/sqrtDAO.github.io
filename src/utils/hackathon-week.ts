import { HACKATHON_END, HACKATHON_START } from "@/constants/hackathon";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const LAST_WEEK = 4; // weeks 1–4 + Demo week

// 0-based timeline card for a timestamp: clamped to week 1 before the start and Demo week after.
export const activeWeek = (now: number) =>
  Math.min(LAST_WEEK, Math.max(0, Math.floor((now - Date.parse(HACKATHON_START)) / WEEK_MS)));

export const isHackathonLive = (now: number) => now >= Date.parse(HACKATHON_START) && now < Date.parse(HACKATHON_END);
