"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  MapPin,
  ArrowRight,
  X,
  RotateCcw,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import expertsData from "@/data/experts.json";

/* ─── Types ──────────────────────────────────────────── */
interface Expert {
  id: string;
  slug: string;
  firm_name: string;
  logo_url: string;
  website_url: string;
  bio_summary: string;
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
  services_implementation: string;
}

const experts = expertsData as Expert[];

/* ─── Static lookup tables ───────────────────────────── */
const PROVINCE_NAMES: Record<string, string> = {
  AB: "Alberta",
  BC: "British Columbia",
  MB: "Manitoba",
  NB: "New Brunswick",
  NL: "Newfoundland and Labrador",
  NS: "Nova Scotia",
  NT: "Northwest Territories",
  NU: "Nunavut",
  ON: "Ontario",
  PE: "Prince Edward Island",
  QC: "Quebec",
  SK: "Saskatchewan",
  YT: "Yukon",
};

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

const ALL_PARTNERS = [...new Set(experts.map((e) => e.national_partner))].sort();
const ALL_PROVINCE_CODES = [...new Set(experts.flatMap((e) => e.provinces_covered))].sort();

/* ─── Sub-components ─────────────────────────────────── */
function FirmInitials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-plum to-magenta flex items-center justify-center shrink-0">
      <span className="text-white font-bold text-lg tracking-tight">{initials}</span>
    </div>
  );
}

function SpecialtyPill({ label }: { label: string }) {
  const style = SPECIALTY_STYLES[label] ?? DEFAULT_SPECIALTY_STYLE;
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border ${style} whitespace-nowrap`}>
      {label}
    </span>
  );
}

function ServiceBadge({ label, active }: { label: string; active: boolean }) {
  if (!active) return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-plum/8 text-plum border border-plum/12">
      <span className="w-1.5 h-1.5 rounded-full bg-magenta" />
      {label}
    </span>
  );
}

function ExpertCard({ expert, index }: { expert: Expert; index: number }) {
  const visibleSpecialties = expert.specialties.slice(0, 3);
  const overflow = expert.specialties.length - 3;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05, duration: 0.4, ease: "easeOut" as const } }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Link
        href={`/experts/${expert.slug}`}
        className="group bg-white rounded-3xl border border-plum/8 shadow-sm hover:shadow-xl hover:border-plum/16 transition-all duration-300 flex flex-col overflow-hidden h-full"
      >
        <div className="p-7 flex flex-col gap-4 flex-1">
          {/* Header */}
          <div className="flex items-start gap-4">
            {expert.logo_url ? (
              <div className="relative w-14 h-14 rounded-xl border border-plum/8 overflow-hidden shrink-0">
                <Image
                  src={expert.logo_url}
                  alt={expert.firm_name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain"
                  unoptimized
                />
              </div>
            ) : (
              <FirmInitials name={expert.firm_name} />
            )}
            <div className="flex flex-col gap-0.5 min-w-0">
              <h3 className="text-base font-bold text-plum leading-snug group-hover:text-magenta transition-colors">
                {expert.firm_name}
              </h3>
              <span className="flex items-center gap-1 text-xs text-plum/45 font-medium">
                <MapPin className="w-3 h-3 shrink-0" />
                {expert.office_city},{" "}
                {PROVINCE_NAMES[expert.office_province] ?? expert.office_province}
              </span>
              <span className="text-xs text-magenta/70 font-medium mt-0.5">
                {expert.national_partner}
              </span>
            </div>
          </div>

          <p className="text-sm text-plum/55 leading-6 line-clamp-3">{expert.bio_summary}</p>

          <div className="flex flex-wrap gap-2">
            <ServiceBadge label="IP Strategy"        active={expert.tier_2_strategy} />
            <ServiceBadge label="IP Implementation"  active={expert.tier_3_implementation} />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {visibleSpecialties.map((s) => <SpecialtyPill key={s} label={s} />)}
            {overflow > 0 && (
              <span className="text-xs font-medium text-plum/40 px-2 py-1">+{overflow} more</span>
            )}
          </div>
        </div>

        <div className="px-7 py-4 border-t border-plum/6 bg-plum-50/40 flex items-center justify-between">
          <span className="text-sm font-semibold text-plum group-hover:text-magenta transition-colors">
            View Profile
          </span>
          <ArrowRight className="w-4 h-4 text-plum/30 group-hover:text-magenta group-hover:translate-x-0.5 transition-all" />
        </div>
      </Link>
    </motion.div>
  );
}

function TogglePill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
        active
          ? "bg-plum text-white border-plum shadow-md"
          : "bg-white text-plum/60 border-plum/15 hover:border-plum/30 hover:text-plum"
      }`}
    >
      <span className={`w-2 h-2 rounded-full transition-colors ${active ? "bg-peach-light" : "bg-plum/20"}`} />
      {label}
    </button>
  );
}

function StyledSelect({
  value, onChange, placeholder, options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full pl-4 pr-9 py-2.5 rounded-xl border border-plum/15 bg-white text-sm text-plum font-medium hover:border-plum/30 focus:outline-none focus:border-plum/40 transition-colors cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-plum/40" />
    </div>
  );
}

