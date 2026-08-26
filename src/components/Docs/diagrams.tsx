import type { ReactNode } from "react";

const Diagram = ({ label, viewBox, children }: { label: string; viewBox: string; children: ReactNode }) => (
  <figure className="mt-8 overflow-x-auto rounded-l border border-subtle bg-raised">
    <svg viewBox={viewBox} className="block w-full min-w-[640px]" role="img" aria-label={label}>
      {children}
    </svg>
    <figcaption className="border-t border-subtle px-4 py-2.5 text-center text-caption text-tertiary">
      {label}
    </figcaption>
  </figure>
);

type BoxProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub?: string;
  mono?: boolean;
  accent?: boolean;
  dashed?: boolean;
};

const Box = ({ x, y, w, h, title, sub, mono, accent, dashed }: BoxProps) => {
  const cy = sub ? y + h / 2 - 7 : y + h / 2;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="10"
        strokeWidth="1.5"
        strokeDasharray={dashed ? "5 4" : undefined}
        className={accent ? "fill-canvas stroke-accent" : "fill-canvas stroke-strong"}
      />
      <text
        x={x + w / 2}
        y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="13"
        fontWeight="500"
        fontFamily={mono ? "ui-monospace, SFMono-Regular, Menlo, monospace" : undefined}
        className={accent ? "fill-accent" : "fill-primary"}
      >
        {title}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={cy + 18}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="11"
          className="fill-tertiary"
        >
          {sub}
        </text>
      )}
    </g>
  );
};

type ArrowProps = {
  from: [number, number];
  to: [number, number];
  label?: string;
  labelDy?: number;
  dashed?: boolean;
  markerId: string;
};

const Arrow = ({ from: [x1, y1], to: [x2, y2], label, labelDy = -8, dashed, markerId }: ArrowProps) => (
  <g>
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      strokeWidth="1.5"
      strokeDasharray={dashed ? "5 4" : undefined}
      markerEnd={`url(#${markerId})`}
      className="stroke-tertiary"
    />
    {label && (
      <text
        x={(x1 + x2) / 2}
        y={(y1 + y2) / 2 + labelDy}
        textAnchor="middle"
        fontSize="11"
        className="fill-secondary"
      >
        {label}
      </text>
    )}
  </g>
);

export const ParticipateFlowDiagram = () => (
  <Diagram label="Your part of the lifecycle: lock during epochs, then claim after they end" viewBox="0 0 840 130">
    <defs>
      <marker id="pf-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 z" className="fill-tertiary" />
      </marker>
    </defs>
    <Box x={60} y={30} w={180} h={64} title="Participate" sub="lock amount × epochs" />
    <Box x={330} y={30} w={180} h={64} title="Wait" sub="epoch ends + claim delay" />
    <Box x={600} y={30} w={180} h={64} title="Claim" sub="your pro-rata reward" accent />
    <Arrow from={[246, 62]} to={[326, 62]} label="your epochs run" markerId="pf-arrow" />
    <Arrow from={[516, 62]} to={[596, 62]} markerId="pf-arrow" />
  </Diagram>
);

export const FundSplitDiagram = () => (
  <Diagram
    label="What happens under the hood: each ended epoch's fund is drained and split across shares"
    viewBox="0 0 840 130"
  >
    <defs>
      <marker id="fs-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 z" className="fill-tertiary" />
      </marker>
    </defs>
    <Box x={40} y={30} w={160} h={64} title="Ended epoch" sub="locked participation" />
    <Box x={240} y={30} w={160} h={64} title="Drain" sub="permissionless call" mono />
    <Box x={440} y={30} w={160} h={64} title="Shares" sub="must sum to 100%" />
    <Box x={640} y={30} w={160} h={64} title="Hooks" sub="fee · burn · custom" accent />
    <Arrow from={[202, 62]} to={[236, 62]} markerId="fs-arrow" />
    <Arrow from={[402, 62]} to={[436, 62]} markerId="fs-arrow" />
    <Arrow from={[602, 62]} to={[636, 62]} label="bps cuts" markerId="fs-arrow" />
  </Diagram>
);

