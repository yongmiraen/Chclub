import Link from "next/link";
import type { ReactNode } from "react";

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
  return (
    <header
      className={`sticky top-0 z-20 flex h-14 items-center gap-2 px-4 ${
        variant === "default"
          ? "border-b border-stone-100 bg-white/95 backdrop-blur"
          : "bg-transparent"
      }`}
    >
      {back ? (
        <Link
          href={back}
          aria-label="뒤로"
          className="-ml-2 grid h-9 w-9 place-items-center rounded-full text-stone-700 active:bg-stone-100"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>
      ) : null}
      <div className="flex min-w-0 flex-1 items-baseline gap-1.5">
        <h1 className="truncate text-lg font-bold text-stone-900">{title}</h1>
        {subtitle && (
          <span className="truncate text-xs text-stone-500">{subtitle}</span>
        )}
      </div>
      <div className="flex items-center gap-1">{right}</div>
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
    "grid h-9 w-9 place-items-center rounded-full text-stone-700 active:bg-stone-100";
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
