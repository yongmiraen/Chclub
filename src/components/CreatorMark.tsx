"use client";

import { useEffect } from "react";

export default function CreatorMark({
  groupId,
  title,
}: {
  groupId: string;
  title: string;
}) {
  useEffect(() => {
    try {
      const raw = localStorage.getItem("kroso:created") || "{}";
      const map = JSON.parse(raw) as Record<string, { title: string }>;
      if (!map[groupId]) {
        map[groupId] = { title };
        localStorage.setItem("kroso:created", JSON.stringify(map));
        window.dispatchEvent(new Event("kroso:created-change"));
      }
    } catch {
      // 무시
    }
  }, [groupId, title]);
  return null;
}
