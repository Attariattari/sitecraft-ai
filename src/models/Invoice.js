import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" },
    invoiceNumber: { type: String, required: true, unique: true, trim: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    discountAmount: { type: Number, default: 0, min: 0 },
    finalAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "PKR", uppercase: true, trim: true },
    status: { type: String, enum: ["pending", "paid", "void", "refunded"], default: "pending", index: true },
    issuedAt: { type: Date, default: Date.now },
    paidAt: { type: Date },
    downloadUrl: { type: String, default: "", trim: true },
  },
  { timestamps: true },
);

const Invoice = mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);

export default Invoice;
