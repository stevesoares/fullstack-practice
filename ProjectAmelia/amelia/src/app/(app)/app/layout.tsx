import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";
import { AppTabs } from "./_components/AppTabs";
import { UserMenu } from "./_components/UserMenu";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex items-center justify-center">
            <Link href="/app" className={`${cormorant.className} text-xl tracking-wide`} aria-label="Amelia App" tabIndex={0}>Amelia</Link>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex-1" />
            <AppTabs />
            <div className="flex-1 flex justify-end">
              <UserMenu />
            </div>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}

// tabs moved to client component for active state


