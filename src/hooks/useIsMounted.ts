"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** False during prerender, true after hydration — without a setState effect. */
export const useIsMounted = () => useSyncExternalStore(subscribe, () => true, () => false);
