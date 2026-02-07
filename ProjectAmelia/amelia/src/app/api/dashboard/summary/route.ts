import { prisma } from "@/server/db";
import { requireUserId, UnauthorizedError } from "@/server/require-user";

function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setHours(0, 0, 0, 0);
  d.setDate(diff);
  return d;
}

export async function GET() {
  try {
    const userId = await requireUserId();

    const [totalLeads, bookedLeads, invoices, leadsThisWeek, upcomingEvents] = await Promise.all([
      prisma.lead.count({ where: { ownerId: userId } }),
      prisma.lead.count({ where: { ownerId: userId, status: "BOOKED" } }),
      prisma.invoice.findMany({ where: { ownerId: userId }, select: { amountUsd: true, leadId: true } }),
      prisma.lead.count({ where: { ownerId: userId, createdAt: { gte: startOfWeek(new Date()) } } }),
      prisma.calendarEvent.findMany({
        where: {
          ownerId: userId,
          startsAt: { gte: new Date() },
        },
        orderBy: { startsAt: "asc" },
        take: 6,
      }),
    ]);

    const conversionRate = totalLeads === 0 ? 0 : Math.round((bookedLeads / totalLeads) * 100);
    const totalsByLead = invoices.reduce<Record<string, number>>((acc, invoice) => {
      const key = invoice.leadId ?? "unassigned";
      acc[key] = (acc[key] ?? 0) + invoice.amountUsd;
      return acc;
    }, {});

    const avgSalesPerClient =
      Object.keys(totalsByLead).length === 0
        ? 0
        : Math.round((Object.values(totalsByLead).reduce((sum, value) => sum + value, 0) / Object.keys(totalsByLead).length) * 100) /
          100;

    return Response.json({
      ok: true,
      data: {
        kpis: {
          conversionRate,
          bookedLeads,
          totalLeads,
          leadsThisWeek,
          avgSalesPerClient,
        },
        today: upcomingEvents,
      },
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return Response.json({ ok: false, data: null, message: "Unauthorized" }, { status: 401 });
    }

    return Response.json({ ok: false, data: null, message: "Failed to fetch dashboard summary" }, { status: 500 });
  }
}
