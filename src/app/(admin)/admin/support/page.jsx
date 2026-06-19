import Link from "next/link";
import {
  HeadphonesIcon,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

const statusStyles = {
  Open: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
  "In Progress": "bg-blue-500/10 text-blue-600 border border-blue-500/20",
  Resolved: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
  Closed: "bg-muted text-muted-foreground border border-border",
};

const priorityStyles = {
  High: "bg-red-500/10 text-red-600",
  Medium: "bg-amber-500/10 text-amber-600",
  Low: "bg-slate-500/10 text-slate-500",
};

const mockTickets = [
  {
    id: "TCK-1042",
    subject: "Unable to publish website",
    user: "Alice Johnson",
    priority: "High",
    status: "Open",
    updated: "10m ago",
  },
  {
    id: "TCK-1041",
    subject: "Billing discrepancy on invoice",
    user: "Bob Smith",
    priority: "Medium",
    status: "In Progress",
    updated: "2h ago",
  },
  {
    id: "TCK-1039",
    subject: "AI generation stuck at 0%",
    user: "Carol White",
    priority: "High",
    status: "In Progress",
    updated: "5h ago",
  },
  {
    id: "TCK-1035",
    subject: "Request to change account email",
    user: "Dan Brown",
    priority: "Low",
    status: "Resolved",
    updated: "1d ago",
  },
];

export default function AdminSupportPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Support Tickets"
        description="Track and resolve customer support requests across the platform."
        route="/admin/support"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard
          icon={HeadphonesIcon}
          label="Open Tickets"
          value="—"
          sub="Awaiting response"
        />
        <AdminStatCard
          icon={Clock}
          label="In Progress"
          value="—"
          sub="Being handled"
          iconClass="bg-blue-500"
        />
        <AdminStatCard
          icon={CheckCircle2}
          label="Resolved Today"
          value="—"
          sub="Closed tickets"
          iconClass="bg-emerald-500"
        />
        <AdminStatCard
          icon={AlertCircle}
          label="Avg Response Time"
          value="—"
          sub="Last 7 days"
          iconClass="bg-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tickets by subject or user..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-card outline-none focus:border-primary transition-all text-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-card outline-none focus:border-primary transition-all text-sm appearance-none cursor-pointer">
            <option>All Statuses</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
            <option>Closed</option>
          </select>
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-card outline-none focus:border-primary transition-all text-sm appearance-none cursor-pointer">
            <option>All Priorities</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-black text-foreground">All Tickets</h2>
          </div>
          <span className="text-xs text-muted-foreground">
            {mockTickets.length} total
          </span>
        </div>
        <div className="divide-y divide-border/50">
          {mockTickets.map((t) => (
            <Link
              key={t.id}
              href={`/admin/support/${t.id}`}
              className="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {t.id}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${priorityStyles[t.priority]}`}
                  >
                    {t.priority}
                  </span>
                </div>
                <p className="text-sm font-bold text-foreground truncate">
                  {t.subject}
                </p>
                <p className="text-xs text-muted-foreground">{t.user}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${statusStyles[t.status]}`}
                >
                  {t.status}
                </span>
                <span className="text-xs text-muted-foreground hidden sm:block">
                  {t.updated}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
