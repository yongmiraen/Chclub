import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "크로소 — 크리스천 소모임",
  description:
    "신앙과 일상을 함께 나눌 크리스천 소모임을 만들고, 가입하고, 함께 활동하세요.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1917" },
  ],
};

/* 플래시 없는 다크모드 — hydration 전에 실행되는 인라인 스크립트 */
const noFlashScript = `
try {
  const s = localStorage.getItem('kroso:theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (s === 'dark' || (!s && prefersDark)) {
    document.documentElement.classList.add('dark');
  }
} catch {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body className="min-h-full bg-stone-100 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
        <ThemeProvider>
          <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-white shadow-xl shadow-stone-300/40 dark:bg-stone-900 dark:shadow-stone-950/60">
            <div className="flex flex-1 flex-col">{children}</div>
            <BottomNav />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
