import mongoose from "mongoose";

const blogAutomationLogSchema = new mongoose.Schema(
  {
    runId: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ["running", "success", "skipped", "failed"],
      default: "running",
      index: true,
    },
    message: { type: String, default: "" },
    topic: { type: String, default: "" },
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
    contentStatus: { type: String, default: "pending" },
    imageStatus: { type: String, default: "pending" },
    retries: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
    finishedAt: { type: Date },
    errors: { type: [String], default: [] },
  },
  { timestamps: true, suppressReservedKeysWarning: true },
);

export default mongoose.models.BlogAutomationLog ||
  mongoose.model("BlogAutomationLog", blogAutomationLogSchema);
