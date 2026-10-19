"use client";

import { useId } from "react";
import EcosystemLogo from "@/components/EcosystemLogo/EcosystemLogo";
import SelectBox from "@/components/SelectBox/SelectBox";
import { ECOSYSTEMS } from "@/constants/ecosystems";
import { BODY_M } from "@/constants/typography";
import { isLive } from "@/utils/chain-utils";

type EcosystemPickerProps = {
  variant: "rich" | "minimal";
  value: number;
  onChange: (chainId: number) => void;
};

// "Choose ecosystem" — rich cards scroll sideways (launch), minimal pills wrap (import).
const EcosystemPicker = ({ variant, value, onChange }: EcosystemPickerProps) => {
  const labelId = useId();
  return (
    <div className={`flex w-full flex-col ${variant === "rich" ? "gap-4" : "gap-2"}`}>
      <p id={labelId} className={`${BODY_M} text-primary`}>
        Choose ecosystem
      </p>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        className={`flex gap-2 ${variant === "rich" ? "-mx-4 overflow-x-auto px-4 xl:mx-0 xl:px-0" : "flex-wrap"}`}
      >
        {ECOSYSTEMS.map((e) => {
          const live = isLive(e);
          return (
            <SelectBox
              key={e.slug}
              variant={variant}
              icon={<EcosystemLogo slug={e.slug} />}
              label={variant === "rich" && e.testnet ? `${e.name} Testnet` : e.name}
              description={live ? e.description : "Working on it, coming soon"}
              selected={e.chain?.id === value}
              disabled={!live}
              onSelect={() => onChange(e.chain!.id)}
            />
          );
      })}
    </div>
  </div>
  );
};

export default EcosystemPicker;
