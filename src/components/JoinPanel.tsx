"use client";

import { useActionState, useState } from "react";
import { joinGroup } from "@/lib/actions";
import type { ActionResult } from "@/lib/actions";

type Props = {
  groupId: string;
  full: boolean;
  userName?: string;
};

const inputCls =
  "w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 focus:border-amber-500 focus:outline-none";

export default function JoinPanel({ groupId, full, userName }: Props) {
  const boundAction = joinGroup.bind(null, groupId);
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(boundAction, null);
  const [open, setOpen] = useState(false);

  if (state?.ok) {
    return (
      <div className="sticky bottom-0 z-10 border-t border-stone-100 bg-white/95 px-4 py-3 pb-[max(env(safe-area-inset-bottom),12px)] backdrop-blur">
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
          <span className="text-lg">⏳</span>
          <div>
            <p className="text-sm font-semibold text-amber-900">가입 신청 완료</p>
            <p className="text-xs text-amber-700">방장이 수락하면 멤버가 돼요.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="sticky bottom-0 z-10 border-t border-stone-100 bg-white/95 px-4 py-3 pb-[max(env(safe-area-inset-bottom),12px)] backdrop-blur">
        {full ? (
          <button disabled className="w-full rounded-xl bg-stone-200 px-4 py-3.5 text-sm font-medium text-stone-500">
            지금은 자리가 없어요
          </button>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="w-full rounded-xl bg-amber-700 px-4 py-3.5 text-base font-semibold text-white shadow-sm active:bg-amber-800"
          >
            가입하기
          </button>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/40"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="w-full max-w-[430px] rounded-t-2xl bg-white p-5 pb-[max(env(safe-area-inset-bottom),20px)] shadow-2xl">
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-stone-300" />
            <h3 className="text-lg font-bold text-stone-900">같이 해요</h3>
            <p className="mt-1 text-xs text-stone-500">
              <strong className="text-stone-700">{userName}</strong> 으로 신청해요.
            </p>

            {state && !state.ok && (
              <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
                {state.error}
              </div>
            )}

            <form action={formAction} className="mt-4 space-y-3">
              <input type="hidden" name="nickname" value={userName} />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-800">
                  가입하고 싶은 이유
                  <span className="ml-1 text-xs font-normal text-stone-500">(선택)</span>
                </label>
                <textarea
                  name="message"
                  rows={4}
                  maxLength={500}
                  placeholder="방장에게 한마디 남겨요. 예) 성경공부에 관심이 많아 참여하고 싶어요."
                  className={`${inputCls} leading-6`}
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setOpen(false)}
                  className="flex-1 rounded-xl border border-stone-300 px-4 py-3 text-sm text-stone-700">
                  닫기
                </button>
                <button type="submit" disabled={pending}
                  className="flex-[2] rounded-xl bg-amber-700 px-4 py-3 text-sm font-semibold text-white active:bg-amber-800 disabled:bg-stone-400">
                  {pending ? "잠깐만요…" : "신청해요"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
