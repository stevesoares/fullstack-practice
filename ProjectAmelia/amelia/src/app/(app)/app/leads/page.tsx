"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { LeadStatus } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useLeads, useUpdateLead } from "@/hooks/use-app-data";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const statuses: LeadStatus[] = ["LEAD", "QUALIFIED", "BOOKED"];

function labelForStatus(status: LeadStatus) {
  if (status === "LEAD") return "Lead";
  if (status === "QUALIFIED") return "Qualified";
  return "Booked";
}

export default function LeadsPage() {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [status, setStatus] = useState<LeadStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const { push } = useToast();

  const leadsQuery = useLeads({ view, status, q: search });
  const updateLead = useUpdateLead();

  const statusOptions = useMemo(
    () => [{ value: "ALL", label: "All statuses" }, ...statuses.map((value) => ({ value, label: labelForStatus(value) }))],
    [],
  );

  const onStatusChange = async (id: string, nextStatus: LeadStatus) => {
    try {
      await updateLead.mutateAsync({ id, payload: { status: nextStatus } });
      push({ title: "Lead updated", message: `Moved to ${labelForStatus(nextStatus)}.` });
    } catch (error) {
      push({ title: "Could not update lead", message: error instanceof Error ? error.message : "Please retry." });
    }
  };

  return (
    <main className="mx-auto w-full max-w-7xl space-y-4 px-4 py-4 md:space-y-6 md:px-6 md:py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Leads Pipeline</h2>
          <p className="text-sm text-muted-foreground">Track inquiry progress with list and board workflows.</p>
        </div>
        <Tabs value={view} onValueChange={(value) => setView(value as "kanban" | "list")}>
          <TabsList>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Input placeholder="Search by name, email, source" value={search} onChange={(event) => setSearch(event.target.value)} />
        <div className="sm:col-span-1">
          <Select
            value={status}
            onChange={(event) => setStatus(event.target.value as LeadStatus | "ALL")}
            options={statusOptions}
          />
        </div>
      </div>

      {leadsQuery.isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} className="h-72" />
          ))}
        </div>
      ) : null}

      {leadsQuery.error ? (
        <Card>
          <CardHeader>
            <CardTitle>Could not load leads</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {leadsQuery.error instanceof Error ? leadsQuery.error.message : "Unexpected error"}
          </CardContent>
        </Card>
      ) : null}

      {!leadsQuery.isLoading && !leadsQuery.error ? (
        <Tabs value={view} onValueChange={(value) => setView(value as "kanban" | "list") }>
          <TabsContent value="kanban" className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {statuses.map((column) => {
              const items = leadsQuery.data?.columns?.[column] ?? [];
              return (
                <section
                  key={column}
                  className="rounded-2xl border border-border bg-muted/20 p-3"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    const id = event.dataTransfer.getData("text/plain");
                    if (id) void onStatusChange(id, column);
                  }}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold">{labelForStatus(column)}</h3>
                    <Badge variant="secondary">{items.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {items.length === 0 ? <p className="rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">No leads</p> : null}
                    {items.map((lead) => (
                      <Link
                        key={lead.id}
                        href={`/app/leads/${lead.id}`}
                        className={cn(
                          "block rounded-xl border border-border bg-background p-3 shadow-sm transition hover:shadow",
                          updateLead.isPending ? "opacity-80" : "",
                        )}
                        draggable
                        onDragStart={(event) => {
                          event.dataTransfer.setData("text/plain", lead.id);
                        }}
                      >
                        <p className="text-sm font-semibold">{lead.clientName}</p>
                        <p className="text-xs text-muted-foreground">{lead.clientEmail}</p>
                        {lead.source ? <p className="mt-1 text-xs text-muted-foreground">{lead.source}</p> : null}
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </TabsContent>

          <TabsContent value="list" className="rounded-2xl border border-border bg-background">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(leadsQuery.data?.items ?? []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                      No leads found for the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  (leadsQuery.data?.items ?? []).map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.clientName}</TableCell>
                      <TableCell>{lead.clientEmail}</TableCell>
                      <TableCell>{lead.source ?? "-"}</TableCell>
                      <TableCell>
                        <Select
                          value={lead.status}
                          onChange={(event) => void onStatusChange(lead.id, event.target.value as LeadStatus)}
                          options={statuses.map((value) => ({ value, label: labelForStatus(value) }))}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/app/leads/${lead.id}`} className="text-sm text-primary underline underline-offset-2">
                          Open
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      ) : null}
    </main>
  );
}
