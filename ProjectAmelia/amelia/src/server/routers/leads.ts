import { prisma } from "@/server/db";
import { publicProcedure, router } from "@/server/trpc";
import { z } from "zod";

export const leadsRouter = router({
  list: publicProcedure.query(async () => {
    return prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
  }),
  create: publicProcedure
    .input(
      z.object({
        ownerId: z.string().cuid(),
        clientName: z.string().min(1),
        clientEmail: z.string().email(),
        source: z.string().optional(),
        budgetUsd: z.number().int().optional(),
        eventDate: z.string().datetime().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.lead.create({
        data: {
          ownerId: input.ownerId,
          clientName: input.clientName,
          clientEmail: input.clientEmail,
          source: input.source,
          budgetUsd: input.budgetUsd,
          eventDate: input.eventDate ? new Date(input.eventDate) : undefined,
        },
      });
    }),
});


