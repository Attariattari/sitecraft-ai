import "server-only";

export function unavailableProvider(name) {
  return {
    id: name,
    async createCheckoutSession() {
      return {
        ok: false,
        code: "PROVIDER_NOT_CONFIGURED",
        message: "This payment method is not configured yet.",
      };
    },
    async verifyWebhook() {
      return { ok: false, message: "Webhook verification is not configured." };
    },
    async verifyPayment() {
      return { ok: false, status: "pending" };
    },
  };
}
