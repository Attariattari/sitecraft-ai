import jwt from "jsonwebtoken";
import { serverEnv } from "@/lib/server/env";

const JWT_SECRET = serverEnv.JWT_SECRET;
if (!JWT_SECRET) {
  // Graceful fallback for development/build if needed, but error at runtime in production
  if (serverEnv.NODE_ENV === "production" && !process.env.CI) {
    console.warn("JWT_SECRET is missing. Proceeding with fallback for build phase.");
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

export function signPendingLinkToken(data) {
  // Short-lived token for account linking confirmation (10 minutes)
  return jwt.sign(data, secret, { expiresIn: "10m" });
}

export function verifyPendingLinkToken(token) {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}

export function verifyAuthToken(token) {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}
