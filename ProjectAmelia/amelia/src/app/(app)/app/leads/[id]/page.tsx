import { prisma } from "@/server/db";
import { notFound } from "next/navigation";

type PageProps = { params: Promise<{ id: string }> };

export default async function AppLeadDetailPage({ params }: PageProps) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-[var(--font-cormorant)] text-3xl">{lead.clientName}</h1>
        <span className="text-xs rounded-full bg-muted px-2 py-1">{lead.status}</span>
      </div>
      <section className="rounded-2xl border border-border bg-background p-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{lead.clientEmail}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Budget</p>
            <p className="font-medium">{lead.budgetUsd ? `$${lead.budgetUsd}` : "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Event Date</p>
            <p className="font-medium">{lead.eventDate ? new Date(lead.eventDate).toDateString() : "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Source</p>
            <p className="font-medium">{lead.source ?? "—"}</p>
          </div>
        </div>
      </section>
    </main>
  );
}


