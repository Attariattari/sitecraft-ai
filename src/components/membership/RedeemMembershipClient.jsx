"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Gift, LockKeyhole, XCircle } from "lucide-react";
import { useUser } from "@/context/UserContext";

export function RedeemMembershipClient({ token }) {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const [invite, setInvite] = useState(null);
  const [status, setStatus] = useState({ loading: true, message: "Checking invite...", error: "" });
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    async function validate() {
      const response = await fetch(`/api/membership-invites/validate/${encodeURIComponent(token)}`, {
        headers: { "Cache-Control": "no-cache" },
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setStatus({ loading: false, message: "", error: data.message || "This membership invite is not available." });
        return;
      }
      setInvite(data.invite);
      setStatus({ loading: false, message: "Invite ready.", error: "" });
    }
    validate();
  }, [token]);

  async function redeem() {
    setRedeeming(true);
    const response = await fetch("/api/membership-invites/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await response.json();
    setRedeeming(false);
    if (!response.ok || !data.success) {
      setStatus({ loading: false, message: "", error: data.message || "Invite could not be redeemed." });
      return;
    }
    router.push(data.redirectUrl || "/dashboard/billing");
  }

  const emailMismatch = user && invite && user.email?.toLowerCase() !== invite.targetEmail?.toLowerCase();

  return (
    <main className="min-h-screen bg-background px-4 py-14">
      <section className="mx-auto max-w-5xl overflow-hidden rounded-lg border border-border bg-card shadow-xl">
        <div className="bg-gradient-to-br from-primary to-accent px-6 py-10 text-primary-foreground md:px-10">
          <p className="text-xs font-black uppercase tracking-[0.2em]">Membership gift</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">Redeem SiteCraft AI Access</h1>
          <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 opacity-90">
            This secure invite is linked to one email address and can only be used once.
          </p>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-[1fr_340px] md:p-10">
          <div>
            {status.loading ? <State icon={LockKeyhole} title="Checking invite" text={status.message} /> : null}
            {status.error ? <State icon={XCircle} title="Invite unavailable" text={status.error} danger /> : null}
            {invite && !status.error ? (
              <>
                <div className="rounded-lg border border-primary/20 bg-primary/10 p-5">
                  <Gift className="size-7 text-primary" />
                  <h2 className="mt-4 text-2xl font-black text-foreground">
                    {invite.planSlug === "pro" ? "Pro" : "Basic"} membership
                  </h2>
                  <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">
                    Duration: {invite.durationLabel}. Expires if not redeemed by {new Date(invite.tokenExpiresAt).toLocaleDateString()}.
                  </p>
                  {invite.adminMessage ? (
                    <p className="mt-4 rounded-lg border border-border bg-background/70 p-4 text-sm leading-6 text-muted-foreground">
                      {invite.adminMessage}
                    </p>
                  ) : null}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {["AI website generation", "More themes and templates", "Dashboard billing visibility", "Gifted membership tracking"].map((item) => (
                    <div key={item} className="rounded-lg border border-border bg-background/70 p-4">
                      <CheckCircle2 className="size-4 text-primary" />
                      <p className="mt-2 text-sm font-bold text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </div>

          <aside className="h-fit rounded-lg border border-border bg-background/80 p-5">
            <h3 className="text-lg font-black text-foreground">Secure redemption</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Target email: <span className="font-black text-foreground">{invite?.targetEmail || "Checking..."}</span>
            </p>
            {!userLoading && !user && invite ? (
              <div className="mt-5">
                <p className="text-sm font-semibold leading-6 text-muted-foreground">
                  Please login or register with the same email address to redeem this membership.
                </p>
                <Link
                  href={`/login?next=/membership/redeem/${encodeURIComponent(token)}`}
                  className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-black text-primary-foreground"
                >
                  Login to redeem
                </Link>
              </div>
            ) : null}

            {emailMismatch ? (
              <div className="mt-5 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm font-bold text-foreground">
                This membership invite is linked to a different email address.
              </div>
            ) : null}

            {user && invite && !emailMismatch ? (
              <button
                type="button"
                onClick={redeem}
                disabled={redeeming}
                className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-black text-primary-foreground disabled:opacity-60"
              >
                {redeeming ? "Redeeming..." : "Redeem Membership"}
              </button>
            ) : null}

            <p className="mt-5 text-xs font-semibold leading-5 text-muted-foreground">
              If you did not expect this invite, you can ignore it. No membership change happens until redemption succeeds server-side.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}

function State({ icon: Icon, title, text, danger = false }) {
  return (
    <div className={`rounded-lg border p-5 ${danger ? "border-destructive/20 bg-destructive/10" : "border-border bg-background/70"}`}>
      <Icon className={danger ? "size-6 text-destructive" : "size-6 text-primary"} />
      <h2 className="mt-4 text-xl font-black text-foreground">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}
