"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MainnetHeader from "@/components/MainnetHeader/MainnetHeader";
import MainnetFooter from "@/components/MainnetFooter/MainnetFooter";
import NavLink from "@/components/NavLink/NavLink";
import DocSearch from "./DocSearch";
import { docsNav } from "@/app/docs/docs-nav";

export default function DocsShell({ children }: { children: React.ReactNode }) {
  const mainRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="flex h-dvh flex-col">
      <MainnetHeader
        showWallet={false}
        mobileMenuExtra={
          <div className="flex w-full flex-col items-center gap-2 pt-2">
            {docsNav.map((group, i) => (
              <div key={group.label ?? i} className="flex w-full flex-col items-center gap-2">
                {group.label && (
                  <p className="w-full px-4 pt-2 text-caption uppercase tracking-widest text-tertiary">
                    {group.label}
                  </p>
                )}
                {group.items.map((item) => (
                  <NavLink key={item.path} label={item.label} href={item.path} size="l" className="w-full" />
                ))}
              </div>
            ))}
          </div>
        }
      />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="hidden w-72 shrink-0 flex-col border-r border-subtle bg-surface lg:flex">
          <DocSearch />
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

        <main ref={mainRef} className="min-w-0 flex-1 overflow-y-auto">
          <div className="flex min-h-full flex-col">
            <article className="mx-auto w-full max-w-3xl px-6 py-12 sm:px-gutter sm:py-20">
              {children}
              <DocsPager />
            </article>
            <div className="mt-auto">
              <MainnetFooter />
            </div>
          </div>
        </main>
      </div>
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
