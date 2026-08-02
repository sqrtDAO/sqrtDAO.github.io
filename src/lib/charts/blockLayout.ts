/** Fixed per Figma node 4405:12118 (desktop) / 4306:8023 (mobile "device"
 * variant) — never scale these with container width, only with device. */
export type ChartDevice = "desktop" | "mobile";

export const BLOCK_DIMS: Record<ChartDevice, { width: number; height: number; gap: number }> = {
  desktop: { width: 4, height: 12, gap: 2 },
  mobile: { width: 6, height: 18, gap: 3 },
};

export const MIN_ROWS = 1;
export const MAX_ROWS = 5;

export interface BlockDisplayWindow {
  columns: number;
  rows: number;
  /** Slice of the full epochs array that's actually rendered — [startIndex, endIndex). */
  startIndex: number;
  endIndex: number;
}

/** Row index the current epoch should land on whenever there's enough data
 * on both sides to center it — the middle of a 5-row grid is row 2. */
const TARGET_CURRENT_ROW = Math.floor((MAX_ROWS - 1) / 2);

/**
 * The chart never scrolls — it must always fit the container it's given.
 * Block size (per device) and the row cap (5) are fixed, so column count is
 * capped by how many actually fit the container width (`naturalColumns`);
 * that in turn caps how many epochs can be on screen at once
 * (`naturalColumns * MAX_ROWS`).
 *
 * Two cases:
 *   - Everything fits (totalEpochs ≤ that cap): show all of it, picking
 *     however many columns (between capacity-floor and the natural-fit
 *     ceiling) centers the current epoch on the middle row — never growing
 *     past what the container actually fits, unlike a scrollable chart.
 *   - It doesn't fit: show a `naturalColumns * MAX_ROWS`-epoch window
 *     centered on the current epoch instead of the whole history, clamped
 *     to the start/end of the data. The center of a centered window always
 *     lands the current epoch exactly on the middle row by construction;
 *     near the start or end of the schedule the clamp shifts the window and
 *     it lands as close to the middle as the data allows.
 */
export function computeBlockDisplayWindow(
  containerWidthPx: number,
  totalEpochs: number,
  currentIndex: number,
  device: ChartDevice = "desktop"
): BlockDisplayWindow {
  const { width, gap } = BLOCK_DIMS[device];
  const naturalColumns = Math.max(1, Math.floor((containerWidthPx + gap) / (width + gap)));
  const maxVisible = naturalColumns * MAX_ROWS;

  if (totalEpochs <= maxVisible) {
    const minColumns = Math.max(1, Math.ceil(totalEpochs / MAX_ROWS));
    let bestColumns = naturalColumns;
    let bestDistance = Infinity;
    for (let columns = minColumns; columns <= naturalColumns; columns++) {
      const currentRow = Math.floor(currentIndex / columns);
      const distance = Math.abs(currentRow - TARGET_CURRENT_ROW);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestColumns = columns;
        if (distance === 0) break; // exact middle-row match — smallest columns wins ties
      }
    }
    const rows = Math.min(MAX_ROWS, Math.max(MIN_ROWS, Math.ceil(totalEpochs / bestColumns)));
    return { columns: bestColumns, rows, startIndex: 0, endIndex: totalEpochs };
  }

  const start = Math.max(0, Math.min(currentIndex - Math.floor(maxVisible / 2), totalEpochs - maxVisible));
  return { columns: naturalColumns, rows: MAX_ROWS, startIndex: start, endIndex: start + maxVisible };
}

export function blockPosition(
  index: number,
  columns: number,
  device: ChartDevice = "desktop"
): { x: number; y: number; col: number; row: number } {
  const { width, height, gap } = BLOCK_DIMS[device];
  const col = index % columns;
  const row = Math.floor(index / columns);
  return { x: col * (width + gap), y: row * (height + gap), col, row };
}

export function gridPixelSize(
  columns: number,
  rows: number,
  device: ChartDevice = "desktop"
): { width: number; height: number } {
  const { width, height, gap } = BLOCK_DIMS[device];
  return {
    width: columns * (width + gap) - gap,
    height: rows * (height + gap) - gap,
  };
}
