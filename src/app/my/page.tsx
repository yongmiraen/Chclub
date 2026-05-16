import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import TopBar from "@/components/TopBar";
import GroupListItem from "@/components/GroupListItem";
import type { Group, GroupWithCount } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "내모임 · 크로소" };

type Row = Group & { memberships: { count: number }[] };

export default async function MyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/my");

  // 내가 만든 모임
  const { data: createdRows } = await supabase
    .from("groups")
    .select("*, memberships(count)")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })
    .returns<Row[]>();

  // 내가 가입한 모임 (memberships.user_id 기준)
  const { data: memberRows } = await supabase
    .from("memberships")
    .select("group_id")
    .eq("user_id", user.id);

  const joinedGroupIds = memberRows?.map((m) => m.group_id) ?? [];

  let joinedGroups: GroupWithCount[] = [];
  if (joinedGroupIds.length > 0) {
    const { data: joinedRows } = await supabase
      .from("groups")
      .select("*, memberships(count)")
      .in("id", joinedGroupIds)
      .returns<Row[]>();
    joinedGroups =
      joinedRows?.map((g) => ({ ...g, member_count: g.memberships?.[0]?.count ?? 0 })) ?? [];
  }

  const createdGroups: GroupWithCount[] =
    createdRows?.map((g) => ({ ...g, member_count: g.memberships?.[0]?.count ?? 0 })) ?? [];

  const name = user.user_metadata?.name || user.user_metadata?.full_name || "회원";

  return (
    <>
      <TopBar title="내모임" subtitle={name} />
      {createdGroups.length === 0 && joinedGroups.length === 0 ? (
        <div className="mx-4 mt-6 rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-10 text-center">
          <div className="text-4xl">🌱</div>
          <p className="mt-3 text-sm text-stone-600">
            아직 만들거나 참여한 모임이 없어요.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Link href="/"
              className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm text-stone-700">
              모임 둘러보기
            </Link>
            <Link href="/groups/new"
              className="rounded-full bg-amber-700 px-4 py-2 text-sm font-medium text-white">
              + 만들기
            </Link>
          </div>
        </div>
      ) : (
        <>
          {createdGroups.length > 0 && (
            <Section label={`내가 만든 모임 · ${createdGroups.length}`}>
              {createdGroups.map((g, i) => (
                <GroupListItem key={g.id} group={g} hideDivider={i === createdGroups.length - 1} />
              ))}
            </Section>
          )}
          {joinedGroups.length > 0 && (
            <Section label={`참여한 모임 · ${joinedGroups.length}`}>
              {joinedGroups.map((g, i) => (
                <GroupListItem key={g.id} group={g} hideDivider={i === joinedGroups.length - 1} />
              ))}
            </Section>
          )}
        </>
      )}
      <div className="h-6" />
    </>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mt-2">
      <h2 className="px-4 pb-1 pt-4 text-xs font-medium text-stone-500">{label}</h2>
      <div className="border-t border-stone-100">{children}</div>
    </section>
  );
}
