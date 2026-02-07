"use client";

import { useEffect, useMemo, useState } from "react";
import type { LeadStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useLead, useUpdateLead } from "@/hooks/use-app-data";
import { useToast } from "@/components/ui/toast";

const statuses: LeadStatus[] = ["LEAD", "QUALIFIED", "BOOKED"];

function labelForStatus(status: LeadStatus) {
  if (status === "LEAD") return "Lead";
  if (status === "QUALIFIED") return "Qualified";
  return "Booked";
}

export default function LeadDetailClient({ id }: { id: string }) {
  const leadQuery = useLead(id);
  const updateLead = useUpdateLead();
  const { push } = useToast();
  const [dirty, setDirty] = useState(false);
  const [form, setForm] = useState({
    clientName: "",
    clientEmail: "",
    source: "",
    budgetUsd: "",
    eventDate: "",
    status: "LEAD" as LeadStatus,
  });

  const statusOptions = useMemo(() => statuses.map((value) => ({ value, label: labelForStatus(value) })), []);
  const lead = leadQuery.data;

  useEffect(() => {
    if (!lead || dirty) return;
    setForm({
      clientName: lead.clientName,
      clientEmail: lead.clientEmail,
      source: lead.source ?? "",
      budgetUsd: lead.budgetUsd?.toString() ?? "",
      eventDate: lead.eventDate ? new Date(lead.eventDate).toISOString().slice(0, 10) : "",
      status: lead.status,
    });
  }, [dirty, lead]);

  if (leadQuery.isLoading) {
    return (
      <main className="mx-auto w-full max-w-4xl space-y-4 px-4 py-6 md:px-6">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-72 w-full" />
      </main>
    );
  }

  if (leadQuery.error || !lead) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Lead not available</CardTitle>
            <CardDescription>{leadQuery.error instanceof Error ? leadQuery.error.message : "The lead could not be loaded."}</CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl space-y-4 px-4 py-6 md:space-y-6 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">{lead.clientName}</h2>
          <p className="text-sm text-muted-foreground">Lead details and quick edits</p>
        </div>
        <Badge variant={lead.status === "BOOKED" ? "success" : "secondary"}>{labelForStatus(lead.status)}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lead Information</CardTitle>
          <CardDescription>Update core details without leaving the page.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-3"
            onSubmit={async (event) => {
              event.preventDefault();
              try {
                await updateLead.mutateAsync({
                  id,
                  payload: {
                    clientName: form.clientName,
                    clientEmail: form.clientEmail,
                    source: form.source,
                    budgetUsd: form.budgetUsd ? Number(form.budgetUsd) : null,
                    eventDate: form.eventDate || null,
                    status: form.status,
                  },
                });
                setDirty(false);
                push({ title: "Lead updated" });
              } catch (error) {
                push({ title: "Update failed", message: error instanceof Error ? error.message : "Please retry." });
              }
            }}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm">
                <span className="text-muted-foreground">Client Name</span>
                <Input
                  value={form.clientName}
                  onChange={(event) => {
                    setDirty(true);
                    setForm((prev) => ({ ...prev, clientName: event.target.value }));
                  }}
                />
              </label>
              <label className="space-y-1 text-sm">
                <span className="text-muted-foreground">Client Email</span>
                <Input
                  type="email"
                  value={form.clientEmail}
                  onChange={(event) => {
                    setDirty(true);
                    setForm((prev) => ({ ...prev, clientEmail: event.target.value }));
                  }}
                />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <label className="space-y-1 text-sm">
                <span className="text-muted-foreground">Status</span>
                <Select
                  value={form.status}
                  options={statusOptions}
                  onChange={(event) => {
                    setDirty(true);
                    setForm((prev) => ({ ...prev, status: event.target.value as LeadStatus }));
                  }}
                />
              </label>
              <label className="space-y-1 text-sm">
                <span className="text-muted-foreground">Budget (USD)</span>
                <Input
                  type="number"
                  min={0}
                  value={form.budgetUsd}
                  onChange={(event) => {
                    setDirty(true);
                    setForm((prev) => ({ ...prev, budgetUsd: event.target.value }));
                  }}
                />
              </label>
              <label className="space-y-1 text-sm">
                <span className="text-muted-foreground">Event Date</span>
                <Input
                  type="date"
                  value={form.eventDate}
                  onChange={(event) => {
                    setDirty(true);
                    setForm((prev) => ({ ...prev, eventDate: event.target.value }));
                  }}
                />
              </label>
            </div>

            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Source</span>
              <Input
                value={form.source}
                onChange={(event) => {
                  setDirty(true);
                  setForm((prev) => ({ ...prev, source: event.target.value }));
                }}
              />
            </label>

            <div className="flex justify-end">
              <Button type="submit" disabled={!dirty || updateLead.isPending}>
                {updateLead.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
