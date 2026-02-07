import { prisma } from "@/server/db";
import { Resend } from "resend";
import crypto from "crypto";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email(),
});

const TOKEN_TTL_MS = 60 * 60 * 1000;

function buildResetUrl(token: string) {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return `${baseUrl}/auth/reset-password?token=${encodeURIComponent(token)}`;
}

async function sendResetEmail(email: string, resetUrl: string) {
  if (!process.env.RESEND_API_KEY) return;
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "Amelia <no-reply@amelia.app>",
    to: email,
    subject: "Reset your Amelia password",
    html: `<p>Reset your password using this link:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 1 hour.</p>`,
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ message: "Invalid email" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user?.email) {
    return Response.json({ ok: true });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id, usedAt: null },
  });

  await prisma.passwordResetToken.create({
    data: { userId: user.id, tokenHash, expiresAt },
  });

  const resetUrl = buildResetUrl(token);
  try {
    await sendResetEmail(user.email, resetUrl);
  } catch (error) {
    console.error("Failed to send password reset email", error);
  }

  if (process.env.NODE_ENV !== "production") {
    console.info(`Password reset URL for ${user.email}: ${resetUrl}`);
    return Response.json({ ok: true, resetUrl });
  }

  return Response.json({ ok: true });
}
