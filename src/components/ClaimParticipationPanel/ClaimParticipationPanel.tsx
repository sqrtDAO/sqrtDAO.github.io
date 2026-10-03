import ClaimCard, {
  type ClaimCardProps,
} from "@/components/ClaimCard/ClaimCard";
import ParticipationCard, {
  type ParticipationCardProps,
} from "@/components/ParticipationCard/ParticipationCard";

type ClaimParticipationPanelProps = {
  /** Omit when the wallet has nothing to claim (or isn't connected). */
  claim?: ClaimCardProps;
  participation: ParticipationCardProps;
};

// Figma 10285:97779 (desktop, 424 wide) / 14730:123928 (mobile "participation volume").
const ClaimParticipationPanel = ({
  claim,
  participation,
}: ClaimParticipationPanelProps) => (
  <div className="flex w-full flex-col gap-2 bg-surface p-2 xl:w-106">
    {claim && <ClaimCard {...claim} />}
    <ParticipationCard {...participation} />
  </div>
);

export default ClaimParticipationPanel;
