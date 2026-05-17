"use client";

import { useTransition } from "react";
import { toggleAttendance, deleteEvent } from "@/lib/actions";
import type { GroupEvent } from "@/lib/types";

function formatEventDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ko-KR", {
    month: "long", day: "numeric", weekday: "short",
  }) + " " + d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
}

export default function EventCard({
  event,
  groupId,
  attendeeCount,
  isAttending,
  isOwner,
  isLoggedIn,
}: {
  event: GroupEvent;
  groupId: string;
  attendeeCount: number;
  isAttending: boolean;
  isOwner: boolean;
  isLoggedIn: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const isPast = new Date(event.event_date) < new Date();

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4">
      {/* 날짜 뱃지 */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-amber-700">
            📅 {formatEventDate(event.event_date)}
          </p>
          <h3 className="mt-1 text-base font-semibold text-stone-900">{event.title}</h3>
        </div>
        {isOwner && !isPast && (
          <button
            onClick={() => startTransition(async () => { await deleteEvent(event.id, groupId); })}
            disabled={isPending}
            className="shrink-0 text-xs text-stone-400 hover:text-rose-500"
          >
            삭제
          </button>
        )}
      </div>

      {event.location && (
        <p className="mt-1.5 text-xs text-stone-500">📍 {event.location}</p>
      )}
      {event.description && (
        <p className="mt-2 text-sm leading-6 text-stone-600">{event.description}</p>
      )}

      {/* 참석 정보 */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-stone-500">
          참석 {attendeeCount}명
          {event.max_attendees ? ` / 최대 ${event.max_attendees}명` : ""}
        </span>

        {!isPast && isLoggedIn && (
          <button
            disabled={isPending}
            onClick={() => startTransition(async () => {
              await toggleAttendance(event.id, groupId, isAttending);
            })}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition disabled:opacity-50 ${
              isAttending
                ? "border border-stone-300 bg-white text-stone-600"
                : "bg-amber-700 text-white"
            }`}
          >
            {isAttending ? "참석 취소" : "참석할게요"}
          </button>
        )}
        {isPast && (
          <span className="text-xs text-stone-400">종료된 정모</span>
        )}
      </div>
    </div>
  );
}
