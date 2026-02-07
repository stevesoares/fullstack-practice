"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "@/components/app-shell/nav-config";

const mobileItems = navItems.slice(0, 6);

export function MobileBottomNav() {
  const pathname = usePathname() ?? "/app";

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-2 py-1 backdrop-blur lg:hidden" aria-label="Primary mobile">
      <ul className="grid grid-cols-6 gap-1">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const active = item.matches(pathname);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg px-1 py-2 text-[11px]",
                  active ? "text-foreground bg-muted/70" : "text-muted-foreground",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-4 w-4" />
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
