import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  // Graceful fallback for development/build if needed, but error at runtime in production
  if (process.env.NODE_ENV === "production" && !process.env.CI) {
    console.warn(
      "⚠️ JWT_SECRET is missing. Proceeding with fallback for build phase.",
    );
  }
}

const secret = JWT_SECRET || "fallback_dev_secret_only";

export function signAuthToken(user, expiresIn = "7d", loginProvider = null) {
  const payload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    accountPurpose: user.accountPurpose,
    sessionVersion: user.sessionVersion || 0,
    isRootSuperAdmin: user.isRootSuperAdmin || false,
    status: user.status || "active",
    loginProvider: loginProvider || user.lastLoginProvider || "credentials",
  };

  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyAuthToken(token) {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}
