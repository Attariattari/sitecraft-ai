"use client";

import { useEffect, useState } from "react";
import { SiteCraftInitialLoader } from "@/components/shared/SiteCraftInitialLoader";

export function AppLoaderProvider({ children }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if it's the first load
    const hasLoaded = sessionStorage.getItem("sitecraft_app_loaded");
    if (hasLoaded) {
      setIsReady(true);
      return;
    }

    // Delay showing children until the app is fully hydrated and loader is near completion
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1800); // Show children 200ms before loader finishes (2s total)

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <SiteCraftInitialLoader />
      <div
        className={
          isReady ? "opacity-100" : "opacity-0 invisible h-0 overflow-hidden"
        }
      >
        {children}
      </div>
    </>
  );
}
