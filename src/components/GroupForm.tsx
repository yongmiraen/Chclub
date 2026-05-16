"use client";

import { useActionState } from "react";
import { CATEGORIES } from "@/lib/categories";
import type { ActionResult } from "@/lib/actions";

type Props = {
  action: (prev: ActionResult | null, form: FormData) => Promise<ActionResult>;
  mode: "create" | "edit";
  defaults?: {
    title?: string;
    description?: string;
    category?: string;
    region?: string;
    max_members?: number;
  };
  submitLabel: string;
};

const initial: ActionResult | null = null;

export default function GroupForm({
  action,
  mode,
  defaults = {},
  submitLabel,
}: Props) {
  const [state, formAction, pending] = useActionState(action, initial);
  const error = state && !state.ok ? state.error : null;

  const spiritual = CATEGORIES.filter((c) => c.group === "신앙");
  const hobby = CATEGORIES.filter((c) => c.group === "취미");

  return (
    <form action={formAction} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      )}

      <Field label="모임 이름" hint="2~60자">
        <input
          name="title"
          required
          maxLength={60}
          minLength={2}
          defaultValue={defaults.title}
          placeholder="예) 신촌 청년 큐티 모임"
          className="input"
        />
      </Field>

      <Field label="카테고리">
        <div className="space-y-3">
          <FieldsetGroup
            title="신앙"
            name="category"
            options={spiritual}
            defaultValue={defaults.category}
          />
          <FieldsetGroup
            title="취미"
            name="category"
            options={hobby}
            defaultValue={defaults.category}
          />
        </div>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="지역" hint="선택">
          <input
            name="region"
            maxLength={30}
            defaultValue={defaults.region ?? ""}
            placeholder="예) 서울 마포구"
            className="input"
          />
        </Field>
        <Field label="정원" hint="2~200명">
          <input
            name="max_members"
            type="number"
            required
            min={2}
            max={200}
            defaultValue={defaults.max_members ?? 10}
            className="input"
          />
        </Field>
      </div>

      <Field label="소개글" hint="모임 취지·진행 방식·요일 등">
        <textarea
          name="description"
          rows={6}
          maxLength={2000}
          defaultValue={defaults.description ?? ""}
          placeholder={`예)
- 매주 토요일 오전 9시
- 마가복음 1장씩 읽고 나눔
- 누구나 환영합니다`}
          className="input"
        />
      </Field>

      {mode === "create" && (
        <Field label="방장 닉네임" hint="1~20자">
          <input
            name="creator_nickname"
            required
            maxLength={20}
            className="input"
          />
        </Field>
      )}

      <Field
        label={mode === "create" ? "수정용 PIN 만들기" : "PIN 확인"}
        hint="숫자 4자리 · 모임 수정·삭제 시 필요"
      >
        <input
          name="edit_pin"
          required
          inputMode="numeric"
          pattern="\d{4}"
          maxLength={4}
          placeholder="예) 1234"
          className="input tracking-widest"
        />
      </Field>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-amber-700 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-amber-800 disabled:bg-stone-400"
      >
        {pending ? "저장 중…" : submitLabel}
      </button>

      <style>{`
        .input {
          width: 100%;
          border: 1px solid #d6d3d1;
          background: white;
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 14px;
          outline: none;
          transition: border-color .15s;
        }
        .input:focus {
          border-color: #d97706;
        }
        textarea.input { line-height: 1.6; }
      `}</style>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
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

function FieldsetGroup({
  title,
  name,
  options,
  defaultValue,
}: {
  title: string;
  name: string;
  options: { slug: string; label: string; emoji: string }[];
  defaultValue?: string;
}) {
  return (
    <div>
      <div className="mb-1 text-xs font-medium text-stone-500">{title}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={o.slug}
            className="cursor-pointer rounded-full border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-700 has-checked:border-amber-700 has-checked:bg-amber-700 has-checked:text-white"
          >
            <input
              type="radio"
              name={name}
              value={o.slug}
              defaultChecked={defaultValue === o.slug}
              className="sr-only"
              required
            />
            <span aria-hidden className="mr-1">
              {o.emoji}
            </span>
            {o.label}
          </label>
        ))}
      </div>
    </div>
  );
}
