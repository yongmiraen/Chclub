import { notFound } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import GroupListItem from "@/components/GroupListItem";
import { CATEGORY_MAP } from "@/lib/categories";
import { toneFor } from "@/lib/theme";
import { createClient } from "@/lib/supabase-server";
import type { Group, GroupWithCount } from "@/lib/types";

export const dynamic = "force-dynamic";

type GroupsRow = Group & { memberships: { count: number }[] };

export default async function CategoryDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = CATEGORY_MAP[slug];
  if (!cat) notFound();
  const tone = toneFor(slug);

  const supabase = await createClient();
  const { data } = await supabase
    .from("groups").select("*, memberships(count)")
    .eq("category", slug).order("created_at", { ascending: false })
    .returns<GroupsRow[]>();

  const groups: GroupWithCount[] =
    data?.map((g) => ({ ...g, member_count: g.memberships?.[0]?.count ?? 0 })) ?? [];

  return (
    <>
      <TopBar title={cat.label} back="/categories" />
      <section className={`${tone.bg} px-5 py-6`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{cat.emoji}</span>
          <div>
            <h2 className="text-lg font-bold text-stone-900">{cat.label}</h2>
            <p className="text-xs text-stone-700/80">
              {cat.group === "신앙" ? "함께 신앙을 키워가요" : "함께 즐기며 친해져요"}
              {" · "}{groups.length}개 모임
            </p>
          </div>
        </div>
      </section>

      {groups.length === 0 ? (
        <div className="mx-4 mt-6 rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-10 text-center">
          <p className="text-sm text-stone-600">
            아직 {cat.label} 모임이 없어요.<br />첫 모임을 만들어 보세요.
          </p>
          <Link href="/groups/new"
            className="mt-4 inline-block rounded-full bg-amber-700 px-5 py-2 text-sm font-medium text-white">
            + 모임 만들기
          </Link>
        </div>
      ) : (
        <ul>
          {groups.map((g, i) => (
            <li key={g.id}><GroupListItem group={g} hideDivider={i === groups.length - 1} /></li>
          ))}
        </ul>
      )}
      <div className="h-6" />
    </>
  );
}
