import mongoose from "mongoose";

const aiUsageLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    siteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
    },
    provider: {
      type: String,
      default: "gemini",
    },
    model: {
      type: String,
      default: "gemini-2.0-flash",
    },
    promptTokens: Number,
    outputTokens: Number,
    totalTokens: Number,
    status: {
      type: String,
      enum: ["success", "failed", "partial"],
      default: "success",
    },
    error: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.AIUsageLog || mongoose.model("AIUsageLog", aiUsageLogSchema);
