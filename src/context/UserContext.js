"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      // If the app is opened directly from the filesystem (file://),
      // skip calling the API to avoid network errors in that environment.
      if (typeof window !== "undefined" && window.location.protocol === "file:") {
        console.warn("User refresh skipped: running from file:// protocol");
        setUser(null);
        setLoading(false);
        return;
      }
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        // If unauthorized, attempt server-side cleanup (remove cookie)
        if (res.status === 401) {
          try {
            await fetch("/api/auth/logout", { method: "POST" });
          } catch (e) {
            // ignore
          }
        }
        setUser(null);
        return;
      }
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("refreshUser error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <UserContext.Provider value={{ user, setUser, loading, refreshUser }}>
      {" "}
      {children}{" "}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
