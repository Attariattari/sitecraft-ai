"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Eye, Trash2, Share2, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardSitesPage() {
  const router = useRouter();
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSites() {
      try {
        const response = await fetch("/api/sites");
        const result = await response.json();
        if (result.success) {
          setSites(result.sites || []);
        }
      } catch (error) {
        console.error("Error fetching sites:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSites();
  }, []);

  const handleDelete = async (siteId) => {
    if (!confirm("Are you sure you want to delete this site?")) return;

    try {
      const response = await fetch(`/api/sites/${siteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSites(sites.filter((s) => s._id !== siteId));
      } else {
        alert("Failed to delete site");
      }
    } catch (error) {
      console.error("Error deleting site:", error);
      alert("Error deleting site");
    }
  };

  const handlePublish = async (siteId) => {
    try {
      const response = await fetch(`/api/sites/${siteId}/publish`, {
        method: "POST",
      });

      const result = await response.json();
      if (result.success) {
        router.push(`/site/${result.site.slug}`);
      } else {
        alert("Failed to publish site");
      }
    } catch (error) {
      console.error("Error publishing site:", error);
      alert("Error publishing site");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">SiteCraft AI</span>
          </div>
          <Link href="/generate">
            <Button>Create New</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl">
          <h1 className="text-4xl font-bold mb-2">My Websites</h1>
          <p className="text-muted-foreground mb-8">
            Manage all your generated websites here.
          </p>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading your websites...</p>
            </div>
          ) : sites.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-6">No websites yet.</p>
                <Link href="/generate">
                  <Button>
                    Create Your First Portfolio
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sites.map((site) => (
                <Card key={site._id} className="hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl">
                          {site.inputData?.name || "Untitled"}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-2">
                          {site.inputData?.profession || "No profession"}
                        </p>
                      </div>
                      <div className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                        {site.status}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div>
                        <p className="text-xs text-muted-foreground">Created</p>
                        <p className="text-sm font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(site.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Theme</p>
                        <p className="text-sm font-medium">{site.themeId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <p className="text-sm font-medium capitalize">{site.status}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Views</p>
                        <p className="text-sm font-medium">{site.analytics?.views || 0}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/preview/${site._id}`, "_blank")}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>

                      {!site.isPublished ? (
                        <Button
                          size="sm"
                          onClick={() => handlePublish(site._id)}
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Publish
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/site/${site.slug}`, "_blank")}
                        >
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Visit
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(site._id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
