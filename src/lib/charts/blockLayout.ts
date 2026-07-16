/** Fixed per Figma node 4405:12118 — never scale these with container width. */
export const BLOCK_W = 4;
export const BLOCK_H = 12;
export const BLOCK_GAP = 2;
export const MIN_ROWS = 1;
export const MAX_ROWS = 5;

export interface BlockLayout {
  columns: number;
  rows: number;
  /** True when columns*rows worth of grid width exceeds the container — caller should let it scroll horizontally. */
  overflowsContainer: boolean;
}

/**
 * Block size and row cap (1–5) are fixed; only the column count adapts.
 * Two situations grow columns beyond the container's natural fit:
 *   1. capacity: totalEpochs needs more than 5 rows at the natural column count.
 *   2. last-row rule (Figma annotation): "keep the last row always future
 *      epochs, unless it was just 1 row overall" — if the current epoch
 *      would land in the last row, add columns (never shrink blocks, never
 *      drop epochs) until it doesn't.
 * Either case can make the grid wider than the container; the block chart
 * component wraps it in an horizontally-scrollable region as the safety net.
 */
export function computeBlockLayout(
  containerWidthPx: number,
  totalEpochs: number,
  currentIndex: number
): BlockLayout {
  const naturalColumns = Math.max(1, Math.floor((containerWidthPx + BLOCK_GAP) / (BLOCK_W + BLOCK_GAP)));
  let columns = naturalColumns;
  let rows = Math.min(MAX_ROWS, Math.max(MIN_ROWS, Math.ceil(totalEpochs / columns)));

  if (Math.ceil(totalEpochs / columns) > MAX_ROWS) {
    rows = MAX_ROWS;
    columns = Math.ceil(totalEpochs / rows);
  }

  if (rows > 1) {
    let guard = 0;
    while (rows > 1 && currentIndex >= columns * (rows - 1) && guard++ < 5000) {
      columns++;
      rows = Math.min(MAX_ROWS, Math.max(MIN_ROWS, Math.ceil(totalEpochs / columns)));
    }
  }

  return { columns, rows, overflowsContainer: columns > naturalColumns };
}

export function blockPosition(index: number, columns: number): { x: number; y: number; col: number; row: number } {
  const col = index % columns;
  const row = Math.floor(index / columns);
  return { x: col * (BLOCK_W + BLOCK_GAP), y: row * (BLOCK_H + BLOCK_GAP), col, row };
}

export function gridPixelSize(columns: number, rows: number): { width: number; height: number } {
  return {
    width: columns * (BLOCK_W + BLOCK_GAP) - BLOCK_GAP,
    height: rows * (BLOCK_H + BLOCK_GAP) - BLOCK_GAP,
  };
}
