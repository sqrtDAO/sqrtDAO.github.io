// CAMPAIGN: no-fee-november — delete this component with src/constants/campaigns.ts.
import { STATUS_CHIP } from "@/components/Status/Status";

const NoFeeNovemberBadge = ({ label, className = "" }: { label: string; className?: string }) => (
  <span className={`${STATUS_CHIP} w-fit bg-live-bg text-accent ${className}`}>{label}</span>
);

export default NoFeeNovemberBadge;
