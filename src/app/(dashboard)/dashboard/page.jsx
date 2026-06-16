"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, FileText, Zap, Users } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">SiteCraft AI</span>
          </div>
          <Link href="/">
            <Button variant="outline">Home</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground mb-12">
            Manage your generated websites and track your activity.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  My Sites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">0</p>
                <p className="text-sm text-muted-foreground mt-2">No sites generated yet</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Credits Used
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">0/5</p>
                <p className="text-sm text-muted-foreground mt-2">Free tier credits</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Published
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">0</p>
                <p className="text-sm text-muted-foreground mt-2">Live websites</p>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/dashboard/sites">
              <Card className="cursor-pointer hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle>My Websites</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    View, edit, and manage all your generated websites.
                  </p>
                  <div className="flex items-center gap-2 text-primary font-medium">
                    View all <ArrowRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/generate">
              <Card className="cursor-pointer hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle>Create New</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Generate a new portfolio website with AI.
                  </p>
                  <div className="flex items-center gap-2 text-primary font-medium">
                    Generate now <ArrowRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Getting Started */}
          <Card className="mt-12 border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Create Your Portfolio</p>
                    <p className="text-sm text-muted-foreground">
                      Fill out a short form about yourself
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Review Generated Content</p>
                    <p className="text-sm text-muted-foreground">
                      AI generates your portfolio content automatically
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Choose Theme & Template</p>
                    <p className="text-sm text-muted-foreground">
                      Pick from multiple professional designs
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    4
                  </div>
                  <div>
                    <p className="font-medium">Publish & Share</p>
                    <p className="text-sm text-muted-foreground">
                      Get your own URL and share your portfolio
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Link href="/generate">
                  <Button className="w-full">Create Your Portfolio Now</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
