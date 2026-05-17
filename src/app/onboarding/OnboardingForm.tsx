"use client";

import { useActionState } from "react";
import { saveProfile } from "@/lib/actions";
import type { ActionResult } from "@/lib/actions";

const initial: ActionResult | null = null;

export default function OnboardingForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(saveProfile, initial);
  const error = state && !state.ok ? state.error : null;

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={next} />

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      )}

      <div>
        <label className="block">
          <span className="text-sm font-medium text-stone-800">소속 교회</span>
          <input
            name="church_name"
            required
            maxLength={50}
            placeholder="예) 사랑의교회, 온누리교회"
            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-amber-600"
          />
        </label>
      </div>

      <div>
        <label className="block">
          <span className="text-sm font-medium text-stone-800">생년월일</span>
          <input
            name="birth_date"
            type="date"
            required
            min="1920-01-01"
            max={new Date().toISOString().slice(0, 10)}
            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-amber-600"
          />
        </label>
      </div>

      <p className="text-xs text-stone-400">
        입력하신 정보는 나중에 내 프로필에서 수정할 수 있어요.
      </p>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-amber-700 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-amber-800 disabled:bg-stone-400"
      >
        {pending ? "저장 중…" : "시작하기"}
      </button>
    </form>
  );
}
