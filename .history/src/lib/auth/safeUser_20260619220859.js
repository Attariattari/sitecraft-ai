/**
 * Sanitizes a Mongoose user document into a safe payload for the frontend.
 * This is the central source of truth for user data sent to the client.
 */
export function safeUserPayload(user, loginProvider = "credentials") {
    if (!user) return null;

    // Determine display profile based on session loginProvider
    let displayName = user.name;
    let displayImage = user.profileImage ? .url || user.avatarUrl || null;
    let displaySource = "fallback";

    if (loginProvider === "google" && user.googleProfile ? .name) {
        displayName = user.googleProfile.name;
        displayImage = user.googleProfile.cloudinaryImage ? .url || user.googleProfile.picture || displayImage;
        displaySource = "google";
    } else if (loginProvider === "credentials") {
        // If we have a specific manual profile, use it; otherwise top-level fields
        if (user.manualProfile ? .name) {
            displayName = user.manualProfile.name;
            displayImage = user.manualProfile.profileImage ? .url || displayImage;
        }
        displaySource = "manual";
    }

    return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        plan: user.plan || "free",
        credits: user.credits || 0,
        accountPurpose: user.accountPurpose,
        primaryPurpose: user.primaryPurpose,
        selectedPurposes: user.selectedPurposes || [],
        profileImage: user.profileImage,
        profile: user.profile,
        preferences: user.preferences,
        isRootSuperAdmin: user.isRootSuperAdmin || false,
        status: user.status,
        isEmailVerified: user.isEmailVerified || false,
        sessionVersion: user.sessionVersion || 0,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        // Linking & Provider Info
        loginProvider,
        lastLoginProvider: user.lastLoginProvider,
        authProviders: user.authProviders || { credentials: true, google: false },
        googleProfile: user.googleProfile,
        manualProfile: user.manualProfile,
        displayProfile: {
            name: displayName,
            imageUrl: displayImage,
            source: displaySource,
        },
    };
}