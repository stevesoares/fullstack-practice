import { prisma } from "@/server/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(8),
});

function passwordMeetsPolicy(password: string) {
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  return hasUpper && (hasDigit || hasSymbol);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ message: "Invalid input" }, { status: 400 });

  const { token, newPassword, confirmPassword } = parsed.data;
  if (newPassword !== confirmPassword) {
    return Response.json({ message: "Passwords do not match" }, { status: 400 });
  }
  if (!passwordMeetsPolicy(newPassword)) {
    return Response.json(
      { message: "Password must include 1 uppercase letter and at least one number or symbol" },
      { status: 400 }
    );
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const now = new Date();
  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      tokenHash,
      usedAt: null,
      expiresAt: { gt: now },
    },
    select: { id: true, userId: true },
  });

  if (!resetToken) {
    return Response.json({ message: "Reset token is invalid or expired" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: now },
    }),
  ]);

  return Response.json({ ok: true });
}
