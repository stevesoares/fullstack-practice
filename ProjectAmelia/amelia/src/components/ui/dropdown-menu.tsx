"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  return <div className="relative inline-block">{children}</div>;
}

export function DropdownMenuTrigger({
  onClick,
  className,
  children,
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" onClick={onClick} className={cn("inline-flex items-center", className)}>
      {children}
    </button>
  );
}

export function DropdownMenuContent({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("absolute right-0 z-50 mt-2 min-w-48 rounded-xl border border-border bg-background p-1 shadow-lg", className)}>{children}</div>;
}

export function DropdownMenuItem({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={cn("w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-muted", className)} {...props} />;
}
