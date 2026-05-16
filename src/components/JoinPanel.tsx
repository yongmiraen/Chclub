"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import { joinGroup } from "@/lib/actions";
import type { ActionResult } from "@/lib/actions";

type Props = {
  groupId: string;
  full: boolean;
};

const STORAGE_KEY = "kroso:joined";
const CHANGE_EVENT = "kroso:joined-change";

type JoinedMap = Record<string, { nickname: string }>;

function readJoined(): JoinedMap {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeJoined(map: JoinedMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(CHANGE_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(CHANGE_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

function useJoinedRecord(groupId: string) {
  return useSyncExternalStore<{ nickname: string } | null>(
    subscribe,
    () => readJoined()[groupId] ?? null,
    () => null,
  );
}

export default function JoinPanel({ groupId, full }: Props) {
  const boundAction = joinGroup.bind(null, groupId);
  const [state, formAction, pending] = useActionState<
    ActionResult | null,
    FormData
  >(boundAction, null);

  const pendingNicknameRef = useRef<string>("");
  const lastConsumedRef = useRef<ActionResult | null>(null);
  const joined = useJoinedRecord(groupId);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!state || state === lastConsumedRef.current) return;
    lastConsumedRef.current = state;
    if (state.ok && pendingNicknameRef.current) {
      const next = readJoined();
      next[groupId] = { nickname: pendingNicknameRef.current };
      writeJoined(next);
      pendingNicknameRef.current = "";
      setOpen(false);
    }
  }, [state, groupId]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const fd = new FormData(e.currentTarget);
    pendingNicknameRef.current = (fd.get("nickname") as string) ?? "";
  }

  const cta = joined ? (
    <div className="flex items-center gap-3">
      <div className="flex-1 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <strong>{joined.nickname}</strong> 으로 참여중 🙌
      </div>
      <button
        type="button"
        onClick={() => {
          if (!confirm("참여 표시를 해제할까요?")) return;
          const next = readJoined();
          delete next[groupId];
          writeJoined(next);
        }}
        className="rounded-xl border border-stone-200 px-3 py-3 text-xs text-stone-600 active:bg-stone-100"
      >
        해제
      </button>
    </div>
  ) : full ? (
    <button
      disabled
      className="w-full rounded-xl bg-stone-200 px-4 py-3.5 text-sm font-medium text-stone-500"
    >
      정원이 가득 찼어요
    </button>
  ) : (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="w-full rounded-xl bg-amber-700 px-4 py-3.5 text-base font-semibold text-white shadow-sm active:bg-amber-800"
    >
      가입하기
    </button>
  );

  return (
    <>
      <div className="sticky bottom-0 z-10 border-t border-stone-100 bg-white/95 px-4 py-3 pb-[max(env(safe-area-inset-bottom),12px)] backdrop-blur">
        {cta}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/40"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-[480px] rounded-t-2xl bg-white p-5 pb-[max(env(safe-area-inset-bottom),20px)] shadow-2xl">
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-stone-300" />
            <h3 className="text-lg font-bold text-stone-900">참여 신청</h3>
            <p className="mt-1 text-xs text-stone-500">
              방장이 연락할 수 있도록 닉네임을 남겨 주세요.
            </p>

            {state && !state.ok && (
              <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
                {state.error}
              </div>
            )}

            <form
              action={formAction}
              onSubmit={handleSubmit}
              className="mt-4 space-y-3"
            >
              <input
                name="nickname"
                required
                maxLength={20}
                placeholder="닉네임"
                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
              />
              <input
                name="contact"
                maxLength={100}
                placeholder="연락처 (선택, 카톡ID·전화 등)"
                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
              />
              <textarea
                name="message"
                rows={3}
                maxLength={500}
                placeholder="방장에게 한마디 (선택)"
                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm leading-6 focus:border-amber-500 focus:outline-none"
              />
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-xl border border-stone-300 px-4 py-3 text-sm text-stone-700"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="flex-[2] rounded-xl bg-amber-700 px-4 py-3 text-sm font-semibold text-white active:bg-amber-800 disabled:bg-stone-400"
                >
                  {pending ? "신청 중…" : "함께 하기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
