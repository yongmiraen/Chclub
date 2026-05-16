"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GroupError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Group page error:", error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <div className="text-4xl">😢</div>
      <h2 className="mt-4 text-lg font-bold text-stone-900 dark:text-stone-100">
        모임을 불러오지 못했어요
      </h2>
      <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
        잠깐 후에 다시 시도해 보세요.
      </p>
      {error.digest && (
        <p className="mt-1 text-xs text-stone-400">
          오류 코드: {error.digest}
        </p>
      )}
      <div className="mt-6 flex gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-amber-700 px-5 py-2 text-sm font-medium text-white dark:bg-amber-600"
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="rounded-full border border-stone-300 bg-white px-5 py-2 text-sm text-stone-700 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-300"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
