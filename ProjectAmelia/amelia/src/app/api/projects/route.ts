import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return Response.json({ message: "Unauthorized" }, { status: 401 });
  const projects = await prisma.project.findMany({ where: { ownerId: userId }, orderBy: { createdAt: "desc" } });
  return Response.json({ projects });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return Response.json({ message: "Unauthorized" }, { status: 401 });
  const { title, contactId, eventDate } = await req.json();
  if (!title) return Response.json({ message: "Missing title" }, { status: 400 });
  const project = await prisma.project.create({ data: { ownerId: userId, title, contactId: contactId || null, eventDate: eventDate ? new Date(eventDate) : null } });
  return Response.json({ ok: true, project });
}


