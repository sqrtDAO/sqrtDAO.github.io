import { useSyncExternalStore } from "react";
import { isHackathonLive } from "@/utils/hackathon-week";

const subscribe = () => () => {};

// Client-only clock check (false during prerender), so the static export never hydrates a mismatch.
export const useHackathonLive = (extra: () => boolean = () => true) =>
  useSyncExternalStore(subscribe, () => isHackathonLive(Date.now()) && extra(), () => false);
