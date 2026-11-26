import { CoreFeatures } from "@/components/landing/core-features";
import { DiasporaCta } from "@/components/landing/diaspora-cta";
import { Hero } from "@/components/landing/hero";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <CoreFeatures />
        <DiasporaCta />
      </main>
      <SiteFooter />
    </>
  );
}
