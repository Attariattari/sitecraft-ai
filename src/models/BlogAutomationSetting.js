import mongoose from "mongoose";

const blogAutomationSettingSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: false },
    frequencyHours: { type: Number, default: 24 },
    autoPublishAfterAIApproval: { type: Boolean, default: false },
    maxContentRetries: { type: Number, default: 2 },
    maxImageRetries: { type: Number, default: 2 },
    defaultStatus: {
      type: String,
      enum: ["draft", "pending", "published"],
      default: "pending",
    },
    allowedCategories: { type: [String], default: [] },
    blockedTopics: { type: [String], default: [] },
    lastRunAt: { type: Date },
    nextRunAt: { type: Date },
    updatedBy: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.models.BlogAutomationSetting ||
  mongoose.model("BlogAutomationSetting", blogAutomationSettingSchema);
