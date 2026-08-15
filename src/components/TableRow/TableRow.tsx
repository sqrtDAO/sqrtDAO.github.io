import { IconChevronRight } from "@tabler/icons-react";
import TableCell from "@/components/TableCell/TableCell";
import type { Distribution } from "@/lib/fixtures/distributions";
import { formatDate } from "@/utils/formatDate";

export type TableRowProps = {
  index: number;
  distribution: Distribution;
};

// Row height = 64px, per Figma: the row wrapper's own 8px top+bottom padding
// (outside every cell) plus the tallest cell's content (24px line-height +
// 12px top+bottom cell padding = 48px) = 64px. A real <tr> can't carry that
// outer padding itself, so it's reproduced as a fixed height on every <td>
// (h-16) with align-middle to center each cell's shorter content within it.
const cellBorder = "h-16 align-middle border-y border-muted group-hover:border-transparent";

export default function TableRow({ index, distribution }: TableRowProps) {
  return (
    <tr
      className="group relative cursor-pointer hover:bg-canvas"
      onClick={() =>
        window.open(
          `/distribution/?address=${distribution.address}`,
          "_blank",
          "noopener,noreferrer",
        )
      }
    >
      <td className={`relative rounded-l-m border-l ${cellBorder}`}>
        <TableCell value={index + 1} variant="index" />
      </td>
      <td className={cellBorder}>
        <TableCell
          name={distribution.tokenName}
          ticker={distribution.tokenSymbol}
          variant="name"
        />
      </td>
      <td className={`w-26 ${cellBorder}`}>
        <TableCell status={distribution.status} variant="status" />
      </td>
      <td className={cellBorder}>
        <TableCell
          unit={distribution.participationTokenSymbol}
          value={distribution.totalParticipation.toLocaleString("en-US")}
          variant="amount"
        />
      </td>
      <td className={cellBorder}>
        <TableCell date={formatDate(distribution.startedAt)} variant="date" />
      </td>
      <td className={cellBorder}>
        <TableCell date={formatDate(distribution.finishedAt)} variant="date" />
      </td>
      <td className={cellBorder}>
        <TableCell
          unit={`/${distribution.totalEpochs.toLocaleString("en-US")}`}
          value={distribution.epochsCompleted.toLocaleString("en-US")}
          variant="amount"
        />
      </td>
      <td className={`w-12 rounded-r-m border-r ${cellBorder}`}>
        <div className="flex items-center justify-center px-4 py-3">
          <IconChevronRight
            className="text-tertiary group-hover:text-primary"
            size={20}
            strokeWidth={1.75}
          />
        </div>
      </td>
    </tr>
  );
}
