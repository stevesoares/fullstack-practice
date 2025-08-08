import { router } from "@/server/trpc";
import { leadsRouter } from "@/server/routers/leads";

export const appRouter = router({
  leads: leadsRouter,
});

export type AppRouter = typeof appRouter;


