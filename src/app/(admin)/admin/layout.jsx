import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Super Admin — SiteCraft AI",
  description: "SiteCraft AI Super Admin Dashboard",
};

export default async function AdminLayout({ children }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin" && user.role !== "super-admin") {
    redirect("/dashboard");
  }

  if (user.status === "restricted" || user.status === "suspended") {
    // Allow Root Super Admin to bypass accidental restriction
    if (!user.isRootSuperAdmin) {
      redirect("/dashboard");
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
