"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function SessionProvider({ 
  children 
}: { 
  children: ReactNode 
}) {
  return (
    <NextAuthSessionProvider
      // Refetch session every 5 minutes to keep it alive
      refetchInterval={5 * 60}
      // Refetch session when window gets focus
      refetchOnWindowFocus={true}
      // Refetch session when coming back online
      refetchWhenOffline={false}
    >
      {children}
    </NextAuthSessionProvider>
  );
}