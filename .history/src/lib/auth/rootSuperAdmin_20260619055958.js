import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export function isRootSuperAdminEmail(email) {
    if (!email) return false;
    const root = process.env.ROOT_SUPER_ADMIN_EMAIL;
    if (!root) return false;
    return email.toLowerCase().trim() === root.toLowerCase().trim();
}

export async function ensureRootSuperAdminUser() {
    await dbConnect();
    const root = process.env.ROOT_SUPER_ADMIN_EMAIL;
    if (!root) throw new Error("ROOT_SUPER_ADMIN_EMAIL is not configured.");

    const email = root.toLowerCase().trim();
    let user = await User.findOne({ email });

    if (user) {
        let dirty = false;
        if (user.role !== "super-admin") {
            user.role = "super-admin";
            dirty = true;
        }
        if (!user.isRootSuperAdmin) {
            user.isRootSuperAdmin = true;
            dirty = true;
        }
        if (user.status !== "active") {
            user.status = "active";
            dirty = true;
        }
        if (dirty) await user.save();
        return user;
    }

    // Create root user with a random unusable password — only OTP grants access
    const bcrypt = (await
        import ("bcryptjs")).default;
    const randomPass = await bcrypt.hash(
        Math.random().toString(36) + Date.now().toString(36),
        12,
    );

    user = await User.create({
        name: "Root Super Admin",
        email,
        password: randomPass,
        role: "super-admin",
        isRootSuperAdmin: true,
        status: "active",
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
        accountPurpose: "agency",
        plan: "agency",
        credits: 999999,
    });

    return user;
}

export function assertNotRootSuperAdminTarget(targetUser) {
    if (!targetUser) return;
    const isRoot =
        targetUser.isRootSuperAdmin === true ||
        isRootSuperAdminEmail(targetUser.email);
    if (isRoot) {
        throw new Error(
            "This action cannot be performed on the Root Super Admin account.",
        );
    }
}

export function canManageUserRole(actorUser, targetUser) {
    if (!actorUser || !targetUser) return false;

    // No one can manage root
    if (targetUser.isRootSuperAdmin || isRootSuperAdminEmail(targetUser.email)) {
        return false;
    }

    // Root super admin can manage anyone (except root, handled above)
    if (actorUser.isRootSuperAdmin || isRootSuperAdminEmail(actorUser.email)) {
        return true;
    }

    // Super-admin can manage admins and users
    if (actorUser.role === "super-admin") {
        return targetUser.role !== "super-admin";
    }

    return false;
}