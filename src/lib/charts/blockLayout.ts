/** Fixed per Figma node 4405:12118 (desktop) / 4306:8023 (mobile "device"
 * variant) — never scale these with container width, only with device. */
export type ChartDevice = "desktop" | "mobile";

export const BLOCK_DIMS: Record<
  ChartDevice,
  { width: number; height: number; gap: number }
> = {
  desktop: { width: 4, height: 12, gap: 2 },
  mobile: { width: 6, height: 18, gap: 3 },
};

/** Hard column caps — one row never exceeds this many blocks per device. */
export const MAX_COLUMNS: Record<ChartDevice, number> = {
  desktop: 135,
  mobile: 60,
};

/** The grid never shows more than this many rows. */
export const MAX_ROWS = 5;

/** Upper bound on rendered blocks across devices (desktop 135 × 5). */
export const MAX_RENDERED_EPOCHS = MAX_COLUMNS.desktop * MAX_ROWS;

/** Smallest full grid across devices (mobile 60 × 5). */
export const MIN_GRID_CAPACITY = MAX_COLUMNS.mobile * MAX_ROWS;

export interface BlockDisplayWindow {
  columns: number;
  rows: number;
  /** Slice of the full epochs array that's actually rendered — [startIndex, endIndex). */
  startIndex: number;
  endIndex: number;
}

/**
 * The chart never scrolls and always fills the container width: every column
 * that fits the width is used (`columns`, capped per device), complete rows
 * are filled first, then whatever's left becomes the last row. At most
 * MAX_ROWS are rendered — when there are more epochs than fit, the most
 * recent full window is shown instead of the whole history.
 *
 * `currentEpochIndex` shifts that window back when the current epoch would
 * otherwise fall before it, keeping the glowing block on-grid.
 */
export function computeBlockDisplayWindow(
  containerWidthPx: number,
  totalEpochs: number,
  device: ChartDevice = "desktop",
  currentEpochIndex = -1,
): BlockDisplayWindow {
  const { width, gap } = BLOCK_DIMS[device];
  const columns = Math.min(
    MAX_COLUMNS[device],
    Math.max(1, Math.floor((containerWidthPx + gap) / (width + gap))),
  );
  const capacity = columns * MAX_ROWS;
  if (totalEpochs <= capacity) {
    const rows = Math.max(1, Math.ceil(totalEpochs / columns));
    return { columns, rows, startIndex: 0, endIndex: totalEpochs };
  }
  // too many epochs for the grid — render the most recent full window,
  // row-aligned so all MAX_ROWS rows are complete
  let startIndex = totalEpochs - capacity;
  if (currentEpochIndex >= 0 && currentEpochIndex < startIndex) {
    startIndex = currentEpochIndex;
  }
  return {
    columns,
    rows: MAX_ROWS,
    startIndex,
    endIndex: startIndex + capacity,
  };
}

export function blockPosition(
  index: number,
  columns: number,
  device: ChartDevice = "desktop",
): { x: number; y: number; col: number; row: number } {
  const { width, height, gap } = BLOCK_DIMS[device];
  const col = index % columns;
  const row = Math.floor(index / columns);
  return { x: col * (width + gap), y: row * (height + gap), col, row };
}

export function gridPixelSize(
  columns: number,
  rows: number,
  device: ChartDevice = "desktop",
): { width: number; height: number } {
  const { width, height, gap } = BLOCK_DIMS[device];
  return {
    width: columns * (width + gap) - gap,
    height: rows * (height + gap) - gap,
  };
}
