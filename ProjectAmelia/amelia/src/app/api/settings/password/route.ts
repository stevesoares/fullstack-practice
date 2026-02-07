import { prisma } from "@/server/db";
import bcrypt from "bcryptjs";
import { requireUserId, UnauthorizedError } from "@/server/require-user";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let userId: string;
  try {
    userId = await requireUserId();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return Response.json({ ok: false, data: null, message: "Unauthorized" }, { status: 401 });
    }
    return Response.json({ ok: false, data: null, message: "Failed to authorize user" }, { status: 500 });
  }

  const { currentPassword, newPassword, confirmPassword } = await req.json();
  if (!newPassword || !confirmPassword) return Response.json({ ok: false, data: null, message: "Missing fields" }, { status: 400 });
  if (newPassword !== confirmPassword) return Response.json({ ok: false, data: null, message: "Passwords do not match" }, { status: 400 });
  const hasMinLen = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasDigit = /\d/.test(newPassword);
  const hasSymbol = /[^A-Za-z0-9]/.test(newPassword);
  if (!(hasMinLen && hasUpper && (hasDigit || hasSymbol))) return Response.json({ ok: false, data: null, message: "Password does not meet requirements" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return Response.json({ ok: false, data: null, message: "User not found" }, { status: 404 });
  if (user.passwordHash) {
    if (!currentPassword) return Response.json({ ok: false, data: null, message: "Missing current password" }, { status: 400 });
    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) return Response.json({ ok: false, data: null, message: "Incorrect current password" }, { status: 400 });
  }

  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash: hash } });
  return Response.json({ ok: true, data: null, message: "Password updated" });
}
