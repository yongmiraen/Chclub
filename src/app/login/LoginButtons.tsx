"use client";

import { createClient } from "@/lib/supabase-browser";

export default function LoginButtons({ next }: { next: string }) {
  const supabase = createClient();

  async function signInWith(provider: "google" | "kakao") {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => signInWith("kakao")}
        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#FEE500] px-5 py-3.5 text-sm font-semibold text-[#191919] shadow-sm transition active:brightness-95"
      >
        <KakaoIcon />
        카카오로 계속하기
      </button>

      <button
        type="button"
        onClick={() => signInWith("google")}
        className="flex w-full items-center justify-center gap-3 rounded-2xl border border-stone-200 bg-white px-5 py-3.5 text-sm font-semibold text-stone-800 shadow-sm transition active:bg-stone-50"
      >
        <GoogleIcon />
        구글로 계속하기
      </button>
    </div>
  );
}

function KakaoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#191919">
      <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.736 1.71 5.137 4.29 6.583l-1.09 3.98a.3.3 0 0 0 .46.323l4.638-3.09A11.7 11.7 0 0 0 12 18.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3Z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" />
    </svg>
  );
}
