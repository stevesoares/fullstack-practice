"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Key = "lead" | "contact" | "project" | "meeting" | "invoice" | "contract" | "gallery";

export default function CreateNew() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const items: Array<{ key: Key; label: string }> = [
    { key: "lead", label: "Lead" },
    { key: "contact", label: "Contact" },
    { key: "project", label: "Project" },
    { key: "meeting", label: "Meeting" },
    { key: "invoice", label: "Invoice" },
    { key: "contract", label: "Contract" },
    { key: "gallery", label: "Gallery" },
  ];

  const handleSelect = (key: Key) => {
    switch (key) {
      case "lead":
        router.push("/app/leads");
        break;
      case "contact":
        (document.getElementById("open-contact-modal") as HTMLButtonElement | null)?.click();
        break;
      case "project":
        (document.getElementById("open-project-modal") as HTMLButtonElement | null)?.click();
        break;
      case "meeting":
        (document.getElementById("open-event-modal") as HTMLButtonElement | null)?.click();
        break;
      case "invoice":
        router.push("/app");
        break;
      case "contract":
        router.push("/app");
        break;
      case "gallery":
        router.push("/app/galleries");
        break;
    }
  };
  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        className="group inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground shadow transition-all hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="i-lucide-plus" aria-hidden />
        Create New
        <span className="transition-transform group-aria-expanded:rotate-180">▾</span>
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 origin-top-right scale-95 animate-in fade-in zoom-in-95 rounded-xl border border-border bg-background p-2 shadow-md"
          onMouseLeave={() => setOpen(false)}
        >
          {items.map((it) => (
            <button
              key={it.key}
              onClick={() => {
                setOpen(false);
                handleSelect(it.key);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              role="menuitem"
            >
              {it.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}


