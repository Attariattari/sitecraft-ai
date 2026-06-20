import dbConnect from "@/lib/dbConnect";
import ThemeRecommendation from "@/models/ThemeRecommendation";
import { realtimeEmitter } from "@/lib/realtime/realtimeEmitter";

/**
 * Invalidate theme recommendations when themes or user personal info changes
 * This ensures recommendations are regenerated when needed
 */

/**
 * Invalidate all recommendations for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Deletion result
 */
export async function invalidateUserRecommendations(userId) {
  if (!userId) return { deletedCount: 0 };

  try {
    await dbConnect();
    const result = await ThemeRecommendation.deleteMany({
      userId,
    });

    return result;
  } catch (error) {
    console.error("Error invalidating user recommendations:", error);
    return { deletedCount: 0 };
  }
}

/**
 * Invalidate all recommendations globally
 * Called when Super Admin changes theme availability
 * @returns {Promise<Object>} - Deletion result
 */
export async function invalidateAllRecommendations() {
  try {
    await dbConnect();
    const result = await ThemeRecommendation.deleteMany({});

    return result;
  } catch (error) {
    console.error("Error invalidating all recommendations:", error);
    return { deletedCount: 0 };
  }
}

/**
 * Emit realtime event to notify clients of theme changes
 * @param {string} eventType - Type of event
 * @param {Object} data - Event data
 */
export async function notifyThemeListRefresh(data = {}) {
  try {
    await realtimeEmitter.emitToAll("theme:list-refresh", {
      timestamp: new Date().toISOString(),
      ...data,
    });
  } catch (error) {
    console.error("Error emitting theme refresh event:", error);
  }
}

/**
 * Emit event to notify clients of recommendation cache refresh
 * @param {string} userId - User ID
 */
export async function notifyRecommendationRefresh(userId) {
  try {
    await realtimeEmitter.emitToUser(userId, "theme:recommendation-refresh", {
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error emitting recommendation refresh event:", error);
  }
}

/**
 * Handle theme availability changes
 * Invalidate recommendations and notify clients
 * @param {string} themeId - Theme ID that changed
 * @param {Object} changes - Changes object
 */
export async function handleThemeAvailabilityChange(themeId, changes = {}) {
  const isRestricting =
    changes.isActive === false ||
    changes.isAvailable === false ||
    changes.isLocked === true;

  if (isRestricting) {
    // Invalidate all recommendations since availability changed
    await invalidateAllRecommendations();
    await notifyThemeListRefresh({ themeId, action: "restricted" });
  } else {
    // Theme was made available/active again
    await invalidateAllRecommendations();
    await notifyThemeListRefresh({ themeId, action: "enabled" });
  }
}

/**
 * Handle personal info updates
 * Invalidate user's recommendations since their profile changed
 * @param {string} userId - User ID
 */
export async function handlePersonalInfoUpdate(userId) {
  await invalidateUserRecommendations(userId);
  await notifyRecommendationRefresh(userId);
}
