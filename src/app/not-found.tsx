import Link from "next/link";
import { IconChevronLeft } from "@tabler/icons-react";
import "@/components/Button/Button.css";

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center gap-6 overflow-y-auto overflow-x-hidden px-6 py-12 text-center md:gap-8">
      <div className="order-1 flex w-full flex-col items-center gap-1">
        <p className="font-display text-display-m font-semibold leading-none tracking-[-0.02em] text-primary">
          404
        </p>
        <p className="font-display text-h3 font-normal leading-none text-primary md:text-h2 md:font-semibold md:tracking-[-0.36px]">
          Oops! Page not found
        </p>
      </div>
      <p className="order-2 w-full text-left text-body leading-[22px] tracking-[0.16px] text-primary md:max-w-[432px] md:text-center md:text-body-l md:leading-[24px] md:tracking-[0.36px]">
        Looks like you&apos;ve wandered into uncharted territory. The
        coordinate you requested does not exist or has been relocated to
        another sector.
      </p>
      <img
        src="/404/illustration.svg"
        alt=""
        width={1920}
        height={771}
        className="pointer-events-none order-3 h-auto w-[246.15%] max-w-none shrink-0 md:order-5 md:-mx-6 md:w-[calc(100%+3rem)]"
      />
      <Link
        href="/"
        className="sqrt-btn sqrt-btn--primary sqrt-btn--l order-4 md:order-3"
      >
        <span className="sqrt-btn__icon" aria-hidden="true">
          <IconChevronLeft size={20} strokeWidth={2} />
        </span>
        <span className="sqrt-btn__label">Back to Main Page</span>
      </Link>
    </main>
  );
}
