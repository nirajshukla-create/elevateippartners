"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, MapPin, ArrowRight, X, RotateCcw } from "lucide-react";
import expertsData from "@/data/experts.json";
import { useLanguage } from "@/components/LanguageProvider";

/* ─── Types ──────────────────────────────────────────── */
interface Expert {
  slug: string;
  firm_name: string;
  office_city: string;
  office_province: string;
  bio_summary: string;
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

const DEFAULT_SPECIALTY_STYLE = "bg-plum-50 text-plum/70 border-plum/10";

function SpecialtyPill({ label }: { label: string }) {
  const style = SPECIALTY_STYLES[label] ?? DEFAULT_SPECIALTY_STYLE;
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border ${style} whitespace-nowrap`}>
      {label}
    </span>
  );
}

const experts = expertsData as Expert[];

/* ─── Card ───────────────────────────────────────────── */
function ExpertCard({
  expert,
  index,
  viewProfileLabel,
  moreLabel,
  profileHref,
}: {
  expert: Expert;
  index: number;
  viewProfileLabel: string;
  moreLabel: string;
  profileHref: string;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05, duration: 0.4, ease: "easeOut" as const } }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Link
        href={profileHref}
        className="group bg-white rounded-3xl border border-plum/8 shadow-sm hover:shadow-xl hover:border-plum/16 transition-all duration-300 flex flex-col overflow-hidden h-full"
      >
        <div className="p-7 flex flex-col gap-4 flex-1">
          <div>
            <h3 className="text-base font-bold text-plum leading-snug group-hover:text-magenta transition-colors">
              {expert.firm_name}
            </h3>
            {(expert.office_city || expert.office_province) && (
              <span className="flex items-center gap-1 text-xs text-plum/45 font-medium mt-1">
                <MapPin className="w-3 h-3 shrink-0" aria-hidden="true" />
                {[expert.office_city, expert.office_province].filter(Boolean).join(", ")}
              </span>
            )}
          </div>
          <p className="text-sm text-plum/55 leading-6 line-clamp-3">{expert.bio_summary}</p>

          {expert.specialties.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {expert.specialties.slice(0, 3).map((s) => <SpecialtyPill key={s} label={s} />)}
              {expert.specialties.length > 3 && (
                <span className="text-xs font-medium text-plum/40 px-2 py-1">
                  +{expert.specialties.length - 3} {moreLabel}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="px-7 py-4 border-t border-plum/6 bg-plum-50/40 flex items-center justify-between">
          <span className="text-sm font-semibold text-plum group-hover:text-magenta transition-colors">
            {viewProfileLabel}
          </span>
          <ArrowRight className="w-4 h-4 text-plum/30 group-hover:text-magenta group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Main component ─────────────────────────────────── */
export default function ExpertsDirectory() {
  const { locale, dict } = useLanguage();
  const t = dict.experts;

  const [search, setSearch] = useState("");

  const hasFilters = !!search;

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return experts.filter((e) =>
      !search ||
      e.firm_name.toLowerCase().includes(term) ||
      e.bio_summary.toLowerCase().includes(term) ||
      e.office_city.toLowerCase().includes(term) ||
      e.specialties.some((s) => s.toLowerCase().includes(term))
    );
  }, [search]);

  const firmCount = `${filtered.length} ${filtered.length === 1 ? t.firmFound : t.firmsFound}`;

  return (
    <section id="experts" className="py-16 md:py-28 px-6 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-magenta mb-3">
            {t.eyebrow}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-plum leading-tight mb-4">
            {t.heading}
          </h2>
          <p className="text-plum/50 text-base max-w-lg mx-auto leading-7">
            {t.subheading}
          </p>
        </div>

        {/* Search bar */}
        <div className="bg-white rounded-3xl border border-plum/10 shadow-sm p-5 mb-10">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-plum/35 pointer-events-none" aria-hidden="true" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                aria-label={t.searchPlaceholder}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-plum/15 bg-white text-sm text-plum placeholder:text-plum/35 focus:outline-none focus:ring-2 focus:ring-plum/20 focus:border-plum/40 transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-plum/30 hover:text-plum/60 transition-colors"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>
            <span className="text-xs text-plum/40 font-medium shrink-0">{firmCount}</span>
            {hasFilters && (
              <button
                onClick={() => setSearch("")}
                className="inline-flex items-center gap-1.5 text-xs text-plum/50 hover:text-plum font-medium transition-colors shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                {t.resetFilters}
              </button>
            )}
          </div>
        </div>

        {/* Card grid */}
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div key="grid" layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {filtered.map((expert, i) => (
                  <ExpertCard
                    key={expert.slug}
                    expert={expert}
                    index={i}
                    viewProfileLabel={t.viewProfile}
                    moreLabel={t.moreSpecialties}
                    profileHref={`/${locale}/experts/${expert.slug}`}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-plum-50 flex items-center justify-center mb-5" aria-hidden="true">
                <Search className="w-7 h-7 text-plum/30" />
              </div>
              <h3 className="text-xl font-bold text-plum mb-2">{t.noExpertsFound}</h3>
              <p className="text-plum/45 text-sm max-w-xs leading-6 mb-6">{t.noExpertsBody}</p>
              <button
                onClick={() => setSearch("")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-plum text-white text-sm font-semibold hover:bg-plum-dark transition-colors shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                {t.resetAllFilters}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
