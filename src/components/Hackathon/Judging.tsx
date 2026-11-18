import Image from "next/image";
import { IconBrandDiscord, IconBrandGithub, IconBrandX, IconBrightnessUp, IconSignLeft, IconUsers } from "@tabler/icons-react";
import { BODY_L, BODY_M } from "@/constants/typography";
import { DISCORD_URL, X_URL } from "@/constants/links";
import SectionHeading from "./SectionHeading";
import "@/components/IconButton/IconButton.css";

const CRITERIA = [
  { n: "01", icons: [IconBrandX, IconBrandGithub], title: "Open source and continuous shipping", note: "How much you build and ship, and how often." },
  { n: "02", icons: [IconUsers], title: "Community participation vol and votes", note: "Real people votes and their participation volume in your distribution." },
  { n: "03", icons: [IconBrightnessUp], title: "Product idea", note: "Does it work, and is it useful?" },
  { n: "04", icons: [IconSignLeft], title: "Market fit", note: "How well it fits web3 or AI." },
];

const SOCIALS = [
  { label: "X", href: X_URL, Icon: IconBrandX },
  { label: "Discord", href: DISCORD_URL, Icon: IconBrandDiscord },
];

// Figma 17472:86202 (desktop) / 17572:91237 + 17572:91660 (mobile).
const Judging = () => (
  <section id="judging" className="scroll-mt-24 py-6 xl:py-35">
    <div className="mx-auto flex w-full max-w-[390px] flex-col gap-6 px-4 xl:max-w-[1373px] xl:px-6">
      <SectionHeading
        text="How projects are judged"
        className="text-h3 leading-[normal] font-normal text-primary xl:text-display-m xl:font-semibold xl:tracking-[-0.02em]"
        backing={
          <>
            <span aria-hidden="true" className="absolute top-0 left-0 h-[35px] w-[346px] bg-black xl:hidden" />
            <Image src="/hackathon/judging-heading-backing.svg" alt="" width={1191} height={119} className="absolute top-0 left-0 hidden max-w-none xl:block" />
          </>
        }
      />

      <div className="flex flex-col gap-2 xl:flex-row xl:gap-6">
        {CRITERIA.map(({ n, icons, title, note }) => (
          <div key={n} className="flex flex-col gap-2 bg-black p-2 xl:min-w-0 xl:flex-1 xl:gap-6 xl:py-3">
            <div className="flex items-center justify-between xl:flex-col xl:items-start xl:gap-4">
              <p className="font-display text-h3 leading-[normal] text-tertiary">{n}</p>
              <div className="flex gap-4 text-primary xl:gap-8" aria-hidden="true">
                {icons.map((Icon, i) => (
                  <Icon key={i} stroke={1.5} className="size-6 xl:size-12" />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1 xl:flex-1 xl:justify-end xl:gap-4 xl:pt-4">
              <h3 className="font-sans text-h4 leading-[normal] font-medium text-primary xl:font-display xl:text-[26px] xl:leading-[1.1] xl:font-semibold xl:tracking-[-0.01em]">
                {title}
              </h3>
              <p className={`text-secondary ${BODY_M}`}>{note}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col bg-black xl:flex-row xl:gap-10">
        <p className="font-display text-h3 leading-[normal] text-primary xl:w-[820px] xl:shrink-0">
          Judging happens <span className="text-accent">after the Hackathon closes on 20 Dec</span>, based on everything you did during the Hackathon.
          Open-source projects with a public repo get bonus points.
        </p>
        <div className="flex flex-col justify-end gap-2 p-4 xl:min-w-0 xl:flex-1 xl:p-0">
          <p className={`text-secondary ${BODY_L}`}>Want to judge? Reply to us on X or say hi in Discord.</p>
          <div className="flex gap-2.5">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="icon-btn icon-btn--ghost icon-btn--m">
                <span className="icon-btn__icon" aria-hidden="true">
                  <Icon size={24} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Judging;
