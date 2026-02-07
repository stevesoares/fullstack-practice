import { format } from "date-fns";
import { prisma } from "@/server/db";
import { requireUserId } from "@/server/require-user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function ContractsPage() {
  const userId = await requireUserId();
  const contracts = await prisma.contract.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6 md:py-6">
      <Card>
        <CardHeader>
          <CardTitle>Contracts</CardTitle>
          <CardDescription>Monitor signature progress and linked leads.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Signer</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                    No contracts yet.
                  </TableCell>
                </TableRow>
              ) : (
                contracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell className="font-medium">{contract.title}</TableCell>
                    <TableCell>{contract.status}</TableCell>
                    <TableCell>{contract.signerEmail ?? "-"}</TableCell>
                    <TableCell>{format(new Date(contract.createdAt), "MMM d, yyyy")}</TableCell>
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
