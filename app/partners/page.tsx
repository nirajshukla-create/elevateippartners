import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import PartnersGrid from "@/components/PartnersGrid";

export const metadata: Metadata = {
  title: "Ecosystem Partners | ElevateIP Partners",
  description:
    "Canada's national network of IP support organizations — federal bodies, provincial agencies, and professional associations helping startups protect and leverage their intellectual property.",
};

export default function PartnersPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-plum">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-plum/8 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-plum/60 hover:text-plum transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <span className="font-bold text-plum text-xl tracking-tight">
            ElevateIP<span className="text-magenta"> Partners</span>
          </span>
        </div>
      </header>

      <main className="flex-1">
        <PageTransition>
          {/* ── Hero ── */}
          <section className="py-20 md:py-32 px-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white via-peach-50/40 to-white pointer-events-none" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[640px] h-[320px] rounded-full bg-gradient-to-br from-magenta-pale/40 to-peach-pale/30 blur-3xl pointer-events-none" />

            <div className="relative max-w-3xl mx-auto flex flex-col items-center gap-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-magenta">
                The National Network
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-plum leading-[1.08] tracking-tight">
                Ecosystem Partners
              </h1>
              <p className="text-base md:text-lg text-plum/55 leading-7 max-w-xl">
                Connecting Canadian startups with the national network of intellectual property
                support organizations.
              </p>
            </div>
          </section>

          {/* ── Grid ── */}
          <section className="pb-24 px-6">
            <div className="max-w-6xl mx-auto">
              <PartnersGrid />
            </div>
          </section>
        </PageTransition>
      </main>

      <Footer />
    </div>
  );
}
