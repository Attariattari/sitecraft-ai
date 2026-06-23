"use client";

export const REALTIME_BROADCAST_CHANNEL = "sitecraft_realtime_channel";

export function createRealtimeBroadcastChannel(onMessage) {
  if (typeof window === "undefined") return null;

  if ("BroadcastChannel" in window) {
    const channel = new BroadcastChannel(REALTIME_BROADCAST_CHANNEL);
    if (onMessage) {
      channel.addEventListener("message", (event) => onMessage(event.data));
    }
    return {
      post: (message) => channel.postMessage(message),
      close: () => channel.close(),
    };
  }

  const storageHandler = (event) => {
    if (event.key !== REALTIME_BROADCAST_CHANNEL || !event.newValue || !onMessage) return;
    try {
      onMessage(JSON.parse(event.newValue));
    } catch {
      // Ignore malformed cross-tab payloads.
    }
  };

  window.addEventListener("storage", storageHandler);
  return {
    post: (message) => {
      try {
        localStorage.setItem(
          REALTIME_BROADCAST_CHANNEL,
          JSON.stringify({ ...message, sentAt: Date.now() }),
        );
      } catch {
        // Storage can be unavailable in private browsing.
      }
    },
    close: () => window.removeEventListener("storage", storageHandler),
  };
}

export function broadcastRealtimeMessage(message) {
  const channel = createRealtimeBroadcastChannel();
  if (!channel) return;
  channel.post(message);
  channel.close();
}
