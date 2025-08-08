"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export const Navbar = () => {
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
      <div className="flex items-center justify-between px-4 py-3">
        <a href="#hero" className="font-semibold" aria-label="Amelia" tabIndex={0}>Amelia</a>
        <div className="hidden gap-6 md:flex">
          <a href="#about" className="text-sm text-muted-foreground hover:text-foreground" aria-label="About" tabIndex={0}>About</a>
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground" aria-label="Features" tabIndex={0}>Features</a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground" aria-label="Pricing" tabIndex={0}>Pricing</a>
          <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground" aria-label="FAQ" tabIndex={0}>FAQ</a>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/api/auth/signin" className="rounded-xl px-4 py-2 text-sm ring-1 ring-border" aria-label="Log in" tabIndex={0}>Login</Link>
          <Link href="/api/auth/signin" className="rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground" aria-label="Sign Up" tabIndex={0}>Sign Up</Link>
        </div>
      </div>
    </nav>
  );
};


