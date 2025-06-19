"use client";

import { ProgressProvider } from "@bprogress/next/app";
import { getQueryClient } from "@/lib/get-query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ProgressProvider
        height="2px"
        color="#a16207"
        options={{ showSpinner: false }}
        shallowRouting
      >
        {children}
      </ProgressProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
