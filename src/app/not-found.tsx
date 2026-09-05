import Link from "next/link";
import { IconChevronLeft } from "@tabler/icons-react";
import "@/components/Button/Button.css";

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center gap-8 overflow-hidden px-6 text-center">
      <img
        src="/404/illustration.svg"
        alt=""
        width={1920}
        height={771}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-auto w-full"
      />
      <div className="relative z-10 flex w-full flex-col items-center gap-1">
        <p className="font-display text-display-m font-semibold leading-none tracking-[-0.02em] text-primary">
          404
        </p>
        <p className="font-display text-h2 font-semibold leading-none tracking-[-0.36px] text-primary">
          Oops! Page not found
        </p>
      </div>
      <p className="relative z-10 w-full max-w-[432px] text-body-l text-primary">
        Looks like you&apos;ve wandered into uncharted territory. The
        coordinate you requested does not exist or has been relocated to
        another sector.
      </p>
      <Link href="/" className="sqrt-btn sqrt-btn--primary sqrt-btn--l relative z-10">
        <span className="sqrt-btn__icon" aria-hidden="true">
          <IconChevronLeft size={20} strokeWidth={2} />
        </span>
        <span className="sqrt-btn__label">Back to Main Page</span>
      </Link>
    </main>
  );
}
