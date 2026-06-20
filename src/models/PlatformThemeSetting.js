import mongoose from "mongoose";

const PlatformThemeSettingSchema = new mongoose.Schema(
  {
    lightThemeId: {
      type: String,
      default: "white-green-orange",
    },
    darkThemeId: {
      type: String,
      default: "dark-slate-emerald",
    },
    defaultMode: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system",
    },
    allowUserOverride: {
      type: Boolean,
      default: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Singleton pattern: only one document should exist
PlatformThemeSettingSchema.statics.getOrCreate = async function () {
  let setting = await this.findOne({});
  if (!setting) {
    setting = await this.create({
      lightThemeId: "white-green-orange",
      darkThemeId: "dark-slate-emerald",
      defaultMode: "system",
      allowUserOverride: true,
    });
  }
  return setting;
};

PlatformThemeSettingSchema.statics.updateSetting = async function (data, userId) {
  const setting = await this.getOrCreate();
  if (data.lightThemeId) setting.lightThemeId = data.lightThemeId;
  if (data.darkThemeId) setting.darkThemeId = data.darkThemeId;
  if (data.defaultMode) setting.defaultMode = data.defaultMode;
  if (data.hasOwnProperty("allowUserOverride")) setting.allowUserOverride = data.allowUserOverride;
  if (userId) setting.updatedBy = userId;
  await setting.save();
  return setting;
};

export default mongoose.models.PlatformThemeSetting ||
  mongoose.model("PlatformThemeSetting", PlatformThemeSettingSchema);
