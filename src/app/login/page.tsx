import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import LoginButtons from "./LoginButtons";

export const metadata = { title: "로그인 · 크로소" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) redirect("/");

  const sp = await searchParams;
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="text-4xl">✝️</div>
      <h1 className="mt-4 text-2xl font-bold text-stone-900">크로소</h1>
      <p className="mt-2 text-sm text-stone-600">크리스천 소모임 — 함께 해요</p>

      {sp.error && (
        <div className="mt-6 w-full max-w-xs rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          로그인에 실패했어요. 다시 시도해 주세요.
        </div>
      )}

      <div className="mt-8 w-full max-w-xs">
        <LoginButtons next={sp.next ?? "/"} />
      </div>

      <p className="mt-10 text-center text-xs leading-5 text-stone-400">
        로그인하면 크로소{" "}
        <a href="/legal/terms" className="underline hover:text-stone-600">
          이용약관
        </a>
        에 동의하는 것으로 간주합니다.
      </p>
    </div>
  );
}
