"use client";

import { useTransition } from "react";
import { approveMember, rejectMember } from "@/lib/actions";

export default function MemberActions({
  membershipId,
  groupId,
}: {
  membershipId: string;
  groupId: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="mt-2 flex gap-2">
      <button
        disabled={isPending}
        onClick={() => startTransition(async () => { await approveMember(membershipId, groupId); })}
        className="flex-1 rounded-lg bg-amber-700 py-1.5 text-xs font-medium text-white transition active:bg-amber-800 disabled:opacity-50"
      >
        수락
      </button>
      <button
        disabled={isPending}
        onClick={() => startTransition(async () => { await rejectMember(membershipId, groupId); })}
        className="flex-1 rounded-lg border border-stone-300 py-1.5 text-xs font-medium text-stone-600 transition active:bg-stone-100 disabled:opacity-50"
      >
        거절
      </button>
    </div>
  );
}
