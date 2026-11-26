import type { Metadata } from "next";

import { AboutIntro } from "@/components/landing/about-intro";
import { DiasporaCta } from "@/components/landing/diaspora-cta";
import { ManagementCards } from "@/components/landing/management-cards";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Meet the Ngaris Construction leadership — verifying providers, selecting with clients, and managing Zimbabwe projects for diaspora and local owners.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <AboutIntro />
        <ManagementCards />
        <div className="bg-[#F4F7FA]">
          <DiasporaCta />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
