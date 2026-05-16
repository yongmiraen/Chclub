"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useTheme } from "./ThemeProvider";

type Props = {
  title?: string;
  subtitle?: string;
  back?: string;
  right?: ReactNode;
  variant?: "default" | "plain";
};

export default function TopBar({
  title = "크로소",
  subtitle,
  back,
  right,
  variant = "default",
}: Props) {
  const { resolved, toggle } = useTheme();

  return (
    <header
      className={`sticky top-0 z-20 flex h-14 items-center gap-2 px-4 ${
        variant === "default"
          ? "border-b border-stone-100 bg-white/95 backdrop-blur dark:border-stone-700 dark:bg-stone-900/95"
          : "bg-transparent"
      }`}
    >
      {back ? (
        <Link
          href={back}
          aria-label="뒤로"
          className="-ml-2 grid h-9 w-9 place-items-center rounded-full text-stone-700 active:bg-stone-100 dark:text-stone-300 dark:active:bg-stone-800"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>
      ) : null}
      <div className="flex min-w-0 flex-1 items-baseline gap-1.5">
        <h1 className="truncate text-lg font-bold text-stone-900 dark:text-stone-100">{title}</h1>
        {subtitle && (
          <span className="truncate text-xs text-stone-500 dark:text-stone-400">{subtitle}</span>
        )}
      </div>
      <div className="flex items-center gap-1">
        {right}
        <button
          type="button"
          onClick={toggle}
          aria-label={resolved === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
          className="grid h-9 w-9 place-items-center rounded-full text-stone-600 active:bg-stone-100 dark:text-stone-400 dark:active:bg-stone-800"
        >
          {resolved === "dark" ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}

export function IconButton({
  href,
  ariaLabel,
  children,
}: {
  href?: string;
  ariaLabel: string;
  children: ReactNode;
}) {
  const cls =
    "grid h-9 w-9 place-items-center rounded-full text-stone-700 active:bg-stone-100 dark:text-stone-300 dark:active:bg-stone-800";
  if (href)
    return (
      <Link href={href} aria-label={ariaLabel} className={cls}>
        {children}
      </Link>
    );
  return (
    <button type="button" aria-label={ariaLabel} className={cls}>
      {children}
    </button>
  );
}
