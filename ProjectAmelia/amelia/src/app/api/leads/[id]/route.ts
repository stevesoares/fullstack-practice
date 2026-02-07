import { LeadStatus } from "@prisma/client";
import { prisma } from "@/server/db";
import { requireUserId, UnauthorizedError } from "@/server/require-user";

type Params = { params: Promise<{ id: string }> };

function toStatus(value: unknown): LeadStatus | null {
  if (typeof value !== "string") return null;
  const normalized = value.toUpperCase();
  if (normalized === "LEAD" || normalized === "QUALIFIED" || normalized === "BOOKED") {
    return normalized as LeadStatus;
  }
  return null;
}

export async function GET(_req: Request, { params }: Params) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const lead = await prisma.lead.findFirst({ where: { id, ownerId: userId } });
    if (!lead) {
      return Response.json({ ok: false, data: null, message: "Lead not found" }, { status: 404 });
    }
    return Response.json({ ok: true, data: { lead } });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return Response.json({ ok: false, data: null, message: "Unauthorized" }, { status: 401 });
    }
    return Response.json({ ok: false, data: null, message: "Failed to fetch lead" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const body = await req.json();
    const existingLead = await prisma.lead.findFirst({ where: { id, ownerId: userId } });
    if (!existingLead) {
      return Response.json({ ok: false, data: null, message: "Lead not found" }, { status: 404 });
    }

    const status = toStatus(body?.status);

    const lead = await prisma.lead.update({
      where: { id: existingLead.id },
      data: {
        ...(typeof body?.clientName === "string" ? { clientName: body.clientName.trim() } : {}),
        ...(typeof body?.clientEmail === "string" ? { clientEmail: body.clientEmail.trim() } : {}),
        ...(typeof body?.source === "string" ? { source: body.source.trim() || null } : {}),
        ...(typeof body?.budgetUsd === "number" ? { budgetUsd: body.budgetUsd } : {}),
        ...(typeof body?.eventDate === "string" || body?.eventDate === null
          ? { eventDate: body.eventDate ? new Date(body.eventDate) : null }
          : {}),
        ...(status ? { status } : {}),
      },
    });

    return Response.json({ ok: true, data: { lead }, message: "Lead updated" });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return Response.json({ ok: false, data: null, message: "Unauthorized" }, { status: 401 });
    }
    return Response.json({ ok: false, data: null, message: "Failed to update lead" }, { status: 500 });
  }
}
