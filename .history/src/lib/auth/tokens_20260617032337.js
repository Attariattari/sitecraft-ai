import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  // Graceful fallback for development if needed, but error in production
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is required in production");
  }
}

const secret = JWT_SECRET || "fallback_dev_secret_only";

export function signAuthToken(user) {
  const payload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    accountPurpose: user.accountPurpose,
  };

  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function verifyAuthToken(token) {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}
