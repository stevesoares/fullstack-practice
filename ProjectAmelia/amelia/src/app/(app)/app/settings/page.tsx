import { prisma } from "@/server/db";
import { requireUserId } from "@/server/require-user";
import SettingsForm from "./settings-form";

export default async function SettingsPage() {
  const userId = await requireUserId();
  const user = await prisma.user.findUnique({ where: { id: userId } });

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-4 md:px-6 md:py-6">
      <SettingsForm user={user} />
    </main>
  );
}
