import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/server/db";
import { z } from "zod";
import bcrypt from "bcryptjs";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/signin" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID ?? "",
      clientSecret: process.env.APPLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Email and Password",
      credentials: { email: {}, password: {} },
      async authorize(creds) {
        const parsed = credentialsSchema.safeParse(creds);
        if (!parsed.success) return null;
        const { email, password } = parsed.data as { email: string; password: string };
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        // Transition: if user has no passwordHash yet, set it now
        if (!user.passwordHash) {
          const hash = await bcrypt.hash(password, 10);
          await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hash } });
        } else {
          const ok = await bcrypt.compare(password, user.passwordHash);
          if (!ok) return null;
        }

        return { id: user.id, email: user.email ?? undefined, name: user.name ?? undefined };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Extend session with user id in a typed-safe manner
      const userId = typeof token?.sub === "string" ? token.sub : undefined;
      if (session?.user && userId) (session.user as { id?: string }).id = userId;
      return session;
    },
    async redirect({ url, baseUrl }) {
      try {
        const { origin } = new URL(baseUrl);
        const next = new URL(url, baseUrl);
        // If sending to sign-in or unknown path, go to /app
        if (next.origin === origin) {
          if (next.pathname === "/" || next.pathname.startsWith("/api/auth")) {
            return `${origin}/app`;
          }
          return next.toString();
        }
        return `${origin}/app`;
      } catch {
        return `${baseUrl}/app`;
      }
    },
  },
};


