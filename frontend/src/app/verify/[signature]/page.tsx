import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteAtmosphere } from "@/components/site-atmosphere";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { VerifiedResult } from "@/components/verified-result";

export const metadata: Metadata = {
  title: "Verified result — Heartometer",
  description: "A Heartometer score card checked against its stored result.",
};

export default function VerifyPage({ params }: PageProps<"/verify/[signature]">) {
  return (
    <>
      <SiteAtmosphere />
      <SiteHeader />
      <main>
        <Suspense fallback={<p className="px-5 pt-40 text-center text-sm text-muted">Checking this result</p>}>
          <VerifiedResultLoader params={params} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

async function VerifiedResultLoader({ params }: { params: Promise<{ signature: string }> }) {
  const { signature } = await params;
  return <VerifiedResult signature={signature} />;
}
