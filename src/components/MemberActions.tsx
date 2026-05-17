"use client";

import { useTransition } from "react";
import { approveMember, rejectMember, setMemberRole } from "@/lib/actions";

export default function MemberActions({
  membershipId,
  groupId,
  isPending,
  role,
  isOwnerView, // 방장만 운영자 임명 가능
}: {
  membershipId: string;
  groupId: string;
  isPending?: boolean;   // 대기 중 멤버 여부
  role?: "member" | "operator";
  isOwnerView?: boolean; // 방장 본인 화면인지
}) {
  const [loading, startTransition] = useTransition();

  if (isPending) {
    return (
      <div className="mt-2 flex gap-2">
        <button
          disabled={loading}
          onClick={() => startTransition(async () => { await approveMember(membershipId, groupId); })}
          className="flex-1 rounded-lg bg-amber-700 py-1.5 text-xs font-medium text-white transition active:bg-amber-800 disabled:opacity-50"
        >
          수락
        </button>
        <button
          disabled={loading}
          onClick={() => startTransition(async () => { await rejectMember(membershipId, groupId); })}
          className="flex-1 rounded-lg border border-stone-300 py-1.5 text-xs font-medium text-stone-600 transition active:bg-stone-100 disabled:opacity-50"
        >
          거절
        </button>
      </div>
    );
  }

  // 승인된 멤버 — 방장만 운영자 임명/해제
  if (isOwnerView) {
    const isOperator = role === "operator";
    return (
      <button
        disabled={loading}
        onClick={() => startTransition(async () => {
          await setMemberRole(membershipId, groupId, isOperator ? "member" : "operator");
        })}
        className={`mt-2 rounded-lg border px-3 py-1 text-xs font-medium transition disabled:opacity-50 ${
          isOperator
            ? "border-amber-300 bg-amber-50 text-amber-700"
            : "border-stone-200 bg-white text-stone-500"
        }`}
      >
        {isOperator ? "⭐ 운영자 · 해제" : "운영자 임명"}
      </button>
    );
  }

  return null;
}
