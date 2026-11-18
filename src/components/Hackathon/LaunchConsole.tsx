import type { CSSProperties } from "react";
import InView from "./InView";
import { ONCE, Shimmer, TypedLines, termLines, typing } from "./Terminal";

// Figma "launch console" 17562:88419 (flattened vector there) rebuilt as text + grid.
// Motion (once, when in view): lines type in, cursor shimmers, then the grid fills in; the
// amber cell keeps shimmering.
const V3 = "bg-(--color-charts-epochs-300)";
const V5 = "bg-(--color-charts-epochs-500)";
const V7 = "bg-(--color-charts-epochs-700)";
const V9 = "bg-(--color-charts-epochs-900)";
const EMPTY = "bg-(--color-alpha-white-04)";
const AMBER = "amber";

const CELLS = [
  ...[V3, V9, V3, V5, V9, V5, V9, V5, V5, V3, V5],
  ...[V3, V5, V5, V3, V3, V7, V3, V7, V3, AMBER, EMPTY],
  ...Array<string>(22).fill(EMPTY),
];

const LINES = termLines("sqrt launch --chain robinhood", [
  { label: "> project ........ ", value: "my-idea", tone: "text-primary" },
  { label: "> repo ........... ", value: "public, MIT √" },
  { label: "> fund split .......... ", value: "+70% / +30%", tone: "text-primary" },
  { label: "> status ......... ", value: "live ●" },
]);
const DONE = typing(LINES).at;

const LaunchConsole = () => (
  <InView className="flex h-[498px] flex-col justify-center gap-4 bg-black px-4 font-mono text-body-s leading-[1.5] xl:h-auto xl:p-4 xl:text-[15px]">
    <TypedLines lines={LINES} />
    <div className="grid grid-cols-11 gap-1.25" aria-hidden="true">
      {CELLS.map((bg, i) => (
        <span
          key={i}
          style={{ "--d": `${DONE + i * 12}ms`, "--t": "300ms" } as CSSProperties}
          className={`aspect-square rounded-s motion-safe:transition-opacity motion-safe:group-data-[view=idle]/view:opacity-0 ${ONCE} ${bg === AMBER ? "" : bg}`}
        >
          {bg === AMBER && <Shimmer className="rounded-s" />}
        </span>
      ))}
    </div>
  </InView>
);

export default LaunchConsole;
