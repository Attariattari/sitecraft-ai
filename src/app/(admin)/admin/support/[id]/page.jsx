import Link from "next/link";
import {
  HeadphonesIcon,
  ArrowLeft,
  MessageSquare,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

const ticketData = {
  id: "TCK-1042",
  subject: "Unable to publish website",
  user: "Alice Johnson",
  email: "alice@example.com",
  priority: "High",
  status: "Open",
  category: "Technical",
  created: "Jun 19, 2026 — 09:14",
  updated: "10m ago",
  description:
    "I've been trying to publish my website for the past hour but keep getting a timeout error. The site was working fine yesterday. I've tried refreshing and logging out but the issue persists.",
};

const thread = [
  {
    from: "Alice Johnson",
    role: "user",
    time: "09:14",
    message:
      "I've been trying to publish my website for the past hour but keep getting a timeout error.",
  },
  {
    from: "Support Bot",
    role: "bot",
    time: "09:14",
    message:
      "Thank you for reaching out. Your ticket has been received and assigned ticket ID TCK-1042. Our team will respond shortly.",
  },
];

export default function SupportTicketDetailPage({ params }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/support"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tickets
        </Link>
      </div>

      <AdminPageHeader
        title={ticketData.subject}
        description={`Ticket ${ticketData.id} — submitted by ${ticketData.user}`}
        route={`/admin/support/${ticketData.id}`}
        badge={ticketData.status}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Thread */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
              <MessageSquare className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-black text-foreground">
                Ticket Thread
              </h2>
            </div>
            <div className="p-5 space-y-4">
              {thread.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.role === "bot" ? "flex-row-reverse" : ""}`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-emerald-500/20 flex items-center justify-center text-[10px] font-black text-primary border border-primary/10 shrink-0">
                    {msg.from
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div
                    className={`max-w-[80%] ${msg.role === "bot" ? "text-right" : ""}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-foreground">
                        {msg.from}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {msg.time}
                      </span>
                    </div>
                    <div
                      className={`px-4 py-3 rounded-xl text-sm ${msg.role === "bot" ? "bg-primary/10 text-foreground" : "bg-muted text-foreground"}`}
                    >
                      {msg.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 pb-5">
              <div className="flex gap-3">
                <textarea
                  rows={3}
                  placeholder="Write your admin reply..."
                  className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all resize-none"
                />
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all self-end">
                  <Send className="w-4 h-4" />
                  Reply
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <h3 className="text-sm font-black text-foreground">
              Ticket Details
            </h3>
            {[
              { label: "Status", value: ticketData.status },
              { label: "Priority", value: ticketData.priority },
              { label: "Category", value: ticketData.category },
              { label: "Created", value: ticketData.created },
              { label: "Last Updated", value: ticketData.updated },
            ].map((d) => (
              <div key={d.label} className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{d.label}</span>
                <span className="text-xs font-bold text-foreground">
                  {d.value}
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-black text-foreground">
                User Details
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-emerald-500/20 flex items-center justify-center text-xs font-black text-primary border border-primary/10">
                AJ
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {ticketData.user}
                </p>
                <p className="text-xs text-muted-foreground">
                  {ticketData.email}
                </p>
              </div>
            </div>
            <Link
              href="/admin/users"
              className="block text-center px-4 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
            >
              View User Profile
            </Link>
          </div>

          <div className="space-y-2">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 text-sm font-bold hover:bg-emerald-500/20 transition-all border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" /> Mark Resolved
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 text-amber-600 text-sm font-bold hover:bg-amber-500/20 transition-all border border-amber-500/20">
              <AlertCircle className="w-4 h-4" /> Escalate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
