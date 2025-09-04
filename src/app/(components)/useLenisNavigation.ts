"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useLenisNavigation() {
  const router = useRouter();

  const navigateWithLenis = useCallback((href: string) => {
    // Smooth scroll to top before navigation
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
      
      // Small delay to allow smooth scroll to complete
      setTimeout(() => {
        router.push(href);
      }, 300);
    } else {
      router.push(href);
    }
  }, [router]);

  return { navigateWithLenis };
} 