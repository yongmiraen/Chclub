"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import GroupListItem from "@/components/GroupListItem";
import { supabase } from "@/lib/supabase";
import type { Group, GroupWithCount } from "@/lib/types";

type Row = Group & { memberships: { count: number }[] };
type LocalEntry = { nickname?: string; title?: string };

function readLocal(key: string): Record<string, LocalEntry> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(key) || "{}"); }
  catch { return {}; }
}

export default function MyPage() {
  const [joined, setJoined] = useState<GroupWithCount[]>([]);
  const [created, setCreated] = useState<GroupWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const joinedMap = readLocal("kroso:joined");
      const createdMap = readLocal("kroso:created");
      const joinedIds = Object.keys(joinedMap);
      const createdIds = Object.keys(createdMap);
      const allIds = Array.from(new Set([...joinedIds, ...createdIds]));

      let byId = new Map<string, GroupWithCount>();
      if (allIds.length > 0) {
        const { data } = await supabase
          .from("groups").select("*, memberships(count)")
          .in("id", allIds).returns<Row[]>();
        const enriched: GroupWithCount[] =
          data?.map((g) => ({ ...g, member_count: g.memberships?.[0]?.count ?? 0 })) ?? [];
        byId = new Map(enriched.map((g) => [g.id, g]));
      }

      if (cancelled) return;
      setJoined(joinedIds.map((id) => byId.get(id)).filter((g): g is GroupWithCount => Boolean(g)));
      setCreated(createdIds.map((id) => byId.get(id)).filter((g): g is GroupWithCount => Boolean(g)));
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <TopBar title="내모임" />
      {loading ? (
        <div className="px-4 py-10 text-center text-sm text-stone-500">불러오는 중…</div>
      ) : joined.length === 0 && created.length === 0 ? (
        <Empty />
      ) : (
        <>
          {created.length > 0 && (
            <Block label={`내가 만든 모임 · ${created.length}`}>
              {created.map((g, i) => (
                <GroupListItem key={g.id} group={g} hideDivider={i === created.length - 1} />
              ))}
            </Block>
          )}
          {joined.length > 0 && (
            <Block label={`참여한 모임 · ${joined.length}`}>
              {joined.map((g, i) => (
                <GroupListItem key={g.id} group={g} hideDivider={i === joined.length - 1} />
              ))}
            </Block>
          )}
        </>
      )}
      <p className="px-4 pb-6 pt-2 text-center text-[11px] text-stone-400">
        로그인이 없는 데모라서 모임 기록은 이 브라우저에만 저장돼요.
      </p>
    </>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mt-2">
      <h2 className="px-4 pb-1 pt-4 text-xs font-medium text-stone-500">{label}</h2>
      <div className="border-t border-stone-100">{children}</div>
    </section>
  );
}

function Empty() {
  return (
    <div className="mx-4 mt-6 rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-10 text-center">
      <div className="text-4xl">🌱</div>
      <p className="mt-3 text-sm text-stone-600">아직 만들거나 참여한 모임이 없어요.</p>
      <div className="mt-4 flex justify-center gap-2">
        <Link href="/" className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm text-stone-700">
          모임 둘러보기
        </Link>
        <Link href="/groups/new" className="rounded-full bg-amber-700 px-4 py-2 text-sm font-medium text-white">
          + 만들기
        </Link>
      </div>
    </div>
  );
}
