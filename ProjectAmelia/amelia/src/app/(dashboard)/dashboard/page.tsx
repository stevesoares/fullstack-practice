import { prisma } from "@/server/db";
import Link from "next/link";

export default async function DashboardPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-6 font-[var(--font-cormorant)] text-4xl">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-background p-6">
          <h2 className="mb-2 text-lg font-semibold">Upcoming Events</h2>
          <p className="text-muted-foreground text-sm">Google Calendar sync coming soon.</p>
        </div>
        <div className="rounded-2xl border border-border bg-background p-6">
          <h2 className="mb-4 text-lg font-semibold">Open Leads</h2>
          {leads.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No leads yet. Visit <code className="rounded bg-muted px-1 py-0.5">/api/seed</code> to add sample data.
            </p>
          ) : (
            <ul className="space-y-2">
              {leads.map((l) => (
                <li key={l.id} className="rounded-lg border border-border hover:bg-muted/50 focus-within:ring-2 focus-within:ring-ring">
                  <Link
                    href={`/dashboard/leads/${l.id}`}
                    className="flex items-center justify-between px-3 py-2 outline-none"
                    aria-label={`Open lead ${l.clientName}`}
                  >
                    <div>
                      <p className="font-medium">{l.clientName}</p>
                      <p className="text-xs text-muted-foreground">{l.clientEmail}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{l.status}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-2xl border border-border bg-background p-6">
          <h2 className="mb-2 text-lg font-semibold">Key Metrics</h2>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Lead-to-booking: —</li>
            <li>Avg. time-to-respond: —</li>
            <li>Upcoming invoice totals: —</li>
          </ul>
        </div>
      </div>
    </main>
  );
}


