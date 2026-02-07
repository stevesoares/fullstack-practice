import { prisma } from "@/server/db";
import { requireUserId, UnauthorizedError } from "@/server/require-user";
import { z } from "zod";

const optionalText = z.string().trim().optional();

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

  const schema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    companyName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    address: optionalText,
    addressStreet: optionalText,
    addressCity: optionalText,
    addressState: optionalText,
    addressPostalCode: optionalText,
    billingEmail: z.string().email(),
  });
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ ok: false, data: null, message: "Invalid input" }, { status: 400 });

  const { firstName, lastName, companyName, email, phone, address, billingEmail, addressStreet, addressCity, addressState, addressPostalCode } = parsed.data;
  const normalizedParts = [addressStreet, addressCity, addressState, addressPostalCode].filter(Boolean);
  const normalizedAddress = normalizedParts.length > 0 ? normalizedParts.join(", ") : (address ?? null);
  await prisma.user.update({
    where: { id: userId },
    data: {
      firstName,
      lastName,
      companyName,
      email,
      phone,
      address: normalizedAddress,
      billingEmail,
      addressStreet: addressStreet ?? null,
      addressCity: addressCity ?? null,
      addressState: addressState ?? null,
      addressPostalCode: addressPostalCode ?? null,
    },
  });
  return Response.json({ ok: true, data: null, message: "Profile updated" });
}
