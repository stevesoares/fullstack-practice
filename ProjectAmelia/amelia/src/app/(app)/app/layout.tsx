import { AppSidebar } from "@/components/app-shell/app-sidebar";
import { MobileBottomNav } from "@/components/app-shell/mobile-bottom-nav";
import { TopBar } from "@/components/app-shell/top-bar";

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-dvh bg-background">
      <AppSidebar />
      <TopBar />
      <div className="pb-20 lg:ml-72 lg:pb-6">{children}</div>
      <MobileBottomNav />
    </div>
  );
}

