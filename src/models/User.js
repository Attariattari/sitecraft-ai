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
        required: function() {
            return this.authProvider === "credentials" || !this.authProvider;
        },
        select: false,
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
        required: false,
        default: "",
        index: true,
    },
    primaryPurpose: {
        type: String,
        default: "",
    },
    selectedPurposes: {
        type: [String],
        default: [],
    },
    isRootSuperAdmin: {
        type: Boolean,
        default: false,
        index: true,
    },
    // Authentication provider tracking
    authProvider: {
        type: String,
        enum: ["credentials", "google"],
        default: "credentials",
        index: true,
    },
    lastLoginProvider: {
        type: String,
        enum: ["credentials", "google"],
        index: true,
    },
    authProviders: {
        credentials: { type: Boolean, default: true },
        google: { type: Boolean, default: false },
    },
    googleId: {
        type: String,
        default: null,
        index: true,
    },
    googleProfile: {
        name: String,
        email: String,
        picture: String,
        cloudinaryImage: {
            url: { type: String, default: "" },
            publicId: { type: String, default: "" },
            uploadedAt: { type: Date },
        },
        linkedAt: { type: Date },
    },
    manualProfile: {
        name: String,
        profileImage: {
            url: { type: String, default: "" },
            publicId: { type: String, default: "" },
            uploadedAt: { type: Date },
        },
    },
    // Avatar provided by OAuth provider (Google) - maintained for backward compatibility
    avatarUrl: {
        type: String,
        default: "",
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
        index: true,
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
        defaultThemeId: {
            type: String,
            default: "",
        },
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
UserSchema.pre("save", async function() {
    const ROOT_EMAIL = process.env.ROOT_SUPER_ADMIN_EMAIL;

    // Migration logic for old accountPurpose
    if (this.accountPurpose && !this.primaryPurpose) {
        this.primaryPurpose = this.accountPurpose;
    }

    if (
        this.primaryPurpose &&
        (!this.selectedPurposes || this.selectedPurposes.length === 0)
    ) {
        this.selectedPurposes = [this.primaryPurpose];
    }

    // Keep accountPurpose in sync with primaryPurpose for backward compatibility
    if (this.primaryPurpose) {
        this.accountPurpose = this.primaryPurpose;
    }

    // Sync manualProfile if missing
    if (
        this.authProviders ? .credentials &&
        !this.manualProfile ? .name &&
        this.name
    ) {
        this.manualProfile.name = this.name;
        if (this.profileImage && this.profileImage.url) {
            this.manualProfile.profileImage = {
                url: this.profileImage.url,
                publicId: this.profileImage.publicId,
                uploadedAt: this.profileImage.uploadedAt,
            };
        }
    }

    // Update top-level displayed profile based on lastLoginProvider if not set
    // This allows display-layer components to use user.name/user.profileImage directly
    if (this.lastLoginProvider === "google" && this.googleProfile ? .name) {
        this.name = this.googleProfile.name;
        if (this.googleProfile.cloudinaryImage ? .url) {
            this.profileImage = {
                url: this.googleProfile.cloudinaryImage.url,
                publicId: this.googleProfile.cloudinaryImage.publicId,
                uploadedAt: this.googleProfile.cloudinaryImage.uploadedAt,
            };
        }
    } else if (
        this.lastLoginProvider === "credentials" &&
        this.manualProfile ? .name
    ) {
        this.name = this.manualProfile.name;
        if (this.manualProfile.profileImage ? .url) {
            this.profileImage = {
                url: this.manualProfile.profileImage.url,
                publicId: this.manualProfile.profileImage.publicId,
                uploadedAt: this.manualProfile.profileImage.uploadedAt,
            };
        }
    }

    if (!ROOT_EMAIL) return;

    const emailStr = this.email || "";
    const isRootEmail =
        emailStr.toLowerCase().trim() === ROOT_EMAIL.toLowerCase().trim();

    if (isRootEmail || this.isRootSuperAdmin) {
        // Ensure root properties are immutable
        this.role = "super-admin";
        this.isRootSuperAdmin = true;
        this.status = "active";
        this.plan = "agency"; // Root admins always get all purposes
    }

    // Super admins always get at least "pro" plan — never free or basic
    if (this.role === "super-admin" && ["free", "basic"].includes(this.plan)) {
        this.plan = "agency";
    }
});

// Prevent Root Super Admin from being deleted
UserSchema.pre(["findOneAndDelete", "findOneAndRemove"], async function() {
    const query = this.getQuery();
    const ROOT_EMAIL = process.env.ROOT_SUPER_ADMIN_EMAIL;
    if (!ROOT_EMAIL) return;

    const user = await this.model.findOne(query);
    if (
        user &&
        (user.isRootSuperAdmin ||
            user.email.toLowerCase().trim() === ROOT_EMAIL.toLowerCase().trim())
    ) {
        throw new Error("Root Super Admin cannot be deleted.");
    }
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

// In development, always delete the cached model to prevent stale hooks from HMR
if (process.env.NODE_ENV !== "production" && mongoose.models.User) {
    delete mongoose.models.User;
}

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;