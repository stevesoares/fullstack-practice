import { prisma } from "@/server/db";
import { requireUserId, UnauthorizedError } from "@/server/require-user";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const body = await req.json();
    const existingEvent = await prisma.calendarEvent.findFirst({ where: { id, ownerId: userId } });
    if (!existingEvent) {
      return Response.json({ ok: false, data: null, message: "Event not found" }, { status: 404 });
    }

    const event = await prisma.calendarEvent.update({
      where: { id: existingEvent.id },
      data: {
        ...(typeof body?.title === "string" ? { title: body.title.trim() } : {}),
        ...(typeof body?.description === "string" ? { description: body.description.trim() } : {}),
        ...(typeof body?.location === "string" ? { location: body.location.trim() } : {}),
        ...(typeof body?.startsAt === "string" ? { startsAt: new Date(body.startsAt) } : {}),
        ...(typeof body?.endsAt === "string" ? { endsAt: new Date(body.endsAt) } : {}),
      },
    });
    return Response.json({ ok: true, data: { event }, message: "Event updated" });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return Response.json({ ok: false, data: null, message: "Unauthorized" }, { status: 401 });
    }
    return Response.json({ ok: false, data: null, message: "Failed to update event" }, { status: 500 });
  }
}
