"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

const ThemeCtx = createContext<{
  theme: Theme;
  resolved: "light" | "dark";
  toggle: () => void;
}>({ theme: "system", resolved: "light", toggle: () => {} });

export function useTheme() {
  return useContext(ThemeCtx);
}

function readSaved(): Theme {
  if (typeof window === "undefined") return "system";
  const s = localStorage.getItem("kroso:theme");
  return s === "light" || s === "dark" ? s : "system";
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  // 클라이언트에서는 lazy initializer로 localStorage 즉시 읽음 → useEffect 불필요
  const [theme, setTheme] = useState<Theme>(readSaved);
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const isDark = theme === "dark" || (theme === "system" && mq.matches);
      document.documentElement.classList.toggle("dark", isDark);
      setResolved(isDark ? "dark" : "light");
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);

  function toggle() {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("kroso:theme", next);
      return next;
    });
  }

  return (
    <ThemeCtx.Provider value={{ theme, resolved, toggle }}>
      {children}
    </ThemeCtx.Provider>
  );
}
