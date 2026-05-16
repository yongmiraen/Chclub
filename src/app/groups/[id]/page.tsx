import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { categoryLabel, categoryEmoji } from "@/lib/categories";
import { toneFor } from "@/lib/theme";
import TopBar, { IconButton } from "@/components/TopBar";
import JoinPanel from "@/components/JoinPanel";
import CreatorMark from "@/components/CreatorMark";
import type { Group, Membership } from "@/lib/types";

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

  const [{ data: group }, { data: members }] = await Promise.all([
    supabase.from("groups").select("*").eq("id", id).single<Group>(),
    supabase
      .from("memberships")
      .select("*")
      .eq("group_id", id)
      .order("created_at", { ascending: true })
      .returns<Membership[]>(),
  ]);

  if (!group) notFound();

  const memberCount = members?.length ?? 0;
  const full = memberCount >= group.max_members;
  const tone = toneFor(group.category);
  const isPrayer = group.category === "prayer";

  return (
    <>
      {created && <CreatorMark groupId={group.id} title={group.title} />}

      <TopBar
        title={group.title}
        back="/"
        right={
          <IconButton
            href={`/groups/${group.id}/edit`}
            ariaLabel="모임 수정"
          >
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
            {created
              ? "모임이 만들어졌어요! 링크와 PIN을 잘 보관하세요."
              : "변경 사항이 저장되었어요."}
          </div>
        )}

        {/* 히어로 배너 */}
        <section
          className={`relative grid h-44 place-items-center bg-gradient-to-br ${tone.bg}`}
        >
          <div className="text-6xl drop-shadow-sm">
            {categoryEmoji(group.category)}
          </div>
        </section>

        <section className="px-5 pb-2 pt-5">
          <div className="flex flex-wrap items-center gap-1.5">
            <Chip>{categoryLabel(group.category)}</Chip>
            {group.region && <Chip>{group.region}</Chip>}
            <Chip>멤버 {memberCount}</Chip>
            {full && <Chip tone="rose">마감</Chip>}
          </div>

          <h1 className="mt-3 text-xl font-bold leading-snug text-stone-900">
            {group.title}
          </h1>

          <div className="mt-2 flex items-center gap-3 text-xs text-stone-500">
            <span>방장 · {group.creator_nickname}</span>
            <span>
              {new Date(group.created_at).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              개설
            </span>
          </div>

          <p className="mt-5 whitespace-pre-wrap text-[15px] leading-7 text-stone-700">
            {group.description}
          </p>

          <div className="mt-3 text-xs text-stone-500">
            정원 {group.max_members}명
          </div>
        </section>

        <section className="mt-5 px-5">
          <div className="flex items-baseline justify-between">
            <h2 className="text-base font-bold text-stone-900">
              {isPrayer ? "🙏 함께 기도해요" : `참여 멤버 (${memberCount})`}
            </h2>
          </div>

          <div className="mt-3 space-y-2">
            {memberCount === 0 && (
              <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center text-sm text-stone-500">
                첫 번째로 함께해 보세요.
              </div>
            )}
            {members?.map((m) => (
              <div
                key={m.id}
                className="rounded-xl border border-stone-200 bg-white p-3.5"
              >
                <div className="flex items-center justify-between">
                  <strong className="text-sm text-stone-900">
                    {m.nickname}
                  </strong>
                  <span className="text-[11px] text-stone-400">
                    {new Date(m.created_at).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                {m.message && (
                  <p className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-stone-700">
                    {m.message}
                  </p>
                )}
                {m.contact && (
                  <p className="mt-1.5 text-xs text-stone-500">
                    연락처 · {m.contact}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="px-5 pb-5 pt-6">
          <Link
            href={`/groups/${group.id}/edit`}
            className="block text-center text-xs text-stone-400 hover:text-stone-600"
          >
            방장만 · 수정 / 삭제
          </Link>
        </div>
      </div>

      <JoinPanel groupId={group.id} full={full} />
    </>
  );
}

function Chip({
  children,
  tone = "stone",
}: {
  children: React.ReactNode;
  tone?: "stone" | "rose";
}) {
  const cls =
    tone === "rose"
      ? "bg-rose-100 text-rose-800"
      : "bg-stone-100 text-stone-700";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${cls}`}
    >
      {children}
    </span>
  );
}
