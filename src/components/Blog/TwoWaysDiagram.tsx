"use client";

import Link from "next/link";
import { DISTRIBUTION_LAUNCH_HREF } from "@/constants/links";
import { useInView } from "@/hooks/useInView";

// Both token doors flow down into the same distribution engine. The door
// paths draw in (and the SMIL runner dots fade in to loop along them) when
// the diagram scrolls into view — see the .doors rules in globals.css.
// Reduced motion renders the paths fully drawn and hides the runners via
// CSS, so the observer is skipped entirely in that case.
const DOOR_PATH_A = "M175 94 C175 160 340 150 340 222";
const DOOR_PATH_B = "M505 94 C505 160 340 150 340 222";

export default function TwoWaysDiagram() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`doors mt-5 rounded-l border border-subtle bg-raised p-5${inView ? " in" : ""}`}
    >
      <svg
        viewBox="0 0 680 330"
        role="img"
        aria-label="Launch a new token, or import an existing one; both flow down into the same distribution."
      >
        <defs>
          <marker
            id="doors-arrow"
            viewBox="0 0 10 10"
            refX={8}
            refY={5}
            markerWidth={7}
            markerHeight={7}
            orient="auto"
          >
            <path
              d="M1 1L8 5L1 9"
              fill="none"
              strokeWidth={1.6}
              strokeLinecap="round"
              className="door-path-marker"
            />
          </marker>
        </defs>

        {/* door A */}
        <Link href={DISTRIBUTION_LAUNCH_HREF}>
          <rect className="door-box" x={40} y={16} width={270} height={78} rx={14} strokeWidth={1.3} />
          <text className="kicker" x={175} y={46} textAnchor="middle">
            NO TOKEN YET
          </text>
          <text className="door-title" x={175} y={74} textAnchor="middle">
            Launch it natively
          </text>
        </Link>

        {/* door B */}
        <Link href={DISTRIBUTION_LAUNCH_HREF}>
          <rect className="door-box" x={370} y={16} width={270} height={78} rx={14} strokeWidth={1.3} />
          <text className="kicker" x={505} y={46} textAnchor="middle">
            ALREADY HAVE ONE
          </text>
          <text className="door-title" x={505} y={74} textAnchor="middle">
            Import your token
          </text>
        </Link>

        {/* paths down */}
        <path className="door-path a" d={DOOR_PATH_A} markerEnd="url(#doors-arrow)" />
        <path className="door-path b" d={DOOR_PATH_B} markerEnd="url(#doors-arrow)" />
        <circle className="runner" r={4}>
          <animateMotion dur="2.6s" repeatCount="indefinite" path={DOOR_PATH_A} />
        </circle>
        <circle className="runner" r={4}>
          <animateMotion dur="2.6s" begin="1.3s" repeatCount="indefinite" path={DOOR_PATH_B} />
        </circle>

        {/* engine */}
        <rect className="engine-box" x={200} y={228} width={280} height={86} rx={16} />
        <text className="engine-title" x={340} y={264} textAnchor="middle">
          Your distribution
        </text>
        <text className="engine-sub" x={340} y={290} textAnchor="middle">
          same rules, same fairness
        </text>
      </svg>
    </div>
  );
}
