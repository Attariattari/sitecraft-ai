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
                const data = await res.json();

                if (data.success) {
                    setUser(data.user);
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
    }, []);

    const refreshUser = async() => {
        try {
            const res = await fetch("/api/auth/me");
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