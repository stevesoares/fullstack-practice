import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  CalendarDays,
  FolderKanban,
  Users,
  CircleDollarSign,
  Image,
  FileText,
  Receipt,
  Briefcase,
  UserRound,
  Settings,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  matches: (pathname: string) => boolean;
};

export const navItems: NavItem[] = [
  { href: "/app", label: "Overview", icon: LayoutDashboard, matches: (p) => p === "/app" },
  { href: "/app/leads", label: "Leads", icon: FolderKanban, matches: (p) => p.startsWith("/app/leads") },
  { href: "/app/calendar", label: "Calendar", icon: CalendarDays, matches: (p) => p.startsWith("/app/calendar") },
  { href: "/app/contacts", label: "Contacts", icon: UserRound, matches: (p) => p.startsWith("/app/contacts") },
  { href: "/app/projects", label: "Projects", icon: Briefcase, matches: (p) => p.startsWith("/app/projects") },
  { href: "/app/clients", label: "Clients", icon: Users, matches: (p) => p.startsWith("/app/clients") },
  { href: "/app/sales", label: "Sales", icon: CircleDollarSign, matches: (p) => p.startsWith("/app/sales") },
  { href: "/app/invoices", label: "Invoices", icon: Receipt, matches: (p) => p.startsWith("/app/invoices") },
  { href: "/app/contracts", label: "Contracts", icon: FileText, matches: (p) => p.startsWith("/app/contracts") },
  { href: "/app/galleries", label: "Galleries", icon: Image, matches: (p) => p.startsWith("/app/galleries") },
  { href: "/app/settings", label: "Settings", icon: Settings, matches: (p) => p.startsWith("/app/settings") },
];

export function labelForPath(pathname: string) {
  const found = navItems.find((item) => item.matches(pathname));
  return found?.label ?? "App";
}
