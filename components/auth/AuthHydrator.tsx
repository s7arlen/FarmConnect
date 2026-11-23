"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

/**
 * Automatically syncs the client-side Zustand auth store with the active server session.
 * Ensures OAuth users have their name, role, avatar, and ID hydrated on the client.
 */
export function AuthHydrator() {
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    let isMounted = true;

    async function syncSession() {
      try {
        const res = await fetch("/api/users/profile");
        if (!isMounted) return;

        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            // Only update if different to prevent unnecessary re-renders
            if (!user || user.id !== data.user.id || user.role !== data.user.role) {
              setUser({
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                role: data.user.role,
                avatar: data.user.avatar,
              });
            }
          }
        }
      } catch {
        // Ignore network errors during background sync
      }
    }

    syncSession();

    return () => {
      isMounted = false;
    };
  }, [user, setUser]);

  return null;
}
