import { prisma } from "@/server/db";
import SettingsForm from "./settings-form";
import { requireUserId } from "@/server/require-user";

export default async function SettingsPage() {
  const userId = await requireUserId();
  const user = await prisma.user.findUnique({ where: { id: userId } });

  return (
    <main className="mx-auto max-w-4xl px-6 py-8 space-y-8">
      <h1 className="font-[var(--font-cormorant)] text-4xl">Settings</h1>
      <SettingsForm user={user} />
    </main>
  );
}

