"use client";

import { SiteCraftInitialLoader } from "@/components/shared/SiteCraftInitialLoader";

export function AppLoaderProvider({ children }) {
  return (
    <>
      <SiteCraftInitialLoader />
      {children}
    </>
  );
}
