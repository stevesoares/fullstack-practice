import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return Response.json({ message: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const where: any = { ownerId: userId };
  if (from || to) where.startsAt = {};
  if (from) where.startsAt.gte = new Date(from);
  if (to) where.startsAt.lte = new Date(to);
  const events = await prisma.calendarEvent.findMany({ where, orderBy: { startsAt: "asc" } });
  return Response.json({ events });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return Response.json({ message: "Unauthorized" }, { status: 401 });
  const { title, description, location, startsAt, endsAt, projectId } = await req.json();
  if (!title || !startsAt || !endsAt) return Response.json({ message: "Missing required fields" }, { status: 400 });
  const event = await prisma.calendarEvent.create({ data: { ownerId: userId, title, description, location, startsAt: new Date(startsAt), endsAt: new Date(endsAt), projectId: projectId || null } });
  return Response.json({ ok: true, event });
}


