export default function InvestmentDiagram() {
  return (
    <div className="mt-5 rounded-l border border-subtle bg-raised p-5">
      <svg
        viewBox="0 0 680 300"
        role="img"
        aria-label="Investors put money into your project, you build, and if the project grows they get a share of the profit."
        className="block h-auto w-full font-display"
      >
        <defs>
          <marker
            id="invest-arrow"
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
              className="stroke-tertiary"
            />
          </marker>
        </defs>

        <rect x={24} y={30} width={180} height={88} rx={14} strokeWidth={1.3} className="fill-raised stroke-muted" />
        <text x={114} y={60} textAnchor="middle" className="fill-tertiary text-[12px] tracking-widest">
          INVESTORS
        </text>
        <text x={114} y={86} textAnchor="middle" className="fill-primary text-[18px] font-semibold">
          money + trust
        </text>

        <rect x={250} y={30} width={180} height={88} rx={14} strokeWidth={1.6} className="fill-action-glow stroke-focus" />
        <text x={340} y={60} textAnchor="middle" className="fill-tertiary text-[12px] tracking-widest">
          YOUR PROJECT
        </text>
        <text x={340} y={86} textAnchor="middle" className="fill-primary text-[18px] font-semibold">
          the work you do
        </text>

        <rect x={476} y={30} width={180} height={88} rx={14} strokeWidth={1.3} className="fill-raised stroke-muted" />
        <text x={566} y={60} textAnchor="middle" className="fill-tertiary text-[12px] tracking-widest">
          PROJECT GROWS
        </text>
        <text x={566} y={86} textAnchor="middle" className="fill-primary text-[18px] font-semibold">
          users, revenue
        </text>

        <line x1={204} y1={74} x2={246} y2={74} strokeWidth={2} markerEnd="url(#invest-arrow)" className="stroke-tertiary" />
        <text x={225} y={58} textAnchor="middle" className="fill-secondary text-[12px]">
          money
        </text>

        <line x1={430} y1={74} x2={472} y2={74} strokeWidth={2} markerEnd="url(#invest-arrow)" className="stroke-tertiary" />
        <text x={451} y={58} textAnchor="middle" className="fill-secondary text-[12px]">
          work
        </text>

        <path
          d="M566 118 L566 236 L114 236 L114 122"
          fill="none"
          strokeWidth={2}
          markerEnd="url(#invest-arrow)"
          className="stroke-accent"
        />
        <text x={340} y={262} textAnchor="middle" className="fill-accent text-[14px]">
          share of the profit — or nothing, if it fails
        </text>
      </svg>
    </div>
  );
}
