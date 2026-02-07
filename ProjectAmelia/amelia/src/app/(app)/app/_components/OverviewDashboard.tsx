"use client";

import Link from "next/link";
import { format } from "date-fns";
import { CalendarCheck2, ListChecks } from "lucide-react";
import CalendarMonth from "./CalendarMonth";
import { useDashboardSummary } from "@/hooks/use-app-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function OverviewDashboard() {
  const summaryQuery = useDashboardSummary();

  if (summaryQuery.isLoading) {
    return (
      <main className="mx-auto w-full max-w-7xl space-y-4 px-4 py-4 md:px-6 md:py-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Card key={idx}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-20" />
              </CardHeader>
            </Card>
          ))}
        </div>
        <Skeleton className="h-[320px] w-full" />
      </main>
    );
  }

  if (summaryQuery.error || !summaryQuery.data) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Overview unavailable</CardTitle>
            <CardDescription>{summaryQuery.error instanceof Error ? summaryQuery.error.message : "Could not load summary data."}</CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  const { kpis, today } = summaryQuery.data;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-4 px-4 py-4 md:space-y-6 md:px-6 md:py-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard title="Conversion Rate" value={`${kpis.conversionRate}%`} subtext={`${kpis.bookedLeads}/${kpis.totalLeads} booked`} />
        <KpiCard title="Leads This Week" value={kpis.leadsThisWeek} subtext="Week-to-date" />
        <KpiCard title="Avg Sales / Client" value={`$${kpis.avgSalesPerClient}`} subtext="Based on invoices" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Upcoming meetings and events</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <CalendarMonth />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CalendarCheck2 className="h-4 w-4" />Today</CardTitle>
            <CardDescription>What needs attention right now</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {today.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                No upcoming events. Schedule your next client touchpoint.
              </div>
            ) : (
              today.map((event) => (
                <div key={event.id} className="rounded-xl border border-border p-3">
                  <p className="text-sm font-semibold">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(event.startsAt), "EEE, MMM d · p")}</p>
                  {event.location ? <p className="text-xs text-muted-foreground">{event.location}</p> : null}
                </div>
              ))
            )}

            <div className="rounded-xl bg-muted/50 p-3">
              <p className="mb-2 flex items-center gap-2 text-sm font-medium"><ListChecks className="h-4 w-4" />Action prompts</p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>
                  <Link href="/app/leads" className="underline underline-offset-2">Review new leads</Link>
                </li>
                <li>
                  <Link href="/app/calendar" className="underline underline-offset-2">Open full calendar</Link>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ModuleCard title="Leads" description="Track inquiries and progress toward bookings." href="/app/leads" />
        <ModuleCard title="Projects" description="Manage active projects and event timelines." href="/app/projects" />
        <ModuleCard title="Galleries" description="Deliver albums and manage access in one place." href="/app/galleries" />
      </div>
    </main>
  );
}

function KpiCard({ title, value, subtext }: { title: string; value: string | number; subtext: string }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
        <Badge variant="secondary" className="w-fit">{subtext}</Badge>
      </CardHeader>
    </Card>
  );
}

function ModuleCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={href} className="text-sm font-medium text-primary underline underline-offset-4">
          Open {title}
        </Link>
      </CardContent>
    </Card>
  );
}
