import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Globe,
  Mail,
  CheckCircle2,
  Building2,
  Award,
  Layers,
} from "lucide-react";
import expertsData from "@/data/experts.json";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import LanguageToggle from "@/components/LanguageToggle";
import { getDictionary, hasLocale, type Locale } from "@/lib/i18n";

/* ─── Types ──────────────────────────────────────────── */
interface Expert {
  id: string;
  slug: string;
  firm_name: string;
  logo_url: string;
  website_url: string;
  bio_summary: string;
  bio_summary_fr?: string;
  national_partner: string;
  provinces_covered: string[];
  office_city: string;
  office_province: string;
  tier_2_strategy: boolean;
  tier_3_implementation: boolean;
  specialties: string[];
  industries: string[];
  contact_email: string;
  services_strategy: string;
  services_strategy_fr?: string;
  services_implementation: string;
  services_implementation_fr?: string;
}

const experts = expertsData as Expert[];

const SPECIALTY_STYLES: Record<string, string> = {
  Patents:                "bg-blue-50   text-blue-700   border-blue-100",
  Trademarks:             "bg-emerald-50 text-emerald-700 border-emerald-100",
  "Trade Secrets":        "bg-violet-50  text-violet-700  border-violet-100",
  Copyright:              "bg-orange-50  text-orange-700  border-orange-100",
  Licensing:              "bg-teal-50    text-teal-700    border-teal-100",
  "IP Strategy":          "bg-plum-pale  text-plum        border-plum/20",
  Commercialization:      "bg-yellow-50  text-yellow-700  border-yellow-100",
  "Technology Transfer":  "bg-indigo-50  text-indigo-700  border-indigo-100",
  "Life Sciences":        "bg-rose-50    text-rose-700    border-rose-100",
  "Software IP":          "bg-cyan-50    text-cyan-700    border-cyan-100",
  "Industrial Design":    "bg-amber-50   text-amber-700   border-amber-100",
  "IP Audits":            "bg-slate-50   text-slate-600   border-slate-200",
  "Due Diligence":        "bg-zinc-50    text-zinc-600    border-zinc-200",
};

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

  const isFr = locale === "fr";
  const bio             = isFr && expert.bio_summary_fr             ? expert.bio_summary_fr             : expert.bio_summary;
  const servicesStrat   = isFr && expert.services_strategy_fr       ? expert.services_strategy_fr       : expert.services_strategy;
  const servicesImpl    = isFr && expert.services_implementation_fr  ? expert.services_implementation_fr  : expert.services_implementation;

  const initials = expert.firm_name
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-plum">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-plum/8 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
          <Link
            href={`/${locale}/experts`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-plum/60 hover:text-plum transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {dict.nav.backToDirectory}
          </Link>
          <span className="font-bold text-plum text-xl tracking-tight">
            ElevateIP<span className="text-magenta"> Partners</span>
          </span>
          <LanguageToggle />
        </div>
      </header>

      <PageTransition>
        <main className="flex-1">
          {/* ── Hero header ── */}
          <div className="bg-gradient-to-br from-plum-50 via-white to-peach-50 border-b border-plum/8 px-6 py-10 md:py-14">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {expert.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={expert.logo_url}
                  alt={expert.firm_name}
                  className="w-24 h-24 object-contain rounded-2xl border border-plum/8 bg-white p-2 shadow-sm shrink-0"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-plum to-magenta flex items-center justify-center shrink-0 shadow-md">
                  <span className="text-white font-bold text-3xl tracking-tight">{initials}</span>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-magenta/10 text-magenta text-xs font-semibold">
                    <Award className="w-3.5 h-3.5" />
                    {p.vettedBy} {expert.national_partner}
                  </span>
                  {expert.tier_2_strategy && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-plum/8 text-plum text-xs font-semibold border border-plum/12">
                      <span className="w-1.5 h-1.5 rounded-full bg-peach" />
                      {p.ipStrategy}
                    </span>
                  )}
                  {expert.tier_3_implementation && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-plum/8 text-plum text-xs font-semibold border border-plum/12">
                      <span className="w-1.5 h-1.5 rounded-full bg-peach" />
                      {p.ipImplementation}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-plum leading-tight">
                  {expert.firm_name}
                </h1>
                <span className="flex items-center gap-1.5 text-sm text-plum/50 font-medium">
                  <MapPin className="w-4 h-4 text-magenta/60" />
                  {expert.office_city},{" "}
                  {provinceNames[expert.office_province] ?? expert.office_province}
                </span>
              </div>
            </div>
          </div>

          {/* ── Body: 2-col grid ── */}
          <div className="max-w-5xl mx-auto px-6 py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* ── Left / Main content ── */}
            <div className="lg:col-span-2 flex flex-col gap-10 order-2 lg:order-1">

              {/* About */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-magenta mb-4">
                  {p.about}
                </h2>
                <p className="text-plum/70 text-base leading-8">{bio}</p>
              </section>

              {/* IP Strategy Services */}
              {expert.tier_2_strategy && servicesStrat && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-plum/8 flex items-center justify-center">
                      <Layers className="w-4 h-4 text-plum" />
                    </div>
                    <h2 className="text-lg font-bold text-plum">{p.ipStrategyServices}</h2>
                  </div>
                  <div className="pl-10">
                    <p className="text-plum/65 text-sm leading-7">{servicesStrat}</p>
                  </div>
                </section>
              )}

              {/* IP Implementation Services */}
              {expert.tier_3_implementation && servicesImpl && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-peach-pale flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-peach" />
                    </div>
                    <h2 className="text-lg font-bold text-plum">{p.ipImplementationServices}</h2>
                  </div>
                  <div className="pl-10">
                    <p className="text-plum/65 text-sm leading-7">{servicesImpl}</p>
                  </div>
                </section>
              )}

              {/* Specialties */}
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

              {/* Industries */}
              {expert.industries.length > 0 && (
                <section>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-magenta mb-4">
                    {p.industriesServed}
                  </h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {expert.industries.map((ind) => (
                      <li key={ind} className="flex items-center gap-2.5 text-sm text-plum/65">
                        <span className="w-1.5 h-1.5 rounded-full bg-peach shrink-0" />
                        {ind}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {/* ── Right / Sidebar ── */}
            <aside className="flex flex-col gap-5 order-1 lg:order-2">

              {/* Contact CTA card */}
              <div className="rounded-3xl bg-plum p-7 flex flex-col gap-4 shadow-md">
                <p className="text-white/70 text-sm leading-6">{p.contactPrompt}</p>
                {expert.contact_email && (
                  <a
                    href={`mailto:${expert.contact_email}`}
                    className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-white text-plum text-sm font-bold hover:bg-peach-50 transition-colors shadow-sm"
                  >
                    <Mail className="w-4 h-4" />
                    {p.contactFirm}
                  </a>
                )}
                <a
                  href={expert.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-2xl border border-white/20 text-white/80 text-sm font-semibold hover:bg-white/10 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  {p.visitWebsite}
                </a>
              </div>

              {/* Quick facts card */}
              <div className="rounded-3xl border border-plum/10 bg-plum-50/40 p-7 flex flex-col gap-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-plum/40">
                  {p.quickFacts}
                </h3>

                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-4 h-4 text-magenta/60 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-plum/40 font-medium mb-0.5">{p.office}</p>
                      <p className="text-sm text-plum font-semibold">
                        {expert.office_city},{" "}
                        {provinceNames[expert.office_province] ?? expert.office_province}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-magenta/60 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-plum/40 font-medium mb-1.5">{p.provincesServed}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {expert.provinces_covered.map((code) => (
                          <span
                            key={code}
                            className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white border border-plum/10 text-plum/70"
                          >
                            {code}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Award className="w-4 h-4 text-magenta/60 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-plum/40 font-medium mb-0.5">{p.elevateipPartner}</p>
                      <p className="text-sm text-plum font-semibold">{expert.national_partner}</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}
