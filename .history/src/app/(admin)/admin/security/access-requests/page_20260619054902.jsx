"use client";

import { useState, useEffect } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  Loader2,
  UserCheck,
  UserX,
  User,
  Mail,
  Calendar,
  MessageSquare,
  ShieldAlert,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";

export default function AccessRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null); // id of user being processed

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/admin/access-requests");
      const data = await res.json();
      if (res.ok) setRequests(data.requests);
    } catch (err) {
      console.error("Fetch requests error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId, action) => {
    setProcessing(userId);
    try {
      const res = await fetch(
        `/api/admin/access-requests/${userId}/${action}`,
        {
          method: "PATCH",
        },
      );
      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r._id !== userId));
      }
    } catch (err) {
      console.error(`Action ${action} error:`, err);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Access Review Requests"
        description="Manage appeals from restricted users"
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card rounded-3xl border border-border/50">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground font-medium">
            Loading requests...
          </p>
        </div>
      ) : requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card rounded-3xl border border-border/50 text-center px-6">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            Clean Slated
          </h3>
          <p className="text-muted-foreground max-w-sm">
            There are no pending access review requests at the moment. All
            restricted users have been processed.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {requests.map((request) => (
            <div
              key={request._id}
              className="bg-card border border-border/50 rounded-3xl overflow-hidden hover:border-primary/20 transition-all group"
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  {/* User Info */}
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      {request.profileImage?.url ? (
                        <img
                          src={request.profileImage.url}
                          alt=""
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      ) : (
                        <User className="w-7 h-7" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground leading-tight">
                        {request.name}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                        <Mail className="w-3.5 h-3.5" />
                        {request.email}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-[11px] font-bold uppercase tracking-wider border border-destructive/20">
                          <ShieldAlert className="w-3 h-3" />
                          Restricted
                        </span>
                        <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Requested:{" "}
                          {format(
                            new Date(
                              request.restrictionAppeal?.requestedAt ||
                                request.updatedAt,
                            ),
                            "PPP",
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Reasons & Appeal */}
                  <div className="flex-1 max-w-2xl bg-muted/30 rounded-2xl p-5 border border-border/30">
                    <div className="mb-4">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">
                        Original Restriction Reason
                      </p>
                      <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                        {request.restrictionReason || "No reason provided."}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-border/30 flex gap-3">
                      <MessageSquare className="w-4 h-4 text-primary shrink-0 mt-1" />
                      <div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1.5">
                          User Appeal Message
                        </p>
                        <p className="text-sm text-foreground italic leading-relaxed">
                          &quot;{request.restrictionAppeal?.message}&quot;
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row md:flex-col gap-3 min-w-[140px]">
                    <button
                      onClick={() => handleAction(request._id, "approve")}
                      disabled={processing === request._id}
                      className="flex-1 py-3 px-4 bg-emerald-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/10 disabled:opacity-50"
                    >
                      {processing === request._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4" />
                          Approve
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleAction(request._id, "reject")}
                      disabled={processing === request._id}
                      className="flex-1 py-3 px-4 bg-destructive text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-destructive/90 transition-all shadow-md shadow-destructive/10 disabled:opacity-50"
                    >
                      {processing === request._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <UserX className="w-4 h-4" />
                          Reject
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
