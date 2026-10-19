import { BODY_S } from "@/constants/typography";
import { ecosystemOf } from "@/utils/chain-utils";

// Figma 11597:109270 — "on BASE" / "on ROBINHOOD" / … tag.
const EcosystemLabel = ({ chainId, className = "" }: { chainId?: number; className?: string }) => {
  const ecosystem = ecosystemOf(chainId);
  if (!ecosystem) return null;
  return (
    <span
      className={`inline-flex h-5 shrink-0 items-center px-1 whitespace-nowrap ${BODY_S} ${ecosystem.label} ${className}`}
    >
      on {ecosystem.name.toUpperCase()}
    </span>
  );
};

export default EcosystemLabel;