/* ─── Main component ─────────────────────────────────── */
export default function ExpertsDirectory() {
  const [search,      setSearch]      = useState("");
  const [province,    setProvince]    = useState("");
  const [tier2,       setTier2]       = useState(false);
  const [tier3,       setTier3]       = useState(false);
  const [partner,     setPartner]     = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const hasFilters = search || province || tier2 || tier3 || partner;
  const activeFilterCount = [province, partner, tier2, tier3].filter(Boolean).length;

  const resetFilters = () => {
    setSearch(""); setProvince(""); setTier2(false); setTier3(false); setPartner("");
  };

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return experts.filter((e) => {
      const matchSearch   = !search  || e.firm_name.toLowerCase().includes(term) || e.bio_summary.toLowerCase().includes(term) || e.office_city.toLowerCase().includes(term) || e.specialties.some((s) => s.toLowerCase().includes(term));
      const matchProvince = !province || e.provinces_covered.includes(province);
      const matchTier2    = !tier2    || e.tier_2_strategy;
      const matchTier3    = !tier3    || e.tier_3_implementation;
      const matchPartner  = !partner  || e.national_partner === partner;
      return matchSearch && matchProvince && matchTier2 && matchTier3 && matchPartner;
    });
  }, [search, province, tier2, tier3, partner]);

  return (
    <section id="experts" className="py-16 md:py-28 px-6 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Section heading */}
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-magenta mb-3">
            Service Provider Directory
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-plum leading-tight mb-4">
            National IP Experts
          </h2>
          <p className="text-plum/50 text-base max-w-lg mx-auto leading-7">
            Vetted intellectual property professionals connected through the ElevateIP national
            network. Find the right expert for your stage and region.
          </p>
        </div>

        {/* ── Filter bar ── */}
        <div className="bg-white rounded-3xl border border-plum/10 shadow-sm p-5 mb-10 flex flex-col gap-4">

          {/* Row 1: Search + mobile filter toggle */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-plum/35 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by firm name, specialty, or city…"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-plum/15 bg-white text-sm text-plum placeholder:text-plum/35 focus:outline-none focus:border-plum/40 transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-plum/30 hover:text-plum/60 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile filter toggle — hidden on sm+ */}
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className="sm:hidden shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-plum/15 bg-white text-sm text-plum font-medium hover:border-plum/30 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-plum/50" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-plum text-white text-[11px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile filter drawer (Province + Partner) */}
          <AnimatePresence initial={false}>
            {filtersOpen && (
              <motion.div
                key="mobile-drawer"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="sm:hidden overflow-hidden"
              >
                <div className="flex flex-col gap-3 pt-1">
                  <StyledSelect
                    value={province}
                    onChange={setProvince}
                    placeholder="All Provinces"
                    options={ALL_PROVINCE_CODES.map((code) => ({
                      value: code,
                      label: PROVINCE_NAMES[code] ?? code,
                    }))}
                  />
                  <StyledSelect
                    value={partner}
                    onChange={setPartner}
                    placeholder="All Partners"
                    options={ALL_PARTNERS.map((p) => ({ value: p, label: p }))}
                  />
                  {/* Service toggles inside drawer on mobile */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <TogglePill label="IP Strategy"       active={tier2} onClick={() => setTier2((v) => !v)} />
                    <TogglePill label="IP Implementation" active={tier3} onClick={() => setTier3((v) => !v)} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop filter row: Province + Partner (hidden on mobile) */}
          <div className="hidden sm:flex gap-3">
            <div className="w-52">
              <StyledSelect
                value={province}
                onChange={setProvince}
                placeholder="All Provinces"
                options={ALL_PROVINCE_CODES.map((code) => ({
                  value: code,
                  label: PROVINCE_NAMES[code] ?? code,
                }))}
              />
            </div>
            <div className="w-52">
              <StyledSelect
                value={partner}
                onChange={setPartner}
                placeholder="All Partners"
                options={ALL_PARTNERS.map((p) => ({ value: p, label: p }))}
              />
            </div>
          </div>

          {/* Desktop service toggles + result count (hidden on mobile) */}
          <div className="hidden sm:flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <TogglePill label="IP Strategy"       active={tier2} onClick={() => setTier2((v) => !v)} />
              <TogglePill label="IP Implementation" active={tier3} onClick={() => setTier3((v) => !v)} />
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <span className="text-xs text-plum/40 font-medium">
                {filtered.length} {filtered.length === 1 ? "firm" : "firms"} found
              </span>
              {hasFilters && (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 text-xs text-plum/50 hover:text-plum font-medium transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset filters
                </button>
              )}
            </div>
          </div>

          {/* Mobile result count + reset (hidden on sm+) */}
          <div className="sm:hidden flex items-center justify-between gap-4">
            <span className="text-xs text-plum/40 font-medium">
              {filtered.length} {filtered.length === 1 ? "firm" : "firms"} found
            </span>
            {hasFilters && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 text-xs text-plum/50 hover:text-plum font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* ── Card grid ── */}
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div
              key="grid"
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((expert, i) => (
                  <ExpertCard key={expert.id} expert={expert} index={i} />
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
              <div className="w-16 h-16 rounded-2xl bg-plum-50 flex items-center justify-center mb-5">
                <Search className="w-7 h-7 text-plum/30" />
              </div>
              <h3 className="text-xl font-bold text-plum mb-2">No experts found</h3>
              <p className="text-plum/45 text-sm max-w-xs leading-6 mb-6">
                No firms match your current filters. Try adjusting your search or broadening your criteria.
              </p>
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-plum text-white text-sm font-semibold hover:bg-plum-dark transition-colors shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset All Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
