import mongoose from "mongoose";

const AIHelpAnswerCacheSchema = new mongoose.Schema(
  {
    questionHash: { type: String, required: true, unique: true, index: true },
    normalizedQuestion: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    sourceIds: { type: [String], default: [] },
    contextHash: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true },
);

const AIHelpAnswerCache =
  mongoose.models.AIHelpAnswerCache ||
  mongoose.model("AIHelpAnswerCache", AIHelpAnswerCacheSchema);

export default AIHelpAnswerCache;
