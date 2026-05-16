import Link from "next/link";
import { categoryLabel, categoryEmoji } from "@/lib/categories";
import { toneFor } from "@/lib/theme";
import type { GroupWithCount } from "@/lib/types";

export default function GroupListItem({
  group,
  hideDivider,
}: {
  group: GroupWithCount;
  hideDivider?: boolean;
}) {
  const tone = toneFor(group.category);
  const full = group.member_count >= group.max_members;
  return (
    <Link
      href={`/groups/${group.id}`}
      className={`flex gap-3 px-4 py-4 active:bg-stone-100 ${
        hideDivider ? "" : "border-b border-stone-100"
      }`}
    >
      <div
        className={`grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${tone.bg} text-3xl shadow-inner ring-1 ring-white/40`}
      >
        <span aria-hidden>{categoryEmoji(group.category)}</span>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-1 text-base font-semibold text-stone-900">
          {group.title}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-sm text-stone-600">
          {group.description || "—"}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px] text-stone-500">
          <span className="font-medium text-stone-700">
            {categoryLabel(group.category)}
          </span>
          {group.region && <span>· {group.region}</span>}
          <span>· 멤버</span>
          <span className={full ? "font-medium text-rose-600" : "text-stone-700"}>
            {group.member_count}
            {full && " · 마감"}
          </span>
        </div>
      </div>
    </Link>
  );
}
