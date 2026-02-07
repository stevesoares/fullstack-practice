"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ToastItem = { id: number; title: string; message?: string };

type ToastContextType = {
  push: (toast: Omit<ToastItem, "id">) => void;
};

const ToastContext = React.createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  const push = React.useCallback((toast: Omit<ToastItem, "id">) => {
    const id = Date.now();
    setItems((prev) => [...prev, { id, ...toast }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-20 right-4 z-[120] space-y-2">
        {items.map((item) => (
          <div key={item.id} className="w-80 rounded-lg border border-border bg-background p-3 shadow-lg">
            <p className="text-sm font-semibold">{item.title}</p>
            {item.message ? <p className="text-xs text-muted-foreground">{item.message}</p> : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    return {
      push: (_toast: Omit<ToastItem, "id">) => {
        void _toast;
      },
    };
  }
  return ctx;
}

export function Toast({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-lg border border-border bg-background p-3 shadow-lg", className)} {...props} />;
}
