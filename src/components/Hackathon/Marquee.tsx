import InView from "./InView";
import { PAUSE } from "./classes";

const ITEMS = [
  "Ship fast. Get funded.",
  "Small projects are welcome",
  "Open source bonus",
  "No forms",
  "Base ecosystem",
  "Ship it. Get funded.",
  "Robinhood ecosystem",
];

// Figma 17472:86591 — desktop only (no marquee in the mobile frames). Two copies + the shared
// `marquee` keyframes (translateX −50%) loop seamlessly; pauses on hover and off screen.
const Marquee = () => (
  <InView className="hidden overflow-hidden bg-black py-4 xl:block">
    <div className={`flex w-max font-display text-[26px] leading-[normal] text-tertiary hover:[animation-play-state:paused] motion-safe:animate-marquee ${PAUSE}`}>
      {[0, 1].map((copy) => (
        <ul key={copy} aria-hidden={copy ? true : undefined} className="flex shrink-0 gap-16 pr-16 whitespace-nowrap">
          {ITEMS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ))}
    </div>
  </InView>
);

export default Marquee;
