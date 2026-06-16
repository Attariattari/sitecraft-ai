"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Database, Grid3x3, FolderOpen } from "lucide-react";

export default function AdminPage() {
  const [seedLoading, setSeedLoading] = useState(false);
  const [seedResult, setSeedResult] = useState(null);

  const handleSeedDefaults = async () => {
    setSeedLoading(true);
    setSeedResult(null);

    try {
      const response = await fetch("/api/admin/seed-defaults", {
        method: "POST",
      });

      const result = await response.json();
      setSeedResult(result);
    } catch (error) {
      console.error("Error seeding defaults:", error);
      setSeedResult({ success: false, error: error.message });
    } finally {
      setSeedLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">SiteCraft AI</span>
            <span className="text-xs font-medium px-2 py-1 bg-red-500/10 text-red-700 dark:text-red-400 rounded-full">
              Admin
            </span>
          </div>
          <Button variant="outline" onClick={() => window.location.href = "/"}>
            Home
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground mb-12">
            Manage SiteCraft AI system and database.
          </p>

          {/* Database Management */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Database
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Manage database collections and seed default data.
                </p>
                <Button
                  onClick={handleSeedDefaults}
                  disabled={seedLoading}
                  className="w-full"
                >
                  {seedLoading ? "Seeding..." : "Seed Default Data"}
                </Button>
                {seedResult && (
                  <div
                    className={`p-4 rounded-lg text-sm ${
                      seedResult.success
                        ? "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400"
                        : "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400"
                    }`}
                  >
                    {seedResult.success ? (
                      <div>
                        <p className="font-medium mb-2">Seed successful!</p>
                        <ul className="text-xs space-y-1">
                          <li>
                            Categories: {seedResult.results?.categories?.created} created,{" "}
                            {seedResult.results?.categories?.skipped} skipped
                          </li>
                          <li>
                            Templates: {seedResult.results?.templates?.created} created,{" "}
                            {seedResult.results?.templates?.skipped} skipped
                          </li>
                        </ul>
                      </div>
                    ) : (
                      <p>{seedResult.error || "An error occurred"}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  API Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Generate API</span>
                    <span className="px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 text-xs rounded">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database Connection</span>
                    <span className="px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 text-xs rounded">
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Gemini API</span>
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 text-xs rounded">
                      Configured
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                Quick Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="w-full justify-start">
                  <Grid3x3 className="w-4 h-4 mr-2" />
                  View All Sites
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  View All Users
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Database className="w-4 h-4 mr-2" />
                  View Templates
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Zap className="w-4 h-4 mr-2" />
                  View AI Usage
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-6 border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20">
            <CardContent className="pt-6">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                <strong>Security Note:</strong> This admin panel is a temporary MVP implementation.
                In production, implement proper authentication, authorization, and access control.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
