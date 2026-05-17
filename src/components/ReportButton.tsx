"use client";

import { useState, useTransition } from "react";
import { reportGroup } from "@/lib/actions";

export default function ReportButton({ groupId }: { groupId: string }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  function submit(reason: string) {
    startTransition(async () => {
      await reportGroup(groupId, reason);
      setDone(true);
      setOpen(false);
    });
  }

  if (done) return (
    <p className="text-center text-xs text-stone-400">신고가 접수되었어요. 검토 후 조치할게요.</p>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="block w-full text-center text-xs text-stone-400 hover:text-stone-600"
      >
        이 모임 신고하기
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-8">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5">
            <h3 className="mb-3 font-semibold text-stone-900">신고 사유 선택</h3>
            <div className="space-y-2">
              {["사이비·이단 의심", "허위 정보", "불법·유해 콘텐츠", "기타"].map((reason) => (
                <button
                  key={reason}
                  disabled={isPending}
                  onClick={() => submit(reason)}
                  className="w-full rounded-xl border border-stone-200 py-3 text-sm text-stone-700 transition active:bg-stone-50 disabled:opacity-50"
                >
                  {reason}
                </button>
              ))}
            </div>
            <button
              onClick={() => setOpen(false)}
              className="mt-3 w-full text-sm text-stone-400"
            >
              취소
            </button>
          </div>
        </div>
      )}
    </>
  );
}
