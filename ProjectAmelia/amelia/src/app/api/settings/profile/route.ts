import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db";
import { z } from "zod";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const schema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    companyName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    address: z.string().min(1),
    addressStreet: z.string().optional(),
    addressCity: z.string().optional(),
    addressState: z.string().optional(),
    addressPostalCode: z.string().optional(),
    billingEmail: z.string().email(),
  });
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ message: "Invalid input" }, { status: 400 });

  const { firstName, lastName, companyName, email, phone, address, billingEmail, addressStreet, addressCity, addressState, addressPostalCode } = parsed.data;
  await prisma.user.update({
    where: { id: userId },
    data: { firstName, lastName, companyName, email, phone, address, billingEmail, addressStreet, addressCity, addressState, addressPostalCode },
  });
  return Response.json({ ok: true });
}


