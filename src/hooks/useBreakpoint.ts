"use client";

import { useState, useEffect } from "react";

export type Breakpoint = "desktop" | "tablet" | "mobile";

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>("desktop");

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setBp(w >= 1280 ? "desktop" : w >= 768 ? "tablet" : "mobile");
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return bp;
}
