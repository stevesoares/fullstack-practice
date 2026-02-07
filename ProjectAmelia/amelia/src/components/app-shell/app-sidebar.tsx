"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "@/components/app-shell/nav-config";

export function AppSidebar() {
  const pathname = usePathname() ?? "/app";

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-72 lg:flex-col lg:border-r lg:border-border lg:bg-background/90 lg:backdrop-blur">
      <div className="border-b border-border px-6 py-5">
        <Link href="/app" className={cn("font-[var(--font-cormorant)] text-3xl tracking-wide")}>Amelia</Link>
        <p className="mt-1 text-xs text-muted-foreground">Client & studio operations</p>
      </div>
      <nav className="space-y-1 p-4" aria-label="App">
        {navItems.map((item) => {
          const active = item.matches(pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition",
                active
                  ? "bg-primary/15 text-foreground ring-1 ring-border"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
