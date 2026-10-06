"use client";

import { useState } from "react";
import MainnetDdp from "@/components/MainnetDdp/MainnetDdp";
import type { DdpState } from "@/components/DistributionOverview/DistributionOverview";
import Segmented from "@/components/Segmented/Segmented";
import { ddpMock } from "./ddp-mocks";

const STATES: DdpState[] = ["upcoming", "live", "finished"];

// Dev-only state toggle floating over the DDP preview.
const DdpPreview = ({ variant }: { variant: "native" | "imported" }) => {
  const [stateIdx, setStateIdx] = useState(1);
  const [connected, setConnected] = useState(0);
  const [now] = useState(() => Date.now());
  const state = STATES[stateIdx];

  return (
    <>
      <MainnetDdp
        variant={variant}
        state={state}
        connected={connected === 1}
        data={ddpMock(state, now)}
      />
      <div className="fixed bottom-4 left-4 z-30 flex flex-col gap-2 rounded-m border border-strong bg-raised p-2">
        <Segmented
          items={["Upcoming", "Live", "Finished"]}
          activeIndex={stateIdx}
          onChange={setStateIdx}
        />
        <Segmented
          items={["Disconnected", "Connected"]}
          activeIndex={connected}
          onChange={setConnected}
        />
      </div>
    </>
  );
};

export default DdpPreview;
