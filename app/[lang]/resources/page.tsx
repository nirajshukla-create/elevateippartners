import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ResourcesGrid from "@/components/ResourcesGrid";
import LanguageToggle from "@/components/LanguageToggle";
import { getDictionary, hasLocale, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "National Resources | ElevateIP Partners",
  description:
    "Nationally available IP tools and resources — freely accessible to every founder in the ElevateIP ecosystem, no matter where you are in Canada.",
};

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const locale = lang as Locale;
  const dict = await getDictionary(locale);

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-plum">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-plum/8 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-plum/60 hover:text-plum transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {dict.nav.backToHome}
          </Link>
          <span className="font-bold text-plum text-xl tracking-tight">
            ElevateIP<span className="text-magenta"> Partners</span>
          </span>
          <LanguageToggle />
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
                {dict.resources.eyebrow}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-plum leading-[1.08] tracking-tight">
                {dict.resources.heading}
              </h1>
              <p className="text-base md:text-lg text-plum/55 leading-7 max-w-xl">
                {dict.resources.body}
              </p>
            </div>
          </section>

          {/* ── Cards ── */}
          <section className="pb-24 px-6">
            <div className="max-w-4xl mx-auto">
              <ResourcesGrid />
            </div>
          </section>
        </PageTransition>
      </main>

      <Footer />
    </div>
  );
}
