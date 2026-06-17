import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
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
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "super-admin"],
      default: "user",
      index: true,
    },
    plan: {
      type: String,
      enum: ["free", "basic", "pro", "agency"],
      default: "free",
    },
    credits: {
      type: Number,
      default: 10,
    },
    accountPurpose: {
      type: String,
      enum: [
        "portfolio",
        "business",
        "salon",
        "ecommerce",
        "restaurant",
        "clinic",
        "realEstate",
        "agency",
        "school",
        "landingPage",
      ],
      required: true,
      index: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifiedAt: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// We define an index on createdAt as requested
UserSchema.index({ createdAt: -1 });

// Ensure we don't accidentally leak the password
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  return obj;
};

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
