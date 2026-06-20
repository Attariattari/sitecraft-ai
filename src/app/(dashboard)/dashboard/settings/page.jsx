"use client";

import { Bell, Shield, Key, UserX } from "lucide-react";
import {
  DashboardShell,
  DashboardPageHeader,
} from "@/components/dashboard/DashboardShell";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

export default function DashboardSettingsPage() {
  return (
    <DashboardShell>
      <DashboardPageHeader
        title="Account Settings"
        description="Manage your account security, notification preferences, and API keys."
      />

      <div className="max-w-3xl space-y-6">
        <DashboardCard>
          <div className="flex items-center gap-2 mb-4 text-foreground font-semibold">
            <Bell className="w-4 h-4 text-primary" />
            <h3>Notification Preferences</h3>
          </div>
          <div className="space-y-4">
            {[
              {
                title: "Website Updates",
                desc: "Get notified when your website generation is complete.",
              },
              {
                title: "AI Credits",
                desc: "Receive alerts when you are running low on AI generation credits.",
              },
              {
                title: "Marketing & News",
                desc: "Hear about new features, templates, and platform updates.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start justify-between py-3 border-b border-border last:border-0 last:pb-0"
              >
                <div>
                  <h4 className="text-sm font-medium text-foreground">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.desc}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked={i !== 2}
                  />
                  <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center gap-2 mb-4 text-foreground font-semibold">
            <Shield className="w-4 h-4 text-primary" />
            <h3>Security & Password</h3>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Change your password to keep your account secure.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="password"
                placeholder="Current Password"
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:border-primary outline-none"
              />
              <div className="hidden md:block" />
              <input
                type="password"
                placeholder="New Password"
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:border-primary outline-none"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:border-primary outline-none"
              />
            </div>
            <button className="site-secondary-button px-4 py-2 rounded-lg text-sm font-medium mt-2">
              Update Password
            </button>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center gap-2 mb-4 text-foreground font-semibold">
            <Key className="w-4 h-4 text-primary" />
            <h3>API Keys</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Use API keys to connect your SiteCraft websites directly with your
            own backend systems. (Available on Pro plan)
          </p>
          <button className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-semibold cursor-not-allowed">
            Generate New Key
          </button>
        </DashboardCard>

        <DashboardCard className="border-destructive/20 bg-destructive/5">
          <div className="flex items-center gap-2 mb-2 text-destructive font-semibold">
            <UserX className="w-4 h-4" />
            <h3>Delete Account</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Permanently delete your account and all generated websites. This
            action cannot be undone.
          </p>
          <button className="px-4 py-2 rounded-lg bg-destructive text-white text-sm font-semibold hover:bg-destructive/90 transition-colors">
            Delete My Account
          </button>
        </DashboardCard>
      </div>
    </DashboardShell>
  );
}
