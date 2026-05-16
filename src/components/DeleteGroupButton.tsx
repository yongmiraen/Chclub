"use client";

import { useActionState } from "react";
import { deleteGroup } from "@/lib/actions";
import type { ActionResult } from "@/lib/actions";

export default function DeleteGroupButton({ groupId }: { groupId: string }) {
  const boundAction = deleteGroup.bind(null, groupId);
  const [state, formAction, pending] = useActionState<
    ActionResult | null,
    FormData
  >(boundAction, null);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!confirm("정말 삭제할까요? 참여자 정보도 모두 사라집니다.")) {
          e.preventDefault();
        }
      }}
      className="space-y-2 rounded-xl border border-rose-200 bg-rose-50 p-4"
    >
      <p className="text-sm font-medium text-rose-900">위험구역 · 모임 삭제</p>
      <p className="text-xs text-rose-800">
        PIN 4자리를 입력하면 모임과 참여 기록이 함께 삭제됩니다.
      </p>
      {state && !state.ok && (
        <p className="text-xs text-rose-700">{state.error}</p>
      )}
      <div className="flex gap-2">
        <input
          name="edit_pin"
          required
          inputMode="numeric"
          pattern="\d{4}"
          maxLength={4}
          placeholder="PIN"
          className="w-24 rounded-lg border border-rose-300 bg-white px-3 py-2 text-sm tracking-widest focus:border-rose-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-rose-700 px-4 py-2 text-sm font-medium text-white hover:bg-rose-800 disabled:bg-stone-400"
        >
          {pending ? "삭제 중…" : "모임 삭제"}
        </button>
      </div>
    </form>
  );
}