export const BuyBackBurnFlowDiagram = () => (
  <Diagram
    label="Buy back & burn flow: each drained epoch fund is partially swapped and burned"
    viewBox="0 0 840 210"
  >
    <defs>
      <marker id="bb-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 z" className="fill-tertiary" />
      </marker>
    </defs>

    <Box x={270} y={14} w={220} h={42} title="Other shares" sub="protocol fee · treasury · …" dashed />
    <Box x={40} y={118} w={160} h={64} title="Epoch fund" sub="participation token" />
    <Box x={250} y={118} w={170} h={64} title="BuyAndBurnHookV3" mono />
    <Box x={470} y={118} w={160} h={64} title="Uniswap V3 pool" sub="0.3% fee tier" />
    <Box x={680} y={118} w={120} h={64} title="Dead address" accent />
    <Arrow from={[202, 150]} to={[246, 150]} label="shareBps cut" labelDy={-10} markerId="bb-arrow" />
    <Arrow from={[422, 150]} to={[466, 150]} label="exactInput" labelDy={-10} markerId="bb-arrow" />
    <Arrow from={[632, 150]} to={[676, 150]} label="burned" labelDy={-10} markerId="bb-arrow" />
    <path
      d="M 195 122 L 300 60"
      fill="none"
      strokeWidth="1.5"
      strokeDasharray="5 4"
      markerEnd="url(#bb-arrow)"
      className="stroke-tertiary"
    />
    <text x={200} y={82} fontSize="11" className="fill-secondary">
      rest of fund
    </text>
  </Diagram>
);

export const ArchitectureDiagram = () => (
  <Diagram
    label="v1 architecture: FactoryV1 orchestrates the sub-factories, distributor and hooks"
    viewBox="0 0 840 470"
  >
    <defs>
      <marker id="arch-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 z" className="fill-tertiary" />
      </marker>
    </defs>

    <Box x={340} y={16} w={160} h={44} title="Creator & users" />
    <Arrow from={[420, 60]} to={[420, 96]} label="single transaction" labelDy={-8} markerId="arch-arrow" />
    <Box x={330} y={100} w={180} h={56} title="FactoryV1" sub="entry point" mono accent />

    <Arrow from={[338, 138]} to={[234, 236]} markerId="arch-arrow" />
    <Box x={50} y={240} w={184} h={52} title="TokenV1Factory" mono />
    <Arrow from={[142, 292]} to={[142, 320]} markerId="arch-arrow" />
    <Box x={50} y={324} w={184} h={52} title="TokenV1" sub="ERC20 with allocations" mono />

    <Arrow from={[502, 138]} to={[606, 236]} markerId="arch-arrow" />
    <Box x={606} y={240} w={184} h={52} title="DistributionV1Factory" mono />
    <Arrow from={[698, 292]} to={[698, 320]} markerId="arch-arrow" />
    <Box x={606} y={324} w={184} h={52} title="DistributorV1" sub="users participate & claim" mono accent />

    <Arrow from={[420, 156]} to={[420, 320]} markerId="arch-arrow" />
    <text x={432} y={244} fontSize="11" className="fill-secondary">
      creates pool · LP burned
    </text>
    <Box x={335} y={324} w={170} h={52} title="Uniswap V3 pool" sub="0.3% fee tier" />

    <Arrow from={[668, 376]} to={[556, 408]} dashed markerId="arch-arrow" />
    <Arrow from={[700, 376]} to={[706, 408]} dashed markerId="arch-arrow" />
    <text x={480} y={404} fontSize="11" className="fill-secondary">
      shares (bps)
    </text>
    <Box x={430} y={412} w={130} h={46} title="TransferToHook" mono dashed />
    <Box x={600} y={412} w={190} h={46} title="BuyAndBurnHookV3" mono dashed />
  </Diagram>
);
