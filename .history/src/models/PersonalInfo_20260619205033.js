import mongoose from "mongoose";

const PersonalInfoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    sharedInfo: {
      fullName: { type: String, default: "" },
      displayName: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      whatsapp: { type: String, default: "" },
      location: { type: String, default: "" },
      profileImage: { type: String, default: "" },
      brandLogo: { type: String, default: "" },
      websiteUrl: { type: String, default: "" },
      bio: { type: String, default: "" },
      socialLinks: {
        linkedin: { type: String, default: "" },
        github: { type: String, default: "" },
        facebook: { type: String, default: "" },
        instagram: { type: String, default: "" },
        x: { type: String, default: "" },
        youtube: { type: String, default: "" },
        tiktok: { type: String, default: "" },
      },
    },
    purposeInfo: {
      portfolio: { type: mongoose.Schema.Types.Mixed, default: {} },
      business: { type: mongoose.Schema.Types.Mixed, default: {} },
      salon: { type: mongoose.Schema.Types.Mixed, default: {} },
      ecommerce: { type: mongoose.Schema.Types.Mixed, default: {} },
      restaurant: { type: mongoose.Schema.Types.Mixed, default: {} },
      clinic: { type: mongoose.Schema.Types.Mixed, default: {} },
      realEstate: { type: mongoose.Schema.Types.Mixed, default: {} },
      agency: { type: mongoose.Schema.Types.Mixed, default: {} },
      school: { type: mongoose.Schema.Types.Mixed, default: {} },
      landingPage: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    completion: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// In development, always delete the cached model to prevent stale hooks
if (process.env.NODE_ENV !== "production" && mongoose.models.PersonalInfo) {
  delete mongoose.models.PersonalInfo;
}

const PersonalInfo =
  mongoose.models.PersonalInfo ||
  mongoose.model("PersonalInfo", PersonalInfoSchema);

export default PersonalInfo;
