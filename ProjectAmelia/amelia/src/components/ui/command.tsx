import * as React from "react";
import { cn } from "@/lib/utils";

export function Command({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-lg border border-border", className)} {...props} />;
}

export function CommandInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("w-full border-b border-border bg-transparent px-3 py-2 text-sm outline-none", className)} {...props} />;
}

export function CommandList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("max-h-72 overflow-y-auto p-2", className)} {...props} />;
}

export function CommandItem({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={cn("flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-muted", className)} {...props} />;
}
