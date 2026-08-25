"use client";

import { useState } from "react";
import Status, { type DistributionStatus } from "@/components/Status/Status";
import TableCell from "@/components/TableCell/TableCell";
import TableRow from "@/components/TableRow/TableRow";
import Pagination from "@/components/Pagination/Pagination";
import DistributionCard from "@/components/DistributionCard/DistributionCard";
import { mockDistributions } from "@/lib/fixtures/distributions";

const STATUSES: DistributionStatus[] = ["live", "upcoming", "ended"];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 border-b border-muted pb-12">
      <h2 className="text-h4 text-primary">{title}</h2>
      {children}
    </section>
  );
}

export default function ComponentsV1PreviewPage() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(mockDistributions.length / 10);
  const rows = mockDistributions.slice(0, 3);
  const cards = STATUSES.map(
    (status) => mockDistributions.find((d) => d.status === status)!,
  );

  return (
    <main className="mx-auto flex max-w-[1200px] flex-col gap-12 p-8">
      <h1 className="text-h2 text-primary">Components V.1 preview</h1>

      <Section title="Status">
        <div className="flex items-center gap-3">
          {STATUSES.map((status) => (
            <Status key={status} status={status} />
          ))}
        </div>
      </Section>

      <Section title="TableCell — every variant">
        <div className="flex flex-col divide-y divide-muted">
          <TableCell value={7} variant="index" />
          <TableCell name="Solstice" ticker="SOL2" variant="name" />
          <TableCell unit="ROOT" value="20,000" variant="amount" />
          <TableCell date="21 June, 2026" variant="date" />
          <TableCell days={12} hours={2} minutes={42} seconds={21} variant="countdown" />
          <TableCell status="live" variant="status" />
        </div>
      </Section>

      <Section title="TableRow">
        <table className="w-full border-separate border-spacing-y-2">
          <tbody>
            {rows.map((distribution) => (
              <TableRow distribution={distribution} key={distribution.address} />
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="Pagination">
        <Pagination
          currentPage={page}
          onPageChange={setPage}
          totalPages={totalPages}
        />
        <p className="text-body-s text-tertiary">Page {page} of {totalPages}</p>
      </Section>

      <Section title="DistributionCard (mobile)">
        <div className="flex max-w-[390px] flex-col gap-2">
          {cards.map((distribution) => (
            <DistributionCard distribution={distribution} key={distribution.address} />
          ))}
        </div>
      </Section>
    </main>
  );
}
