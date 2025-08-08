import { prisma } from "@/server/db";

async function seed() {
  const user = await prisma.user.upsert({
    where: { email: "demo@amelia.app" },
    update: {},
    create: { email: "demo@amelia.app", name: "Demo" },
  });

  const count = await prisma.lead.count();
  if (count === 0) {
    await prisma.lead.createMany({
      data: [
        { ownerId: user.id, clientName: "Taylor Couple", clientEmail: "taylor@example.com", source: "Website", budgetUsd: 3000 },
        { ownerId: user.id, clientName: "Jordan & Alex", clientEmail: "jordan.alex@example.com", source: "Instagram", budgetUsd: 4200 },
        { ownerId: user.id, clientName: "Sam Rivera", clientEmail: "sam.r@example.com", source: "Referral", budgetUsd: 2500 },
      ],
    });
  }

  return Response.json({ ok: true, userId: user.id });
}

export async function POST() {
  return seed();
}

// Convenience for local testing in the browser
export async function GET() {
  return seed();
}


