"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CalendarEvent, Contact, Lead, LeadStatus, Project } from "@prisma/client";
import { fetchJson } from "@/lib/fetcher";

export type DashboardSummary = {
  kpis: {
    conversionRate: number;
    bookedLeads: number;
    totalLeads: number;
    leadsThisWeek: number;
    avgSalesPerClient: number;
  };
  today: CalendarEvent[];
};

type LeadPatchPayload = {
  clientName?: string;
  clientEmail?: string;
  source?: string | null;
  budgetUsd?: number | null;
  eventDate?: string | null;
  status?: LeadStatus;
};

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: async () => {
      const response = await fetchJson<DashboardSummary>("/api/dashboard/summary");
      if (!response.ok || !response.data) throw new Error(response.message ?? "Could not load dashboard summary");
      return response.data;
    },
  });
}

export function useLeads(params: { view: "kanban" | "list"; status?: LeadStatus | "ALL"; q?: string }) {
  const search = new URLSearchParams();
  search.set("view", params.view);
  if (params.status && params.status !== "ALL") search.set("status", params.status);
  if (params.q) search.set("q", params.q);
  const url = `/api/leads?${search.toString()}`;

  return useQuery({
    queryKey: ["leads", params],
    queryFn: async () => {
      const response = await fetchJson<{
        columns?: Record<LeadStatus, Lead[]>;
        items?: Lead[];
        total: number;
      }>(url);
      if (!response.ok || !response.data) throw new Error(response.message ?? "Could not load leads");
      return response.data;
    },
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: LeadPatchPayload }) => {
      const response = await fetchJson<{ lead: Lead }>(`/api/leads/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      if (!response.ok || !response.data) {
        throw new Error(response.message ?? "Could not update lead");
      }
      return response.data.lead;
    },
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ["leads"] });
      const previous = queryClient.getQueriesData<{ columns?: Record<LeadStatus, Lead[]>; items?: Lead[]; total: number }>({
        queryKey: ["leads"],
      });
      const optimisticPatch: Partial<Lead> = {
        ...(payload.clientName !== undefined ? { clientName: payload.clientName } : {}),
        ...(payload.clientEmail !== undefined ? { clientEmail: payload.clientEmail } : {}),
        ...(payload.source !== undefined ? { source: payload.source } : {}),
        ...(payload.budgetUsd !== undefined ? { budgetUsd: payload.budgetUsd } : {}),
        ...(payload.status !== undefined ? { status: payload.status } : {}),
        ...(payload.eventDate !== undefined ? { eventDate: payload.eventDate ? new Date(payload.eventDate) : null } : {}),
      };

      previous.forEach(([key, data]) => {
        if (!data) return;

        if (data.items) {
          queryClient.setQueryData(key, {
            ...data,
            items: data.items.map((lead) => (lead.id === id ? { ...lead, ...optimisticPatch } : lead)),
          });
          return;
        }

        if (data.columns) {
          const allLeads = Object.values(data.columns)
            .flat()
            .map((lead) => (lead.id === id ? { ...lead, ...optimisticPatch } : lead));
          const columns: Record<LeadStatus, Lead[]> = {
            LEAD: allLeads.filter((lead) => lead.status === "LEAD"),
            QUALIFIED: allLeads.filter((lead) => lead.status === "QUALIFIED"),
            BOOKED: allLeads.filter((lead) => lead.status === "BOOKED"),
          };

          queryClient.setQueryData(key, {
            ...data,
            columns,
          });
        }
      });

      return { previous };
    },
    onError: (_error, _variables, context) => {
      context?.previous?.forEach(([key, value]) => {
        queryClient.setQueryData(key, value);
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["leads"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: ["lead", id],
    queryFn: async () => {
      const response = await fetchJson<{ lead: Lead }>(`/api/leads/${id}`);
      if (!response.ok || !response.data) throw new Error(response.message ?? "Could not load lead");
      return response.data.lead;
    },
    enabled: !!id,
  });
}

export function useEvents(from: string, to: string) {
  const search = new URLSearchParams();
  search.set("from", from);
  search.set("to", to);
  const url = `/api/events?${search.toString()}`;

  return useQuery({
    queryKey: ["events", from, to],
    queryFn: async () => {
      const response = await fetchJson<{ events: CalendarEvent[] }>(url);
      if (!response.ok || !response.data) throw new Error(response.message ?? "Could not load events");
      return response.data.events;
    },
  });
}

export function useContacts() {
  return useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const response = await fetchJson<{ contacts: Contact[] }>("/api/contacts");
      if (!response.ok || !response.data) throw new Error(response.message ?? "Could not load contacts");
      return response.data.contacts;
    },
  });
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await fetchJson<{ projects: Project[] }>("/api/projects");
      if (!response.ok || !response.data) throw new Error(response.message ?? "Could not load projects");
      return response.data.projects;
    },
  });
}
