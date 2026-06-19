/**
 * Realtime Client Abstraction
 * Handles polling fallback for serverless environments.
 * Can be easily swapped for Socket.IO-client.
 */
export class RealtimeClient {
    constructor() {
        this.listeners = new Map();
        this.intervalId = null;
        this.lastCheckedHeader = null;
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

    startPolling(interval = 10000) {
        if (this.intervalId) return;

        this.intervalId = setInterval(async() => {
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

                // Check auth status/session version via a separate check if needed,
                // but normally api/notifications will return 401 if restricted/logged out.
                if (res.status === 401) {
                    this.emit("session:force-logout", {
                        reason: "Unauthorized or Restricted",
                    });
                }
            } catch (err) {
                console.error("Polling error:", err);
            }
        }, interval);
    }

    stopPolling() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

export const realtimeClient = new RealtimeClient();