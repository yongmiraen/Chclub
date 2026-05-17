"use client";

import { useActionState } from "react";
import { createEvent } from "@/lib/actions";
import type { ActionResult } from "@/lib/actions";

const initial: ActionResult | null = null;

export default function EventForm({ groupId }: { groupId: string }) {
  const boundAction = createEvent.bind(null, groupId);
  const [state, formAction, pending] = useActionState(boundAction, initial);
  const error = state && !state.ok ? state.error : null;

  // 기본값: 오늘 날짜 + 1주일 후, 오전 10시
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 7);
  defaultDate.setHours(10, 0, 0, 0);
  const defaultDateStr = defaultDate.toISOString().slice(0, 16);

  return (
    <form action={formAction} className="space-y-5 px-5 py-5">
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      )}

      <Field label="정모 제목" hint="2~60자">
        <input
          name="title"
          required
          maxLength={60}
          placeholder="예) 5월 정기 모임, 종강 기념 뒤풀이"
          className="input"
        />
      </Field>

      <Field label="날짜 · 시간">
        <input
          name="event_date"
          type="datetime-local"
          required
          defaultValue={defaultDateStr}
          className="input"
        />
      </Field>

      <Field label="장소" hint="선택">
        <input
          name="location"
          maxLength={100}
          placeholder="예) 홍대입구역 2번 출구 앞, 종로구 카페 ○○"
          className="input"
        />
      </Field>

      <Field label="최대 참석 인원" hint="선택">
        <input
          name="max_attendees"
          type="number"
          min={1}
          max={200}
          placeholder="제한 없음"
          className="input"
        />
      </Field>

      <Field label="내용" hint="선택 · 500자 이내">
        <textarea
          name="description"
          rows={4}
          maxLength={500}
          placeholder="정모에 대한 추가 안내를 적어주세요."
          className="input"
        />
      </Field>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-amber-700 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-amber-800 disabled:bg-stone-400"
      >
        {pending ? "만드는 중…" : "정모 만들기"}
      </button>

      <style>{`
        .input { width:100%; border:1px solid #d6d3d1; background:white; color:#1c1917;
          border-radius:12px; padding:10px 14px; font-size:14px; outline:none; transition:border-color .15s; }
        .input:focus { border-color:#d97706; }
        textarea.input { line-height:1.6; }
      `}</style>
    </form>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm font-medium text-stone-800">{label}</span>
        {hint && <span className="text-xs text-stone-500">{hint}</span>}
      </div>
      {children}
    </label>
  );
}
