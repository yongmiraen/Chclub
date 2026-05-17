"use client";

import { useActionState, useRef } from "react";
import { createPost } from "@/lib/actions";
import type { ActionResult } from "@/lib/actions";

const initial: ActionResult | null = null;

export default function PostForm({ groupId }: { groupId: string }) {
  const boundAction = createPost.bind(null, groupId);
  const [state, formAction, pending] = useActionState(boundAction, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const error = state && !state.ok ? state.error : null;

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await formAction(fd);
        formRef.current?.reset();
      }}
      className="rounded-2xl border border-stone-200 bg-white p-4"
    >
      {error && (
        <p className="mb-2 text-xs text-rose-600">{error}</p>
      )}
      <textarea
        name="content"
        rows={3}
        maxLength={1000}
        placeholder="모임 활동을 짧게 나눠보세요 :)"
        className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-amber-500 focus:bg-white"
      />
      <div className="mt-2 flex items-center justify-between">
        <label className="cursor-pointer text-xs text-stone-400">
          📷 사진
          <input type="file" name="image" accept="image/*" className="sr-only" />
        </label>
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
