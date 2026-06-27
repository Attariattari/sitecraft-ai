import "server-only";
import { serverEnv } from "@/lib/server/env";
import { unavailableProvider } from "@/lib/server/payments/providers";
import { manualProvider } from "@/lib/server/payments/providers/manualProvider";

export function getPaymentProvider(method = "card") {
  if (method === "manual") {
    return serverEnv.MANUAL_PAYMENT_ENABLED === "true"
      ? manualProvider
      : unavailableProvider("manual");
  }
  if (method === "jazzcash") return unavailableProvider("jazzcash");
  if (method === "easypaisa") return unavailableProvider("easypaisa");
  return unavailableProvider(serverEnv.CARD_GATEWAY_PROVIDER || "card_gateway");
}
