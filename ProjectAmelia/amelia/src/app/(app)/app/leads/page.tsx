import Link from "next/link";
import { prisma } from "@/server/db";

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 20 });
  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="mb-6 font-[var(--font-cormorant)] text-4xl">Leads</h1>
      {leads.length === 0 ? (
        <p className="text-sm text-muted-foreground">No leads yet.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {leads.map((l) => (
            <li key={l.id} className="rounded-xl border border-border bg-background">
              <Link href={`/app/leads/${l.id}`} className="flex items-center justify-between px-4 py-3">
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
    </main>
  );
}


