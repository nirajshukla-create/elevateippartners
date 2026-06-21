import type { Metadata } from "next";
import { Layers } from "lucide-react";
import ExpertsDirectory from "@/components/ExpertsDirectory";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import SubpageHeader from "@/components/SubpageHeader";
import { getDictionary, hasLocale, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "IP Experts Directory | ElevateIP Partners",
  description:
    "Find vetted intellectual property professionals across Canada connected through the ElevateIP national network.",
};

export default async function ExpertsPage({
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
      <SubpageHeader backHref={`/${locale}`} backLabel={dict.nav.backToHome} />

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
                    {dict.experts.intake.comingSoon}
                  </p>
                  <h3 className="text-2xl font-bold text-plum mb-2">
                    {dict.experts.intake.heading}
                  </h3>
                  <p className="text-plum/50 text-base leading-7 max-w-md mx-auto">
                    {dict.experts.intake.body}
                  </p>
                </div>
                <button
                  disabled
                  className="mt-2 px-6 py-3 rounded-full bg-plum/10 text-plum/40 font-semibold text-sm cursor-not-allowed"
                >
                  {dict.experts.intake.notify}
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
