import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db";
import { requireUserId, UnauthorizedError } from "@/server/require-user";

export async function GET(req: Request) {
  try {
    const userId = await requireUserId();
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const where: Prisma.CalendarEventWhereInput = { ownerId: userId };
    const startsAt: Prisma.DateTimeFilter = {};

    if (from) startsAt.gte = new Date(from);
    if (to) startsAt.lte = new Date(to);
    if (from || to) where.startsAt = startsAt;

    const events = await prisma.calendarEvent.findMany({ where, orderBy: { startsAt: "asc" } });
    return Response.json({ ok: true, data: { events } });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return Response.json({ ok: false, data: null, message: "Unauthorized" }, { status: 401 });
    }
    return Response.json({ ok: false, data: null, message: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();
    const { title, description, location, startsAt, endsAt, projectId } = await req.json();
    if (!title || !startsAt || !endsAt) {
      return Response.json({ ok: false, data: null, message: "Missing required fields" }, { status: 400 });
    }
    const event = await prisma.calendarEvent.create({
      data: {
        ownerId: userId,
        title,
        description,
        location,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
        projectId: projectId || null,
      },
    });
    return Response.json({ ok: true, data: { event }, message: "Event created" });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return Response.json({ ok: false, data: null, message: "Unauthorized" }, { status: 401 });
    }
    return Response.json({ ok: false, data: null, message: "Failed to create event" }, { status: 500 });
  }
}
