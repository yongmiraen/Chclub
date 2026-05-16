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
      className={`flex gap-3 px-4 py-4 active:bg-stone-100 dark:active:bg-stone-800 ${
        hideDivider ? "" : "border-b border-stone-100 dark:border-stone-700"
      }`}
    >
      <div
        className={`grid h-20 w-20 shrink-0 place-items-center rounded-2xl ${tone.bg} ${tone.darkBg} text-3xl ring-1 ${tone.ring} ${tone.darkRing}`}
      >
        <span aria-hidden>{categoryEmoji(group.category)}</span>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-1 text-base font-semibold text-stone-900 dark:text-stone-100">
          {group.title}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-sm text-stone-600 dark:text-stone-400">
          {group.description || "—"}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px] text-stone-500 dark:text-stone-500">
          <span className="font-medium text-stone-700 dark:text-stone-300">
            {categoryLabel(group.category)}
          </span>
          {group.region && <span>· {group.region}</span>}
          <span>· 멤버</span>
          <span className={full ? "font-medium text-rose-500" : "text-stone-700 dark:text-stone-300"}>
            {group.member_count}
            {full && " · 마감"}
          </span>
        </div>
      </div>
    </Link>
  );
}
