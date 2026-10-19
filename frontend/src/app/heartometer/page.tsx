import type { Metadata } from "next";
import { HeartometerTool } from "@/components/heartometer-tool";
import { SiteAtmosphere } from "@/components/site-atmosphere";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Try Heartometer",
  description:
    "Enter gender, alcohol status, blood pressure, sugar level, and age for a Heartometer prediction.",
};

export default function HeartometerPage() {
  return (
    <>
      <SiteAtmosphere />
      <SiteHeader />
      <main>
        <HeartometerTool />
      </main>
      <SiteFooter />
    </>
  );
}
