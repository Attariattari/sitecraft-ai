import jwt from "jsonwebtoken";
import { serverEnv } from "@/lib/server/env";

const JWT_SECRET = serverEnv.JWT_SECRET || "fallback_secret";

export function signReviewToken(userId) {
    return jwt.sign({ userId, type: "restriction_review" }, JWT_SECRET, {
        expiresIn: "24h",
    });
}

export function verifyReviewToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.type !== "restriction_review") return null;
        return decoded;
    } catch (error) {
        return null;
    }
}
