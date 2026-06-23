"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const UserContext = createContext();

function canUseApiFetch() {
  if (typeof window === "undefined") return true;
  return window.location.protocol === "http:" || window.location.protocol === "https:";
}

function isTransientFetchError(error) {
  return error instanceof TypeError && error.message.toLowerCase().includes("fetch");
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userTheme, setUserTheme] = useState("");

  const loadUserTheme = useCallback(async () => {
    if (!canUseApiFetch()) return;

    try {
      const res = await fetch("/api/user/theme-preference");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.themeId) {
          setUserTheme(data.themeId);
        }
      }
    } catch (error) {
      if (!isTransientFetchError(error)) {
        console.error("Failed to load user theme:", error);
      }
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      if (!canUseApiFetch()) {
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
        // Load user's theme preference
        await loadUserTheme();
      } else {
        setUser(null);
      }
    } catch (error) {
      if (!isTransientFetchError(error)) {
        console.error("refreshUser error:", error);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [loadUserTheme]);

  const updateUserTheme = useCallback(async (themeId) => {
    if (!canUseApiFetch()) return;

    try {
      const res = await fetch("/api/user/theme-preference", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUserTheme(themeId);
          // Update user in context
          if (data.user) {
            setUser(data.user);
          }
        }
      }
    } catch (error) {
      if (!isTransientFetchError(error)) {
        console.error("Failed to update user theme:", error);
      }
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <UserContext.Provider value={{ user, setUser, loading, refreshUser, userTheme, setUserTheme, updateUserTheme }}>
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
