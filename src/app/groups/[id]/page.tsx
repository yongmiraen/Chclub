import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { categoryLabel, categoryEmoji } from "@/lib/categories";
import { toneFor } from "@/lib/theme";
import TopBar, { IconButton } from "@/components/TopBar";
import JoinPanel from "@/components/JoinPanel";
import CreatorMark from "@/components/CreatorMark";
import MemberActions from "@/components/MemberActions";
import PostForm from "@/components/PostForm";
import ReportButton from "@/components/ReportButton";
import type { Group, Membership, GroupPost } from "@/lib/types";

export const dynamic = "force-dynamic";

type SearchParams = { created?: string; updated?: string };

export default async function GroupDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const { created, updated } = await searchParams;
  const supabase = await createClient();

  const [
    { data: group, error: groupError },
    { data: members },
    { data: posts },
    { data: { user } },
  ] = await Promise.all([
    supabase.from("groups").select("*").eq("id", id).single<Group>(),
    supabase.from("memberships").select("*").eq("group_id", id)
      .order("created_at", { ascending: true }).returns<Membership[]>(),
    supabase.from("group_posts").select("*").eq("group_id", id)
      .order("created_at", { ascending: false }).limit(20).returns<GroupPost[]>(),
    supabase.auth.getUser(),
  ]);

  if (groupError || !group) notFound();

  const approvedMembers = members?.filter((m) => m.status === "approved") ?? [];
  const pendingMembers = members?.filter((m) => m.status === "pending") ?? [];
  const memberCount = approvedMembers.length;
  const full = memberCount >= group.max_members;
  const tone = toneFor(group.category);
  const isPrayer = group.category === "prayer";
  const userName = user?.user_metadata?.name || user?.user_metadata?.full_name || undefined;
  const groupWithOwner = group as Group & { owner_id?: string };
  const isOwner = user && groupWithOwner.owner_id === user.id;
  const isMember = user && approvedMembers.some((m) => m.user_id === user.id);

  const scheduleParts = [
    group.meeting_frequency,
    group.meeting_day,
    group.meeting_time ? group.meeting_time.slice(0, 5) : null,
  ].filter(Boolean);
  const scheduleText = scheduleParts.join(" ");

  return (
    <>
      {created && <CreatorMark groupId={group.id} title={group.title} />}

      <TopBar
        title={group.title}
        back="/"
        right={
          <IconButton href={`/groups/${group.id}/edit`} ariaLabel="모임 수정">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="6" r="1.4" />
              <circle cx="12" cy="12" r="1.4" />
              <circle cx="12" cy="18" r="1.4" />
            </svg>
          </IconButton>
        }
      />

      <div className="flex flex-1 flex-col">
        {(created || updated) && (
          <div className="mx-4 mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            {created ? "모임이 만들어졌어요!" : "변경 사항을 저장했어요."}
          </div>
        )}

        {/* 히어로 */}
        <section className={`relative h-52 ${tone.bg}`}>
          {group.image_url ? (
            <Image src={group.image_url} alt={group.title} fill className="object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-6xl drop-shadow-sm">
              {categoryEmoji(group.category)}
            </div>
          )}
        </section>

        {/* 모임 정보 */}
        <section className="px-5 pb-2 pt-5">
          <div className="flex flex-wrap items-center gap-1.5">
            <Chip>{categoryLabel(group.category)}</Chip>
            {group.region && <Chip>{group.region}</Chip>}
            {scheduleText && <Chip>📅 {scheduleText}</Chip>}
            <Chip>멤버 {memberCount}</Chip>
            {full && <Chip tone="rose">마감</Chip>}
          </div>

          <h1 className="mt-3 text-xl font-bold leading-snug text-stone-900">{group.title}</h1>
          {isOwner && (
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
              👑 내가 만든 모임
            </span>
          )}

          <div className="mt-2 flex items-center gap-3 text-xs text-stone-500">
            <span>방장 · {group.creator_nickname}</span>
            <span>{new Date(group.created_at).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })} 개설</span>
          </div>

          <p className="mt-5 whitespace-pre-wrap text-[15px] leading-7 text-stone-700">{group.description}</p>
          <div className="mt-3 text-xs text-stone-500">정원 {group.max_members}명</div>
        </section>

        {/* 활동 피드 */}
        <section className="mt-5 px-5">
          <h2 className="text-base font-bold text-stone-900">활동 소식</h2>
          <div className="mt-3 space-y-3">
            {(isOwner || isMember) && <PostForm groupId={group.id} />}
            {posts && posts.length > 0 ? posts.map((p) => (
              <div key={p.id} className="rounded-2xl border border-stone-200 bg-white p-4">
                {p.image_url && (
                  <div className="relative mb-3 h-48 w-full overflow-hidden rounded-xl">
                    <Image src={p.image_url} alt="" fill className="object-cover" />
                  </div>
                )}
                <p className="whitespace-pre-wrap text-sm leading-6 text-stone-800">{p.content}</p>
                <p className="mt-2 text-[11px] text-stone-400">
                  {new Date(p.created_at).toLocaleDateString("ko-KR")}
                </p>
              </div>
            )) : (
              <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 p-6 text-center text-sm text-stone-400">
                아직 활동 소식이 없어요.<br />
                {(isOwner || isMember) ? "첫 소식을 올려보세요!" : "가입하면 소식을 올릴 수 있어요."}
              </div>
            )}
          </div>
        </section>

        {/* 멤버 */}
        <section className="mt-6 px-5">
          <h2 className="text-base font-bold text-stone-900">
            {isPrayer ? "🙏 함께 기도해요" : `참여 멤버 (${memberCount})`}
          </h2>

          {/* 대기 중 — 방장만 봄 */}
          {isOwner && pendingMembers.length > 0 && (
            <div className="mt-3">
              <p className="mb-2 text-xs font-medium text-amber-700">
                ⏳ 수락 대기 {pendingMembers.length}명
              </p>
              <div className="space-y-2">
                {pendingMembers.map((m) => (
                  <div key={m.id} className="rounded-xl border border-amber-200 bg-amber-50 p-3.5">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm text-stone-900">{m.nickname}</strong>
                      <span className="text-[11px] text-stone-400">{new Date(m.created_at).toLocaleDateString("ko-KR")}</span>
                    </div>
                    {m.message && <p className="mt-1 text-sm text-stone-600">{m.message}</p>}
                    {m.contact && <p className="mt-1 text-xs text-stone-500">연락처 · {m.contact}</p>}
                    <MemberActions membershipId={m.id} groupId={group.id} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 space-y-2">
            {memberCount === 0 && (
              <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center text-sm text-stone-500">
                첫 번째로 함께해 보세요.
              </div>
            )}
            {approvedMembers.map((m) => (
              <div key={m.id} className="rounded-xl border border-stone-200 bg-white p-3.5">
                <div className="flex items-center justify-between">
                  <strong className="text-sm text-stone-900">{m.nickname}</strong>
                  <span className="text-[11px] text-stone-400">{new Date(m.created_at).toLocaleDateString("ko-KR")}</span>
                </div>
                {m.message && <p className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-stone-700">{m.message}</p>}
                {m.contact && <p className="mt-1.5 text-xs text-stone-500">연락처 · {m.contact}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* 수정/삭제 */}
        {isOwner ? (
          <div className="mx-5 mb-5 mt-4">
            <Link href={`/groups/${group.id}/edit`}
              className="block rounded-xl border border-stone-200 bg-stone-50 py-2.5 text-center text-sm font-medium text-stone-700 active:bg-stone-100">
              ✏️ 수정 / 삭제
            </Link>
          </div>
        ) : (
          <div className="space-y-3 px-5 pb-5 pt-2">
            <Link href={`/groups/${group.id}/edit`}
              className="block text-center text-xs text-stone-400 hover:text-stone-600">
              방장이라면 · 수정 / 삭제
            </Link>
            {user && <ReportButton groupId={group.id} />}
          </div>
        )}
      </div>

      {!isOwner && <JoinPanel groupId={group.id} full={full} userName={userName} />}
    </>
  );
}

function Chip({ children, tone = "stone" }: { children: React.ReactNode; tone?: "stone" | "rose" }) {
  const cls = tone === "rose" ? "bg-rose-100 text-rose-800" : "bg-stone-100 text-stone-700";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${cls}`}>
      {children}
    </span>
  );
}
