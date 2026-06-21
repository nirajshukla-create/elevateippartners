import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, type Locale } from "@/lib/i18n";
import SubpageHeader from "@/components/SubpageHeader";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "Accessibility Statement | ElevateIP Partners",
  description:
    "ElevateIP is committed to providing an accessible digital experience for all founders. Learn about our WCAG 2.1 AA conformance efforts.",
};

export default async function AccessibilityPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  const a = dict.accessibility;

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-plum">
      {/* ── Navbar ── */}
      <SubpageHeader backHref={`/${locale}`} backLabel={dict.nav.backToHome} />

      <PageTransition>
        <main className="flex-1">
          {/* ── Hero ── */}
          <div className="bg-gradient-to-br from-plum-50 via-white to-peach-50 border-b border-plum/8 px-6 py-10 md:py-14">
            <div className="max-w-3xl mx-auto">
              <p className="text-xs font-semibold uppercase tracking-widest text-magenta mb-3">
                {a.eyebrow}
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-plum leading-tight">
                {a.title}
              </h1>
              <p className="text-plum/50 text-sm mt-3">
                {a.lastUpdated}
              </p>
            </div>
          </div>

          {/* ── Content ── */}
          <div className="max-w-3xl mx-auto px-6 py-12 lg:py-16">
            <div className="flex flex-col gap-10">

              {/* 1. Our Commitment */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-magenta mb-4">
                  {a.commitment.heading}
                </h2>
                <p className="text-plum/70 text-base leading-8">
                  {a.commitment.p1}
                </p>
                <p className="text-plum/70 text-base leading-8 mt-4">
                  {a.commitment.p2}
                </p>
              </section>

              <hr className="border-plum/8" />

              {/* 2. Conformance Standard */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-magenta mb-4">
                  {a.conformance.heading}
                </h2>
                <p className="text-plum/70 text-base leading-8">
                  {a.conformance.intro}
                  <strong className="font-semibold text-plum">
                    {a.conformance.standard}
                  </strong>
                  {a.conformance.mid}
                </p>
                <p className="text-plum/70 text-base leading-8 mt-4">
                  {a.conformance.closing}
                </p>
              </section>

              <hr className="border-plum/8" />

              {/* 3. Implemented Accessibility Features */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-magenta mb-4">
                  {a.features.heading}
                </h2>
                <p className="text-plum/70 text-base leading-8">
                  {a.features.intro}
                </p>

                <div className="mt-6 flex flex-col gap-6">
                  {a.features.items.map(({ title, body }) => (
                    <div key={title} className="flex gap-4">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-magenta shrink-0" />
                      <div>
                        <h3 className="text-sm font-bold text-plum mb-1">{title}</h3>
                        <p className="text-sm text-plum/65 leading-7">{body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <hr className="border-plum/8" />

              {/* 4. Known Limitations */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-magenta mb-4">
                  {a.limitations.heading}
                </h2>
                <p className="text-plum/70 text-base leading-8">
                  {a.limitations.body}
                </p>
              </section>

              <hr className="border-plum/8" />

              {/* 5. Feedback & Reporting Barriers */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-magenta mb-4">
                  {a.feedback.heading}
                </h2>
                <p className="text-plum/70 text-base leading-8">
                  {a.feedback.intro}
                </p>
                <div className="mt-6 rounded-2xl bg-plum-50/60 border border-plum/8 p-6 flex flex-col gap-2">
                  <p className="text-sm font-semibold text-plum">
                    {a.feedback.calloutTitle}
                  </p>
                  <p className="text-sm text-plum/65 leading-7">
                    {a.feedback.calloutPre}
                    <a
                      href={`mailto:${a.feedback.email}`}
                      className="text-magenta hover:underline"
                    >
                      {a.feedback.email}
                    </a>
                    {a.feedback.calloutPost}
                  </p>
                </div>
              </section>

            </div>
          </div>
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}
