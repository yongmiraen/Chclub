import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-xl font-bold tracking-tight text-stone-900">
            크로소
          </span>
          <span className="text-xs text-stone-500">크리스천 소모임</span>
        </Link>
        <Link
          href="/groups/new"
          className="rounded-full bg-amber-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-amber-800"
        >
          + 모임 만들기
        </Link>
      </div>
    </header>
  );
}
