import { format } from "date-fns";
import { prisma } from "@/server/db";
import { requireUserId } from "@/server/require-user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function InvoicesPage() {
  const userId = await requireUserId();
  const invoices = await prisma.invoice.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6 md:py-6">
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>Track due dates and payment status.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                    No invoices yet.
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id.slice(-8).toUpperCase()}</TableCell>
                    <TableCell>${invoice.amountUsd.toLocaleString()}</TableCell>
                    <TableCell>{format(new Date(invoice.dueDate), "MMM d, yyyy")}</TableCell>
                    <TableCell>{invoice.status}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
