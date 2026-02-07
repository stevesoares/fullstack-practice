import { prisma } from "@/server/db";
import { requireUserId, UnauthorizedError } from "@/server/require-user";

export async function GET() {
  try {
    const userId = await requireUserId();
    const contacts = await prisma.contact.findMany({ where: { ownerId: userId }, orderBy: { createdAt: "desc" } });
    return Response.json({ ok: true, data: { contacts } });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return Response.json({ ok: false, data: null, message: "Unauthorized" }, { status: 401 });
    }
    return Response.json({ ok: false, data: null, message: "Failed to fetch contacts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();
    const { firstName, lastName, email, phone, company } = await req.json();
    if (!firstName || !lastName) return Response.json({ ok: false, data: null, message: "Missing name" }, { status: 400 });
    const contact = await prisma.contact.create({ data: { ownerId: userId, firstName, lastName, email, phone, company } });
    return Response.json({ ok: true, data: { contact }, message: "Contact created" });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return Response.json({ ok: false, data: null, message: "Unauthorized" }, { status: 401 });
    }
    return Response.json({ ok: false, data: null, message: "Failed to create contact" }, { status: 500 });
  }
}
