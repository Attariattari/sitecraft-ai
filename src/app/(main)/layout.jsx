import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-svh flex-col bg-background font-sans selection:bg-primary/20">
      <Navbar />
      <div className="flex flex-1 flex-col [&>main]:min-h-0">{children}</div>
      <Footer />
    </div>
  );
}
