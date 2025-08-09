"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = { href: string; label: string; isActive: (pathname: string) => boolean };

const tabs: Tab[] = [
  { href: "/app", label: "Overview", isActive: (p) => p === "/app" },
  { href: "/app/calendar", label: "Calendar", isActive: (p) => p.startsWith("/app/calendar") },
  { href: "/app/leads", label: "Leads", isActive: (p) => p.startsWith("/app/leads") },
  { href: "/app/clients", label: "Clients", isActive: (p) => p.startsWith("/app/clients") },
  { href: "/app/sales", label: "Sales", isActive: (p) => p.startsWith("/app/sales") },
  { href: "/app/galleries", label: "Galleries", isActive: (p) => p.startsWith("/app/galleries") },
];

export const AppTabs = () => {
  const pathname = usePathname() ?? "/app";
  return (
    <nav className="ml-auto flex items-center gap-1" aria-label="App">
      {tabs.map((t) => {
        const active = t.isActive(pathname);
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground aria-[current=page]:bg-muted aria-[current=page]:text-foreground"
            tabIndex={0}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
};


