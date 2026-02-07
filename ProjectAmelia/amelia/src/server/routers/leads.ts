import { prisma } from "@/server/db";
import { protectedProcedure, router } from "@/server/trpc";
import { z } from "zod";

export const leadsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return prisma.lead.findMany({
      where: { ownerId: ctx.userId },
      orderBy: { createdAt: "desc" },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        clientName: z.string().min(1),
        clientEmail: z.string().email(),
        source: z.string().optional(),
        budgetUsd: z.number().int().optional(),
        eventDate: z.string().datetime().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return prisma.lead.create({
        data: {
          ownerId: ctx.userId,
          clientName: input.clientName,
          clientEmail: input.clientEmail,
          source: input.source,
          budgetUsd: input.budgetUsd,
          eventDate: input.eventDate ? new Date(input.eventDate) : undefined,
        },
      });
    }),
});

