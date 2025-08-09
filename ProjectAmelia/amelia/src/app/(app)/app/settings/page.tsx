import { prisma } from "@/server/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import SettingsForm from "./settings-form";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { id: userId } });

  return (
    <main className="mx-auto max-w-4xl px-6 py-8 space-y-8">
      <h1 className="font-[var(--font-cormorant)] text-4xl">Settings</h1>
      <SettingsForm user={user} />
    </main>
  );
}


