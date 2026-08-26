"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconMenu, IconX } from "@tabler/icons-react";
import Logo from "@/components/Logo/Logo";
import DocSearch from "./DocSearch";
import { docsNav } from "@/app/docs/docs-nav";

export default function DocsShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="flex h-dvh flex-col lg:flex-row">
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-subtle bg-surface px-5 lg:hidden">
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="rounded-m p-1.5 text-primary hover:bg-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          {open ? <IconX size={22} strokeWidth={1.5} /> : <IconMenu size={22} strokeWidth={1.5} />}
        </button>
        <Link href="/docs/" className="font-display text-body-l font-semibold text-primary">
          sqrtDAO <span className="text-accent">docs</span>
        </Link>
      </header>

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 flex-col border-r border-subtle bg-surface transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-subtle px-6 py-4">
          <Link href="/" aria-label="sqrtDAO home">
            <Logo mono width={92} height={34} />
          </Link>
        </div>
        <DocSearch onNavigate={closeMenu} />
        <nav aria-label="Docs" className="flex-1 overflow-y-auto px-3 pb-gutter">
          {docsNav.map((group, i) => (
            <div key={group.label ?? i} className="mt-6">
              {group.label && (
                <p className="px-3 pb-1.5 text-caption uppercase tracking-widest text-tertiary">
                  {group.label}
                </p>
              )}
              <ul>
                {group.items.map((item) => (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      onClick={closeMenu}
                      aria-current={pathname === item.path ? "page" : undefined}
                      className={`block rounded-m px-3 py-2.5 text-body transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
                        pathname === item.path
                          ? "bg-raised text-accent"
                          : "text-secondary hover:bg-raised hover:text-primary"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 cursor-default bg-black/60 lg:hidden"
        />
      )}

      <main ref={mainRef} className="min-w-0 flex-1 overflow-y-auto">
        <article className="mx-auto w-full max-w-3xl px-6 py-12 sm:px-gutter sm:py-20">
          {children}
          <DocsPager />
        </article>
      </main>
    </div>
  );
}

const DocsPager = () => {
  const pathname = usePathname();
  const items = docsNav.flatMap((group) => group.items);
  const index = items.findIndex((item) => item.path === pathname);
  if (index === -1) return null;
  const prev = index > 0 ? items[index - 1] : null;
  const next = index < items.length - 1 ? items[index + 1] : null;

  return (
    <nav aria-label="Pagination" className="mt-20 flex justify-between gap-4 border-t border-subtle pt-8">
      {prev ? (
        <Link href={prev.path} className="group rounded-m text-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          <span className="block text-label uppercase tracking-wider text-tertiary">Previous</span>
          <span className="mt-0.5 block text-accent group-hover:underline">{prev.label}</span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link href={next.path} className="group rounded-m text-right text-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          <span className="block text-label uppercase tracking-wider text-tertiary">Next</span>
          <span className="mt-0.5 block text-accent group-hover:underline">{next.label}</span>
        </Link>
      )}
    </nav>
  );
};
