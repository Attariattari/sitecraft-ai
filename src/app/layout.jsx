import { Geist, Geist_Mono, Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AppLoaderProvider } from "@/components/providers/AppLoaderProvider";
import { UserProvider } from "@/context/UserContext";
import { RealtimeProvider } from "@/components/providers/RealtimeProvider";
import { PlatformThemeProvider } from "@/components/providers/PlatformThemeProvider";
import ScrollProgress from "@/components/shared/ScrollProgress";
import { Toaster } from "sonner";
import { getPlatformThemeForGuest } from "@/lib/platformThemeResolver";
import { PLATFORM_THEME_VARIABLES } from "@/lib/theme/applyPlatformTheme";

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

export const dynamic = "force-dynamic";

function getInitialMode(theme) {
  return theme?.defaultMode === "dark" ? "dark" : "light";
}

function getThemeStyle(theme, mode) {
  const tokens = mode === "dark" ? theme?.darkTokens : theme?.lightTokens;
  return PLATFORM_THEME_VARIABLES.reduce((style, key) => {
    if (tokens?.[key]) style[`--${key}`] = tokens[key];
    return style;
  }, {});
}

function getThemeBootScript(theme) {
  const safeTheme = JSON.stringify(theme || {}).replace(/</g, "\\u003c");

  return `
    (function () {
      try {
        var theme = ${safeTheme};
        var allowedModes = { light: true, dark: true };
        var mode = theme.defaultMode === "dark" ? "dark" : "light";
        if (theme.allowUserOverride !== false) {
          var storedMode = localStorage.getItem("sitecraft_platform_theme_mode");
          if (allowedModes[storedMode]) mode = storedMode;
        }
        localStorage.removeItem("sitecraft_platform_theme");
        var resolvedMode = mode === "dark" ? "dark" : "light";
        var tokens = resolvedMode === "dark" ? theme.darkTokens : theme.lightTokens;
        var keys = ${JSON.stringify(PLATFORM_THEME_VARIABLES)};
        var root = document.documentElement;
        if (tokens) {
          for (var i = 0; i < keys.length; i += 1) {
            var key = keys[i];
            if (tokens[key]) root.style.setProperty("--" + key, tokens[key]);
          }
        }
        root.dataset.platformTheme = theme.activeThemeId || theme.lightThemeId || "default";
        root.dataset.themeMode = resolvedMode;
        root.dataset.platformThemeLight = theme.lightThemeId || "";
        root.dataset.platformThemeDark = theme.darkThemeId || "";
        root.classList.toggle("dark", resolvedMode === "dark");
      } catch (error) {}
    })();
  `;
}

export default async function RootLayout({ children }) {
  const { theme: initialPlatformTheme } = await getPlatformThemeForGuest();
  const initialMode = getInitialMode(initialPlatformTheme);
  const initialThemeStyle = getThemeStyle(initialPlatformTheme, initialMode);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${outfit.variable} h-full antialiased ${initialMode === "dark" ? "dark" : ""}`}
      style={initialThemeStyle}
      data-platform-theme={initialPlatformTheme?.activeThemeId || initialPlatformTheme?.lightThemeId || "default"}
      data-theme-mode={initialMode}
      data-platform-theme-light={initialPlatformTheme?.lightThemeId || ""}
      data-platform-theme-dark={initialPlatformTheme?.darkThemeId || ""}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col font-sans"
        suppressHydrationWarning
      >
        <script
          dangerouslySetInnerHTML={{
            __html: getThemeBootScript(initialPlatformTheme),
          }}
        />
        <Toaster richColors position="top-right" />
        <UserProvider>
          <PlatformThemeProvider initialTheme={initialPlatformTheme}>
            <RealtimeProvider>
              <div className="site-scroll">
                <AppLoaderProvider>{children}</AppLoaderProvider>
                <ScrollProgress />
              </div>
            </RealtimeProvider>
          </PlatformThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
