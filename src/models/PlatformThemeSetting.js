import mongoose from "mongoose";

const PlatformThemeSettingSchema = new mongoose.Schema(
  {
    activeThemeId: {
      type: String,
      default: "default",
    },
    lightThemeId: {
      type: String,
      default: "emerald",
    },
    darkThemeId: {
      type: String,
      default: "modernDark",
    },
    defaultMode: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
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
      activeThemeId: "default",
      lightThemeId: "emerald",
      darkThemeId: "modernDark",
      defaultMode: "light",
      allowUserOverride: true,
    });
  } else if (!setting.activeThemeId) {
    setting.activeThemeId = setting.lightThemeId || "default";
    await setting.save();
  } else if (setting.defaultMode === "system") {
    setting.defaultMode = "light";
    await setting.save();
  }
  return setting;
};

PlatformThemeSettingSchema.statics.updateSetting = async function (data, userId) {
  const setting = await this.getOrCreate();
  if (data.activeThemeId) setting.activeThemeId = data.activeThemeId;
  if (data.lightThemeId) setting.lightThemeId = data.lightThemeId;
  if (data.darkThemeId) setting.darkThemeId = data.darkThemeId;
  if (!data.activeThemeId && data.lightThemeId) setting.activeThemeId = data.lightThemeId;
  if (data.defaultMode) setting.defaultMode = data.defaultMode;
  if (data.hasOwnProperty("allowUserOverride")) setting.allowUserOverride = data.allowUserOverride;
  if (userId) setting.updatedBy = userId;
  await setting.save();
  return setting;
};

export default mongoose.models.PlatformThemeSetting ||
  mongoose.model("PlatformThemeSetting", PlatformThemeSettingSchema);
