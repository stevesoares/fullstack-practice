import { LeadStatus, Prisma } from "@prisma/client";
import { prisma } from "@/server/db";
import { requireUserId, UnauthorizedError } from "@/server/require-user";

function toLeadStatus(value: string | null): LeadStatus | null {
  if (!value) return null;
  const normalized = value.toUpperCase();
  if (normalized === "LEAD" || normalized === "QUALIFIED" || normalized === "BOOKED") {
    return normalized as LeadStatus;
  }
  return null;
}

export async function GET(req: Request) {
  try {
    const userId = await requireUserId();
    const { searchParams } = new URL(req.url);
    const view = searchParams.get("view") ?? "kanban";
    const status = toLeadStatus(searchParams.get("status"));
    const q = searchParams.get("q")?.trim() ?? "";
    const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
    const pageSize = Math.min(Math.max(Number(searchParams.get("pageSize") ?? 20), 1), 100);

    const where: Prisma.LeadWhereInput = {
      ownerId: userId,
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { clientName: { contains: q } },
              { clientEmail: { contains: q } },
              { source: { contains: q } },
            ],
          }
        : {}),
    };

    const [total, leads] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const columns = {
      LEAD: leads.filter((lead) => lead.status === "LEAD"),
      QUALIFIED: leads.filter((lead) => lead.status === "QUALIFIED"),
      BOOKED: leads.filter((lead) => lead.status === "BOOKED"),
    };

    return Response.json({
      ok: true,
      data: view === "list" ? { items: leads, total, page, pageSize } : { columns, total, page, pageSize },
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return Response.json({ ok: false, data: null, message: "Unauthorized" }, { status: 401 });
    }
    return Response.json({ ok: false, data: null, message: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();
    const body = await req.json();
    const clientName = String(body?.clientName ?? "").trim();
    const clientEmail = String(body?.clientEmail ?? "").trim();

    if (!clientName || !clientEmail) {
      return Response.json({ ok: false, data: null, message: "Client name and email are required" }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        ownerId: userId,
        clientName,
        clientEmail,
        source: typeof body?.source === "string" ? body.source : null,
        budgetUsd: typeof body?.budgetUsd === "number" ? body.budgetUsd : null,
        eventDate: body?.eventDate ? new Date(body.eventDate) : null,
        status: toLeadStatus(body?.status ?? null) ?? "LEAD",
      },
    });

    return Response.json({ ok: true, data: { lead }, message: "Lead created" });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return Response.json({ ok: false, data: null, message: "Unauthorized" }, { status: 401 });
    }
    return Response.json({ ok: false, data: null, message: "Failed to create lead" }, { status: 500 });
  }
}
