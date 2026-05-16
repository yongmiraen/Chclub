import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/categories";
import CategoryIcon from "@/components/CategoryIcon";
import GroupListItem from "@/components/GroupListItem";
import TopBar, { IconButton } from "@/components/TopBar";
import type { Group, GroupWithCount } from "@/lib/types";

export const dynamic = "force-dynamic";

type GroupsRow = Group & { memberships: { count: number }[] };

type SortKey = "discover" | "new" | "popular";
const TABS: { key: SortKey; label: string }[] = [
  { key: "discover", label: "발견" },
  { key: "new", label: "신규모임" },
  { key: "popular", label: "인기모임" },
];

type SearchParams = { sort?: string; deleted?: string };

export default async function Home({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const sort: SortKey = sp.sort === "popular" || sp.sort === "new" ? sp.sort : "discover";

  const { data, error } = await supabase
    .from("groups")
    .select("*, memberships(count)")
    .order("created_at", { ascending: false })
    .returns<GroupsRow[]>();

  let groups: GroupWithCount[] =
    data?.map((g) => ({ ...g, member_count: g.memberships?.[0]?.count ?? 0 })) ?? [];

  if (sort === "popular") {
    groups = [...groups].sort((a, b) => b.member_count - a.member_count);
  }

  return (
    <>
      <TopBar
        title="크로소"
        subtitle="크리스천 소모임"
        right={
          <>
            <IconButton ariaLabel="검색">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
              </svg>
            </IconButton>
            <IconButton ariaLabel="알림">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 16V11a6 6 0 1 0-12 0v5l-2 2h16l-2-2Z" /><path d="M10 21h4" />
              </svg>
            </IconButton>
          </>
        }
      />

      {sp.deleted && (
        <div className="mx-4 mt-3 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300">
          모임이 삭제되었어요.
        </div>
      )}

      {/* 정렬 탭 */}
      <div className="sticky top-14 z-10 border-b border-stone-100 bg-white dark:border-stone-700 dark:bg-stone-900">
        <div className="flex">
          {TABS.map((t) => {
            const active = t.key === sort;
            const href = t.key === "discover" ? "/" : `/?sort=${t.key}`;
            return (
              <Link key={t.key} href={href}
                className={`relative flex-1 px-3 py-3 text-center text-sm transition ${
                  active ? "font-semibold text-stone-900 dark:text-stone-100" : "text-stone-500 dark:text-stone-400"
                }`}
              >
                {t.label}
                {active && <span className="absolute inset-x-6 -bottom-px h-0.5 bg-stone-900 dark:bg-stone-100" />}
              </Link>
            );
          })}
        </div>
      </div>

      {/* 카테고리 원형 아이콘 — 2행 가로 스크롤 */}
      <section className="border-b border-stone-100 dark:border-stone-700">
        <div className="overflow-x-auto">
          <div className="grid grid-flow-col grid-rows-2 gap-x-4 gap-y-3 px-4 py-4">
            {CATEGORIES.map((c) => (
              <CategoryIcon key={c.slug} slug={c.slug} size="md" href={`/categories/${c.slug}`} />
            ))}
          </div>
        </div>
      </section>

      {/* 모임 리스트 */}
      <section>
        <div className="flex items-baseline justify-between px-4 pb-2 pt-5">
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
            {sort === "popular" ? "🔥 인기 모임" : sort === "new" ? "✨ 새로 생긴 모임" : "활동이 활발한 모임"}
          </h2>
          <span className="text-xs text-stone-500">총 {groups.length}개</span>
        </div>

        {error && (
          <div className="mx-4 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-700/50 dark:bg-rose-900/20 dark:text-rose-300">
            데이터를 불러오지 못했습니다. .env.local 과 sql/schema.sql 적용을 확인해 주세요.
            <br /><span className="text-xs">({error.message})</span>
          </div>
        )}

        {!error && groups.length === 0 && (
          <div className="mx-4 mt-2 rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-10 text-center dark:border-stone-600 dark:bg-stone-800/50">
            <div className="text-4xl">🌿</div>
            <p className="mt-3 text-sm text-stone-600 dark:text-stone-400">
              아직 모임이 없어요.<br />첫 모임을 만들어 보세요.
            </p>
            <Link href="/groups/new"
              className="mt-5 inline-block rounded-full bg-amber-700 px-5 py-2 text-sm font-medium text-white dark:bg-amber-600">
              + 모임 만들기
            </Link>
          </div>
        )}

        {groups.length > 0 && (
          <ul>
            {groups.map((g, i) => (
              <li key={g.id}>
                <GroupListItem group={g} hideDivider={i === groups.length - 1} />
              </li>
            ))}
          </ul>
        )}
        <div className="h-6" />
      </section>
    </>
  );
}
