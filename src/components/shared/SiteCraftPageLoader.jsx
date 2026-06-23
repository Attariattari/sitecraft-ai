import { SiteCraftLoader } from "@/components/common/SiteCraftLoader";

export function SiteCraftPageLoader({ text = "Loading workspace..." }) {
  return <SiteCraftLoader variant="section" text={text} />;
}
