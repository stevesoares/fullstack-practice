"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CalendarEvent } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEvents } from "@/hooks/use-app-data";
import { fetchJson } from "@/lib/fetcher";
import { useToast } from "@/components/ui/toast";

type EventForm = {
  id?: string;
  title: string;
  startsAt: string;
  endsAt: string;
  location: string;
};

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
}

export default function CalendarMonth() {
  const [cursor, setCursor] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<EventForm>({ id: undefined, title: "", startsAt: "", endsAt: "", location: "" });
  const { push } = useToast();
  const queryClient = useQueryClient();

  const from = useMemo(() => startOfMonth(cursor).toISOString(), [cursor]);
  const to = useMemo(() => endOfMonth(cursor).toISOString(), [cursor]);
  const eventsQuery = useEvents(from, to);

  const saveEvent = useMutation({
    mutationFn: async () => {
      if (form.id) {
        return fetchJson<{ event: CalendarEvent }>(`/api/events/${form.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            title: form.title,
            startsAt: form.startsAt,
            endsAt: form.endsAt,
            location: form.location,
          }),
        });
      }

      return fetchJson<{ event: CalendarEvent }>("/api/events", {
        method: "POST",
        body: JSON.stringify({
          title: form.title,
          startsAt: form.startsAt,
          endsAt: form.endsAt,
          location: form.location,
        }),
      });
    },
    onSuccess: (response) => {
      if (!response.ok) {
        push({ title: "Could not save event", message: response.message ?? "Please retry." });
        return;
      }
      setOpen(false);
      setForm({ id: undefined, title: "", startsAt: "", endsAt: "", location: "" });
      void queryClient.invalidateQueries({ queryKey: ["events"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      push({ title: form.id ? "Event updated" : "Event created" });
    },
  });

  const days = useMemo(() => {
    const start = startOfMonth(cursor);
    const end = endOfMonth(cursor);
    const firstDay = new Date(start);
    const offset = (firstDay.getDay() + 6) % 7;
    const cells: Date[] = [];

    for (let i = 0; i < offset; i++) {
      cells.push(new Date(start.getFullYear(), start.getMonth(), 0 - (offset - 1 - i)));
    }

    for (let day = 1; day <= end.getDate(); day++) {
      cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), day));
    }

    const trailingCount = (7 - (cells.length % 7)) % 7;
    for (let i = 1; i <= trailingCount; i++) {
      cells.push(new Date(end.getFullYear(), end.getMonth(), end.getDate() + i));
    }

    return cells;
  }, [cursor]);

  const monthLabel = cursor.toLocaleString(undefined, { month: "long", year: "numeric" });
  const today = new Date().toDateString();
  const events = eventsQuery.data ?? [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}>Prev</Button>
        <h3 className="text-lg font-semibold">{monthLabel}</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setForm({
                id: undefined,
                title: "",
                startsAt: new Date().toISOString().slice(0, 16),
                endsAt: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
                location: "",
              });
              setOpen(true);
            }}
          >
            New
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}>Next</Button>
        </div>
      </div>

      {eventsQuery.error ? <p className="text-sm text-red-600">Could not load calendar events.</p> : null}

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-border bg-border text-xs sm:text-sm">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="bg-background p-2 text-center text-xs text-muted-foreground">
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          const inMonth = day.getMonth() === cursor.getMonth();
          const isToday = day.toDateString() === today;
          const dayEvents = events.filter((event) => new Date(event.startsAt).toDateString() === day.toDateString());

          return (
            <div key={index} className={`min-h-24 bg-background p-2 ${!inMonth ? "opacity-35" : ""} ${isToday ? "ring-1 ring-primary" : ""}`}>
              <div className="mb-1 text-xs font-semibold">{day.getDate()}</div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    className="w-full truncate rounded bg-muted px-1 py-0.5 text-left text-[10px] hover:bg-muted/70"
                    onClick={() => {
                      setForm({
                        id: event.id,
                        title: event.title,
                        startsAt: new Date(event.startsAt).toISOString().slice(0, 16),
                        endsAt: new Date(event.endsAt).toISOString().slice(0, 16),
                        location: event.location ?? "",
                      });
                      setOpen(true);
                    }}
                  >
                    {event.title}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit Event" : "Create Event"}</DialogTitle>
            <DialogDescription>Manage calendar visibility for your current month view.</DialogDescription>
          </DialogHeader>

          <form
            className="grid gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              saveEvent.mutate();
            }}
          >
            <Input required placeholder="Title" value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                required
                type="datetime-local"
                value={form.startsAt}
                onChange={(event) => setForm((prev) => ({ ...prev, startsAt: event.target.value }))}
              />
              <Input
                required
                type="datetime-local"
                value={form.endsAt}
                onChange={(event) => setForm((prev) => ({ ...prev, endsAt: event.target.value }))}
              />
            </div>
            <Input placeholder="Location" value={form.location} onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))} />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saveEvent.isPending}>
                {saveEvent.isPending ? "Saving..." : "Save event"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
