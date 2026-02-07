import { prisma } from "@/server/db";
import { requireUserId } from "@/server/require-user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function ClientsPage() {
  const userId = await requireUserId();
  const clients = await prisma.lead.findMany({
    where: { ownerId: userId, status: "BOOKED" },
    orderBy: { updatedAt: "desc" },
    take: 50,
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6 md:py-6">
      <Card>
        <CardHeader>
          <CardTitle>Clients</CardTitle>
          <CardDescription>Booked leads currently treated as client profiles.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                    No clients yet. Move leads to Booked to populate this view.
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.clientName}</TableCell>
                    <TableCell>{client.clientEmail}</TableCell>
                    <TableCell>{client.source ?? "-"}</TableCell>
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
