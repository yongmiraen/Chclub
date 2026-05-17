"use client";

import { useActionState, useRef, useState } from "react";
import { createPost } from "@/lib/actions";
import type { ActionResult } from "@/lib/actions";

const initial: ActionResult | null = null;

export default function PostForm({
  groupId,
  isOwner = false,
}: {
  groupId: string;
  isOwner?: boolean;
}) {
  const boundAction = createPost.bind(null, groupId);
  const [state, formAction, pending] = useActionState(boundAction, initial);
  const [isNotice, setIsNotice] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const error = state && !state.ok ? state.error : null;

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await formAction(fd);
        formRef.current?.reset();
        setIsNotice(false);
      }}
      className={`rounded-2xl border p-4 ${isNotice ? "border-amber-300 bg-amber-50" : "border-stone-200 bg-white"}`}
    >
      <input type="hidden" name="is_notice" value={String(isNotice)} />

      {error && <p className="mb-2 text-xs text-rose-600">{error}</p>}

      {isNotice && (
        <p className="mb-2 text-xs font-medium text-amber-700">📢 공지사항으로 올려요</p>
      )}

      <textarea
        name="content"
        rows={3}
        maxLength={1000}
        placeholder={isNotice ? "멤버들에게 전달할 공지를 입력하세요." : "모임 활동을 짧게 나눠보세요 :)"}
        className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-amber-500 focus:bg-white"
      />
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="cursor-pointer text-xs text-stone-400">
            📷 사진
            <input type="file" name="image" accept="image/*" className="sr-only" />
          </label>
          {isOwner && (
            <button
              type="button"
              onClick={() => setIsNotice((v) => !v)}
              className={`text-xs font-medium transition ${isNotice ? "text-amber-700" : "text-stone-400"}`}
            >
              📢 공지
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-amber-700 px-4 py-1.5 text-xs font-medium text-white disabled:opacity-50"
        >
          {pending ? "올리는 중…" : "올리기"}
        </button>
      </div>
    </form>
  );
}
