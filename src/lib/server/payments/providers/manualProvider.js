import "server-only";

export const manualProvider = {
  id: "manual",
  async createCheckoutSession({ payment }) {
    return {
      ok: true,
      provider: "manual",
      redirectUrl: `/payment/success?paymentId=${payment._id.toString()}`,
      instructions:
        "Manual bank transfer creates a pending payment. A SiteCraft AI admin must verify it before plan access is activated.",
    };
  },
  async verifyWebhook() {
    return { ok: false, message: "Manual payments are verified by Super Admin only." };
  },
  async verifyPayment(payment) {
    return { ok: true, status: payment.status };
  },
};
