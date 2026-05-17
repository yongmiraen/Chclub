"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { CATEGORIES } from "@/lib/categories";
import { REGION_GROUPS } from "@/lib/regions";
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
    image_url?: string;
    meeting_frequency?: string;
    meeting_day?: string;
    meeting_time?: string;
  };
  submitLabel: string;
  hidePin?: boolean;
};

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];
const FREQUENCIES = ["매주", "격주", "매월", "비정기"];
const initial: ActionResult | null = null;

export default function GroupForm({ action, mode, defaults = {}, submitLabel, hidePin = false }: Props) {
  const [state, formAction, pending] = useActionState(action, initial);
  const [preview, setPreview] = useState<string | null>(defaults.image_url ?? null);
  const [selectedDays, setSelectedDays] = useState<string[]>(
    defaults.meeting_day ? defaults.meeting_day.split("·").map((d) => d.trim()) : []
  );
  const error = state && !state.ok ? state.error : null;
  const spiritual = CATEGORIES.filter((c) => c.group === "신앙");
  const hobby = CATEGORIES.filter((c) => c.group === "삶·취미");

  function toggleDay(day: string) {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="meeting_day" value={selectedDays.join("·")} />

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      )}

      {/* 대표 이미지 */}
      <Field label="대표 이미지" hint="선택 · 최대 5MB">
        <label className="block cursor-pointer">
          {preview ? (
            <div className="relative h-44 w-full overflow-hidden rounded-2xl">
              <Image src={preview} alt="미리보기" fill className="object-cover" unoptimized />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-xs font-medium text-white opacity-0 transition hover:opacity-100">
                탭해서 변경
              </div>
            </div>
          ) : (
            <div className="flex h-44 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 text-stone-400">
              <span className="text-3xl">📷</span>
              <span className="text-sm">이미지 추가</span>
            </div>
          )}
          <input
            type="file"
            name="image"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setPreview(URL.createObjectURL(file));
            }}
          />
        </label>
      </Field>

      <Field label="모임 이름" hint="2~60자">
        <input name="title" required maxLength={60} minLength={2}
          defaultValue={defaults.title} placeholder="예) 신촌 청년 큐티 모임" className="input" />
      </Field>

      <Field label="카테고리">
        <div className="space-y-3">
          <FieldsetGroup title="신앙" name="category" options={spiritual} defaultValue={defaults.category} />
          <FieldsetGroup title="삶·취미" name="category" options={hobby} defaultValue={defaults.category} />
        </div>
      </Field>

      <Field label="지역" hint="선택 안 하면 전체 공개">
        <div className="space-y-2">
          {REGION_GROUPS.map((g) => (
            <div key={g.label}>
              <div className="mb-1 text-xs font-medium text-stone-500">{g.label}</div>
              <div className="flex flex-wrap gap-2">
                {g.regions.map((r) => (
                  <label key={r}
                    className="cursor-pointer rounded-full border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-700 has-checked:border-amber-700 has-checked:bg-amber-700 has-checked:text-white">
                    <input type="radio" name="region" value={r}
                      defaultChecked={defaults.region === r} className="sr-only" />
                    {r}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <label className="cursor-pointer rounded-full border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-700 has-checked:border-stone-500 has-checked:bg-stone-100">
            <input type="radio" name="region" value="" defaultChecked={!defaults.region} className="sr-only" />
            전체 (지역 무관)
          </label>
        </div>
      </Field>

      {/* 정모 일정 */}
      <Field label="정모 일정" hint="선택">
        <div className="space-y-3">
          <div>
            <div className="mb-1.5 text-xs text-stone-500">주기</div>
            <div className="flex flex-wrap gap-2">
              {FREQUENCIES.map((f) => (
                <label key={f}
                  className="cursor-pointer rounded-full border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-700 has-checked:border-amber-700 has-checked:bg-amber-700 has-checked:text-white">
                  <input type="radio" name="meeting_frequency" value={f}
                    defaultChecked={defaults.meeting_frequency === f} className="sr-only" />
                  {f}
                </label>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-1.5 text-xs text-stone-500">요일 (복수 선택 가능)</div>
            <div className="flex gap-1.5">
              {DAYS.map((d) => (
                <button key={d} type="button" onClick={() => toggleDay(d)}
                  className={`h-9 w-9 rounded-full border text-sm font-medium transition ${
                    selectedDays.includes(d)
                      ? "border-amber-700 bg-amber-700 text-white"
                      : "border-stone-300 bg-white text-stone-700"
                  }`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-1.5 text-xs text-stone-500">시간</div>
            <input type="time" name="meeting_time"
              defaultValue={defaults.meeting_time ?? ""}
              className="input w-auto" />
          </div>
        </div>
      </Field>

      <Field label="정원" hint="2~200명">
        <input name="max_members" type="number" required min={2} max={200}
          defaultValue={defaults.max_members ?? 10} className="input" />
      </Field>

      <Field label="소개글" hint="취지·진행 방식 등">
        <textarea name="description" rows={6} maxLength={2000}
          defaultValue={defaults.description ?? ""}
          placeholder={`예)\n- 마가복음 1장씩 읽고 나눠요\n- 누구나 환영해요`}
          className="input" />
      </Field>

      {mode === "create" && (
        <Field label="방장 닉네임" hint="1~20자">
          <input name="creator_nickname" required maxLength={20} className="input" />
        </Field>
      )}

      {!hidePin && (
        <Field label={mode === "create" ? "나만 아는 PIN 번호" : "PIN 번호 확인"} hint="숫자 4자리 · 수정·삭제할 때 써요">
          <input name="edit_pin" inputMode="numeric" pattern="\d{4}" maxLength={4}
            placeholder="예) 1234" className="input tracking-widest" />
        </Field>
      )}

      <button type="submit" disabled={pending}
        className="w-full rounded-full bg-amber-700 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-amber-800 disabled:bg-stone-400">
        {pending ? "잠깐만요…" : submitLabel}
      </button>

      <style>{`
        .input {
          width: 100%;
          border: 1px solid #d6d3d1;
          background: white;
          color: #1c1917;
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 14px;
          outline: none;
          transition: border-color .15s;
        }
        .input:focus { border-color: #d97706; }
        textarea.input { line-height: 1.6; }
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

function FieldsetGroup({ title, name, options, defaultValue }: {
  title: string; name: string;
  options: { slug: string; label: string; emoji: string }[];
  defaultValue?: string;
}) {
  return (
    <div>
      <div className="mb-1 text-xs font-medium text-stone-500">{title}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.slug}
            className="cursor-pointer rounded-full border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-700 has-checked:border-amber-700 has-checked:bg-amber-700 has-checked:text-white">
            <input type="radio" name={name} value={o.slug}
              defaultChecked={defaultValue === o.slug} className="sr-only" required />
            <span aria-hidden className="mr-1">{o.emoji}</span>
            {o.label}
          </label>
        ))}
      </div>
    </div>
  );
}
