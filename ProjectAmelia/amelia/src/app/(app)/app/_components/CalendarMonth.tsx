"use client";

import { useEffect, useMemo, useState } from "react";

type CalEvent = { id: string; title: string; startsAt: string; endsAt: string };

function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth() + 1, 0); }

export default function CalendarMonth() {
  const [cursor, setCursor] = useState(new Date());
  const [events, setEvents] = useState<CalEvent[]>([]);
  useEffect(() => {
    const from = new Date(cursor.getFullYear(), cursor.getMonth(), 1).toISOString();
    const to = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).toISOString();
    fetch(`/api/events?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
      .then(r => r.json())
      .then(d => setEvents(d.events ?? []))
      .catch(() => setEvents([]));
  }, [cursor]);

  const days = useMemo(() => {
    const start = startOfMonth(cursor);
    const end = endOfMonth(cursor);
    const firstDay = new Date(start);
    const offset = (firstDay.getDay() + 6) % 7; // Monday first
    const cells: Date[] = [];
    for (let i = 0; i < offset; i++) cells.push(new Date(start.getFullYear(), start.getMonth(), 0 - (offset - 1 - i)));
    for (let d = 1; d <= end.getDate(); d++) cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
    while (cells.length % 7 !== 0) cells.push(new Date(end.getFullYear(), end.getMonth(), end.getDate() + (cells.length % 7 === 0 ? 0 : (7 - (cells.length % 7)))));
    return cells;
  }, [cursor]);

  const monthLabel = cursor.toLocaleString(undefined, { month: "long", year: "numeric" });
  const todayStr = new Date().toDateString();

  return (
    <div className="p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between">
        <button className="rounded-md px-2 py-1 text-sm ring-1 ring-border" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}>Prev</button>
        <h3 className="text-lg font-semibold">{monthLabel}</h3>
        <button className="rounded-md px-2 py-1 text-sm ring-1 ring-border" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}>Next</button>
      </div>
      <div className="grid grid-cols-7 gap-px rounded-xl border border-border bg-border text-xs sm:text-sm">
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
          <div key={d} className="bg-background p-2 text-center text-xs text-muted-foreground">{d}</div>
        ))}
        {days.map((d, i) => {
          const inMonth = d.getMonth() === cursor.getMonth();
          const isToday = d.toDateString() === todayStr;
          const dayEvents = events.filter(e => new Date(e.startsAt).toDateString() === d.toDateString());
          return (
            <div key={i} className={`bg-background p-2 min-h-20 sm:min-h-24 ${!inMonth ? "opacity-40" : ""} ${isToday ? "ring-1 ring-primary" : ""}`}>
              <div className="mb-1 text-xs font-medium">{d.getDate()}</div>
              <div className="space-y-1">
                {dayEvents.slice(0,3).map(ev => (
                  <div key={ev.id} className="truncate rounded bg-muted px-1 py-0.5 text-[10px]">{ev.title}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


