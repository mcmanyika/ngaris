"use client";

import Image from "next/image";
import { Play } from "lucide-react";

import { ConsultationModal } from "@/components/landing/consultation-modal";
import { FeatureStrip } from "@/components/landing/feature-strip";
import { ProductTourModal } from "@/components/landing/product-tour-modal";

const HERO_BG = "#022848";
const HERO_GOLD = "#EDB254";

export function Hero() {
  return (
    <div className="flex min-h-dvh flex-col">
      <section
        id="home"
        className="relative flex flex-1 flex-col overflow-hidden text-white"
        style={{ backgroundColor: HERO_BG }}
      >
        {/* Backdrop extends under the transparent header — no seam */}
        <div className="absolute inset-0">
          <Image
            src="/brand/bg.png"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-center gap-6 px-4 pt-24 pb-8 sm:gap-8 sm:px-6 sm:pt-28 sm:pb-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-3 lg:px-8 lg:pb-12">
          <div className="max-w-xl">
            <p className="animate-fade-up text-[11px] font-semibold tracking-[0.2em] text-white/75 uppercase">
              Verified Providers · Managed Projects
            </p>
            <div
              className="animate-fade-up animation-delay-100 mt-3 h-px w-14"
              style={{ backgroundColor: HERO_GOLD }}
              aria-hidden
            />
            <h1 className="animate-fade-up animation-delay-100 mt-4 text-4xl leading-[1.08] font-bold tracking-tight sm:text-5xl lg:text-[3.25rem]">
              Build in Zimbabwe.
              <br />
              <span style={{ color: HERO_GOLD }}>Manage from Anywhere.</span>
            </h1>
            <p className="animate-fade-up animation-delay-200 mt-4 max-w-md text-sm leading-relaxed text-white/70 sm:text-[15px]">
              We help diaspora and local clients find verified service providers,
              choose the right team together, and manage the project end to end.
            </p>
            <div className="animate-fade-up animation-delay-300 mt-8 flex flex-wrap gap-3">
              <ConsultationModal
                trigger={
                  <button
                    type="button"
                    className="inline-flex h-11 items-center rounded-lg px-5 text-sm font-semibold transition-opacity hover:opacity-90"
                    style={{ backgroundColor: HERO_GOLD, color: HERO_BG }}
                  >
                    Start Your Project →
                  </button>
                }
              />
              <ProductTourModal
                trigger={
                  <button
                    type="button"
                    className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/35 px-5 text-sm font-medium text-white transition-colors hover:border-white/55 hover:bg-white/5"
                  >
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/45">
                      <Play className="h-2.5 w-2.5 fill-white" />
                    </span>
                    See How It Works
                  </button>
                }
              />
            </div>
          </div>

          <div className="animate-fade-up animation-delay-200 relative mx-auto w-full max-w-[680px] lg:mx-0 lg:ml-auto lg:max-w-none lg:translate-x-6 lg:origin-right lg:scale-[1.12] xl:translate-x-10">
            <Image
              src="/brand/laptop.png"
              alt="Ngaris Construction platform — providers, selection, and project oversight"
              width={1536}
              height={1024}
              priority
              className="h-auto w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.45)]"
              sizes="(max-width: 1024px) 94vw, 720px"
            />
          </div>
        </div>
      </section>

      <FeatureStrip />
    </div>
  );
}
