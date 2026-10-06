"use client";

import { useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import Chip from "@/components/Chip/Chip";
import LandingAccentBar from "@/components/LandingAccentBar/LandingAccentBar";
import LandingFragment from "@/components/LandingFragment/LandingFragment";
import MainnetDistributionCard, {
  type MainnetDistributionCardProps,
} from "@/components/MainnetDistributionCard/MainnetDistributionCard";
import MainnetFooter from "@/components/MainnetFooter/MainnetFooter";
import MainnetHeader from "@/components/MainnetHeader/MainnetHeader";
import Pagination from "@/components/Pagination/Pagination";
import SmokeMeshBackground from "@/components/SmokeMeshBackground/SmokeMeshBackground";
import { BODY_M, BODY_S } from "@/constants/typography";

export type MainnetDistributionListProps = {
  distributions: (MainnetDistributionCardProps & { id: string })[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const SORTS = ["Newest", "Most participation", "Ending soon"];
const VIEWS = ["All", "Live", "Upcoming", "Finished", "sqrtDAO tokens"];

const Search = () => (
  <label className="flex min-w-0 flex-1 items-center gap-2.5 rounded-m bg-surface px-2 py-2.5 xl:w-52.5 xl:flex-none">
    <IconSearch
      size={16}
      className="shrink-0 text-tertiary"
      aria-hidden="true"
    />
    {/* TODO: teammate wires search */}
    <input
      type="search"
      placeholder="Search tokens"
      aria-label="Search tokens"
      className={`min-w-0 flex-1 bg-transparent ${BODY_S} text-primary placeholder:text-tertiary focus:outline-none`}
    />
  </label>
);

// Figma 14306:80842 (desktop) / 14714:107568 (mobile).
const MainnetDistributionList = (props: MainnetDistributionListProps) => {
  // TODO: teammate wires sort + view filters into the query.
  const [sort, setSort] = useState(SORTS[0]);
  const [view, setView] = useState(VIEWS[0]);
  const chips = (
    <>
      <Chip label="Sort:" options={SORTS} value={sort} onChange={setSort} />
      <Chip label="Status:" options={VIEWS} value={view} onChange={setView} />
    </>
  );
  const launch = (
    <Link
      href="/dev/mainnet/launch"
      className="sqrt-btn sqrt-btn--primary sqrt-btn--m"
    >
      <span className="sqrt-btn__label">Launch token</span>
    </Link>
  );

  return (
    <>
      <SmokeMeshBackground />
      <div className="relative z-10 flex h-dvh flex-col overflow-y-auto">
        <MainnetHeader />
        <main className="mx-auto flex w-full max-w-374 flex-col pt-4 xl:px-38 xl:pt-6">
          <div className="flex items-start justify-between px-4 xl:px-0">
            <div className="flex flex-col">
              <div className="relative hidden h-6 w-95 xl:block">
                <LandingAccentBar
                  band={{ width: 380, height: 22, tint: "ochre-500" }}
                  chips={[
                    { offset: 48.42, width: 28, tint: "ochre-700" },
                    { offset: 76.42, width: 28, tint: "ochre-500" },
                    { offset: 104.42, width: 28, tint: "ochre-700" },
                  ]}
                  className="top-0 left-0"
                />
              </div>
              <div className="flex flex-col gap-2.5 bg-black pb-2 xl:w-fit xl:gap-0">
                <h1 className="text-h3 text-primary xl:font-display xl:text-display-m xl:font-semibold xl:whitespace-nowrap xl:tracking-[-0.02em]">
                  Token Distributions
                </h1>
                <p
                  className={`${BODY_M} text-secondary xl:w-0 xl:min-w-full xl:text-body-l xl:leading-6 xl:tracking-[0.02em]`}
                >
                  Every token distributing on sqrtDAO. Open any one to watch it,
                  or take part.
                </p>
              </div>
            </div>
            <div className="relative mt-10.25 hidden h-19.25 w-17.5 shrink-0 xl:block">
              <LandingFragment className="top-11.5 left-0 size-7.75" />
              <LandingFragment className="top-0 left-9.75 size-7.75" />
            </div>
          </div>

          <div className="flex flex-col gap-4 p-4 xl:px-0">
            {/* Mobile: search + launch, then chips. Desktop: one row. */}
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-4">
                <Search />
                <span className="hidden xl:contents">{chips}</span>
                <span className="xl:hidden">{launch}</span>
              </div>
              <div className="flex gap-2 xl:hidden">{chips}</div>
              <span className="hidden xl:block">{launch}</span>
            </div>

            <div className="grid gap-4 xl:grid-cols-3 xl:gap-2">
              {props.distributions.map(({ id, ...card }) => (
                <MainnetDistributionCard key={id} {...card} />
              ))}
            </div>

            <div className="flex flex-col items-end gap-2 xl:flex-row xl:items-center xl:justify-end xl:gap-6">
              <Pagination
                className="xl:order-2"
                currentPage={props.page}
                totalPages={props.totalPages}
                onPageChange={props.onPageChange}
              />
              <p className={`${BODY_M} text-primary xl:order-1`}>
                {props.distributions.length}{" "}
                <span className="text-secondary">
                  of {props.total.toLocaleString("en-US")} Distributions
                </span>
              </p>
            </div>
          </div>
        </main>
        <MainnetFooter placement="landing" />
      </div>
    </>
  );
};

export default MainnetDistributionList;
