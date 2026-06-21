import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import expertsData from "@/data/experts.json";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import SubpageHeader from "@/components/SubpageHeader";
import { getDictionary, hasLocale, type Locale } from "@/lib/i18n";

/* ─── Types ──────────────────────────────────────────── */
interface Expert {
  slug: string;
  firm_name: string;
  office_city: string;
  office_province: string;
  bio_summary: string;
  contact_name?: string;
  phone_number?: string;
  contact_email: string;
  website_url: string;
  specialties: string[];
}

const SPECIALTY_STYLES: Record<string, string> = {
  Patents:               "bg-blue-50    text-blue-700    border-blue-100",
  Trademarks:            "bg-emerald-50  text-emerald-700  border-emerald-100",
  "Trade Secrets":       "bg-violet-50   text-violet-700   border-violet-100",
  Copyright:             "bg-orange-50   text-orange-700   border-orange-100",
  Licensing:             "bg-teal-50     text-teal-700     border-teal-100",
  "IP Strategy":         "bg-plum-pale   text-plum         border-plum/20",
  Commercialization:     "bg-yellow-50   text-yellow-700   border-yellow-100",
  "Technology Transfer": "bg-indigo-50   text-indigo-700   border-indigo-100",
  "Life Sciences":       "bg-rose-50     text-rose-700     border-rose-100",
  "Software IP":         "bg-cyan-50     text-cyan-700     border-cyan-100",
  "Industrial Design":   "bg-amber-50    text-amber-700    border-amber-100",
  "IP Audits":           "bg-slate-50    text-slate-600    border-slate-200",
  "Due Diligence":       "bg-zinc-50     text-zinc-600     border-zinc-200",
};

const experts = expertsData as Expert[];

/* ─── Static generation ──────────────────────────────── */
export function generateStaticParams() {
  return experts.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const expert = experts.find((e) => e.slug === slug);
  if (!expert) return { title: "Expert Not Found | ElevateIP Partners" };
  return {
    title: `${expert.firm_name} | ElevateIP IP Experts`,
    description: expert.bio_summary,
  };
}

/* ─── Page ───────────────────────────────────────────── */
export default async function ExpertProfilePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  const p = dict.expertProfile;
  const provinceNames = dict.provinceNames as Record<string, string>;

  const expert = experts.find((e) => e.slug === slug);
  if (!expert) notFound();

  const locationParts = [
    expert.office_city,
    (provinceNames[expert.office_province] ?? expert.office_province) || undefined,
  ].filter(Boolean) as string[];

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-plum">
      {/* ── Navbar ── */}
      <SubpageHeader backHref={`/${locale}/experts`} backLabel={dict.nav.backToDirectory} />

      <PageTransition>
        <main className="flex-1">
          {/* ── Hero ── */}
          <div className="bg-gradient-to-br from-plum-50 via-white to-peach-50 border-b border-plum/8 px-6 py-10 md:py-14">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl sm:text-4xl font-bold text-plum leading-tight mb-2">
                {expert.firm_name}
              </h1>
              {locationParts.length > 0 && (
                <span className="flex items-center gap-1.5 text-sm text-plum/50 font-medium">
                  <MapPin className="w-4 h-4 text-magenta/60" />
                  {locationParts.join(", ")}
                </span>
              )}
            </div>
          </div>

          {/* ── Body ── */}
          <div className="max-w-3xl mx-auto px-6 py-10 lg:py-14 flex flex-col gap-10">

            {/* About */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-magenta mb-4">
                {p.about}
              </h2>
              <p className="text-plum/70 text-base leading-8">{expert.bio_summary}</p>
            </section>

            {/* Contact block + disclaimer */}
            <section className="border-t border-plum/8 pt-8">
              <div className="flex flex-col gap-3">
                {expert.contact_name && (
                  <div className="flex items-baseline gap-4">
                    <span className="text-xs font-semibold uppercase tracking-widest text-plum/40 w-24 shrink-0">
                      {p.contactName}
                    </span>
                    <span className="text-sm text-plum">{expert.contact_name}</span>
                  </div>
                )}
                {expert.phone_number && (
                  <div className="flex items-baseline gap-4">
                    <span className="text-xs font-semibold uppercase tracking-widest text-plum/40 w-24 shrink-0">
                      {p.telephone}
                    </span>
                    <span className="text-sm text-plum">{expert.phone_number}</span>
                  </div>
                )}
                {expert.contact_email && (
                  <div className="flex items-baseline gap-4">
                    <span className="text-xs font-semibold uppercase tracking-widest text-plum/40 w-24 shrink-0">
                      {p.email}
                    </span>
                    <a
                      href={`mailto:${expert.contact_email}`}
                      className="text-sm text-magenta hover:underline"
                    >
                      {expert.contact_email}
                    </a>
                  </div>
                )}
                {expert.website_url && (
                  <div className="flex items-baseline gap-4">
                    <span className="text-xs font-semibold uppercase tracking-widest text-plum/40 w-24 shrink-0">
                      {p.website}
                    </span>
                    <a
                      href={expert.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-magenta hover:underline break-all"
                    >
                      {expert.website_url}
                    </a>
                  </div>
                )}
                {expert.office_province && (
                  <div className="flex items-baseline gap-4">
                    <span className="text-xs font-semibold uppercase tracking-widest text-plum/40 w-24 shrink-0">
                      {p.province}
                    </span>
                    <span className="text-sm text-plum">
                      {provinceNames[expert.office_province] ?? expert.office_province}
                    </span>
                  </div>
                )}
              </div>
              <p className="mt-6 text-xs text-gray-500 italic">{p.disclaimer}</p>
            </section>

            {/* Specialties */}
            {expert.specialties.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-magenta mb-4">
                  {p.specialties}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {expert.specialties.map((s) => {
                    const style = SPECIALTY_STYLES[s] ?? "bg-plum-50 text-plum/70 border-plum/10";
                    return (
                      <span
                        key={s}
                        className={`inline-block text-sm font-medium px-4 py-1.5 rounded-full border ${style}`}
                      >
                        {s}
                      </span>
                    );
                  })}
                </div>
              </section>
            )}

          </div>
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}
