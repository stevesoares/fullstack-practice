"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

export const Navbar = () => {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={
        `fixed inset-x-0 top-0 z-50 mx-auto max-w-6xl transition-all ${scrolled ? "bg-background/80 backdrop-blur border-b border-border" : "bg-transparent"}`
      }
      aria-label="Primary"
    >
      <div className="px-4 py-3">
        <div className="flex items-center justify-center">
          <a href="#hero" className={`font-[var(--font-cormorant)] text-xl tracking-wide`} aria-label="Amelia" tabIndex={0}>Amelia</a>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex-1" />
          <div className="hidden gap-6 md:flex">
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground" aria-label="About" tabIndex={0}>About</a>
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground" aria-label="Features" tabIndex={0}>Features</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground" aria-label="Pricing" tabIndex={0}>Pricing</a>
            <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground" aria-label="FAQ" tabIndex={0}>FAQ</a>
          </div>
          <div className="flex flex-1 items-center justify-end gap-2">
            {session ? (
              <>
                <Link href="/app" className="rounded-xl px-4 py-2 text-sm ring-1 ring-border" aria-label="Open App" tabIndex={0}>Open App</Link>
                <button onClick={() => signOut({ redirect: true, callbackUrl: "/" })} className="rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground" aria-label="Sign out" tabIndex={0}>Sign out</button>
              </>
            ) : (
              <>
                <Link href="/auth/signin?callbackUrl=%2Fapp" className="rounded-xl px-4 py-2 text-sm ring-1 ring-border" aria-label="Log in" tabIndex={0}>Login</Link>
                <Link href="/auth/signup?callbackUrl=%2Fapp" className="rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground" aria-label="Sign Up" tabIndex={0}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};


