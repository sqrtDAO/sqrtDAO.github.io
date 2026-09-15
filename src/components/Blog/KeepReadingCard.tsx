import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";

export default function KeepReadingCard() {
  return (
    <Link
      href="/blog/"
      className="group mt-16 block rounded-l border border-subtle bg-raised p-6 transition-colors hover:border-strong"
    >
      <p className="text-caption uppercase tracking-widest text-tertiary">Keep reading</p>
      <p className="mt-2 flex items-center gap-2 font-display text-h4 font-semibold text-primary group-hover:text-accent">
        More from the sqrtDAO blog
        <IconArrowRight
          size={22}
          strokeWidth={1.75}
          className="transition-transform group-hover:translate-x-1"
        />
      </p>
    </Link>
  );
}
