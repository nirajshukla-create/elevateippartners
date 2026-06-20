import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, type Locale } from "@/lib/i18n";
import LanguageToggle from "@/components/LanguageToggle";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "Privacy Policy | ElevateIP Partners",
  description:
    "Learn how ElevateIP collects, uses, and protects information submitted through the ElevateIP National Portal.",
};

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  const p = dict.privacy;

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-plum">
      {/* ── Navbar ── */}
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

      <PageTransition>
        <main className="flex-1">
          {/* ── Hero ── */}
          <div className="bg-gradient-to-br from-plum-50 via-white to-peach-50 border-b border-plum/8 px-6 py-10 md:py-14">
            <div className="max-w-3xl mx-auto">
              <p className="text-xs font-semibold uppercase tracking-widest text-magenta mb-3">
                {p.eyebrow}
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-plum leading-tight">
                {p.title}
              </h1>
              <p className="text-plum/50 text-sm mt-3">
                {p.lastUpdated}
              </p>
            </div>
          </div>

          {/* ── Content ── */}
          <div className="max-w-3xl mx-auto px-6 py-12 lg:py-16">
            <div className="prose-custom flex flex-col gap-10">

              {/* 1. Introduction */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-magenta mb-4">
                  {p.intro.heading}
                </h2>
                <p className="text-plum/70 text-base leading-8">
                  {p.intro.p1}
                </p>
                <p className="text-plum/70 text-base leading-8 mt-4">
                  {p.intro.p2pre}
                  <em>{p.intro.p2law1}</em>
                  {p.intro.p2mid}
                  <em>{p.intro.p2law2}</em>
                  {p.intro.p2post}
                </p>
              </section>

              <hr className="border-plum/8" />

              {/* 2. Information Collection */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-magenta mb-4">
                  {p.collection.heading}
                </h2>
                <h3 className="text-base font-bold text-plum mb-3">
                  {p.collection.voluntaryHeading}
                </h3>
                <p className="text-plum/70 text-base leading-8">
                  {p.collection.voluntaryIntro}
                </p>
                <ul className="mt-4 flex flex-col gap-2 pl-5 list-disc marker:text-magenta/50">
                  {p.collection.voluntaryItems.map((item) => (
                    <li key={item} className="text-plum/70 text-sm leading-7 pl-1">
                      {item}
                    </li>
                  ))}
                </ul>

                <h3 className="text-base font-bold text-plum mt-8 mb-3">
                  {p.collection.metaHeading}
                </h3>
                <p className="text-plum/70 text-base leading-8">
                  {p.collection.metaIntro}
                </p>
                <ul className="mt-4 flex flex-col gap-2 pl-5 list-disc marker:text-magenta/50">
                  {p.collection.metaItems.map((item) => (
                    <li key={item} className="text-plum/70 text-sm leading-7 pl-1">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-plum/70 text-sm leading-7 mt-4">
                  {p.collection.cookieNote}
                </p>
              </section>

              <hr className="border-plum/8" />

              {/* 3. Data Routing & Usage */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-magenta mb-4">
                  {p.dataRouting.heading}
                </h2>
                <p className="text-plum/70 text-base leading-8">
                  {p.dataRouting.intro}
                </p>
                <div className="mt-6 rounded-2xl bg-plum-50/60 border border-plum/8 p-6">
                  <p className="text-plum/80 text-sm leading-7">
                    {p.dataRouting.callout}
                  </p>
                </div>
                <p className="text-plum/70 text-base leading-8 mt-6">
                  {p.dataRouting.closing}
                </p>
              </section>

              <hr className="border-plum/8" />

              {/* 4. Security */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-magenta mb-4">
                  {p.security.heading}
                </h2>
                <p className="text-plum/70 text-base leading-8">
                  {p.security.intro}
                </p>
                <ul className="mt-4 flex flex-col gap-2 pl-5 list-disc marker:text-magenta/50">
                  {p.security.items.map((item) => (
                    <li key={item} className="text-plum/70 text-sm leading-7 pl-1">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-plum/70 text-base leading-8 mt-6">
                  {p.security.closing}
                </p>
              </section>

              <hr className="border-plum/8" />

              {/* 5. Retention */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-magenta mb-4">
                  {p.retention.heading}
                </h2>
                <p className="text-plum/70 text-base leading-8">
                  {p.retention.body}
                </p>
              </section>

              <hr className="border-plum/8" />

              {/* 6. Changes */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-magenta mb-4">
                  {p.changes.heading}
                </h2>
                <p className="text-plum/70 text-base leading-8">
                  {p.changes.body}
                </p>
              </section>

              <hr className="border-plum/8" />

              {/* 7. Contact */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-magenta mb-4">
                  {p.contact.heading}
                </h2>
                <p className="text-plum/70 text-base leading-8">
                  {p.contact.pre}
                  <a
                    href={`mailto:${p.contact.email}`}
                    className="text-magenta hover:underline"
                  >
                    {p.contact.email}
                  </a>
                  {p.contact.post}
                </p>
              </section>

            </div>
          </div>
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}
