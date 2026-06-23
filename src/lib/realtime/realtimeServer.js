import { realtimeEmitter } from "./realtimeEmitter";
import { REALTIME_EVENTS, REALTIME_ROOMS } from "./realtimeEvents";

export const REALTIME_PROVIDER = "database-notification-polling";

export async function emitRealtimeToUser(userId, event, payload = {}) {
  return realtimeEmitter.emitToUser(userId, event, payload);
}

export async function emitRealtimeToAdmins(event, payload = {}) {
  return realtimeEmitter.emitToAdmins(event, payload);
}

export async function emitRealtimeToPublic(event, payload = {}) {
  return realtimeEmitter.emitToAll(event, payload);
}

export { REALTIME_EVENTS, REALTIME_ROOMS };
