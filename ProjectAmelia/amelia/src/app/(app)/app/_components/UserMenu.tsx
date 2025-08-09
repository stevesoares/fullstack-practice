"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export const UserMenu = () => {
  const { data } = useSession();
  const name = (data?.user?.name as string | undefined) ?? (data?.user?.email as string | undefined) ?? "Account";
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1 text-sm"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs">{name?.slice(0,1)?.toUpperCase()}</span>
        <span className="hidden sm:inline">{name}</span>
      </button>
      {open ? (
        <div role="menu" className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-background p-2 shadow">
          <div className="px-2 py-1 text-xs text-muted-foreground">Signed in as</div>
          <div className="px-2 pb-2 text-sm">{name}</div>
          <div className="my-1 h-px bg-border" />
          <Link
            href="/app/settings"
            className="block rounded-md px-2 py-2 text-sm hover:bg-muted"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Settings
          </Link>
          <button
            onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
            className="mt-1 block w-full rounded-md px-2 py-2 text-left text-sm hover:bg-muted"
            role="menuitem"
          >
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
};


