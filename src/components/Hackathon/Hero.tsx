import Image from "next/image";
import EcosystemLogo from "@/components/EcosystemLogo/EcosystemLogo";
import { BODY_L, BODY_M, BODY_S } from "@/constants/typography";
import HeroHeadline from "./HeroHeadline";
import CtaLinks from "./CtaLinks";
import LaunchConsole from "./LaunchConsole";
import Marquee from "./Marquee";

const STEPS = ["Build fast", "Launch your token", "Ship in public", "Get funded"];
// Chain chip fills have no token yet (flagged): Base blue, Robinhood lime.
const CHIP = "px-[3px] py-[5px] xl:px-1 xl:py-1.5";
// Figma "normal" line height for Plex Condensed at 22px is 29px; the browser's normal is 33px.
const H4_MEDIUM = "xl:text-h4 xl:font-medium xl:leading-[29px] xl:tracking-normal";
const CHAIN_TEXT = `text-primary ${BODY_L} ${H4_MEDIUM}`;

// Figma hero grid 17472:86405 (desktop) / 17563:88453 + 17563:89180 (mobile, two screens).
const Hero = () => (
  <section className="xl:flex xl:min-h-[calc(100dvh-96px)] xl:flex-col">
    <div className="mx-auto flex w-full max-w-[390px] flex-col xl:max-w-[1373px] xl:my-auto xl:flex-row xl:items-center xl:justify-center xl:gap-6 xl:px-6">
      <div className="flex min-h-[calc(100dvh-88px)] flex-col gap-6 py-6 xl:min-h-0 xl:max-w-[888px] xl:min-w-0 xl:flex-1 xl:gap-3 xl:py-0">
        <div className="flex flex-1 flex-col justify-center gap-2 px-4 xl:flex-none xl:gap-3 xl:px-0">
          <p className={`text-secondary ${BODY_S} xl:text-body xl:leading-5.5`}>sqrtDAO Builder Hackathon</p>
          <HeroHeadline />
        </div>

        <div className="relative flex w-full max-w-[390px] flex-col items-start gap-4 px-4 xl:max-w-none xl:gap-2 xl:px-0 xl:pb-1">
          <Image src="/hackathon/lede-backing-mobile.svg" alt="" width={390} height={168} className="absolute top-0 left-0 xl:hidden" />
          <Image src="/hackathon/lede-backing.svg" alt="" width={564} height={186} className="absolute top-0 left-0 hidden xl:block" />
          <p className={`relative text-secondary ${BODY_L} xl:w-[600px] ${H4_MEDIUM}`}>
              Ship your project, launch your token and get funded by your community. We help with setup and
              marketing. Up to $2.5k in prizes.
            </p>
          <div className="relative w-full xl:w-auto">
            <CtaLinks className="w-full xl:w-auto" />
          </div>
          <div className="relative flex items-center gap-2.5">
            <span className={CHAIN_TEXT}>Live on</span>
            <span className={`bg-[#0052ff] ${CHIP}`}>
              <EcosystemLogo slug="base" shape="watermark" className="h-3.5 w-auto xl:h-4.5" />
            </span>
            <span className={CHAIN_TEXT}>and</span>
            <span className={`bg-[#ccff00] ${CHIP}`}>
              <Image src="/hackathon/robinhood-light.svg" alt="Robinhood Chain" width={523} height={100} className="h-3.5 w-auto xl:h-4.5" />
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:w-[413px] xl:shrink-0 xl:gap-6">
        <LaunchConsole />
        <div className="flex flex-col gap-2 px-4 py-6 xl:gap-1.5 xl:p-0">
          <div className="relative w-[296px] xl:w-[413px]">
            <Image src="/hackathon/ticker-backing-mobile.svg" alt="" width={296} height={98} className="absolute inset-0 h-full w-full xl:hidden" />
            <Image src="/hackathon/ticker-backing.svg" alt="" width={413} height={136} className="absolute inset-0 hidden h-full w-full xl:block" />
            {/* Row height = the backing's band step (Figma: 24.38 mobile / 34 desktop). */}
            <ul className="relative font-display text-body leading-[24.38px] xl:text-h4 xl:leading-[34px]">
              {STEPS.map((step, i) => (
                <li key={step} className={`flex items-center gap-2 xl:gap-3 ${i ? "text-tertiary" : "text-primary"}`}>
                  <span aria-hidden="true" className={`h-0.5 ${i ? "w-[13px] bg-tertiary xl:w-[18px]" : "w-6 bg-action xl:w-[34px]"}`} />
                  {step}
                </li>
              ))}
            </ul>
          </div>
          <p className={`text-secondary ${BODY_M}`}>
            During this hackathon people can fund your project.{" "}
            <span className="text-accent">Winners get funded by sqrtDAO too.</span>
          </p>
        </div>
      </div>
    </div>
    <Marquee />
  </section>
);

export default Hero;
