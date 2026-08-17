"use client";

import { useRouter } from "next/navigation";
import { IconLoader2 } from "@tabler/icons-react";
import Header from "@/components/Header/Header";
import TestnetRibbon from "@/components/TestnetRibbon/TestnetRibbon";
import TableRow from "@/components/TableRow/TableRow";
import DistributionCard from "@/components/DistributionCard/DistributionCard";
import Pagination from "@/components/Pagination/Pagination";
import LandingFooter from "@/components/LandingFooter/LandingFooter";
import SmokeMeshBackground from "@/components/SmokeMeshBackground/SmokeMeshBackground";
import LandingAccentBar from "@/components/LandingAccentBar/LandingAccentBar";
import LandingFragment from "@/components/LandingFragment/LandingFragment";
import type { Distribution } from "@/lib/fixtures/distributions";

const COLUMN_HEADERS = [
  "Token name",
  "State",
  "Total participation",
  "Started at",
  "Finished at",
  "Epochs",
];

export type DistributionListProps = {
  distributions: Distribution[];
  isLoading?: boolean;
  error?: string;
  total: number;
  totalPages: number;
  page: number;
  onPageChange: (page: number) => void;
};

export default function DistributionList({
  distributions,
  isLoading = false,
  error,
  total,
  totalPages,
  page,
  onPageChange,
}: DistributionListProps) {
  const router = useRouter();

  return (
    <>
      <SmokeMeshBackground />

      <div className="relative z-10 flex h-dvh flex-col overflow-y-auto pb-[env(safe-area-inset-bottom)]">
        <Header />
        <TestnetRibbon />

        <main className="mx-auto flex w-full max-w-[1496px] flex-1 flex-col gap-0 px-4 py-4 xl:px-38 xl:py-6">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-0">
              <div className="relative hidden h-6 w-[380px] xl:block">
                <LandingAccentBar
                  band={{ width: 380, height: 22, tint: "ochre-500" }}
                  chips={[
                    { offset: 48.42, width: 28, tint: "ochre-700" },
                    { offset: 76.42, width: 28, tint: "ochre-500" },
                    { offset: 104.42, width: 28, tint: "ochre-700" },
                  ]}
                  className="left-0 top-0"
                />
              </div>
              <div className="flex flex-col items-start gap-2.5 bg-black pb-2 xl:gap-0">
                <h1 className="text-h3 font-normal text-primary xl:text-display-m xl:font-semibold">
                  Token Distributions
                </h1>
                <p className="max-w-[566px] text-body leading-[22px] text-secondary xl:text-body-l xl:leading-6">
                  Live distributions running right now. Open any one to watch it
                  settle — or take part.
                </p>
              </div>
            </div>

            <div className="relative hidden h-[77px] w-[70px] shrink-0 xl:block">
              <LandingFragment className="left-0 top-[46px] size-[31px]" />
              <LandingFragment className="left-[39px] top-0 size-[31px]" />
            </div>
          </div>

          {error ? (
            <div className="flex flex-col items-start gap-2 bg-black py-4">
              <p className="text-body leading-[22px] text-primary">{error}</p>
            </div>
          ) : isLoading && distributions.length === 0 ? (
            <div className="flex items-center justify-center bg-black py-16">
              <IconLoader2 size={32} className="animate-spin text-tertiary" />
            </div>
          ) : distributions.length === 0 ? (
            <div className="flex flex-col items-start gap-2 bg-black py-4">
              <p className="text-body leading-[22px] text-primary">
                No distributions found on this network yet.
              </p>
            </div>
          ) : (
            <>
              <div className="relative w-full">
                {isLoading && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60">
                    <IconLoader2
                      size={32}
                      className="animate-spin text-tertiary"
                    />
                  </div>
                )}

                <div className="hidden w-full bg-black px-6 xl:mb-4 xl:block">
                  <table className="w-full border-separate border-spacing-y-2">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-black">
                        <th className="w-12" />
                        {COLUMN_HEADERS.map((label) => (
                          <th
                            className="h-20 px-4 text-left align-middle text-body-l leading-6 font-normal text-secondary"
                            key={label}
                          >
                            {label}
                          </th>
                        ))}
                        <th className="w-12" />
                      </tr>
                    </thead>
                    <tbody>
                      {distributions.map((distribution, i) => (
                        <TableRow
                          distribution={distribution}
                          index={total - (page - 1) * 10 - 1 - i}
                          key={distribution.address}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col items-start gap-2 bg-black py-4 xl:hidden">
                  {distributions.map((distribution) => (
                    <DistributionCard
                      distribution={distribution}
                      key={distribution.address}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 xl:flex-row xl:items-center xl:justify-end xl:gap-6">
                <Pagination
                  className="order-1 xl:order-2"
                  currentPage={page}
                  onPageChange={onPageChange}
                  totalPages={totalPages}
                />
                <p className="order-2 text-body leading-[22px] text-primary xl:order-1">
                  {distributions.length}{" "}
                  <span className="text-secondary">
                    of {total} Distributions
                  </span>
                </p>
              </div>
            </>
          )}
        </main>

        <LandingFooter
          mobileTopMargin="mt-0"
          onTryItClick={() => router.push("/launch-and-distribute")}
        />
      </div>
    </>
  );
}
