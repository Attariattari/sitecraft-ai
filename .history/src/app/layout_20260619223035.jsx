import { Geist, Geist_Mono, Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AppLoaderProvider } from "@/components/providers/AppLoaderProvider";
import { UserProvider } from "@/context/UserContext";
import { RealtimeProvider } from "@/components/providers/RealtimeProvider";
import ScrollProgress from "@/components/shared/ScrollProgress";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "SiteCraft AI - Build Beautiful Websites with AI",
  description:
    "SiteCraft AI turns your idea into a fully-designed, content-rich website in minutes. No code, no designer required.",
  keywords: [
    "AI website builder",
    "no-code",
    "website generator",
    "SaaS",
    "portfolio builder",
  ],
  openGraph: {
    title: "SiteCraft AI - Build Beautiful Websites with AI",
    description: "From idea to live website in under 2 minutes. Powered by AI.",
    type: "website",
  },
};

import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col font-sans"
        suppressHydrationWarning
      >
        <Toaster richColors position="top-right" />
        <UserProvider>
          <RealtimeProvider>
            <div className="site-scroll">
              <AppLoaderProvider>{children}</AppLoaderProvider>
              <ScrollProgress />
            </div>
          </RealtimeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
