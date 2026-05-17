import Link from "next/link";
import Image from "next/image";
import { categoryLabel, categoryEmoji } from "@/lib/categories";
import { toneFor } from "@/lib/theme";
import type { GroupWithCount } from "@/lib/types";

function scheduleText(g: GroupWithCount) {
  const parts = [];
  if (g.meeting_frequency) parts.push(g.meeting_frequency);
  if (g.meeting_day) parts.push(g.meeting_day);
  if (g.meeting_time) parts.push(g.meeting_time.slice(0, 5));
  return parts.join(" ");
}

export default function GroupListItem({
  group,
  hideDivider,
}: {
  group: GroupWithCount;
  hideDivider?: boolean;
}) {
  const tone = toneFor(group.category);
  const full = group.member_count >= group.max_members;
  const schedule = scheduleText(group);

  return (
    <Link
      href={`/groups/${group.id}`}
      className={`flex gap-3 px-4 py-4 active:bg-stone-50 ${
        hideDivider ? "" : "border-b border-stone-100"
      }`}
    >
      {/* 썸네일 */}
      <div className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl ${tone.bg} ring-1 ${tone.ring}`}>
        {group.image_url ? (
          <Image src={group.image_url} alt={group.title} fill className="object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-3xl">
            <span aria-hidden>{categoryEmoji(group.category)}</span>
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-1 text-base font-semibold text-stone-900">
          {group.title}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-sm text-stone-500">
          {group.description || "—"}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px] text-stone-500">
          <span className="font-medium text-stone-700">
            {categoryLabel(group.category)}
          </span>
          {group.region && <span>· {group.region}</span>}
          {schedule && <span>· {schedule}</span>}
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
