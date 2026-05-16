import Link from "next/link";
import { toneFor } from "@/lib/theme";
import { CATEGORY_MAP } from "@/lib/categories";

type Props = {
  slug: string;
  size?: "sm" | "md" | "lg";
  href?: string;
  label?: boolean;
};

const sizeCls = {
  sm: { circle: "h-12 w-12 text-xl", label: "text-[11px]" },
  md: { circle: "h-16 w-16 text-2xl", label: "text-xs" },
  lg: { circle: "h-20 w-20 text-3xl", label: "text-sm" },
};

export default function CategoryIcon({ slug, size = "md", href, label = true }: Props) {
  const cat = CATEGORY_MAP[slug];
  if (!cat) return null;
  const tone = toneFor(slug);
  const s = sizeCls[size];

  const inner = (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`grid place-items-center rounded-full ${tone.bg} ${s.circle} ring-1 ${tone.ring}`}>
        <span aria-hidden>{cat.emoji}</span>
      </div>
      {label && <span className={`${s.label} text-stone-700`}>{cat.label}</span>}
    </div>
  );

  if (!href) return inner;
  return (
    <Link href={href} className="shrink-0 active:opacity-60">
      {inner}
    </Link>
  );
}
