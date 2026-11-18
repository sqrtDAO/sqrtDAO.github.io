import Image from "next/image";
import type { CSSProperties } from "react";
import Logo from "@/components/Logo/Logo";
import InView from "./InView";
import { PAUSE } from "./classes";

// "Who it's for" artwork. Figma flattens Students / Vibe / Open-source into single vectors;
// rebuilt as DOM (geometry and colors read from those vectors) so parts can move. The static
// layout is the resting state; motion is transform/opacity/clip-path only, motion-safe, and
// keyed off the InView group (start on enter, loops pause off screen). Decorative: the card
// copy carries the meaning.
const MONO = "font-mono text-caption leading-[1.5]";
const vars = (v: Record<string, string>) => v as CSSProperties;

// Solo — Figma 17566:90053. Ring drifts, the two "+1"s orbit (counter-rotated to stay upright),
// the glow breathes.
const SPIN = `motion-safe:animate-spin ${PAUSE}`;
// Durations/direction inline: the animate-* shorthand would otherwise reset them (to 1s).
const ORBIT = vars({ animationDuration: "70s" });
const COUNTER = vars({ animationDuration: "70s", animationDirection: "reverse" });
export const SoloVignette = () => (
  <InView className="relative h-[324px] w-full overflow-hidden rounded-[10px]">
    <div aria-hidden="true" className="absolute top-[calc(50%-10px)] left-1/2">
      <Image src="/hackathon/orbit-ring.png" alt="" width={200} height={200} style={vars({ animationDuration: "120s" })} className={`absolute size-50 max-w-none -translate-1/2 ${SPIN}`} />
      <Image
        src="/hackathon/orbit-glow.svg"
        alt=""
        width={170}
        height={170}
        style={vars({ animationDuration: "6s" })}
        className={`absolute size-[170px] max-w-none -translate-1/2 motion-safe:animate-pulse ${PAUSE}`}
      />
      <Image src="/hackathon/orbit-inner.svg" alt="" width={118} height={118} className="absolute size-[118px] max-w-none -translate-1/2" />
      <Logo variant="sign" className="absolute h-10 w-auto max-w-none -translate-1/2" />
      <div style={ORBIT} className={`absolute ${SPIN}`}>
        <span
          className={`absolute left-[100px] flex size-[30px] -translate-1/2 items-center justify-center rounded-pill bg-(--color-charts-epochs-300) text-body leading-5.5 text-primary ${SPIN}`}
          style={COUNTER}
        >
          +1
        </span>
        <span
          className={`absolute left-[-100px] flex size-6 -translate-1/2 items-center justify-center rounded-[6px] bg-(--color-support-teal-300) pt-0.5 text-body leading-5.5 text-on-amber ${SPIN}`}
          style={COUNTER}
        >
          +1
        </span>
      </div>
      <p className={`absolute top-[134px] -translate-x-1/2 whitespace-nowrap text-secondary ${MONO}`}>1 person + 1 idea</p>
    </div>
  </InView>
);

// Students — Figma 17568:90614. Cards start squared up on the middle one, fan out to their
// ±2° resting positions with a slight overshoot, then the "public √" badge pops in.
const STUDENT_CARD =
  "absolute flex w-[262.7px] flex-col justify-center gap-1 rounded-m bg-surface px-4 font-mono text-[13px] leading-[1.5] motion-safe:transition-[translate,rotate] motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.34,1.56,0.64,1)]";

export const StudentsVignette = ({ className = "" }: { className?: string }) => (
  <InView className={`flex items-center justify-center overflow-hidden rounded-[10px] ${className}`}>
    <div aria-hidden="true" className="relative h-[230px] w-[269px] shrink-0">
      <div className={`${STUDENT_CARD} top-[4.75px] left-[1px] h-[70px] rotate-2 motion-safe:group-data-[view=idle]/view:translate-y-[73px] motion-safe:group-data-[view=idle]/view:rotate-0`}>
        <p className="text-primary">first_project/</p>
        <p className="text-secondary">README.md</p>
      </div>
      <div className={`${STUDENT_CARD} top-[155.85px] left-[5.4px] h-[70px] -rotate-2 motion-safe:group-data-[view=idle]/view:-translate-y-[78px] motion-safe:group-data-[view=idle]/view:rotate-0`}>
        <p className="text-primary">feedback from sqrtDAO</p>
        <p className="text-secondary">“ship v0.2, it works”</p>
      </div>
      <div className={`${STUDENT_CARD} top-[77.6px] left-[4.2px] h-[74.3px] items-start`}>
        <p className="text-primary">git push origin main</p>
        <p className="origin-left rounded-s bg-(--color-support-teal-900) px-1.5 text-caption text-(--color-support-teal-300) motion-safe:transition-[scale] motion-safe:delay-700 motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-safe:group-data-[view=idle]/view:scale-0">
          public √
        </p>
      </div>
    </div>
  </InView>
);

// Vibe coders — Figma 17568:90751. Bubble, then the code types line by line, then "deployed"
// pops; replays every 6s while on screen. Going back to idle is instant (duration-0).
const STEP =
  "delay-(--d) motion-safe:duration-(--t) motion-safe:group-data-[view=idle]/view:delay-0 motion-safe:group-data-[view=idle]/view:duration-0";
