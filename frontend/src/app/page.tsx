import { Demographics } from "@/components/demographics";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="grid-fade absolute inset-0" />
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
      </div>
      <SiteHeader />
      <main>
        <Hero />
        <HowItWorks />
        <Demographics />
      </main>
      <SiteFooter />
    </>
  );
}
