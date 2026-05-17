import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { CATEGORIES } from "@/lib/categories";
import { ALL_REGIONS } from "@/lib/regions";
import CategoryIcon from "@/components/CategoryIcon";
import GroupListItem from "@/components/GroupListItem";
import TopBar from "@/components/TopBar";
import AuthButton from "@/components/AuthButton";
import type { Group, GroupWithCount } from "@/lib/types";

export const dynamic = "force-dynamic";

type GroupsRow = Group & { memberships: { count: number }[] };
type SortKey = "discover" | "new" | "popular";
const TABS: { key: SortKey; label: string }[] = [
  { key: "discover", label: "발견" },
  { key: "new", label: "신규모임" },
  { key: "popular", label: "인기모임" },
];

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; deleted?: string; region?: string }>;
}) {
  const sp = await searchParams;
  const sort: SortKey = sp.sort === "popular" || sp.sort === "new" ? sp.sort : "discover";
  const regionFilter = ALL_REGIONS.includes(sp.region ?? "") ? sp.region! : "";

  const supabase = await createClient();
  let query = supabase
    .from("groups")
    .select("*, memberships(count)")
    .order("created_at", { ascending: false });

  if (regionFilter) query = query.eq("region", regionFilter);

  const { data, error } = await query.returns<GroupsRow[]>();

  let groups: GroupWithCount[] =
    data?.map((g) => ({ ...g, member_count: g.memberships?.[0]?.count ?? 0 })) ?? [];

  if (sort === "popular")
    groups = [...groups].sort((a, b) => b.member_count - a.member_count);

  return (
    <>
      <TopBar
        title="크로소"
        subtitle="크리스천 소모임"
        right={<AuthButton />}
      />

      {sp.deleted && (
        <div className="mx-4 mt-3 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700">
          모임이 삭제되었어요.
        </div>
      )}

      {/* 정렬 탭 */}
      <div className="sticky top-14 z-10 border-b border-stone-100 bg-white">
        <div className="flex">
          {TABS.map((t) => {
            const active = t.key === sort;
            const params = new URLSearchParams();
            if (t.key !== "discover") params.set("sort", t.key);
            if (regionFilter) params.set("region", regionFilter);
            const href = `/${params.toString() ? `?${params}` : ""}`;
            return (
              <Link key={t.key} href={href}
                className={`relative flex-1 px-3 py-3 text-center text-sm transition ${
                  active ? "font-semibold text-stone-900" : "text-stone-500"
                }`}>
                {t.label}
                {active && <span className="absolute inset-x-6 -bottom-px h-0.5 bg-stone-900" />}
              </Link>
            );
          })}
        </div>
      </div>

      {/* 카테고리 아이콘 */}
      <section className="border-b border-stone-100">
        <div className="overflow-x-auto">
          <div className="grid grid-flow-col grid-rows-2 gap-x-4 gap-y-3 px-4 py-4">
            {CATEGORIES.map((c) => (
              <CategoryIcon key={c.slug} slug={c.slug} size="md" href={`/categories/${c.slug}`} />
            ))}
          </div>
        </div>
      </section>

      {/* 지역 필터 — 서울 25개 구 */}
      <section className="border-b border-stone-100 px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <RegionChip label="전체" value="" current={regionFilter} sort={sort} />
          {ALL_REGIONS.map((r) => (
            <RegionChip key={r} label={r} value={r} current={regionFilter} sort={sort} />
          ))}
        </div>
      </section>

      {/* 모임 리스트 */}
      <section>
        <div className="flex items-baseline justify-between px-4 pb-2 pt-5">
          <h2 className="text-lg font-bold text-stone-900">
            {regionFilter ? `📍 ${regionFilter} 모임` :
              sort === "popular" ? "🔥 인기 모임" :
              sort === "new" ? "✨ 새로 생긴 모임" : "활동이 활발한 모임"}
          </h2>
          <span className="text-xs text-stone-500">총 {groups.length}개</span>
        </div>

        {error && (
          <div className="mx-4 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            데이터를 불러오지 못했습니다. Supabase 연결을 확인해 주세요.
          </div>
        )}

        {!error && groups.length === 0 && (
          <div className="mx-4 mt-2 rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-10 text-center">
            <div className="text-4xl">🌿</div>
            <p className="mt-3 text-sm text-stone-600">
              {regionFilter ? `${regionFilter}에 아직 모임이 없어요.` : "아직 모임이 없어요."}
              <br />첫 모임을 만들어 보세요.
            </p>
            <Link href="/groups/new"
              className="mt-5 inline-block rounded-full bg-amber-700 px-5 py-2 text-sm font-medium text-white">
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

function RegionChip({ label, value, current, sort }: {
  label: string; value: string; current: string; sort: string;
}) {
  const active = current === value;
  const params = new URLSearchParams();
  if (value) params.set("region", value);
  if (sort !== "discover") params.set("sort", sort);
  const href = `/${params.toString() ? `?${params}` : ""}`;
  return (
    <Link href={href}
      className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition ${
        active
          ? "border-amber-700 bg-amber-700 text-white"
          : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
      }`}>
      {label}
    </Link>
  );
}
