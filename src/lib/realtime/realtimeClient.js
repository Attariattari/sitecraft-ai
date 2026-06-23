/**
 * Realtime Client Abstraction
 * Handles polling fallback for serverless environments.
 * Can be easily swapped for Socket.IO-client.
 */
function canUseApiFetch() {
    if (typeof window === "undefined") return true;
    return window.location.protocol === "http:" || window.location.protocol === "https:";
}

function isTransientFetchError(error) {
    return error instanceof TypeError && error.message.toLowerCase().includes("fetch");
}

export class RealtimeClient {
    constructor() {
        this.listeners = new Map();
        this.intervalId = null;
        this.lastCheckedHeader = null;
        this._hadSuccessfulFetch = false;
        this._focusHandler = null;
        this._loggedPollingFetchFailure = false;
        this._loggedAuthFetchFailure = false;
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    off(event, callback) {
        if (!this.listeners.has(event)) return;
        const callbacks = this.listeners.get(event);
        this.listeners.set(
            event,
            callbacks.filter((cb) => cb !== callback),
        );
    }

    emit(event, payload) {
        if (!this.listeners.has(event)) return;
        this.listeners.get(event).forEach((cb) => cb(payload));
    }

    async checkAuthState() {
        if (!canUseApiFetch()) return;

        try {
            const res = await fetch("/api/auth/me", { cache: "no-store" });
            if (!res.ok) return;

            const data = await res.json();
            if (!data.success) return;

            if (data.authState === "restricted") {
                this.emit("user:restricted", {
                    message: "Your account access has been restricted.",
                    status: "restricted",
                });
                this.emit("auth:force-logout", {
                    reason: "restricted",
                    redirectTo: "/restricted",
                });
            }

            if (data.authState === "suspended") {
                this.emit("user:suspended", {
                    message: "Your account has been suspended.",
                    status: "suspended",
                });
                this.emit("auth:force-logout", {
                    reason: "suspended",
                    redirectTo: "/suspended",
                });
            }

            if (data.authState === "guest" && this._hadSuccessfulFetch) {
                this.emit("user:session-revoked", {
                    reason: "session-revoked",
                    redirectTo: "/login",
                });
            }
            this._loggedAuthFetchFailure = false;
        } catch (err) {
            if (isTransientFetchError(err)) {
                if (!this._loggedAuthFetchFailure) {
                    console.warn("Auth realtime check skipped while the API is unavailable.");
                    this._loggedAuthFetchFailure = true;
                }
            } else {
                console.error("Auth realtime check error:", err);
            }
        }
    }

    startPolling(interval = 3000) {
        if (!canUseApiFetch()) return;
        if (this.intervalId) return;

        this.intervalId = setInterval(async() => {
            if (!canUseApiFetch()) return;

            try {
                const res = await fetch("/api/notifications?limit=5");
                const data = await res.json();

                if (data.success && data.notifications.length > 0) {
                    const latest = data.notifications[0];

                    // Only trigger if it's a new notification since last poll
                    if (this.lastCheckedHeader !== latest._id) {
                        this.lastCheckedHeader = latest._id;

                        // Emit as a generic event
                        this.emit("notification:new", latest);

                        // Also emit the specific type if it matches our events
                        this.emit(latest.type, latest);
                    }
                }

                // Mark that we've successfully fetched notifications at least once.
                if (res.ok) {
                    this._hadSuccessfulFetch = true;
                    this._loggedPollingFetchFailure = false;
                }

                // Check auth status/session version via a separate check if needed.
                // Avoid emitting a force-logout on the very first poll failure
                // (this prevents a race where the client hasn't yet received
                // the login cookie but the poll returns 401 immediately).
                if (res.status === 401) {
                    if (this._hadSuccessfulFetch) {
                        this.emit("auth:force-logout", {
                            reason: "Unauthorized or Restricted",
                            redirectTo: "/login",
                        });
                    } else {
                        // Ignore the first auth failure and log for debugging.
                        console.warn("Realtime polling received 401 before any successful poll; ignoring to avoid spurious logout.");
                    }
                }
            } catch (err) {
                if (isTransientFetchError(err)) {
                    if (!this._loggedPollingFetchFailure) {
                        console.warn("Realtime polling skipped while the API is unavailable.");
                        this._loggedPollingFetchFailure = true;
                    }
                } else {
                    console.error("Polling error:", err);
                }
            }

            await this.checkAuthState();
        }, interval);

        this._focusHandler = () => {
            if (document.visibilityState === "visible") {
                this.checkAuthState();
                this.emit("platform-theme:updated", { silent: true });
            }
        };
        window.addEventListener("focus", this._focusHandler);
        document.addEventListener("visibilitychange", this._focusHandler);
    }

    stopPolling() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        if (this._focusHandler && typeof window !== "undefined") {
            window.removeEventListener("focus", this._focusHandler);
            document.removeEventListener("visibilitychange", this._focusHandler);
            this._focusHandler = null;
        }
    }
}

export const realtimeClient = new RealtimeClient();
