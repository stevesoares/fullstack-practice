"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { PropsWithChildren, useEffect, useState } from "react";

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <>{children}</>;
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
};


