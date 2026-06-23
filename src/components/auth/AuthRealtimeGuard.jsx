"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { createRealtimeBroadcastChannel } from "@/lib/realtime/broadcastChannel";
import { REALTIME_EVENTS } from "@/lib/realtime/events";

export function AuthRealtimeGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser, refreshUser } = useUser();

  useEffect(() => {
    const redirectForStatus = (status) => {
      if (status === "restricted") router.replace("/restricted");
      else if (status === "suspended") router.replace("/suspended");
      else router.replace("/login");
    };

    const validate = async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();

        if (data.authState === "restricted" || data.authState === "suspended") {
          setUser(null);
          redirectForStatus(data.authState);
          return;
        }

        if (data.authState === "guest" && (pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin"))) {
          setUser(null);
          router.replace("/login");
          return;
        }

        if (data.authState === "authenticated") {
          refreshUser();
        }
      } catch {
        // Server-side guards still protect the route if this check cannot run.
      }
    };

    const channel = createRealtimeBroadcastChannel((message) => {
      if (message?.type === REALTIME_EVENTS.SESSION.FORCE_LOGOUT) {
        setUser(null);
        redirectForStatus(message.payload?.reason);
      }
    });

    window.addEventListener("focus", validate);
    document.addEventListener("visibilitychange", validate);
    validate();

    return () => {
      channel?.close();
      window.removeEventListener("focus", validate);
      document.removeEventListener("visibilitychange", validate);
    };
  }, [pathname, refreshUser, router, setUser]);

  return children;
}
