"use client";

import { useState } from "react";
import MainnetDistributionList, {
  type MainnetDistributionListProps,
} from "@/components/MainnetDistributionList/MainnetDistributionList";

// TODO: teammate replaces these FAKE placeholder cards with per-distribution data from useDistributions.
const DISTRIBUTIONS: MainnetDistributionListProps["distributions"] = [
  [
    "Placeholder Alpha",
    "FAKEA",
    "live",
    true,
    "48,210",
    "0.0042",
    "1,204",
    "4,800",
  ],
  [
    "Placeholder Beta",
    "FAKEB",
    "live",
    false,
    "3,150",
    "0.118",
    "312",
    "2,000",
  ],
  ["Placeholder Gamma", "FAKEC", "upcoming", true, "0", "—", "0", "6,000"],
  [
    "Placeholder Delta",
    "FAKED",
    "live",
    true,
    "912,004",
    "1.27",
    "7,450",
    "9,000",
  ],
  [
    "Placeholder Epsilon",
    "FAKEE",
    "ended",
    false,
    "27,500",
    "0.0365",
    "1,000",
    "1,000",
  ],
  ["Placeholder Zeta", "FAKEZ", "live", true, "640", "0.0009", "58", "3,600"],
  ["Placeholder Eta", "FAKEH", "upcoming", false, "0", "—", "0", "720"],
  [
    "Placeholder Theta",
    "FAKET",
    "ended",
    true,
    "155,780",
    "0.52",
    "2,400",
    "2,400",
  ],
  [
    "Placeholder Iota",
    "FAKEI",
    "live",
    false,
    "9,875",
    "0.073",
    "4,321",
    "12,000",
  ],
].map(
  ([name, symbol, status, native, participation, price, done, total], i) => ({
    id: String(i),
    href: "/dev/mainnet/ddp-native",
    name: name as string,
    symbol: symbol as string,
    status: status as "live" | "upcoming" | "ended",
    native: native as boolean,
    totalParticipation: participation as string,
    lastClearPrice: price as string,
    quoteSymbol: "USDT",
    epochsCompleted: done as string,
    totalEpochs: total as string,
    progressPct:
      (Number((done as string).replace(/,/g, "")) /
        Number((total as string).replace(/,/g, ""))) *
      100,
  }),
);

const MainnetDistributionsPage = () => {
  const [page, setPage] = useState(1);
  return (
    <MainnetDistributionList
      distributions={DISTRIBUTIONS}
      total={1283}
      page={page}
      totalPages={129}
      onPageChange={setPage}
    />
  );
};

export default MainnetDistributionsPage;
