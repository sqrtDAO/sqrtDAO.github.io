"use client";

import { useState } from "react";
import Header from "@/components/Header/Header";
import TestnetRibbon from "@/components/TestnetRibbon/TestnetRibbon";
import TableRow from "@/components/TableRow/TableRow";
import DistributionCard from "@/components/DistributionCard/DistributionCard";
import Pagination from "@/components/Pagination/Pagination";
import LandingFooter from "@/components/LandingFooter/LandingFooter";
import SmokeMeshBackground from "@/components/SmokeMeshBackground/SmokeMeshBackground";
import LandingAccentBar from "@/components/LandingAccentBar/LandingAccentBar";
import LandingFragment from "@/components/LandingFragment/LandingFragment";
import { mockDistributions } from "@/lib/fixtures/distributions";

// Mobile Figma (7791:75215, single-column card list) still shows 10 cards per
// page, same as the desktop label ("10 of 1283 Distributions") -> one shared
// page size.
const PAGE_SIZE = 10;

const COLUMN_HEADERS = [
  "Token name",
  "State",
  "Total participation",
  "Started at",
  "Finished at",
  "Epochs",
];

export default function DistributionsV1PreviewPage() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(mockDistributions.length / PAGE_SIZE);
  const pageItems = mockDistributions.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  return (
    <>
      <SmokeMeshBackground />

      {/* globals.css sets `body { overflow: hidden }` site-wide (confirmed —
          every real page, e.g. DistributionDetail's `.ddp` class, opens its
          own `height:100vh (dvh here); overflow-y:auto` box instead of
          relying on document scroll, which is disabled). Without this,
          content below the fold — Pagination, the footer — is unreachable:
          exactly the bug reported. */}
      <div className="relative z-10 flex h-dvh flex-col overflow-y-auto pb-[env(safe-area-inset-bottom)]">
        <Header />
        <TestnetRibbon />

        {/* Both frames' exact metadata coordinates confirm every section in
            this stack is flush (0px) against the next, on both breakpoints,
            with exactly one exception: desktop's Table -> Pagination gap is
            a real 16px. So: no shared inter-section gap on <main> at all —
            just that one exception applied directly (xl:mb-4 on the table
            container below). Outer padding also corrected to match: mobile
            "main content" py-16/px-0 (px comes from each section's own
            px-16, equivalent here), desktop "top"/"table frame" px-152
            each — hence px-4 (16px) xl:px-38 (152px), py-4 (16px) xl:py-6
            (24px). */}
        <main className="mx-auto flex w-full max-w-[1496px] flex-col gap-0 px-4 py-4 xl:px-38 xl:py-6">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-0">
              {/* Accent-bar + fragment decoration — desktop only, nothing shown in the mobile Figma frame. Same config already used in LandingHero's hero illustration (band 380x22 ochre-500 + 3 chips), reused as-is rather than hand-built. */}
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
              {/* Title+subtitle sit on their own tight black backdrop in
                  Figma ("Main Header": bg-space, pb-8, no other padding) —
                  not directly on the shader like the rest of the hero.
                  Title-to-subtitle gap is itself breakpoint-specific: 10px
                  on mobile (y=35 -> y=45), flush on desktop (y=80 -> y=80). */}
              <div className="flex flex-col items-start gap-2.5 bg-black pb-2 xl:gap-0">
                {/* Desktop: display-m/semibold (64px). Mobile: h3/regular (28px) — confirmed distinct weights+sizes per breakpoint from Figma, not just a scaled-down desktop title. */}
                <h1 className="text-h3 font-normal text-primary xl:text-display-m xl:font-semibold">
                  Token Distributions
                </h1>
                <p className="max-w-[566px] text-body leading-[22px] text-secondary xl:text-body-l xl:leading-6">
                  Live distributions running right now. Open any one to
                  watch it settle — or take part.
                </p>
              </div>
            </div>

            {/* Two black fragment squares, top-right of the hero row — desktop only. */}
            <div className="relative hidden h-[77px] w-[70px] shrink-0 xl:block">
              <LandingFragment className="left-0 top-[46px] size-[31px]" />
              <LandingFragment className="left-[39px] top-0 size-[31px]" />
            </div>
          </div>

          {/* Fixed-height scroll container (606px, per Figma) with a sticky
              header — rows scroll inside the box, Pagination stays below it
              and is always reachable without scrolling the page. xl:mb-4 is
              the one confirmed non-zero inter-section gap in this whole
              stack (Table -> Pagination, real 16px in Figma). */}
          <div className="hidden max-h-[606px] w-full overflow-y-auto bg-black px-6 xl:mb-4 xl:block">
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
                {pageItems.map((distribution, i) => (
                  <TableRow
                    distribution={distribution}
                    index={(page - 1) * PAGE_SIZE + i}
                    key={distribution.address}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-start gap-2 bg-black py-4 xl:hidden">
            {pageItems.map((distribution) => (
              <DistributionCard
                distribution={distribution}
                key={distribution.address}
              />
            ))}
          </div>

          {/* Mobile ("Frame" 7517:54530): pagination above the count text,
              both right-aligned, 8px gap. Desktop ("Frame" 7463:51868):
              count text then pagination, side by side, 24px gap — reverse
              order, different gap, confirmed distinct per breakpoint. */}
          <div className="flex flex-col items-end gap-2 xl:flex-row xl:items-center xl:justify-end xl:gap-6">
            <Pagination
              className="order-1 xl:order-2"
              currentPage={page}
              onPageChange={setPage}
              totalPages={totalPages}
            />
            <p className="order-2 text-body leading-[22px] text-primary xl:order-1">
              {pageItems.length}{" "}
              <span className="text-secondary">
                of {mockDistributions.length} Distributions
              </span>
            </p>
          </div>
        </main>

        {/* mobileTopMargin="mt-0": LandingFooterMobile's default mt-[240px]
            is landing-page-specific pacing (its own comment says so), not a
            Figma measurement — it was stacking on top of main's own pb-4
            and blowing the pagination-to-footer gap out to ~256px. Figma's
            real "main content"/"landing footer" sibling frames are flush
            (main content ends at y=1501, footer starts at y=1501) — main's
            own pb-4 already reproduces the 16px of that padding that sits
            before the footer, so the footer itself needs zero extra. */}
        <LandingFooter mobileTopMargin="mt-0" />
      </div>
    </>
  );
}
