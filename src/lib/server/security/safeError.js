import "server-only";
import { NextResponse } from "next/server";

const GENERIC_MESSAGE = "Something went wrong. Please try again.";

export function logServerError(label, error) {
  const message = error?.message || String(error || "Unknown error");
  console.error(`${label}: ${message}`);
}

export function safeErrorResponse(message = GENERIC_MESSAGE, status = 500, extra = {}) {
  return NextResponse.json(
    {
      success: false,
      message: status >= 500 ? GENERIC_MESSAGE : message,
      ...extra,
    },
    { status },
  );
}

export function rateLimitResponse() {
  return NextResponse.json(
    {
      success: false,
      code: "RATE_LIMITED",
      message: "Too many requests. Please try again later.",
    },
    { status: 429 },
  );
}
