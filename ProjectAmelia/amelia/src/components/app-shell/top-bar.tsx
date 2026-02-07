"use client";

import { usePathname } from "next/navigation";
import { labelForPath } from "@/components/app-shell/nav-config";
import CreateNew from "@/app/(app)/app/_components/CreateNew";
import { UserMenu } from "@/app/(app)/app/_components/UserMenu";

export function TopBar() {
  const pathname = usePathname() ?? "/app";
  const title = labelForPath(pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 px-4 py-3 backdrop-blur md:px-6 lg:ml-72">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Workspace</p>
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <CreateNew />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
