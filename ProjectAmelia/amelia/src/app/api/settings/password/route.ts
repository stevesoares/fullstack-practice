import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const { currentPassword, newPassword, confirmPassword } = await req.json();
  if (!currentPassword || !newPassword || !confirmPassword) return Response.json({ message: "Missing fields" }, { status: 400 });
  if (newPassword !== confirmPassword) return Response.json({ message: "Passwords do not match" }, { status: 400 });
  const hasMinLen = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasDigit = /\d/.test(newPassword);
  const hasSymbol = /[^A-Za-z0-9]/.test(newPassword);
  if (!(hasMinLen && hasUpper && (hasDigit || hasSymbol))) return Response.json({ message: "Password does not meet requirements" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.passwordHash) return Response.json({ message: "Password not set for this account" }, { status: 400 });
  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok) return Response.json({ message: "Incorrect current password" }, { status: 400 });

  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash: hash } });
  return Response.json({ ok: true });
}


