import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import OnboardingForm from "./OnboardingForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "교회 정보 입력 · 크로소" };

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next = "/" } = await searchParams;
  const supabase = await createClient();

  // 로그인 안 했으면 로그인 페이지로
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/onboarding?next=${encodeURIComponent(next)}`);

  // 이미 교회 입력한 유저면 바로 이동
  const { data: profile } = await supabase
    .from("profiles")
    .select("church_name")
    .eq("id", user.id)
    .single();

  if (profile?.church_name) redirect(next);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* 로고 */}
        <div className="mb-8 text-center">
          <div className="text-4xl">⛪</div>
          <h1 className="mt-3 text-xl font-bold text-stone-900">
            반가워요!
          </h1>
          <p className="mt-1.5 text-sm text-stone-500">
            소속 교회를 알려주시면<br />더 잘 연결해 드릴 수 있어요.
          </p>
        </div>

        <OnboardingForm next={next} />
      </div>
    </div>
  );
}
