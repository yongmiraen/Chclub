import Link from "next/link";
import CategoryBadge from "./CategoryBadge";
import type { GroupWithCount } from "@/lib/types";

export default function GroupCard({ group }: { group: GroupWithCount }) {
  const full = group.member_count >= group.max_members;
  return (
    <Link
      href={`/groups/${group.id}`}
      className="block rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
    >
      <div className="flex items-center gap-2">
        <CategoryBadge slug={group.category} />
        {group.region && (
          <span className="text-xs text-stone-500">📍 {group.region}</span>
        )}
      </div>
      <h3 className="mt-3 line-clamp-1 text-lg font-semibold text-stone-900">
        {group.title}
      </h3>
      <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm text-stone-600">
        {group.description || "—"}
      </p>
      <div className="mt-4 flex items-center justify-between text-xs text-stone-500">
        <span>방장 · {group.creator_nickname}</span>
        <span
          className={`font-medium ${full ? "text-rose-600" : "text-amber-800"}`}
        >
          {group.member_count} / {group.max_members}명{full && " · 마감"}
        </span>
      </div>
    </Link>
  );
}
