import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
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
    isRootSuperAdmin: {
        type: Boolean,
        default: false,
        index: true,
    },
    status: {
        type: String,
        enum: ["active", "restricted", "suspended"],
        default: "active",
        index: true,
    },
    sessionVersion: {
        type: Number,
        default: 0,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    emailVerifiedAt: {
        type: Date,
    },
    profileImage: {
        url: { type: String, default: "" },
        publicId: { type: String, default: "" },
        uploadedAt: { type: Date },
    },
    profile: {
        phone: { type: String, default: "" },
        whatsapp: { type: String, default: "" },
        profession: { type: String, default: "" },
        company: { type: String, default: "" },
        bio: { type: String, default: "" },
        location: { type: String, default: "" },
    },
    preferences: {
        theme: {
            type: String,
            enum: ["light", "dark", "system"],
            default: "system",
        },
        emailNotifications: { type: Boolean, default: true },
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
    restrictedAt: {
        type: Date,
    },
    restrictedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    restrictionReason: {
        type: String,
    },
    restrictionAppeal: {
        requested: { type: Boolean, default: false },
        message: { type: String, default: "" },
        requestedAt: { type: Date },
        status: {
            type: String,
            enum: ["none", "pending", "approved", "rejected"],
            default: "none",
        },
        reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reviewedAt: { type: Date },
    },
}, {
    timestamps: true,
}, );

// We define an index on createdAt as requested
UserSchema.index({ createdAt: -1 });

// Protect Root Super Admin from being modified
UserSchema.pre("save", function(next) {
    const ROOT_EMAIL = process.env.ROOT_SUPER_ADMIN_EMAIL;
    if (!ROOT_EMAIL) return next();

    const isRootEmail =
        this.email.toLowerCase().trim() === ROOT_EMAIL.toLowerCase().trim();

    if (isRootEmail || this.isRootSuperAdmin) {
        // Ensure root properties are immutable
        this.role = "super-admin";
        this.isRootSuperAdmin = true;
        this.status = "active";
    }

    next();
});

// Prevent Root Super Admin from being deleted
UserSchema.pre(["findOneAndDelete", "findOneAndRemove"], async function(next) {
    const query = this.getQuery();
    const ROOT_EMAIL = process.env.ROOT_SUPER_ADMIN_EMAIL;
    if (!ROOT_EMAIL) return next();

    const user = await this.model.findOne(query);
    if (
        user &&
        (user.isRootSuperAdmin ||
            user.email.toLowerCase().trim() === ROOT_EMAIL.toLowerCase().trim())
    ) {
        throw new Error("Root Super Admin cannot be deleted.");
    }
    next();
});

// Ensure we don't accidentally leak the password
UserSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    delete obj.resetPasswordToken;
    delete obj.resetPasswordExpires;
    delete obj.__v;
    return obj;
};

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;