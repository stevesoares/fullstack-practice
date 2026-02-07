import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/routers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import type { TrpcContext } from "@/server/trpc";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async (): Promise<TrpcContext> => {
      const session = await getServerSession(authOptions);
      const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
      return { userId };
    },
  });

export { handler as GET, handler as POST };
