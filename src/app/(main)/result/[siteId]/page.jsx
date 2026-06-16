"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, Eye, Share2, Zap, Lightbulb, AlertCircle, Loader } from "lucide-react";
import Link from "next/link";

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSite() {
      try {
        const siteId = Array.isArray(params.siteId) ? params.siteId[0] : params.siteId;
        const response = await fetch(`/api/sites/${siteId}`);

        if (!response.ok) {
          throw new Error("Site not found");
        }

        const result = await response.json();
        setSite(result.site);
      } catch (err) {
        console.error("Error fetching site:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSite();
  }, [params.siteId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-lg font-semibold">Loading your generated portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-500/50 bg-red-50/50 dark:bg-red-950/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <CardTitle className="text-red-700 dark:text-red-400">Error</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">{error || "Failed to load site"}</p>
            <Button onClick={() => router.push("/")} className="w-full">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const content = site.generatedContent;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">SiteCraft AI</span>
            <span className="text-xs font-medium px-2 py-1 bg-green-500/10 text-green-700 dark:text-green-400 rounded-full">
              Portfolio Generated
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/preview/${site._id}`)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold mb-4">Your Portfolio is Ready!</h1>
          <p className="text-lg text-muted-foreground mb-2">
            Here's your AI-generated portfolio content
          </p>
          <p className="text-sm text-muted-foreground">
            Review, customize, and publish your new website
          </p>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-6 border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                Hero Section
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{content.hero.headline}</h3>
                <p className="text-muted-foreground">{content.hero.subheadline}</p>
              </div>
              <div className="text-sm">
                <span className="font-medium text-primary">CTA: </span>
                <span className="text-muted-foreground">{content.hero.ctaText}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* About Section */}
        {content.about && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="mb-6 border-border/50">
              <CardHeader>
                <CardTitle>{content.about.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{content.about.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Skills Section */}
        {content.skills && content.skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="mb-6 border-border/50">
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {content.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Services Section */}
        {content.services && content.services.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="mb-6 border-border/50">
              <CardHeader>
                <CardTitle>Services</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.services.map((service, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-semibold mb-2">{service.title}</h4>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* SEO Section */}
        {content.seo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="mb-6 border-border/50">
              <CardHeader>
                <CardTitle>SEO Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Page Title</p>
                  <p className="text-sm">{content.seo.title}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Meta Description</p>
                  <p className="text-sm">{content.seo.description}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Keywords</p>
                  <div className="flex flex-wrap gap-2">
                    {content.seo.keywords.map((kw, idx) => (
                      <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Suggestions Section */}
        {content.suggestions && content.suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card className="mb-6 border-border/50 bg-amber-50/50 dark:bg-amber-950/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  AI Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {content.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-600 dark:text-amber-400 font-bold text-sm mt-0.5">
                        •
                      </span>
                      <span className="text-sm text-muted-foreground">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 mt-12"
        >
          <Button
            size="lg"
            variant="outline"
            className="flex-1"
            onClick={() => router.push(`/preview/${site._id}`)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview Website
          </Button>
          <Button
            size="lg"
            className="flex-1"
            onClick={async () => {
              try {
                const response = await fetch(`/api/sites/${site._id}/publish`, {
                  method: "POST",
                });
                const result = await response.json();
                if (result.success) {
                  router.push(`/site/${site.slug}`);
                } else {
                  alert("Failed to publish");
                }
              } catch (error) {
                console.error("Publish error:", error);
                alert("Error publishing site");
              }
            }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Publish Website
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>

        {/* Info Text */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Want to customize? Edit your content before publishing, or publish now and update later.
          </p>
        </div>
      </main>
    </div>
  );
}
