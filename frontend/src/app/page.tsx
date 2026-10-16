import { Demographics } from "@/components/demographics";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { SiteAtmosphere } from "@/components/site-atmosphere";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <SiteAtmosphere />
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