const TYPE = `[clip-path:inset(0)] motion-safe:transition-[clip-path] motion-safe:ease-[steps(var(--n))] motion-safe:group-data-[view=idle]/view:[clip-path:inset(0_100%_0_0)] ${STEP}`;
const CODE = [
  { n: 23, pad: false, line: (<><span className="text-(--color-charts-epochs-300)">export</span> <span className="text-accent">function</span> App() {"{"}</>) },
  { n: 26, pad: true, line: (<>const [votes] = <span className="text-(--color-support-teal-300)">useVotes</span>()</>) },
  { n: 19, pad: true, line: <>return &lt;Playlist /&gt;</> },
  { n: 1, pad: true, line: <>{"}"}</> },
];
const CHAR_MS = 28;
const CODE_START = 700;
const codeTimings = CODE.reduce<{ at: number; list: { d: number; t: number }[] }>(
  (acc, { n }) => ({ at: acc.at + n * CHAR_MS + 120, list: [...acc.list, { d: acc.at, t: n * CHAR_MS }] }),
  { at: CODE_START, list: [] },
);

export const VibeVignette = () => (
  <InView loopMs={6000} className={`flex h-[324px] w-full flex-col gap-2.5 overflow-hidden rounded-[10px] p-3.5 ${MONO}`}>
    <p
      aria-hidden="true"
      style={vars({ "--d": "0ms", "--t": "400ms" })}
      className={`max-w-[219px] self-end rounded-[6px] rounded-br-none bg-infra px-2.5 py-2 text-primary motion-safe:transition-[opacity,translate] motion-safe:group-data-[view=idle]/view:translate-y-2 motion-safe:group-data-[view=idle]/view:opacity-0 ${STEP}`}
    >
      make a playlist app my friends can vote on
    </p>
    <div aria-hidden="true" className="h-[196px] rounded-m bg-canvas px-5 py-3 leading-[23.5px] whitespace-pre text-secondary">
      {CODE.map(({ n, pad, line }, i) => (
        <p
          key={i}
          style={vars({ "--d": `${codeTimings.list[i].d}ms`, "--t": `${codeTimings.list[i].t}ms`, "--n": String(n) })}
          className={`w-fit ${pad ? "pl-[11px]" : ""} ${TYPE}`}
        >
          {line}
        </p>
      ))}
    </div>
    <p
      aria-hidden="true"
      style={vars({ "--d": `${codeTimings.at + 150}ms`, "--t": "350ms" })}
      className={`flex h-7 origin-left items-center rounded-m bg-live-bg px-2.5 text-action motion-safe:transition-[opacity,scale] motion-safe:ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-safe:group-data-[view=idle]/view:scale-90 motion-safe:group-data-[view=idle]/view:opacity-0 ${STEP}`}
    >
      deployed in 2 days
    </p>
  </InView>
);

// Open-source maintainers — Figma 17568:90921. 11×7 commit grid read cell-by-cell from the
// vector; cells light up over ~2s in a scattered order, then about half keep "committing" — a
// soft epochs-200 overlay pulsing 0 → .5 → 0 on its own 3–7s rhythm. The funded badge's ring
// pulses softly. Overlays exist only with motion, so the resting state is exactly Figma's.
const C: Record<string, string> = {
  "3": "bg-(--color-charts-epochs-300)",
  "4": "bg-(--color-charts-epochs-400)",
  "7": "bg-(--color-charts-epochs-700)",
  "9": "bg-(--color-charts-epochs-900)",
  s: "bg-surface",
  r: "bg-raised",
};
const COMMITS = ["74ssr7sr4r7", "4439r997rrr", "997779s4rs4", "s94s4797477", "s473797rs9r", "9949r774r94", "9s937r43r79"]
  .join("")
  .split("");

export const OpenSourceVignette = () => (
  <InView className="flex w-full flex-col overflow-hidden rounded-[10px] p-4">
    <div aria-hidden="true" className="flex justify-between text-body-s leading-5">
      <p className="text-primary">your/lib</p>
      <p className="text-accent">★ 1.2k</p>
    </div>
    <div aria-hidden="true" className="mt-1.5 grid grid-cols-11 gap-1">
      {COMMITS.map((c, i) => (
        <span
          key={i}
          style={vars({ "--d": `${((i * 37) % 77) * 28}ms` })}
          className={`relative aspect-square rounded-xs delay-(--d) motion-safe:transition-opacity motion-safe:duration-500 motion-safe:group-data-[view=idle]/view:opacity-20 ${C[c]}`}
        >
          {(i * 7) % 9 < 4 && (
            <span
              style={vars({ animationDuration: `${3000 + ((i * 53) % 4000)}ms`, animationDelay: `-${(i * 211) % 5000}ms` })}
              className={`absolute inset-0 hidden rounded-xs bg-(--color-charts-epochs-200) opacity-0 motion-safe:block motion-safe:animate-pulse ${PAUSE}`}
            />
          )}
        </span>
      ))}
    </div>
    <p
      aria-hidden="true"
      className={`relative mt-3 flex h-[34px] items-center gap-2 rounded-[6px] border border-(--color-support-violet-300) bg-(--color-charts-epochs-800) px-2.5 text-primary ${MONO}`}
    >
      <span style={vars({ animationDuration: "2.5s" })} className={`absolute -inset-px hidden rounded-[6px] ring-2 ring-(--color-support-violet-300)/50 motion-safe:block motion-safe:animate-pulse ${PAUSE}`} />
      <span className="size-2 rounded-pill bg-(--color-charts-epochs-300)" />
      epoch 1459 funded
    </p>
  </InView>
);
