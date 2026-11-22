import type { Connector } from "wagmi";

type DisplayUriEvent = { type: string; data?: unknown };

/**
 * Wallets announce their pairing URI through a `display_uri` message. With
 * `showQrModal: false` nobody renders it for us, so this is where our modal
 * picks it up (QR on desktop, deep link on mobile).
 */
export const onDisplayUri = (
  connector: Connector | undefined,
  listener: (uri: string) => void,
) => {
  if (!connector) return () => {};

  const handler = ({ type, data }: DisplayUriEvent) => {
    if (type === "display_uri" && typeof data === "string") listener(data);
  };

  connector.emitter.on("message", handler);
  return () => {
    connector.emitter.off("message", handler);
  };
};
