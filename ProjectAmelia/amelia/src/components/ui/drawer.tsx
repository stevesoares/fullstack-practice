"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type DrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
};

export function Drawer({ open, onOpenChange, children }: DrawerProps) {
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

export function DrawerContent({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("absolute bottom-0 left-0 right-0 rounded-t-2xl border border-border bg-background p-6 shadow-xl", className)}>{children}</div>;
}
