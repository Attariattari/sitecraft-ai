import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
import { ToastContainer } from "@/components/dashboard/Toast";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopbar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <ToastContainer />
    </div>
  );
}
