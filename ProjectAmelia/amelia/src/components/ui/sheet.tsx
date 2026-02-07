"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type SheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
};

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/45"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onOpenChange(false);
      }}
    >
      {children}
    </div>
  );
}

export function SheetContent({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("absolute right-0 top-0 h-full w-full max-w-md border-l border-border bg-background p-6 shadow-xl", className)}>
      {children}
    </div>
  );
}
