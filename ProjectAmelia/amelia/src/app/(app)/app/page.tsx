import { prisma } from "@/server/db";
import CreateNew from "./_components/CreateNew";
import Link from "next/link";
import CalendarMonth from "./_components/CalendarMonth";
import { CreateContactModalMount, CreateEventModalMount, CreateProjectModalMount } from "./_components/CreateModals";

function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
  d.setHours(0, 0, 0, 0);
  d.setDate(diff);
  return d;
}

export default async function AppHomePage() {
  // Counts
  await Promise.all([
    prisma.lead.count(),
    prisma.invoice.count(),
    prisma.gallery.count(),
  ]);

  // KPI: conversion rate = booked / total leads
  const [totalLeads, bookedLeads] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "BOOKED" } }),
  ]);
  const conversionRate = totalLeads === 0 ? 0 : Math.round((bookedLeads / totalLeads) * 100);

  // KPI: leads per week (current week)
  const weekStart = startOfWeek(new Date());
  const leadsThisWeek = await prisma.lead.count({ where: { createdAt: { gte: weekStart } } });

  // KPI: average sales per client (avg invoice amount per unique lead with invoices)
  const invoices = await prisma.invoice.findMany({ select: { amountUsd: true, leadId: true } });
  const totalsByLead = invoices.reduce<Record<string, number>>((acc, inv) => {
    const key = inv.leadId ?? `__no_lead_${Math.random()}`;
    acc[key] = (acc[key] ?? 0) + inv.amountUsd;
    return acc;
  }, {});
  const leadIdsWithSales = Object.keys(totalsByLead);
  const avgSalesPerClient = leadIdsWithSales.length === 0
    ? 0
    : Math.round(
        (Object.values(totalsByLead).reduce((a, b) => a + b, 0) / leadIdsWithSales.length) * 100
      ) / 100;

  return (
    <>
    <main className="mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-8">
      <h1 className="font-[var(--font-cormorant)] text-4xl">Overview</h1>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div />
        <CreateNew />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-3">
        <KpiCard title="Conversion Rate" value={`${conversionRate}%`} subtext={`${bookedLeads}/${totalLeads} booked`} />
        <KpiCard title="Leads This Week" value={leadsThisWeek} subtext="Week-to-date" />
        <KpiCard title="Avg Sales / Client" value={`$${avgSalesPerClient}`} subtext="Based on invoices" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border border-border bg-background p-0 lg:col-span-2">
          <CalendarMonth />
        </section>

        <section className="rounded-2xl border border-border bg-background p-3 sm:p-4 md:p-6">
          <h2 className="mb-2 text-lg font-semibold">Leads</h2>
          <p className="text-sm text-muted-foreground">Latest inquiries and statuses.</p>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border border-border bg-background p-3 sm:p-4 md:p-6">
          <h2 className="mb-2 text-lg font-semibold">Clients</h2>
          <p className="text-sm text-muted-foreground">Recent clients with active projects.</p>
        </section>
        <section className="rounded-2xl border border-border bg-background p-3 sm:p-4 md:p-6">
          <h2 className="mb-2 text-lg font-semibold">Sales</h2>
          <p className="text-sm text-muted-foreground">Open invoices, recent payments.</p>
        </section>
        <section className="rounded-2xl border border-border bg-background p-3 sm:p-4 md:p-6">
          <h2 className="mb-2 text-lg font-semibold">Galleries</h2>
          <p className="text-sm text-muted-foreground">Newly delivered albums.</p>
        </section>
      </div>
    </main>
    <CreateContactModalMount />
    <CreateProjectModalMount />
    <CreateEventModalMount />
    </>
  );
}

const KpiCard = ({ title, value, subtext }: { title: string; value: string | number; subtext?: string }) => (
  <div className="rounded-2xl border border-border bg-background p-6">
    <p className="text-sm text-muted-foreground">{title}</p>
    <p className="mt-1 text-3xl font-semibold">{value}</p>
    {subtext ? <p className="mt-1 text-xs text-muted-foreground">{subtext}</p> : null}
  </div>
);


