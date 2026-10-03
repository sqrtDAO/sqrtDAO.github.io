"use client";

import DialogShell from "@/components/DialogShell/DialogShell";
import { BODY_M, BODY_S } from "@/constants/typography";

// Figma 12053:112067 — opened from NativeTokenBanner's "What's that mean?".
const AboutTokenDialog = ({ onClose }: { onClose: () => void }) => (
  <DialogShell
    title="About the token"
    onClose={onClose}
    subtitle={
      <>
        <p className={`${BODY_M} text-primary`}>
          This token was minted through sqrtDAO, not imported.
        </p>
        <p className={`${BODY_S} text-secondary`}>
          That means its contract is our standard one; fixed supply, no hidden
          mint, no backdoor.
          <br />
          So there are no nasty surprises hiding in the code.
          <br />
          The project itself is still yours to research;{" "}
          <span className="text-primary">
            This just means the token is honest.
          </span>
        </p>
      </>
    }
  />
);

export default AboutTokenDialog;
