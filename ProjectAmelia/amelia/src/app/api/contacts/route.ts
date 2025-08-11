import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return Response.json({ message: "Unauthorized" }, { status: 401 });
  const contacts = await prisma.contact.findMany({ where: { ownerId: userId }, orderBy: { createdAt: "desc" } });
  return Response.json({ contacts });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return Response.json({ message: "Unauthorized" }, { status: 401 });
  const { firstName, lastName, email, phone, company } = await req.json();
  if (!firstName || !lastName) return Response.json({ message: "Missing name" }, { status: 400 });
  const contact = await prisma.contact.create({ data: { ownerId: userId, firstName, lastName, email, phone, company } });
  return Response.json({ ok: true, contact });
}


