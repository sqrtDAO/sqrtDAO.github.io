/** Fixed per Figma node 4405:12118 (desktop) / 4306:8023 (mobile "device"
 * variant) — never scale these with container width, only with device. */
export type ChartDevice = "desktop" | "mobile";

export const BLOCK_DIMS: Record<ChartDevice, { width: number; height: number; gap: number }> = {
  desktop: { width: 4, height: 12, gap: 2 },
  mobile: { width: 6, height: 18, gap: 3 },
};

export interface BlockDisplayWindow {
  columns: number;
  rows: number;
  /** Slice of the full epochs array that's actually rendered — [startIndex, endIndex). */
  startIndex: number;
  endIndex: number;
}

/**
 * The chart never scrolls and always fills the container width: every column
 * that fits the width is used (`columns`), complete rows are filled first,
 * then whatever's left becomes the last row. There's no row cap and no
 * windowing — the whole history is rendered. `rows` is just
 * ceil(totalEpochs / columns).
 */
export function computeBlockDisplayWindow(
  containerWidthPx: number,
  totalEpochs: number,
  device: ChartDevice = "desktop"
): BlockDisplayWindow {
  const { width, gap } = BLOCK_DIMS[device];
  const columns = Math.max(1, Math.floor((containerWidthPx + gap) / (width + gap)));
  const rows = Math.max(1, Math.ceil(totalEpochs / columns));
  return { columns, rows, startIndex: 0, endIndex: totalEpochs };
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
