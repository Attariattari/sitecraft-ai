import mongoose from "mongoose";

const SecurityChallengeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
    },
    codeHash: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["password_change"],
      default: "password_change",
    },
    attempts: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // Automatically delete after expiry
    },
  },
  {
    timestamps: true,
  },
);

const SecurityChallenge =
  mongoose.models.SecurityChallenge ||
  mongoose.model("SecurityChallenge", SecurityChallengeSchema);

export default SecurityChallenge;
