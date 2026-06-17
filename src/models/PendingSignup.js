import mongoose from "mongoose";

const PendingSignupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    accountPurpose: {
      type: String,
      required: true,
    },
    verificationCodeHash: {
      type: String,
      required: true,
    },
    verificationCodeExpires: {
      type: Date,
      required: true,
      expires: 0, // TTL index exactly at this date
    },
    attempts: {
      type: Number,
      default: 0,
    },
    lastSentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Mongoose TTL index requires the field to actually be configured as `expires`.
// The expires: 0 will delete the document when the current time reaches verificationCodeExpires.

const PendingSignup =
  mongoose.models.PendingSignup ||
  mongoose.model("PendingSignup", PendingSignupSchema);

export default PendingSignup;
