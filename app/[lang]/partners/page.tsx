import type { Metadata } from "next";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import PartnersGrid from "@/components/PartnersGrid";
import SubpageHeader from "@/components/SubpageHeader";
import { getDictionary, hasLocale, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Ecosystem Partners | ElevateIP Partners",
  description:
    "Canada's national network of IP support organizations — federal bodies, provincial agencies, and professional associations helping startups protect and leverage their intellectual property.",
};

export default async function PartnersPage({
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
          {/* ── Hero ── */}
          <section className="py-20 md:py-32 px-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white via-peach-50/40 to-white pointer-events-none" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[640px] h-[320px] rounded-full bg-gradient-to-br from-magenta-pale/40 to-peach-pale/30 blur-3xl pointer-events-none" />

            <div className="relative max-w-3xl mx-auto flex flex-col items-center gap-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-magenta">
                {dict.partners.eyebrow}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-plum leading-[1.08] tracking-tight">
                {dict.partners.heading}
              </h1>
              <p className="text-base md:text-lg text-plum/55 leading-7 max-w-xl">
                {dict.partners.body}
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
