import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "크로소 — 크리스천 소모임",
  description:
    "신앙과 일상을 함께 나눌 크리스천 소모임을 만들고, 가입하고, 함께 활동하세요.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  // viewportFit cover 없이 브라우저 기본 safe area 처리에 위임
  themeColor: "#fafaf9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      {/* bg-stone-100: 430px 컨테이너 양옆 레터박스 색상 */}
      <body className="min-h-full bg-stone-100 text-stone-900">
        {/*
          기준 해상도: 360~430px (세로형 모바일 가이드 준수)
          - 모바일에서는 100vw로 꽉 채움
          - 데스크탑에서는 430px 고정, 양옆 stone-100 배경
          - min-h-dvh: 최소 디바이스 뷰포트 높이 확보 (640px+ 기기 대응)
        */}
        <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-white shadow-xl shadow-stone-300/40">
          <div className="flex flex-1 flex-col">{children}</div>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
