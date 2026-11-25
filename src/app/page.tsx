import { Hero } from "@/components/landing/hero";
import { LivePreview } from "@/components/landing/live-preview";
import { Modules } from "@/components/landing/modules";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { Workflow } from "@/components/landing/workflow";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Modules />
        <Workflow />
        <LivePreview />
      </main>
      <SiteFooter />
    </>
  );
}
