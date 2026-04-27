import type { Metadata } from "next";
import ExpertsDirectory from "@/components/ExpertsDirectory";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "IP Experts Directory | ElevateIP Partners",
  description:
    "Find vetted intellectual property professionals across Canada connected through the ElevateIP national network.",
};

export default function ExpertsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-plum">
      {/* Minimal header */}
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
          <ExpertsDirectory />

          {/* Intake placeholder */}
          <section className="py-20 px-6 bg-plum-50/40">
            <div className="max-w-3xl mx-auto">
              <div className="rounded-3xl border-2 border-dashed border-plum/20 bg-white p-12 text-center flex flex-col items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-plum/10 to-magenta/10 flex items-center justify-center">
                  <Layers className="w-6 h-6 text-plum/40" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-plum/40 mb-2">
                    Coming Soon
                  </p>
                  <h3 className="text-2xl font-bold text-plum mb-2">
                    National Service Provider Intake
                  </h3>
                  <p className="text-plum/50 text-base leading-7 max-w-md mx-auto">
                    A centralized intake form for IP professionals and service providers to join the national ElevateIP network is currently in development.
                  </p>
                </div>
                <button
                  disabled
                  className="mt-2 px-6 py-3 rounded-full bg-plum/10 text-plum/40 font-semibold text-sm cursor-not-allowed"
                >
                  Notify Me When Available
                </button>
              </div>
            </div>
          </section>
        </PageTransition>
      </main>

      <Footer />
    </div>
  );
}
