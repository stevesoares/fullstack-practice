import { prisma } from "@/server/db";
import { requireUserId, UnauthorizedError } from "@/server/require-user";

export async function GET() {
  try {
    const userId = await requireUserId();
    const projects = await prisma.project.findMany({ where: { ownerId: userId }, orderBy: { createdAt: "desc" } });
    return Response.json({ projects });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
    return Response.json({ message: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();
    const { title, contactId, eventDate } = await req.json();
    if (!title) return Response.json({ message: "Missing title" }, { status: 400 });
    const project = await prisma.project.create({
      data: {
        ownerId: userId,
        title,
        contactId: contactId || null,
        eventDate: eventDate ? new Date(eventDate) : null,
      },
    });
    return Response.json({ ok: true, project });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
    return Response.json({ message: "Failed to create project" }, { status: 500 });
  }
}

