import { prisma } from "@/server/db";
import { requireUserId } from "@/server/require-user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SalesPage() {
  const userId = await requireUserId();
  const [invoiceCount, paidCount, openCount, invoices] = await Promise.all([
    prisma.invoice.count({ where: { ownerId: userId } }),
    prisma.invoice.count({ where: { ownerId: userId, status: "paid" } }),
    prisma.invoice.count({ where: { ownerId: userId, status: "open" } }),
    prisma.invoice.findMany({ where: { ownerId: userId }, select: { amountUsd: true } }),
  ]);
  const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.amountUsd, 0);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-4 px-4 py-4 md:px-6 md:py-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Metric title="Invoices" value={invoiceCount} detail="Total issued" />
        <Metric title="Paid" value={paidCount} detail="Completed payments" />
        <Metric title="Open" value={openCount} detail="Awaiting payment" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Snapshot</CardTitle>
          <CardDescription>Current invoice total from all records.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-semibold">${totalRevenue.toLocaleString()}</p>
          <p className="mt-2 text-sm text-muted-foreground">Use invoices and contracts modules for line-item detail.</p>
        </CardContent>
      </Card>
    </main>
  );
}

function Metric({ title, value, detail }: { title: string; value: number; detail: string }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 text-xs text-muted-foreground">{detail}</CardContent>
    </Card>
  );
}
