import { format } from "date-fns";
import { prisma } from "@/server/db";
import { requireUserId } from "@/server/require-user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function GalleriesPage() {
  const userId = await requireUserId();
  const galleries = await prisma.gallery.findMany({
    where: { ownerId: userId },
    include: { items: { select: { id: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6 md:py-6">
      <Card>
        <CardHeader>
          <CardTitle>Galleries</CardTitle>
          <CardDescription>Delivered albums and media item totals.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {galleries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                    No galleries yet.
                  </TableCell>
                </TableRow>
              ) : (
                galleries.map((gallery) => (
                  <TableRow key={gallery.id}>
                    <TableCell className="font-medium">{gallery.title}</TableCell>
                    <TableCell>{gallery.items.length}</TableCell>
                    <TableCell>{format(new Date(gallery.createdAt), "MMM d, yyyy")}</TableCell>
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
