"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = {
  href: string;
  label: string;
  icon: React.ReactNode;
  match: (path: string) => boolean;
};

const items: Item[] = [
  {
    href: "/",
    label: "홈",
    match: (p) => p === "/",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z" />
      </svg>
    ),
  },
  {
    href: "/categories",
    label: "카테고리",
    match: (p) => p.startsWith("/categories"),
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
  },
  {
    href: "/groups/new",
    label: "만들기",
    match: (p) => p.startsWith("/groups/new"),
    icon: (
      <span className="grid h-9 w-9 place-items-center rounded-full bg-amber-700 text-white shadow-md">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </span>
    ),
  },
  {
    href: "/my",
    label: "내모임",
    match: (p) => p.startsWith("/my"),
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname() || "/";
  return (
    <nav className="sticky bottom-0 z-30 border-t border-stone-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="mx-auto grid max-w-[430px] grid-cols-4">
        {items.map((it) => {
          const active = it.match(pathname);
          const isCenter = it.href === "/groups/new";
          return (
            <li key={it.href} className="contents">
              <Link
                href={it.href}
                className={`flex flex-col items-center justify-center gap-1 py-2 text-[11px] transition ${
                  active && !isCenter ? "text-amber-700" : "text-stone-500"
                }`}
              >
                <span>{it.icon}</span>
                <span>{it.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
