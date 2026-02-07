"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { fetchJson } from "@/lib/fetcher";
import { useToast } from "@/components/ui/toast";
import type { LeadStatus } from "@prisma/client";

type ModalKey = "lead" | "contact" | "project" | "meeting" | null;

type Action = {
  key: string;
  label: string;
  hint: string;
  run: () => void;
};

const leadStatuses: { label: string; value: LeadStatus }[] = [
  { label: "Lead", value: "LEAD" },
  { label: "Qualified", value: "QUALIFIED" },
  { label: "Booked", value: "BOOKED" },
];

export default function CreateNew() {
  const [openPalette, setOpenPalette] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalKey>(null);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const actions = useMemo<Action[]>(
    () => [
      { key: "lead", label: "New Lead", hint: "Add to pipeline", run: () => setActiveModal("lead") },
      { key: "contact", label: "New Contact", hint: "Create CRM contact", run: () => setActiveModal("contact") },
      { key: "project", label: "New Project", hint: "Create project workspace", run: () => setActiveModal("project") },
      { key: "meeting", label: "New Meeting", hint: "Schedule calendar event", run: () => setActiveModal("meeting") },
      { key: "invoice", label: "Go to Invoices", hint: "Open invoices module", run: () => router.push("/app/invoices") },
      { key: "contract", label: "Go to Contracts", hint: "Open contracts module", run: () => router.push("/app/contracts") },
      { key: "gallery", label: "Go to Galleries", hint: "Open galleries module", run: () => router.push("/app/galleries") },
    ],
    [router],
  );

  const filteredActions = actions.filter((action) => {
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return `${action.label} ${action.hint}`.toLowerCase().includes(needle);
  });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpenPalette((prev) => !prev);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <Button variant="default" onClick={() => setOpenPalette(true)}>
        Create New
      </Button>

      <Dialog
        open={openPalette}
        onOpenChange={(open) => {
          setOpenPalette(open);
          if (!open) setQuery("");
        }}
      >
        <DialogContent className="max-w-xl p-0">
          <Command>
            <CommandInput
              autoFocus
              placeholder="Search actions..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <CommandList>
              {filteredActions.length === 0 ? <p className="px-3 py-4 text-sm text-muted-foreground">No matching actions.</p> : null}
              {filteredActions.map((action) => (
                <CommandItem
                  key={action.key}
                  onClick={() => {
                    setOpenPalette(false);
                    action.run();
                  }}
                >
                  <span>{action.label}</span>
                  <span className="text-xs text-muted-foreground">{action.hint}</span>
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>

      <CreateLeadDialog open={activeModal === "lead"} onOpenChange={(open) => setActiveModal(open ? "lead" : null)} />
      <CreateContactDialog open={activeModal === "contact"} onOpenChange={(open) => setActiveModal(open ? "contact" : null)} />
      <CreateProjectDialog open={activeModal === "project"} onOpenChange={(open) => setActiveModal(open ? "project" : null)} />
      <CreateEventDialog open={activeModal === "meeting"} onOpenChange={(open) => setActiveModal(open ? "meeting" : null)} />
    </>
  );
}

function CreateLeadDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [form, setForm] = useState({
    clientName: "",
    clientEmail: "",
    source: "",
    budgetUsd: "",
    eventDate: "",
    status: "LEAD" as LeadStatus,
  });
  const queryClient = useQueryClient();
  const { push } = useToast();

  const createLead = useMutation({
    mutationFn: async () =>
      fetchJson<{ lead: { id: string } }>("/api/leads", {
        method: "POST",
        body: JSON.stringify({
          clientName: form.clientName,
          clientEmail: form.clientEmail,
          source: form.source || undefined,
          budgetUsd: form.budgetUsd ? Number(form.budgetUsd) : undefined,
          eventDate: form.eventDate || undefined,
          status: form.status,
        }),
      }),
    onSuccess: (response) => {
      if (!response.ok || !response.data) {
        push({ title: "Could not create lead", message: response.message ?? "Please try again." });
        return;
      }
      onOpenChange(false);
      setForm({ clientName: "", clientEmail: "", source: "", budgetUsd: "", eventDate: "", status: "LEAD" });
      void queryClient.invalidateQueries({ queryKey: ["leads"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      push({ title: "Lead created", message: "The new lead was added to your pipeline." });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Lead</DialogTitle>
          <DialogDescription>Add a new lead to the pipeline.</DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            createLead.mutate();
          }}
        >
          <Input
            required
            placeholder="Client name"
            value={form.clientName}
            onChange={(event) => setForm((prev) => ({ ...prev, clientName: event.target.value }))}
          />
          <Input
            required
            type="email"
            placeholder="Client email"
            value={form.clientEmail}
            onChange={(event) => setForm((prev) => ({ ...prev, clientEmail: event.target.value }))}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              placeholder="Source"
              value={form.source}
              onChange={(event) => setForm((prev) => ({ ...prev, source: event.target.value }))}
            />
            <Input
              type="number"
              min={0}
              placeholder="Budget (USD)"
              value={form.budgetUsd}
              onChange={(event) => setForm((prev) => ({ ...prev, budgetUsd: event.target.value }))}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              type="date"
              value={form.eventDate}
              onChange={(event) => setForm((prev) => ({ ...prev, eventDate: event.target.value }))}
            />
            <Select
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as LeadStatus }))}
              options={leadStatuses}
            />
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createLead.isPending}>
              {createLead.isPending ? "Saving..." : "Save Lead"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CreateContactDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", company: "" });
  const queryClient = useQueryClient();
  const { push } = useToast();

  const createContact = useMutation({
    mutationFn: async () =>
      fetchJson<{ contact: { id: string } }>("/api/contacts", {
        method: "POST",
        body: JSON.stringify(form),
      }),
    onSuccess: (response) => {
      if (!response.ok) {
        push({ title: "Could not create contact", message: response.message ?? "Please try again." });
        return;
      }
      onOpenChange(false);
      setForm({ firstName: "", lastName: "", email: "", company: "" });
      void queryClient.invalidateQueries({ queryKey: ["contacts"] });
      push({ title: "Contact created" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Contact</DialogTitle>
          <DialogDescription>Add a new contact profile.</DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            createContact.mutate();
          }}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              required
              placeholder="First name"
              value={form.firstName}
              onChange={(event) => setForm((prev) => ({ ...prev, firstName: event.target.value }))}
            />
            <Input
              required
              placeholder="Last name"
              value={form.lastName}
              onChange={(event) => setForm((prev) => ({ ...prev, lastName: event.target.value }))}
            />
          </div>
          <Input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          />
          <Input
            placeholder="Company"
            value={form.company}
            onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
          />
          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createContact.isPending}>
              {createContact.isPending ? "Saving..." : "Save Contact"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CreateProjectDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [form, setForm] = useState({ title: "", eventDate: "" });
  const queryClient = useQueryClient();
  const { push } = useToast();

  const createProject = useMutation({
    mutationFn: async () =>
      fetchJson<{ project: { id: string } }>("/api/projects", {
        method: "POST",
        body: JSON.stringify({ title: form.title, eventDate: form.eventDate || undefined }),
      }),
    onSuccess: (response) => {
      if (!response.ok) {
        push({ title: "Could not create project", message: response.message ?? "Please try again." });
        return;
      }
      onOpenChange(false);
      setForm({ title: "", eventDate: "" });
      void queryClient.invalidateQueries({ queryKey: ["projects"] });
      push({ title: "Project created" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>Set up a new project workspace.</DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            createProject.mutate();
          }}
        >
          <Input
            required
            placeholder="Project title"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          />
          <Input
            type="date"
            value={form.eventDate}
            onChange={(event) => setForm((prev) => ({ ...prev, eventDate: event.target.value }))}
          />
          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createProject.isPending}>
              {createProject.isPending ? "Saving..." : "Save Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CreateEventDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [form, setForm] = useState({ title: "", startsAt: "", endsAt: "", location: "" });
  const queryClient = useQueryClient();
  const { push } = useToast();

  const createEvent = useMutation({
    mutationFn: async () =>
      fetchJson<{ event: { id: string } }>("/api/events", {
        method: "POST",
        body: JSON.stringify(form),
      }),
    onSuccess: (response) => {
      if (!response.ok) {
        push({ title: "Could not create meeting", message: response.message ?? "Please try again." });
        return;
      }
      onOpenChange(false);
      setForm({ title: "", startsAt: "", endsAt: "", location: "" });
      void queryClient.invalidateQueries({ queryKey: ["events"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      push({ title: "Meeting created" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Meeting</DialogTitle>
          <DialogDescription>Add an upcoming event to your calendar.</DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            createEvent.mutate();
          }}
        >
          <Input
            required
            placeholder="Title"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              required
              type="datetime-local"
              value={form.startsAt}
              onChange={(event) => setForm((prev) => ({ ...prev, startsAt: event.target.value }))}
            />
            <Input
              required
              type="datetime-local"
              value={form.endsAt}
              onChange={(event) => setForm((prev) => ({ ...prev, endsAt: event.target.value }))}
            />
          </div>
          <Input
            placeholder="Location"
            value={form.location}
            onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
          />
          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createEvent.isPending}>
              {createEvent.isPending ? "Saving..." : "Save Meeting"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
