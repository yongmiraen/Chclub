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
  themeColor: "#fafaf9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full bg-stone-100 text-stone-900">
        <div className="mx-auto flex min-h-dvh max-w-[480px] flex-col bg-white shadow-xl shadow-stone-200/50">
          <div className="flex flex-1 flex-col">{children}</div>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
