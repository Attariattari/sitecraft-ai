import { useState, useEffect } from "react";

/**
 * Hook to fetch and provide the current logged-in user.
 */
export function useCurrentUser() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch("/api/auth/me");
                if (!res.ok) {
                    // If unauthorized, ensure server removes cookie and clear user
                    if (res.status === 401) {
                        try {
                            await fetch("/api/auth/logout", { method: "POST" });
                        } catch (e) {}
                    }
                    setUser(null);
                    return;
                }
                const data = await res.json();

                if (data.success) {
                    setUser(data.user);
                    // refresh token on load to extend sliding session
                    try {
                        await fetch("/api/auth/refresh", { method: "POST" });
                    } catch (e) {
                        // ignore refresh failures
                    }
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("Failed to fetch user:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();

        // periodic refresh (every 30 minutes) to maintain sliding session while active
        const refreshInterval = setInterval(async () => {
            try {
                const res = await fetch("/api/auth/refresh", { method: "POST" });
                if (!res.ok) {
                    // if refresh fails with 401, clear user
                    if (res.status === 401) setUser(null);
                }
            } catch (e) {
                // ignore
            }
        }, 30 * 60 * 1000);

        return () => clearInterval(refreshInterval);
    }, []);

    const refreshUser = async() => {
        try {
            const res = await fetch("/api/auth/me");
            if (!res.ok) {
                if (res.status === 401) {
                    try {
                        await fetch("/api/auth/logout", { method: "POST" });
                    } catch (e) {}
                }
                setUser(null);
                return;
            }
            const data = await res.json();
            if (data.success) {
                setUser(data.user);
            }
        } catch (err) {
            console.error("Failed to refresh user:", err);
        }
    };

    return { user, loading, error, refreshUser };
}