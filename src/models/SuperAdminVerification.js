import mongoose from "mongoose";

const SuperAdminVerificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // TTL index
    },
    attempts: {
      type: Number,
      default: 0,
    },
    lastSentAt: {
      type: Date,
      default: Date.now,
    },
    ipAddress: {
      type: String,
      default: "",
    },
    userAgent: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// Unique per email — only one active verification at a time
SuperAdminVerificationSchema.index({ email: 1 }, { unique: true });

const SuperAdminVerification =
  mongoose.models.SuperAdminVerification ||
  mongoose.model("SuperAdminVerification", SuperAdminVerificationSchema);

export default SuperAdminVerification;
