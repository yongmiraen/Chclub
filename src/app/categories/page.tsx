import Link from "next/link";
import TopBar, { IconButton } from "@/components/TopBar";
import { CATEGORIES } from "@/lib/categories";
import { toneFor } from "@/lib/theme";

export const metadata = { title: "카테고리 · 크로소" };

export default function CategoriesPage() {
  return (
    <>
      <TopBar
        title="카테고리"
        right={
          <IconButton ariaLabel="검색">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </IconButton>
        }
      />
      <div className="px-4 py-4">
        <Section title="신앙" group="신앙" />
        <div className="h-4" />
        <Section title="취미" group="취미" />
      </div>
    </>
  );
}

function Section({ title, group }: { title: string; group: "신앙" | "취미" }) {
  const items = CATEGORIES.filter((c) => c.group === group);
  return (
    <section>
      <h2 className="mb-2 text-xs font-medium tracking-wide text-stone-500">
        {title}
      </h2>
      <ul className="grid grid-cols-2 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        {items.map((c, i) => {
          const tone = toneFor(c.slug);
          const right = i % 2 === 0;
          const bottom = i < items.length - 2;
          return (
            <li
              key={c.slug}
              className={`${right ? "border-r border-stone-100" : ""} ${
                bottom ? "border-b border-stone-100" : ""
              }`}
            >
              <Link
                href={`/categories/${c.slug}`}
                className="flex items-center gap-3 px-4 py-3.5 active:bg-stone-50"
              >
                <span
                  className={`grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br ${tone.bg} text-lg ring-1 ring-white/50`}
                >
                  {c.emoji}
                </span>
                <span className="text-[15px] text-stone-800">{c.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
