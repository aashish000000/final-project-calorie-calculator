"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthProvider } from "@/lib/auth-context";
import { LanguageProvider } from "@/lib/i18n/language-context";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>{children}</AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

