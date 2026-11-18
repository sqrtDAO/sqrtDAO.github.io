import Link from "next/link";
import Logo from "@/components/Logo/Logo";
import NavLink from "@/components/NavLink/NavLink";
import { BODY_M } from "@/constants/typography";
import { HACKATHON_NAV } from "@/constants/hackathon";
import ScrollFx from "./ScrollFx";

// Figma _campaign-header 17585:108280 (desktop: sticky, black→transparent gradient over a
// progressive blur — the blur layer is masked so its strength fades out toward the bottom edge,
// no hard line) / 17563:88451 (mobile: logo only, part of the hero view — not sticky, no fill).
const HackathonNav = () => (
  <header className="relative top-0 z-20 xl:sticky">
    <ScrollFx />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden bg-linear-to-b from-black/80 via-black/40 to-transparent backdrop-blur-md [mask-image:linear-gradient(to_bottom,black_40%,transparent)] xl:block"
    />
    <div className="relative mx-auto flex max-w-[390px] items-center justify-between px-4 py-6 xl:max-w-[1544px] xl:px-6">
      <div className="flex items-center gap-4">
        <Link href="/" aria-label="sqrtDAO home">
          <Logo className="h-10 w-auto xl:h-12" />
        </Link>
        <p className={`hidden text-secondary xl:block ${BODY_M}`}>sqrtDAO Builder Hackathon</p>
      </div>
      <nav aria-label="Hackathon sections" className="hidden gap-2 xl:flex">
        {HACKATHON_NAV.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
      </nav>
    </div>
  </header>
);

export default HackathonNav;
