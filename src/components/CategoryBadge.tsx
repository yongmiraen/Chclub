import { CATEGORY_MAP } from "@/lib/categories";

export default function CategoryBadge({ slug }: { slug: string }) {
  const cat = CATEGORY_MAP[slug];
  if (!cat) return null;
  const tone =
    cat.group === "신앙"
      ? "bg-amber-100 text-amber-900"
      : "bg-stone-200 text-stone-800";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${tone}`}
    >
      <span aria-hidden>{cat.emoji}</span>
      {cat.label}
    </span>
  );
}
