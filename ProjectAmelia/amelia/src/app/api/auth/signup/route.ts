import { prisma } from "@/server/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const runtime = "nodejs";

const signUpSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  companyName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().min(1),
  addressStreet: z.string().optional(),
  addressCity: z.string().optional(),
  addressState: z.string().optional(),
  addressPostalCode: z.string().optional(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = signUpSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ message: "Missing fields" }, { status: 400 });
    }
    const { firstName, lastName, companyName, email, phone, address, password, addressStreet, addressCity, addressState, addressPostalCode } = parsed.data;
    // Server-side password policy enforcement
    const hasMinLen = typeof password === "string" && password.length >= 8;
    const hasUpper = /[A-Z]/.test(password ?? "");
    const hasDigit = /\d/.test(password ?? "");
    const hasSymbol = /[^A-Za-z0-9]/.test(password ?? "");
    const meetsPolicy = hasMinLen && hasUpper && (hasDigit || hasSymbol);
    if (!meetsPolicy) {
      return Response.json({ message: "Password does not meet requirements" }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return Response.json({ message: "Email already in use" }, { status: 409 });
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        companyName,
        email,
        phone,
        address,
        addressStreet,
        addressCity,
        addressState,
        addressPostalCode,
        passwordHash,
        name: `${firstName} ${lastName}`,
      },
    });
    return Response.json({ ok: true });
  } catch (e) {
    console.error("Signup error", e);
    const message = e instanceof Error ? e.message : "Invalid request";
    return Response.json({ message }, { status: 400 });
  }
}


