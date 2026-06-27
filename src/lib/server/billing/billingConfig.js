import "server-only";
import { serverEnv } from "@/lib/server/env";

export const BILLING_PLAN_SLUGS = ["basic", "pro"];
export const BILLING_CYCLES = ["monthly", "yearly"];

export const FIRST_PURCHASE_BONUS_MONTHS = {
  basic: 3,
  pro: 6,
};

export function getPaymentMethods() {
  return [
    {
      id: "card",
      label: "Visa / Mastercard",
      provider: serverEnv.CARD_GATEWAY_PROVIDER || "card_gateway",
      enabled: Boolean(serverEnv.CARD_GATEWAY_PROVIDER && serverEnv.CARD_GATEWAY_SECRET_KEY),
      note: "Secure hosted card checkout. Raw card details are never stored by SiteCraft AI.",
    },
    {
      id: "jazzcash",
      label: "JazzCash",
      provider: "jazzcash",
      enabled: serverEnv.JAZZCASH_ENABLED === "true",
      note: "Available when JazzCash merchant credentials are configured.",
    },
    {
      id: "easypaisa",
      label: "Easypaisa",
      provider: "easypaisa",
      enabled: serverEnv.EASYPAISA_ENABLED === "true",
      note: "Available when Easypaisa store credentials are configured.",
    },
    {
      id: "manual",
      label: "Bank transfer / manual verification",
      provider: "manual",
      enabled: serverEnv.MANUAL_PAYMENT_ENABLED === "true",
      note: "Creates a pending payment for admin verification. It does not activate access automatically.",
    },
  ];
}

export function getDefaultCurrency(plan) {
  return (plan?.currency || serverEnv.PAYMENT_DEFAULT_CURRENCY || "PKR").toUpperCase();
}
